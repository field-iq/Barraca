import { Play } from 'lucide-react';
export function VideoCard({ poster, title, duration, onPlay }: { poster: string; title: string; duration: string; onPlay?: () => void }) {
  return (
    <button onClick={onPlay} className="group relative block w-full rounded-soft p-3 text-left shadow-soft nm-transition hover:shadow-soft-lg">
      <img src={poster} alt="" className="aspect-video w-full rounded-soft-sm object-cover shadow-soft-inset" />
      <span className="absolute left-1/2 top-[40%] grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-nm-surface text-nm-accent shadow-soft nm-transition group-hover:scale-105 group-active:shadow-soft-inset"><Play className="size-6 fill-current" /></span>
      <div className="flex items-center justify-between px-2 pb-1 pt-4"><span className="font-heading text-lg">{title}</span><span className="text-xs text-nm-muted">{duration}</span></div>
    </button>
  );
}
