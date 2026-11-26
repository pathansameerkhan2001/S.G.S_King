"use client";

import { ArrowLeft, Banknote, CreditCard, Info, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { InputField, SelectField } from "@/components/ui/FormField";
import { commerce } from "@/content/commerce";
import { useCart } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import {
  indianStates,
  isValidEmail,
  isValidIndianMobile,
  isValidPincode,
  saveOrderRequest,
  type CheckoutDetails,
} from "@/lib/order";

import { LineThumb } from "./LineThumb";
import { OrderSummary } from "./OrderSummary";

const initial: CheckoutDetails = {
  fullName: "",
  phone: "",
  email: "",
  house: "",
  street: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  addressType: "home",
  paymentMethod: "cod",
};

type Errors = Partial<Record<keyof CheckoutDetails, string>>;

function validate(d: CheckoutDetails): Errors {
  const e: Errors = {};
  if (d.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
  if (!isValidIndianMobile(d.phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (d.email.trim() && !isValidEmail(d.email)) e.email = "Enter a valid email address, or leave it blank.";
  if (!d.house.trim()) e.house = "Please enter your house / flat number.";
  if (!d.street.trim()) e.street = "Please enter your street.";
  if (!d.area.trim()) e.area = "Please enter your area / locality.";
  if (!d.city.trim()) e.city = "Please enter your city.";
  if (!d.state) e.state = "Please choose your state.";
  if (!isValidPincode(d.pincode)) e.pincode = "Enter a valid 6-digit PIN code.";
  if (d.paymentMethod === "online" && !commerce.onlinePaymentLive) e.paymentMethod = "Online payment is not available yet.";
  return e;
}

export function CheckoutForm() {
  const router = useRouter();
  const { resolved, summary } = useCart();
  const [details, setDetails] = useState<CheckoutDetails>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) => {
    const next = { ...details, [key]: value };
    setDetails(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    saveOrderRequest(details, resolved, summary);
    router.push("/order-success");
  };

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gold/50 bg-ivory/80 px-6 py-12 text-center">
        <h2 className="font-display text-[1.7rem] font-bold text-burgundy">Your cart is empty</h2>
        <p className="mt-2 font-sans text-sm text-umber">Add some products before checking out.</p>
        <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-xl bg-burgundy px-7 font-display text-[1.1rem] font-semibold text-ivory">
          Go to Shop
        </Link>
      </div>
    );
  }

  const errorList = Object.entries(errors);
  const field = (key: keyof CheckoutDetails) => ({
    value: details[key] as string,
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as never),
    error: errors[key],
  });

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      <div className="space-y-6">
        {errorList.length > 0 && (
          <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="rounded-2xl border border-burgundy/40 bg-[#fff5f5] p-4 focus:outline-none">
            <p className="font-display text-[1.15rem] font-bold text-burgundy">Please fix {errorList.length} {errorList.length === 1 ? "field" : "fields"}:</p>
            <ul className="mt-1 list-disc pl-5 font-sans text-sm text-ink">
              {errorList.map(([key, message]) => (
                <li key={key}>
                  <a href={`#${key}`} className="underline underline-offset-2">
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="rounded-2xl border border-gold/30 bg-ivory p-5 sm:p-6">
          <legend className="px-1 font-display text-[1.4rem] font-bold text-burgundy">Customer details</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <InputField id="fullName" label="Full name" required autoComplete="name" className="sm:col-span-2" {...field("fullName")} />
            <InputField id="phone" label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" hint="10-digit Indian mobile number" {...field("phone")} />
            <InputField id="email" label="Email" type="email" autoComplete="email" {...field("email")} />
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-gold/30 bg-ivory p-5 sm:p-6">
          <legend className="px-1 font-display text-[1.4rem] font-bold text-burgundy">Delivery address</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <InputField id="house" label="House / Flat no." required autoComplete="address-line1" {...field("house")} />
            <InputField id="street" label="Street" required autoComplete="address-line2" {...field("street")} />
            <InputField id="area" label="Area / Locality" required {...field("area")} />
            <InputField id="city" label="City" required autoComplete="address-level2" {...field("city")} />
            <SelectField id="state" label="State" required options={indianStates} autoComplete="address-level1" {...field("state")} />
            <InputField id="pincode" label="PIN code" required inputMode="numeric" maxLength={6} autoComplete="postal-code" {...field("pincode")} />
            <InputField id="landmark" label="Landmark" className="sm:col-span-2" {...field("landmark")} />
          </div>
          <div role="radiogroup" aria-label="Address type" className="mt-4 flex flex-wrap gap-2">
            {(["home", "work", "other"] as const).map((t) => (
              <label key={t} className="cursor-pointer rounded-full border border-gold/50 px-4 py-2 font-sans text-sm font-semibold capitalize text-umber has-[:checked]:border-burgundy has-[:checked]:bg-burgundy has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold">
                <input type="radio" name="addressType" value={t} checked={details.addressType === t} onChange={() => set("addressType", t)} className="sr-only" />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-gold/30 bg-ivory p-5 sm:p-6">
          <legend className="px-1 font-display text-[1.4rem] font-bold text-burgundy">Payment method</legend>
          <div className="mt-2 grid gap-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/45 p-4 has-[:checked]:border-burgundy has-[:checked]:bg-gold-pale/50">
              <input type="radio" name="paymentMethod" checked={details.paymentMethod === "cod"} onChange={() => set("paymentMethod", "cod")} className="mt-1 size-4 accent-[#650a16]" />
              <Banknote aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-deep" />
              <span>
                <span className="block font-display text-[1.1rem] font-semibold text-ink">Cash on Delivery</span>
                <span className="block font-sans text-xs text-umber">Availability for your PIN code will be confirmed with your order.</span>
              </span>
            </label>
            {commerce.onlinePaymentLive ? (
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/45 p-4 has-[:checked]:border-burgundy has-[:checked]:bg-gold-pale/50">
                <input type="radio" name="paymentMethod" checked={details.paymentMethod === "online"} onChange={() => set("paymentMethod", "online")} className="mt-1 size-4 accent-[#650a16]" />
                <CreditCard aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-deep" />
                <span className="block font-display text-[1.1rem] font-semibold text-ink">Online payment</span>
              </label>
            ) : (
              <p className="flex items-center gap-2 font-sans text-xs text-umber">
                <CreditCard aria-hidden="true" className="size-4 shrink-0 text-gold-deep" />
                Online payment (UPI / cards) will be added once our payment gateway is connected.
              </p>
            )}
          </div>
        </fieldset>

        <Link href="/cart" className="inline-flex min-h-11 items-center gap-2 font-display text-[1.08rem] font-semibold text-burgundy hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to cart
        </Link>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28">
        <section aria-labelledby="checkout-items" className="rounded-2xl border border-gold/30 bg-ivory p-5">
          <h2 id="checkout-items" className="font-display text-[1.3rem] font-bold text-burgundy">
            Your items
          </h2>
          <ul className="mt-3 space-y-3">
            {resolved.map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <LineThumb item={r.item} size="size-14" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[1.02rem] font-semibold text-ink">{r.item.name}</p>
                  <p className="font-sans text-xs text-umber">
                    {r.variant.label} × {r.line.quantity}
                  </p>
                </div>
                <p className="font-sans text-sm font-semibold">{formatPrice(r.lineTotal)}</p>
              </li>
            ))}
          </ul>
        </section>
        <OrderSummary summary={summary}>
          {!commerce.onlineOrderingLive && (
            <p className="mb-3 flex gap-2 rounded-xl bg-gold-pale/60 p-3 font-sans text-xs leading-relaxed text-ink">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold-deep" />
              Online ordering is being set up. Submitting creates an order request you can send to us on WhatsApp or email to
              confirm. No payment is taken on this website.
            </p>
          )}
          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-burgundy font-display text-[1.15rem] font-semibold text-ivory shadow-soft hover:bg-maroon-light">
            <Lock aria-hidden="true" className="size-4" />
            Review Order Request
          </button>
        </OrderSummary>
      </div>
    </form>
  );
}
