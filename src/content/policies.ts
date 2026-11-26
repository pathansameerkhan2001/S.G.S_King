/**
 * Policy pages (admin-managed later).
 *
 * STATUS: DRAFT TEMPLATES. These are structure and wording placeholders,
 * NOT approved legal or business policies. Every page displays a visible
 * draft notice while `status` is "draft". Text in [square brackets] must be
 * replaced with the business's confirmed details, ideally reviewed by a
 * legal professional, before setting `status: "approved"`.
 */

export type PolicySection = { heading: string; body: string[] };

export type Policy = {
  slug: "privacy" | "terms" | "shipping" | "returns";
  title: string;
  summary: string;
  status: "draft" | "approved";
  lastUpdated?: string;
  sections: PolicySection[];
};

export const policies: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How S.G.S King Foods collects, uses and protects your personal information.",
    status: "draft",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "When you contact us or prepare an order, we receive the details you provide, such as your name, phone number, email address and delivery address.",
          "Your cart, wishlist and recently viewed items are currently stored only in your own browser on this device.",
          "[Confirm any analytics, cookies or third-party tools used on the website.]",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "To respond to your enquiries and to confirm, prepare and deliver your orders.",
          "[Confirm whether information is used for marketing, and how customers can opt out.]",
        ],
      },
      {
        heading: "Sharing your information",
        body: ["[List the parties information is shared with, e.g. courier partners and payment providers, and why.]"],
      },
      {
        heading: "Data retention & security",
        body: ["[Describe how long information is kept and how it is protected.]"],
      },
      {
        heading: "Your choices & contact",
        body: ["You can ask us to update or delete your information by contacting us using the details on our Contact page."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    summary: "The terms that apply when you use this website and order from S.G.S King Foods.",
    status: "draft",
    sections: [
      { heading: "About these terms", body: ["By using this website you agree to these terms. [Add the legal business name and registration details.]"] },
      {
        heading: "Products & pricing",
        body: [
          "Product images are representative and may vary slightly. Prices are shown in Indian Rupees (₹).",
          "[Confirm tax treatment (GST), and how price errors are handled.]",
        ],
      },
      {
        heading: "Orders",
        body: [
          "Orders are confirmed only after we have accepted them and confirmed availability, delivery charges and payment with you.",
          "[Add cancellation rules and the circumstances in which an order may be declined.]",
        ],
      },
      { heading: "Payments", body: ["[Describe accepted payment methods once confirmed: e.g. Cash on Delivery, UPI, cards.]"] },
      { heading: "Liability & governing law", body: ["[Add limitation of liability and governing law / jurisdiction, e.g. courts of Kadapa, Andhra Pradesh.]"] },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping & Delivery",
    summary: "Where we deliver, how long it takes and what it costs.",
    status: "draft",
    sections: [
      { heading: "Delivery areas", body: ["We aim to deliver across India. [Confirm serviceable areas and any exclusions.]"] },
      { heading: "Dispatch & delivery times", body: ["[Add dispatch time after order confirmation and typical delivery times by region.]"] },
      { heading: "Delivery charges", body: ["Delivery charges, if any, are confirmed with you before dispatch. [Add the confirmed fee structure and any free-delivery threshold.]"] },
      { heading: "Tracking", body: ["[Describe how customers receive tracking details, e.g. via WhatsApp or SMS.]"] },
      { heading: "Damaged or delayed parcels", body: ["Please contact us as soon as possible with your order details and photos if a parcel arrives damaged."] },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    summary: "What to do if something is wrong with your order.",
    status: "draft",
    sections: [
      { heading: "Food products", body: ["Because our products are food items, returns may be limited for hygiene and safety reasons. [Confirm the return policy.]"] },
      { heading: "Damaged, incorrect or missing items", body: ["[Add the reporting window, e.g. within N days of delivery, and what evidence is needed (photos, unboxing video).]"] },
      { heading: "Refunds", body: ["[Add how refunds or replacements are issued, and how long they take.]"] },
      { heading: "How to contact us", body: ["Reach us on WhatsApp, phone or email from the Contact page with your order details."] },
    ],
  },
];

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug);
