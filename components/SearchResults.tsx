"use client";
import { Product } from "@/sanity.types";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "./PriceView";
import { useRouter } from "next/navigation";

interface SearchResultsProps {
  isOpen: boolean;
  products: Product[];
  onProductClick: () => void;
}

const SearchResults = ({ isOpen, products, onProductClick }: SearchResultsProps) => {
  const router = useRouter();

  const handleProductClick = (slug: string) => {
    if (slug) {
      router.push(`/product/${slug}`);
      onProductClick();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full mt-1 w-full bg-white rounded-md border shadow-lg z-50">
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {products.map((product) => (
              <CommandItem
                key={product._id}
                onSelect={() => handleProductClick(product.slug?.current ?? "")}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="w-12 h-12 relative">
                  {product.images && product.images[0] && (
                    <Image
                      src={urlFor(product.images[0]).url()}
                      alt={product.name || ""}
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{product.name}</h4>
                  <PriceView
                    price={product.price}
                    discount={product.discount}
                    className="text-xs"
                  />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default SearchResults;