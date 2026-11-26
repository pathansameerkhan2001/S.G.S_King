import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business, socialAccounts, whatsappHref } from "@/content/contact";

const WHATSAPP_MESSAGE = "Hello S.G.S King Foods, I would like to know more about your products.";

/**
 * Fixed social toolbar on the right edge (independent of page layout).
 * Sits below the header (z-40), modal dialogs and the mobile menu.
 */
export function FloatingSocialBar() {
  const instagram = socialAccounts.find((account) => account.id === "instagram" && account.url);

  const items = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: whatsappHref(business.whatsapp, WHATSAPP_MESSAGE),
      Icon: WhatsAppIcon,
      bg: "bg-[#25D366]",
    },
    ...(instagram?.url
      ? [
          {
            id: "instagram",
            label: "Instagram",
            href: instagram.url,
            Icon: InstagramIcon,
            // Instagram brand gradient
            bg: "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]",
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Chat and social media"
      className="fixed bottom-6 right-0 z-30 min-[360px]:bottom-24 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
    >
      <ul className="flex flex-col overflow-hidden rounded-l-xl shadow-[0_10px_28px_-10px_rgba(53,23,15,0.55)]">
        {items.map(({ id, label, href, Icon, bg }) => (
          <li key={id} className="group relative">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} (opens in a new tab)`}
              className={`grid size-11 place-items-center text-white transition-[filter,transform] duration-300 hover:brightness-110 focus-visible:-outline-offset-4 focus-visible:outline-white motion-safe:group-hover:-translate-x-1 sm:size-[50px] ${bg}`}
            >
              <Icon className="size-[22px] sm:size-6" />
            </a>
            {/* Tooltip (pointer and keyboard) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full top-1/2 mr-2.5 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 font-sans text-xs font-semibold text-ivory opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:opacity-100"
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
