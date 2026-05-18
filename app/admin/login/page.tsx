import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-sand/20 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-sand rounded-2xl p-8">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl text-walnut">La Barraca</h1>
          <p className="mt-1 text-sm text-walnut/60">Panel de administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
