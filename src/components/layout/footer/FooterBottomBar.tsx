import Link from "next/link";
import { Fragment } from "react";

import { business } from "@/content/contact";
import { policyLinks } from "@/content/footer";

import { CurrentYear } from "./CurrentYear";

export function FooterBottomBar() {
  const links = policyLinks.filter((link) => link.href);

  return (
    <div className="border-t border-gold/60 bg-burgundy text-ivory">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-2 px-4 py-4 text-center sm:px-8 lg:flex-row lg:justify-between lg:px-10 lg:text-left xl:px-16">
        <p className="font-display text-[0.98rem] text-ivory/95 sm:text-[1.05rem]">
          © <CurrentYear /> {business.name}. All rights reserved.
        </p>

        {links.length > 0 ? (
          <nav aria-label="Policies">
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {links.map((link, i) => (
                <Fragment key={link.label}>
                  {i > 0 && <li aria-hidden="true" className="h-4 w-px bg-gold/60" />}
                  <li>
                    <Link
                      href={link.href!}
                      className="inline-flex min-h-11 items-center font-display text-[1rem] text-ivory/95 transition-colors hover:text-gold-soft"
                    >
                      {link.label}
                    </Link>
                  </li>
                </Fragment>
              ))}
            </ul>
          </nav>
        ) : (
          <p className="font-display text-[0.98rem] italic text-gold-soft sm:text-[1.02rem]">
            Lovingly made in Kadapa, Rayalaseema
          </p>
        )}
      </div>
    </div>
  );
}
