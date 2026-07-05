import type { Metadata } from "next";
import { FavoritesManager } from "@/components/favorites-manager";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Favourite locations",
  description:
    "Save and manage your favourite places. Your locations are stored in a secure MongoDB-backed service.",
};

export default function FavoritesPage() {
  return (
    <div className="container-page min-h-screen pb-20 pt-28 sm:pt-36">
      <div className="mb-10">
        <span className="chip"><T k="favorites.badge" /></span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          <T k="favorites.title" />
        </h1>
        <p className="mt-3 max-w-xl text-slate-500 dark:text-slate-400">
          <T k="favorites.subtitle" />
        </p>
      </div>
      <FavoritesManager />
    </div>
  );
}
