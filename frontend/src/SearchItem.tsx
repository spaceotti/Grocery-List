import React from "react";
import type { SetStateAction } from "react";

type SearchItemProps = {
  search: string;
  setSearch: React.Dispatch<SetStateAction<string>>;
};

const SearchItem: React.FC<SearchItemProps> = ({ search, setSearch }) => {
  return (
    <form className="searchForm">
      <label htmlFor="search">Search Item</label>
      <input
        type="text"
        role="searchbox"
        placeholder="Search item"
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default SearchItem;
