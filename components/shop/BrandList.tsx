import { BRANDS_QUERYResult } from "@/sanity.types";
import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: (brand: string | null) => void;
  variant?: 'default' | 'mobile';
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand, variant = 'default' }: Props) => {
  const isMobile = variant === 'mobile';
  
  return (
    <div className={`w-full ${isMobile ? 'bg-transparent p-0' : 'bg-white p-5'}`}>
      {!isMobile && <Title className="text-base font-black">Brands</Title>}
      <RadioGroup value={selectedBrand || ""} className="mt-2 space-y-1">
        {brands?.map((brand) => (
          <div
            key={brand?._id}
            onClick={() => setSelectedBrand(brand?.slug?.current as string)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={brand?.slug?.current as string}
              id={isMobile ? `mobile-brand-${brand?.slug?.current}` : brand?.slug?.current}
              className={`rounded-sm ${isMobile ? 'border-shop_light_green' : ''}`}
            />
            <Label
              htmlFor={isMobile ? `mobile-brand-${brand?.slug?.current}` : brand?.slug?.current}
              className={`text-sm ${
                selectedBrand === brand?.slug?.current 
                  ? `font-semibold ${isMobile ? 'text-shop_light_green' : 'text-shop_dark_green'}` 
                  : `font-normal ${isMobile ? 'text-white/80' : ''}`
              }`}
            >
              {brand?.title}
            </Label>
          </div>
        ))}
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className={`text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hoverEffect text-left ${
              isMobile ? 'text-shop_light_green hover:text-white' : 'hover:text-shop_dark_green'
            }`}
          >
            Reset selection
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
