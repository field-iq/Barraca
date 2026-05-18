import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-sand/20 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-sand rounded-2xl p-8">
        <div className="mb-6 text-center flex flex-col items-center gap-3">
          <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-sand">
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
            <h1 className="font-serif text-2xl text-walnut">La Barraca</h1>
            <p className="mt-0.5 text-sm text-walnut/60">Panel de administración</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
