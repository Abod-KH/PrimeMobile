import React, { FC, useState } from "react";
import Logo from "./Logo";
import { X, ChevronDown, ChevronRight, Filter } from "lucide-react";
import { headerData } from "@/constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks";
import { Category, Brand } from "@/sanity.types";
import CategoryList from "./shop/CategoryList";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: Category[];
  brands?: Brand[];
  selectedCategory?: string | null;
  selectedBrand?: string | null;
  selectedPrice?: { minPrice: number; maxPrice: number } | null;
  selectedStock?: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  setSelectedPrice: (price: { minPrice: number; maxPrice: number } | null) => void;
  setSelectedStock: (stock: string | null) => void;
}

const SideMenu: FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  categories = [], 
  brands = [],
  selectedCategory,
  selectedBrand,
  selectedPrice,
  selectedStock,
  setSelectedCategory,
  setSelectedBrand,
  setSelectedPrice,
  setSelectedStock
}) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedBrands, setExpandedBrands] = useState(false);

  return (
    <div
      className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hoverEffect`}
    >
      <div
        ref={sidebarRef}
        className="min-w-72 max-w-96 bg-black h-screen p-6 border-r border-r-shop_light_green flex flex-col gap-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-5">
          <Logo className="text-white" spanDesign="group-hover:text-white" />
          <button
            onClick={onClose}
            className="hover:text-shop_light_green hoverEffect"
          >
            <X />
          </button>
        </div>

        <div className="flex flex-col space-y-3.5 font-semibold tracking-wide">
          {headerData?.map((item) => (
            <Link
              href={item?.href}
              key={item?.title}
              className={`hover:text-shop_light_green hoverEffect ${
                pathname === item?.href && "text-white"
              }`}
            >
              {item?.title}
            </Link>
          ))}
        </div>

        {/* Mobile Filters Section */}
        <div className="border-t border-shop_light_green/30 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-shop_light_green" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
          </div>

          {/* Product Categories - Collapsible Accordion */}
          <div className="mb-4">
            <button
              onClick={() => setExpandedCategories(!expandedCategories)}
              className="flex items-center justify-between w-full p-3 bg-shop_light_green/10 rounded-lg hover:bg-shop_light_green/20 transition-colors"
            >
              <span className="font-medium text-white">Product Categories</span>
              {expandedCategories ? (
                <ChevronDown size={20} className="text-shop_light_green" />
              ) : (
                <ChevronRight size={20} className="text-shop_light_green" />
              )}
            </button>
            
            {expandedCategories && (
              <div className="mt-3 bg-shop_light_green/5 rounded-lg overflow-hidden">
                <div className="p-3">
                  <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={(category) => {
                      console.log('Category filter clicked:', category);
                      setSelectedCategory(category);
                    }}
                    variant="mobile"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brands - Collapsible */}
          <div className="mb-4">
            <button
              onClick={() => setExpandedBrands(!expandedBrands)}
              className="flex items-center justify-between w-full p-3 bg-shop_light_green/10 rounded-lg hover:bg-shop_light_green/20 transition-colors"
            >
              <span className="font-medium text-white">Brands</span>
              {expandedBrands ? (
                <ChevronDown size={20} className="text-shop_light_green" />
              ) : (
                <ChevronRight size={20} className="text-shop_light_green" />
              )}
            </button>
            
            {expandedBrands && (
              <div className="mt-3 bg-shop_light_green/5 rounded-lg overflow-hidden">
                <div className="p-3">
                  <BrandList
                    brands={brands}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={(brand) => {
                      console.log('Brand filter clicked:', brand);
                      setSelectedBrand(brand);
                    }}
                    variant="mobile"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Price Range - No Accordion */}
          <div className="mb-4">
            <div className="p-3 bg-shop_light_green/10 rounded-lg">
              <h4 className="font-medium text-white mb-3">Price Range</h4>
              <PriceList
                selectedPrice={selectedPrice}
                setSelectedPrice={(price) => {
                  console.log('Price filter changed:', price);
                  setSelectedPrice(price);
                }}
                variant="mobile"
              />
            </div>
          </div>

          {/* Stock Status - New Filter */}
          <div className="mb-4">
            <div className="p-3 bg-shop_light_green/10 rounded-lg">
              <h4 className="font-medium text-white mb-3">Stock Status</h4>
              <RadioGroup value={selectedStock || ""} onValueChange={setSelectedStock} className="space-y-2">
                <div
                  // onClick={() => {
                  //   console.log('Stock filter clicked: in-stock');
                  //   setSelectedStock("in-stock");
                  // }}
                  className="flex items-center space-x-2 hover:cursor-pointer"
                >
                  <RadioGroupItem
                    value="in-stock"
                    id="mobile-stock-in"
                    className="rounded-sm border-shop_light_green"
                  />
                  <Label
                    htmlFor="mobile-stock-in"
                    className={`text-sm ${
                      selectedStock === "in-stock" 
                        ? "font-semibold text-shop_light_green" 
                        : "font-normal text-white/80"
                    }`}
                  >
                    In Stock
                  </Label>
                </div>
                <div
                  // onClick={() => {
                  //   console.log('Stock filter clicked: out-of-stock');
                  //   setSelectedStock("out-of-stock");
                  // }}
                  className="flex items-center space-x-2 hover:cursor-pointer"
                >
                  <RadioGroupItem
                    value="out-of-stock"
                    id="mobile-stock-out"
                    className="rounded-sm border-shop_light_green"
                  />
                  <Label
                    htmlFor="mobile-stock-out"
                    className={`text-sm ${
                      selectedStock === "out-of-stock" 
                        ? "font-semibold text-shop_light_green" 
                        : "font-normal text-white/80"
                    }`}
                  >
                    Out of Stock
                  </Label>
                </div>
              </RadioGroup>
              {selectedStock && (
                <button
                  onClick={() => setSelectedStock(null)}
                  className="text-sm font-medium mt-3 underline underline-offset-2 decoration-[1px] hover:text-shop_light_green hoverEffect text-left text-shop_light_green"
                >
                  Reset selection
                </button>
              )}
            </div>
          </div>
        </div>

        <SocialMedia />
      </div>
    </div>
  );
};

export default SideMenu;
