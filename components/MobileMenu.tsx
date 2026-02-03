"use client";
import { AlignLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import { client } from "@/sanity/lib/client";
import { Category, BRANDS_QUERYResult } from "@/sanity.types";

// Create a global filter state that can be accessed by both components
const globalFilterState = {
  selectedCategory: null as string | null,
  selectedBrand: null as string | null,
  selectedPrice: null as { minPrice: number; maxPrice: number } | null,
  selectedStock: null as string | null,
  listeners: new Set<() => void>(),

  setSelectedCategory(category: string | null) {
    console.log('Global filter: setSelectedCategory called with:', category);
    this.selectedCategory = category;
    this.notifyListeners();
  },

  setSelectedBrand(brand: string | null) {
    console.log('Global filter: setSelectedBrand called with:', brand);
    this.selectedBrand = brand;
    this.notifyListeners();
  },

  setSelectedPrice(price: { minPrice: number; maxPrice: number } | null) {
    console.log('Global filter: setSelectedPrice called with:', price);
    this.selectedPrice = price;
    this.notifyListeners();
  },

  setSelectedStock(stock: string | null) {
    console.log('Global filter: setSelectedStock called with:', stock);
    this.selectedStock = stock;
    this.notifyListeners();
  },

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
};

// Hook to use the global filter state
export const useGlobalFilters = () => {
  console.log('useGlobalFilters hook called');

  const [state, setState] = useState({
    selectedCategory: globalFilterState.selectedCategory,
    selectedBrand: globalFilterState.selectedBrand,
    selectedPrice: globalFilterState.selectedPrice,
    selectedStock: globalFilterState.selectedStock
  });

  useEffect(() => {
    console.log('useGlobalFilters: Setting up subscription');
    const unsubscribe = globalFilterState.subscribe(() => {
      console.log('useGlobalFilters: Received update, new state:', {
        selectedCategory: globalFilterState.selectedCategory,
        selectedBrand: globalFilterState.selectedBrand,
        selectedPrice: globalFilterState.selectedPrice,
        selectedStock: globalFilterState.selectedStock
      });
      setState({
        selectedCategory: globalFilterState.selectedCategory,
        selectedBrand: globalFilterState.selectedBrand,
        selectedPrice: globalFilterState.selectedPrice,
        selectedStock: globalFilterState.selectedStock
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  console.log('useGlobalFilters: Returning state:', state);
  return {
    ...state,
    setSelectedCategory: globalFilterState.setSelectedCategory.bind(globalFilterState),
    setSelectedBrand: globalFilterState.setSelectedBrand.bind(globalFilterState),
    setSelectedPrice: globalFilterState.setSelectedPrice.bind(globalFilterState),
    setSelectedStock: globalFilterState.setSelectedStock.bind(globalFilterState)
  };
};

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BRANDS_QUERYResult>([]);
  const [_loading, setLoading] = useState(false);

  // Use the global filter state
  const filters = useGlobalFilters();

  // Fetch categories and brands for mobile filters
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesQuery = `*[_type == "category"] | order(title asc) {
          _id, title, slug
        }`;
        const categoriesData = await client.fetch(categoriesQuery);
        setCategories(categoriesData);

        // Fetch brands
        const brandsQuery = `*[_type == "brand"] | order(title asc) {
          _id, title, slug
        }`;
        const brandsData = await client.fetch(brandsQuery);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          categories={categories}
          brands={brands}
          selectedCategory={filters.selectedCategory}
          selectedBrand={filters.selectedBrand}
          selectedPrice={filters.selectedPrice}
          selectedStock={filters.selectedStock}
          setSelectedCategory={filters.setSelectedCategory}
          setSelectedBrand={filters.setSelectedBrand}
          setSelectedPrice={filters.setSelectedPrice}
          setSelectedStock={filters.setSelectedStock}
        />
      </div>
    </>
  );
};

export default MobileMenu;
