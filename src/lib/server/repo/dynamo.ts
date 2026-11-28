import "server-only";

import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, GetCommand, PutCommand, ScanCommand, type ScanCommandInput } from "@aws-sdk/lib-dynamodb";

import { dynamo } from "../aws";

/** Thrown when a write lost an optimistic-locking or uniqueness race. */
export class ConflictError extends Error {
  constructor(message = "This record was changed by someone else. Reload and try again.") {
    super(message);
    this.name = "ConflictError";
  }
}

/** Reads every item (paginated Scan). Fine for catalogue-sized tables; capped for safety. */
export async function scanAll<T>(table: string, limit = 5000): Promise<T[]> {
  const items: T[] = [];
  let ExclusiveStartKey: ScanCommandInput["ExclusiveStartKey"];
  do {
    const res = await dynamo().send(new ScanCommand({ TableName: table, ExclusiveStartKey }));
    items.push(...((res.Items ?? []) as T[]));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey && items.length < limit);
  return items;
}

export async function getItem<T>(table: string, key: Record<string, string>): Promise<T | null> {
  const res = await dynamo().send(new GetCommand({ TableName: table, Key: key, ConsistentRead: true }));
  return (res.Item as T) ?? null;
}

/** Create: fails if an item with this key already exists. */
export async function createItem(table: string, keyName: string, item: Record<string, unknown>) {
  try {
    await dynamo().send(new PutCommand({ TableName: table, Item: item, ConditionExpression: "attribute_not_exists(#k)", ExpressionAttributeNames: { "#k": keyName } }));
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) throw new ConflictError("An item with this ID already exists.");
    throw e;
  }
}

/** Replace with optimistic locking: succeeds only if the stored version matches. */
export async function replaceItem(table: string, keyName: string, item: Record<string, unknown> & { version: number }, expectedVersion: number) {
  try {
    await dynamo().send(
      new PutCommand({
        TableName: table,
        Item: { ...item, version: expectedVersion + 1 },
        ConditionExpression: "attribute_exists(#k) AND #v = :v",
        ExpressionAttributeNames: { "#k": keyName, "#v": "version" },
        ExpressionAttributeValues: { ":v": expectedVersion },
      }),
    );
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) throw new ConflictError();
    throw e;
  }
}

export async function deleteItem(table: string, key: Record<string, string>, expectedVersion: number) {
  try {
    await dynamo().send(
      new DeleteCommand({
        TableName: table,
        Key: key,
        ConditionExpression: "#v = :v",
        ExpressionAttributeNames: { "#v": "version" },
        ExpressionAttributeValues: { ":v": expectedVersion },
      }),
    );
  } catch (e) {
    if (e instanceof ConditionalCheckFailedException) throw new ConflictError();
    throw e;
  }
}
