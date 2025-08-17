import { Category } from "@/sanity.types";
import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: (category: string | null) => void;
  variant?: 'default' | 'mobile';
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  variant = 'default'
}: Props) => {
  const isMobile = variant === 'mobile';
  
  return (
    <div className={`w-full ${isMobile ? 'bg-transparent p-0' : 'bg-white p-5'}`}>
      {!isMobile && <Title className="text-base font-black">Product Categories</Title>}
      <RadioGroup value={selectedCategory || ""} className="mt-2 space-y-1">
        {categories?.map((category) => (
          <div
            onClick={() => {
              setSelectedCategory(category?.slug?.current as string);
            }}
            key={category?._id}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={category?.slug?.current as string}
              id={isMobile ? `mobile-${category?.slug?.current}` : category?.slug?.current}
              className={`rounded-sm ${isMobile ? 'border-shop_light_green' : ''}`}
            />
            <Label
              htmlFor={isMobile ? `mobile-${category?.slug?.current}` : category?.slug?.current}
              className={`text-sm ${
                selectedCategory === category?.slug?.current 
                  ? `font-semibold ${isMobile ? 'text-shop_light_green' : 'text-shop_dark_green'}` 
                  : `font-normal ${isMobile ? 'text-white/80' : ''}`
              }`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hoverEffect text-left ${
            isMobile ? 'text-shop_light_green hover:text-white' : 'hover:text-shop_dark_green'
          }`}
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;
