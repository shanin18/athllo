import { NextRequest, NextResponse } from "next/server";
import { getAthletes } from "@/lib/data/athletes";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const result = await getAthletes({
    q: sp.get("q") || undefined,
    sport: sp.get("sport") || undefined,
    minReach: sp.get("minReach") ? Number(sp.get("minReach")) : undefined,
    location: sp.get("location") || undefined,
    maxBudget: sp.get("budget") ? Number(sp.get("budget")) : undefined,
    sort: (sp.get("sort") as "reach" | "recent" | "relevance") || "reach",
    page: sp.get("page") ? Number(sp.get("page")) : 0,
    pageSize: 8,
  });
  return NextResponse.json(result);
}
