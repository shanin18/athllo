const SPORT_IMAGES: Record<string, string> = {
  Surfing: "photo-1502680390469-be75c86b636f",
  "Track & Field": "photo-1461896836934-ffe607ba8211",
  Basketball: "photo-1546519638-68e109498ffc",
  Climbing: "photo-1522163182402-834f871fd851",
  Football: "photo-1431324155629-1a6deb1dec8d",
  Cycling: "photo-1541625602330-2277a4c46182",
};

const FALLBACK = "photo-1517649763962-0c623066013b";

export function sportImageUrl(sport: string, width = 800): string {
  const id = SPORT_IMAGES[sport] ?? FALLBACK;
  return `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`;
}
