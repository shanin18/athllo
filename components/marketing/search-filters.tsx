"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Values = {
  q: string;
  sport: string;
  reach: string;
  location: string;
  budget: string;
  sort: string;
};

export function SearchFilters({ sports, values }: { sports: string[]; values: Values }) {
  const router = useRouter();
  const [showMore, setShowMore] = useState(!!(values.location || values.budget));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of form.entries()) {
      if (value) params.set(key, String(value));
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-line bg-surface p-3 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input name="q" defaultValue={values.q} placeholder="Search by name…" className="pl-9" />
        </div>
        <select
          name="sport"
          defaultValue={values.sport}
          className="h-11 rounded-xl border border-line bg-surface px-3 text-[15px] text-ink"
        >
          {sports.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          name="reach"
          defaultValue={values.reach}
          className="h-11 rounded-xl border border-line bg-surface px-3 text-[15px] text-ink"
        >
          <option value="">Any reach</option>
          <option value="500K+">500K+</option>
          <option value="1M+">1M+</option>
          <option value="3M+">3M+</option>
        </select>
        <select
          name="sort"
          defaultValue={values.sort}
          className="h-11 rounded-xl border border-line bg-surface px-3 text-[15px] text-ink"
        >
          <option value="reach">Sort: Reach</option>
          <option value="recent">Sort: Recently active</option>
        </select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => setShowMore((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" /> More filters
        </Button>
        <Button type="submit" size="sm">
          Search
        </Button>
      </div>

      {showMore && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3">
          <Input name="location" defaultValue={values.location} placeholder="Location…" className="max-w-xs" />
          <Input
            name="budget"
            type="number"
            defaultValue={values.budget}
            placeholder="Max budget per campaign ($)"
            className="max-w-xs"
          />
        </div>
      )}
    </form>
  );
}
