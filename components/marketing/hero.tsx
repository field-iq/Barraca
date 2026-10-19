export function Hero({ title, videoSrc, posterSrc }: { title: string; videoSrc?: string; posterSrc?: string }) {
  return (
    // Pulled up by the header's height (h-16) so the video sits behind the
    // floating header instead of leaving a strip of page background above it.
    <section className="relative -mt-16 h-[100svh] min-h-[540px] w-full overflow-hidden bg-white">
      {videoSrc && (
        <video
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      )}

      <h1 className="sr-only">{title}</h1>
    </section>
  );
}
