"use client";

import { useEffect, useRef } from "react";

export function Hero({ title, videoSrc, posterSrc }: { title: string; videoSrc?: string; posterSrc?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Safari/iOS only autoplay when the video is muted *before* play() is called, and React doesn't
  // always reflect the muted attribute. Set it by hand, then retry on the first touch if the
  // browser still refused (for example Low Power Mode, which we can't override).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const retry = () => {
      video.play().then(removeListeners).catch(() => {});
    };
    const events = ["touchstart", "pointerdown", "scroll", "keydown"] as const;
    function removeListeners() {
      events.forEach((name) => window.removeEventListener(name, retry));
    }

    video.play().catch(() => {
      events.forEach((name) => window.addEventListener(name, retry, { passive: true, once: false }));
    });
    return removeListeners;
  }, [videoSrc]);

  return (
    // Pulled up by the header's height (h-16) so the video sits behind the
    // floating header instead of leaving a strip of page background above it.
    <section className="relative -mt-16 h-[100svh] min-h-[540px] w-full overflow-hidden bg-white">
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
        />
      )}

      <h1 className="sr-only">{title}</h1>
    </section>
  );
}
