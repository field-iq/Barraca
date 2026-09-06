import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export function Hero({ eyebrow, title, body, image, imageAlt }: { eyebrow: string; title: React.ReactNode; body: string; image: string; imageAlt: string }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 py-16 md:grid-cols-2">
      <div className="grid gap-7">
        <Badge tone="accent">{eyebrow}</Badge>
        <h1 className="text-5xl leading-[1.05] md:text-7xl">{title}</h1>
        <p className="max-w-md text-lg leading-relaxed text-nm-muted">{body}</p>
        <div className="flex flex-wrap gap-4">
          <Button variant="accent" size="lg" trailing={<ArrowRight className="size-4" />}>Browse the collection</Button>
          <Button size="lg">Book a consultation</Button>
        </div>
      </div>
      <div className="rounded-soft-lg p-4 shadow-soft"><img src={image} alt={imageAlt} className="aspect-[4/5] w-full rounded-soft object-cover shadow-soft-inset" /></div>
    </section>
  );
}
