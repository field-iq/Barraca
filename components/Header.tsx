import Image from "next/image";
import { StoreCartButton } from "./StoreCartButton";

export function Header() {
  return (
    <header className="border-b border-sand bg-cream/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
        <div className="relative h-10 w-10 rounded-md overflow-hidden bg-sand shrink-0">
          <Image
            src="/logo.jpg"
            alt="Logo de La Barraca De Juan"
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="font-serif text-xl text-walnut">La Barraca De Juan</div>
          <div className="text-xs text-bark/80">Muebles artesanales</div>
        </div>
        <StoreCartButton />
      </div>
    </header>
  );
}
