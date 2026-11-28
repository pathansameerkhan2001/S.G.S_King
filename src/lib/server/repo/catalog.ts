import "server-only";

import { randomBytes } from "node:crypto";

import type { Category, CategoryInput, Combo, ComboInput, Order, OrderTimelineEntry, Product, ProductInput } from "@/lib/admin/schemas";

import { tables } from "../aws";
import { ConflictError, createItem, deleteItem, getItem, replaceItem, scanAll } from "./dynamo";

const now = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}_${randomBytes(8).toString("hex")}`;

// ---------------------------------------------------------------- categories
export const listCategories = async () =>
  (await scanAll<Category>(tables().categories)).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
export const getCategory = (id: string) => getItem<Category>(tables().categories, { categoryId: id });

export async function createCategory(input: CategoryInput) {
  const t = now();
  await createItem(tables().categories, "categoryId", { ...input, createdAt: t, updatedAt: t, version: 1 });
}
export async function updateCategory(input: CategoryInput, expectedVersion: number) {
  const existing = await getCategory(input.categoryId);
  if (!existing) throw new ConflictError("This category no longer exists.");
  await replaceItem(tables().categories, "categoryId", { ...existing, ...input, updatedAt: now(), version: existing.version }, expectedVersion);
}
export async function deleteCategory(id: string, expectedVersion: number) {
  const inUse = (await listProducts()).filter((p) => p.categoryId === id);
  if (inUse.length) throw new ConflictError(`Cannot delete: ${inUse.length} product(s) use this category. Move them first.`);
  await deleteItem(tables().categories, { categoryId: id }, expectedVersion);
}

// ---------------------------------------------------------------- products
export const listProducts = async () =>
  (await scanAll<Product>(tables().products)).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
export const getProduct = (id: string) => getItem<Product>(tables().products, { productId: id });

async function assertUniqueSlug(list: { slug: string; id: string }[], slug: string, selfId?: string) {
  if (list.some((x) => x.slug === slug && x.id !== selfId)) throw new ConflictError(`The slug “${slug}” is already used.`);
}

export async function createProduct(input: ProductInput) {
  const all = await listProducts();
  await assertUniqueSlug(all.map((p) => ({ slug: p.slug, id: p.productId })), input.slug);
  const productId = newId("prd");
  const t = now();
  await createItem(tables().products, "productId", { ...input, productId, createdAt: t, updatedAt: t, version: 1 });
  return productId;
}
export async function updateProduct(productId: string, input: ProductInput, expectedVersion: number) {
  const existing = await getProduct(productId);
  if (!existing) throw new ConflictError("This product no longer exists.");
  const all = await listProducts();
  await assertUniqueSlug(all.map((p) => ({ slug: p.slug, id: p.productId })), input.slug, productId);
  await replaceItem(tables().products, "productId", { ...existing, ...input, productId, updatedAt: now(), version: existing.version }, expectedVersion);
}
export async function deleteProduct(productId: string, expectedVersion: number) {
  const combos = (await listCombos()).filter((c) => c.items.some((i) => i.productId === productId));
  if (combos.length) throw new ConflictError(`Cannot delete: used in ${combos.length} combo(s): ${combos.map((c) => c.name).join(", ")}.`);
  await deleteItem(tables().products, { productId }, expectedVersion);
}

// ---------------------------------------------------------------- combos
export const listCombos = async () =>
  (await scanAll<Combo>(tables().combos)).sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
export const getCombo = (id: string) => getItem<Combo>(tables().combos, { comboId: id });

async function assertProductsExist(input: ComboInput) {
  const ids = new Set((await listProducts()).map((p) => p.productId));
  const missing = input.items.filter((i) => !ids.has(i.productId));
  if (missing.length) throw new ConflictError("One or more selected products no longer exist.");
}

export async function createCombo(input: ComboInput) {
  await assertProductsExist(input);
  const all = await listCombos();
  await assertUniqueSlug(all.map((c) => ({ slug: c.slug, id: c.comboId })), input.slug);
  const comboId = newId("cmb");
  const t = now();
  await createItem(tables().combos, "comboId", { ...input, comboId, createdAt: t, updatedAt: t, version: 1 });
  return comboId;
}
export async function updateCombo(comboId: string, input: ComboInput, expectedVersion: number) {
  const existing = await getCombo(comboId);
  if (!existing) throw new ConflictError("This combo no longer exists.");
  await assertProductsExist(input);
  const all = await listCombos();
  await assertUniqueSlug(all.map((c) => ({ slug: c.slug, id: c.comboId })), input.slug, comboId);
  await replaceItem(tables().combos, "comboId", { ...existing, ...input, comboId, updatedAt: now(), version: existing.version }, expectedVersion);
}
export const deleteCombo = (comboId: string, expectedVersion: number) => deleteItem(tables().combos, { comboId }, expectedVersion);

// ---------------------------------------------------------------- orders
export const listOrders = async () =>
  (await scanAll<Order>(tables().orders, 10000)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const getOrder = (id: string) => getItem<Order>(tables().orders, { orderId: id });

/** Status / payment update with an appended timeline entry (optimistic locking). */
export async function updateOrder(
  orderId: string,
  patch: { status: Order["status"]; paymentStatus: Order["payment"]["status"]; paymentReference?: string; note?: string },
  expectedVersion: number,
  by: string,
) {
  const existing = await getOrder(orderId);
  if (!existing) throw new ConflictError("This order no longer exists.");
  const entry: OrderTimelineEntry = { at: now(), by };
  if (patch.status !== existing.status) entry.status = patch.status;
  if (patch.paymentStatus !== existing.payment.status) entry.payment = patch.paymentStatus;
  if (patch.note) entry.note = patch.note;
  const changed = entry.status || entry.payment || entry.note || patch.paymentReference !== existing.payment.reference;
  if (!changed) return;
  await replaceItem(
    tables().orders,
    "orderId",
    {
      ...existing,
      status: patch.status,
      payment: { ...existing.payment, status: patch.paymentStatus, reference: patch.paymentReference },
      timeline: [...(existing.timeline ?? []), entry],
      updatedAt: now(),
      version: existing.version,
    },
    expectedVersion,
  );
}
