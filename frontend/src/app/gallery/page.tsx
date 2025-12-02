"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import DonationSection from "./DonationSection";

type GalleryItem = {
  id: number;
  src: string;
  title: string;
  tag: string;
  location: string;
  date: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1200&q=80",
    title: "Uttara Lake cleanup, Dhaka",
    tag: "Clean-up",
    location: "Uttara, Dhaka",
    date: "Nov 2025",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
    title: "Community mural, Kalshi underpass",
    tag: "Public space",
    location: "Kalshi, Dhaka",
    date: "Oct 2025",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=1200&q=80",
    title: "Tree planting at Hatirjheel",
    tag: "Greening",
    location: "Hatirjheel, Dhaka",
    date: "Sep 2025",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1523419400524-2230b5c4c508?auto=format&fit=crop&w=1200&q=80",
    title: "School session in Mirpur",
    tag: "Awareness",
    location: "Mirpur, Dhaka",
    date: "Sep 2025",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
    title: "Zero-waste camp, Patenga beach",
    tag: "Waste",
    location: "Patenga, Chattogram",
    date: "Aug 2025",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80",
    title: "Canal clearing, Rajbari",
    tag: "Waterways",
    location: "Rajbari",
    date: "Jul 2025",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80",
    title: "Ward 17 pocket park",
    tag: "Urban green",
    location: "Dhaka North",
    date: "Jul 2025",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    title: "Rooftop garden build, Banani",
    tag: "Community",
    location: "Banani, Dhaka",
    date: "Jun 2025",
  },
];

const FILTERS = [
  "All",
  "Clean-up",
  "Greening",
  "Public space",
  "Waterways",
  "Awareness",
  "Waste",
  "Community",
  "Urban green",
] as const;

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const filtered = useMemo<GalleryItem[]>(() => {
    if (activeFilter === "All") return galleryItems;
    return galleryItems.filter((g) => g.tag === activeFilter);
  }, [activeFilter]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="bg-base-200 text-base-content">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-10 top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100/70 text-primary font-semibold">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Latest Nagar Nirman field updates
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-[1.1]">
              Real work from Dhaka, Chattogram, Rajbari, and beyond.
            </h1>

            <p className="text-base md:text-lg text-base-content/80 leading-relaxed max-w-xl">
              A running log of clean-ups, greening, and community fixes powered by volunteers,
              ward officers, and partner schools.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="btn btn-primary shadow-lg hover:shadow-xl transition">
                Join the next drive
              </button>

              <div className="flex items-center gap-3 text-sm md:text-base">
                <span className="h-2 w-2 rounded-full bg-success" />
                18 wards reporting weekly
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative h-[280px] sm:h-[340px] lg:h-[420px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <Image
                src="https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1400&q=80"
                alt="Field work highlight"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">
                    Featured story
                  </p>
                  <h3 className="text-xl font-semibold leading-tight">
                    Banani rail-line cleanup before monsoon
                  </h3>
                  <p className="text-sm text-gray-100">
                    64 neighbors, 3 hours, 1.2 tons waste diverted.
                  </p>
                </div>

                <button
                  className="btn btn-sm btn-outline border-white/50 text-white hover:bg-white/10"
                  onClick={() =>
                    setSelected({
                      id: 999,
                      src: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1400&q=80",
                      title: "Banani rail-line cleanup before monsoon",
                      tag: "Clean-up",
                      location: "Banani, Dhaka",
                      date: "Nov 2025",
                    })
                  }
                >
                  View log
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-base-100 md:py-14 py-10">
        <div className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          {/* Header + filters */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">Impact library</p>
              <h2 className="text-3xl font-bold">See the people and places we fix</h2>
              <p className="text-base text-base-content/70 max-w-2xl">
                Fresh uploads from drives in Dhaka North, Chattogram City, and partner wards.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((label) => {
                const active = activeFilter === label;
                return (
                  <button
                    type="button"
                    aria-label={`Filter by ${label}`}
                    aria-pressed={active ? "true" : "false"}
                    key={label}
                    onClick={() => {
                      setActiveFilter(label);
                      setVisibleCount(8);
                    }}
                    className={[
                      "px-3 py-1 rounded-full text-sm font-semibold border transition",
                      active
                        ? "bg-primary text-primary-content border-primary shadow-sm"
                        : "border-base-300 bg-base-200 hover:bg-base-300/60",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {visibleItems.length === 0 ? (
            <div className="rounded-2xl border border-base-300 bg-base-200/60 p-10 text-center">
              <h3 className="text-lg font-semibold">
                No photos yet for this category.
              </h3>
              <p className="text-base-content/70 mt-1">
                Try another filter or submit your drive photos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="group relative overflow-hidden rounded-2xl shadow-lg bg-base-300/40 aspect-4/3 text-left
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={`Open photo: ${item.title}`}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition duration-500" />

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white space-y-1">
                      <p className="text-xs uppercase tracking-[0.18em] text-primary">
                        {item.tag}
                      </p>
                      <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/80">
                        {item.location} • {item.date}
                      </p>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-base-content opacity-0 translate-y-2
                                    group-hover:opacity-100 group-hover:translate-y-0 transition">
                      View details
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setVisibleCount((c) => c + 8)}
              >
                Load more
              </button>
            </div>
          )}

          {/* Info card */}
          <div className="rounded-2xl border border-base-300 bg-base-200/70 backdrop-blur-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">
                What you are seeing
              </p>
              <h3 className="text-2xl font-bold">
                Proof of every pledge, logged by Nagar Nirman teams.
              </h3>
              <p className="text-base text-base-content/70">
                Each upload is timestamped by ward captains so donors, city partners,
                and volunteers can follow progress without waiting for a PDF report.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="stats shadow hidden sm:grid">
                <div className="stat">
                  <div className="stat-title">This month</div>
                  <div className="stat-value text-primary">27 drops</div>
                  <div className="stat-desc">Curated by 12 leads</div>
                </div>
              </div>

              <button className="btn btn-outline btn-primary">
                Submit your photo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Banner metrics */}
      <section className="relative w-full h-[220px] sm:h-[260px] md:h-80">
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
          alt="Impact metrics banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65 flex justify-center items-center px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-10 text-white text-center w-full max-w-5xl">
            {[
              { num: "24", label: "Active projects" },
              { num: "18", label: "Wards engaged" },
              { num: "840", label: "Volunteers trained" },
              { num: "12.5k", label: "Trees planted" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-center gap-3 md:gap-5"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
                  {item.num}
                </h1>
                <div className="text-left">
                  <p className="text-xs sm:text-sm md:text-base font-semibold tracking-wide">
                    {item.label}
                  </p>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-200">
                    Updated weekly
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Modal */}
      {!!selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-4xl bg-base-100 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black">
              <Image
                src={selected.src}
                alt={selected.title}
                fill
                className="object-contain"
              />
              <button
                onClick={() => setSelected(null)}
                className="btn btn-sm btn-circle absolute top-3 right-3 bg-black/60 text-white border-none hover:bg-black"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-primary badge-outline">
                  {selected.tag}
                </span>
                <span className="text-sm text-base-content/70">
                  {selected.location} • {selected.date}
                </span>
              </div>

              <h3 className="text-2xl font-bold leading-tight">
                {selected.title}
              </h3>

              <p className="text-base text-base-content/75">
                This is a field update captured by local teams. Add a short story here later
                (what happened, who joined, impact, etc.).
              </p>

              <div className="pt-3 flex gap-2">
                <button className="btn btn-primary">Support similar drives</button>
                <button className="btn btn-ghost">Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DonationSection />
    </div>
  );
};

export default GalleryPage;
