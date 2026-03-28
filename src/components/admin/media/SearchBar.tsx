"use client";

type MediaFilter = "all" | "image" | "video";
type MediaSort = "newest" | "oldest" | "name";

type SearchBarProps = {
  filter: MediaFilter;
  onFilterChange: (value: MediaFilter) => void;
  onQueryChange: (value: string) => void;
  onSortChange: (value: MediaSort) => void;
  query: string;
  resultCount: number;
  sort: MediaSort;
};

export function SearchBar({
  filter,
  onFilterChange,
  onQueryChange,
  onSortChange,
  query,
  resultCount,
  sort,
}: SearchBarProps) {
  return (
    <div className="admin-media-searchbar">
      <div className="admin-field">
        <label htmlFor="media-search">Search media</label>
        <input
          className="admin-input"
          id="media-search"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by title, alt text, or public ID"
          value={query}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="media-filter">Type</label>
        <select
          className="admin-input"
          id="media-filter"
          onChange={(event) => onFilterChange(event.target.value as MediaFilter)}
          value={filter}
        >
          <option value="all">All assets</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      <div className="admin-field">
        <label htmlFor="media-sort">Sort</label>
        <select
          className="admin-input"
          id="media-sort"
          onChange={(event) => onSortChange(event.target.value as MediaSort)}
          value={sort}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div className="admin-media-searchbar-count">
        <span className="status-pill status-pill--ok">
          {resultCount} visible asset{resultCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
