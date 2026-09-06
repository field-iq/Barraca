import { Camera, MessageCircle } from 'lucide-react';

export interface FooterProps {
  tagline: string;
  notice: string;
  developedByLabel: string;
  instagramUrl: string;
  whatsappUrl: string;
}

export function Footer({ tagline, notice, developedByLabel, instagramUrl, whatsappUrl }: FooterProps) {
  return (
    <footer className="mt-16 rounded-t-soft-lg bg-nm-surface px-6 pb-8 pt-12 shadow-soft-lg sm:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-2xl text-nm-text">
            La Barraca <span className="text-nm-accent">de Juan</span>
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-nm-muted">{tagline}</p>
        </div>
        <div className="flex gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="nm-transition inline-grid size-11 place-items-center rounded-full bg-nm-surface text-nm-text shadow-soft hover:shadow-soft-lg"
          >
            <Camera className="size-4" />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="nm-transition inline-grid size-11 place-items-center rounded-full bg-nm-surface text-nm-text shadow-soft hover:shadow-soft-lg"
          >
            <MessageCircle className="size-4" />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1200px] flex-col gap-2 border-t border-nm-line pt-5 text-xs text-nm-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{notice}</span>
        <span>
          {developedByLabel}{" "}
          <a href="https://taheebo.com.au" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-nm-text">
            Taheebo
          </a>
        </span>
      </div>
    </footer>
  );
}
