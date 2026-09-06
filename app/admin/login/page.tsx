import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nm-bg p-4">
      <div className="w-full max-w-sm rounded-soft-lg bg-nm-surface p-8 shadow-soft-lg">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full shadow-soft-inset-sm">
            <Image
              src="/logo.jpg"
              alt="Logo de La Barraca De Juan"
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-nm-text">La Barraca</h1>
            <p className="mt-0.5 text-sm text-nm-muted">Panel de administración</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
