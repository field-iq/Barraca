import { Hero } from "@/components/marketing/hero";
import { getHeroSettings } from "@/lib/heroStore";
import { HomeContent } from "./HomeContent";

// Re-render at most once a minute; saving from /admin also revalidates immediately.
export const revalidate = 60;

export default async function HomePage() {
  const hero = await getHeroSettings();
  return (
    <HomeContent
      hero={<Hero title="La Barraca de Juan" videoSrc={hero.videoUrl} posterSrc={hero.posterUrl ?? undefined} />}
    />
  );
}
