import { LeafSprig } from "@/components/decor/Ornaments";
import { Logo } from "@/components/layout/Logo";
import { business, socialAccounts, whatsappHref } from "@/content/contact";
import { footerCopy } from "@/content/footer";

import { SocialIcon } from "./SocialIcon";

const socialButton =
  "grid size-11 place-items-center rounded-full border-[1.5px] border-burgundy/70 text-burgundy transition-colors duration-300 hover:bg-burgundy hover:text-ivory";

export function FooterBrand() {
  const socials = socialAccounts.filter((account) => account.url);

  return (
    <div className="flex flex-col items-center text-center">
      <Logo className="size-24 sm:size-28" sizesHint="112px" />
      <p className="mt-3 font-display text-[1.9rem] font-bold leading-tight text-burgundy xl:text-[2.1rem]">
        {business.name}
      </p>

      <div aria-hidden="true" className="mt-2 flex items-center gap-2">
        <span className="h-px w-16 bg-gradient-to-r from-gold/0 to-gold" />
        <LeafSprig className="h-3.5 w-6 text-gold-deep" />
        <span className="h-px w-16 bg-gradient-to-l from-gold/0 to-gold" />
      </div>

      <p className="mt-3 max-w-[22rem] text-pretty font-display text-[1.08rem] italic leading-relaxed text-ink/85">
        {footerCopy.description}
      </p>

      <div aria-hidden="true" className="mt-4 flex items-center gap-1.5">
        <span className="h-px w-20 bg-gradient-to-r from-gold/0 to-gold/70" />
        <span className="size-1 rotate-45 bg-gold" />
        <span className="size-1.5 rotate-45 bg-gold" />
        <span className="size-1 rotate-45 bg-gold" />
        <span className="h-px w-20 bg-gradient-to-l from-gold/0 to-gold/70" />
      </div>

      <ul aria-label="Social media and chat" className="mt-4 flex items-center gap-4">
        {socials.map((account) => (
          <li key={account.id}>
            <a
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${business.name} on ${account.label} (opens in a new tab)`}
              className={socialButton}
            >
              <SocialIcon id={account.id} className="size-5" />
            </a>
          </li>
        ))}
        <li>
          <a
            href={whatsappHref(business.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp (opens in a new tab)"
            className={socialButton}
          >
            <SocialIcon id="whatsapp" className="size-5" />
          </a>
        </li>
      </ul>
    </div>
  );
}
