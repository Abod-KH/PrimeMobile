"use client";
import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import SearchResults from "./SearchResults";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        const query = `*[_type == "product" && name match $searchTerm + "*"] {
          _id,
          name,
          price,
          images,
          slug,
          stock,
          discount
        } | order(name asc)[0...6]`;

        const results = await client.fetch(query, { searchTerm });
        setProducts(results || []);
      } else {
        setProducts([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCloseSearch = () => {
    setOpen(false);
    setSearchTerm("");
    setProducts([]);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setOpen(true)}
            className="pl-8 pr-8 w-full md:w-[300px] focus-visible:ring-shop_dark_green bg-white"
          />
          {searchTerm && (
            <button
              onClick={handleCloseSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <SearchResults
        isOpen={open && Boolean(searchTerm || products.length > 0)}
        products={products}
        onProductClick={handleCloseSearch}
      />
    </div>
  );
};

export default SearchBar;
