"use client";

import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { CyberButton } from "@/components/cyber-button";

const categories = [
  "All",
  "Penetration Testing",
  "Network Security",
  "Web Security",
  "Malware Analysis",
  "Cryptography",
  "Social Engineering",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export function CourseFilters() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-4">
      {/* Search and view toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-lg border transition-colors ${
              viewMode === "grid"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-lg border transition-colors ${
              viewMode === "list"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            aria-label="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              category === cat
                ? "bg-primary/10 border border-primary/30 text-primary"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Level filter */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Level:
        </span>
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setLevel(lvl)}
            className={`text-sm transition-colors ${
              level === lvl
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}
