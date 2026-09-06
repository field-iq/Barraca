"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/feedback/alert";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin/catalogo";
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </FormField>
      {error && <Alert tone="danger" title={error} />}
      <Button type="submit" variant="accent" size="lg" block loading={loading}>
        {loading ? "Verificando..." : "Ingresar"}
      </Button>
    </form>
  );
}
