import React, { useState, useEffect } from "react";
import Title from "../Title";
import { RangeSlider } from "../ui/range-slider";

interface Props {
  selectedPrice?: {minPrice: number, maxPrice: number} | null;
  setSelectedPrice: (price: { minPrice: number; maxPrice: number } | null) => void;
  variant?: 'default' | 'mobile';
}

const PriceList = ({ selectedPrice, setSelectedPrice, variant = 'default' }: Props) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const isMobile = variant === 'mobile';

  useEffect(() => {
    if (selectedPrice) {
      setMinPrice(selectedPrice.minPrice);
      setMaxPrice(selectedPrice.maxPrice);
    } else {
      setMinPrice(0);
      setMaxPrice(10000);
    }
  }, [selectedPrice]);

  const handleValueChange = (newValues: number[]) => {
    const [newMin, newMax] = newValues;
    setMinPrice(newMin);
    setMaxPrice(newMax);
    setSelectedPrice({ minPrice: newMin, maxPrice: newMax });
  };

  return (
    <div className={`w-full ${isMobile ? 'bg-transparent p-0' : 'bg-white p-5'}`}>
      {!isMobile && <Title className="text-base font-black">Price Range</Title>}
      <div className="mt-4">
        <div className={`flex justify-between text-sm font-medium ${isMobile ? 'text-white' : ''}`}>
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
        <div className="mt-2">
          <RangeSlider
            min={0}
            max={10000}
            step={100}
            value={[minPrice, maxPrice]}
            onValueChange={handleValueChange}
            className="w-full"
          />
        </div>
      </div>
      {(minPrice !== 0 || maxPrice !== 10000) && (
        <button
          onClick={() => setSelectedPrice(null)}
          className={`text-sm font-medium mt-4 underline underline-offset-2 decoration-[1px] hoverEffect ${
            isMobile ? 'text-shop_light_green hover:text-white' : 'hover:text-shop_dark_green'
          }`}
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default PriceList;
