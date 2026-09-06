import { Button } from '@/components/ui/button';
export function CtaSection({ title, body, primary, secondary }: { title: string; body: string; primary: string; secondary?: string }) {
  return (
    <section className="mx-auto max-w-3xl rounded-soft-lg p-12 text-center shadow-soft-inset-lg">
      <h2 className="text-4xl">{title}</h2><p className="mx-auto mt-4 max-w-md text-nm-muted">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4"><Button variant="accent" size="lg">{primary}</Button>{secondary && <Button size="lg">{secondary}</Button>}</div>
    </section>
  );
}
