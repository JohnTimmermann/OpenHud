import { useState } from "react";
import { MdSearch, MdClose } from "react-icons/md";

interface SearchBarProps {
  dataSearch: (searchValue: string) => void;
}

export const Searchbar = ({ dataSearch }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue: string = event.target.value;
    setSearchValue(searchValue);
    dataSearch(searchValue);
  };

  const clearSearchInput = () => {
    setSearchValue("");
    dataSearch("");
  };

  return (
    <div
      id="Search"
      className="noDrag absolute left-1/2 flex h-8 -translate-x-1/2 items-center justify-center rounded-full border border-border px-2 text-sm"
    >
      <MdSearch className="size-5" />
      <input
        type="text"
        placeholder={`Search`}
        className="w-36 border-none bg-transparent focus:outline-none focus:ring-0"
        onChange={handleSearch}
        value={searchValue}
      />
      {searchValue.length === 0 ? null : (
        <MdClose
          id="clearSearch"
          className="absolute right-2 size-5 cursor-pointer rounded-lg hover:bg-background-light"
          onClick={clearSearchInput}
        />
      )}
    </div>
  );
};
