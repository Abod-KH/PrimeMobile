"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState, useMemo } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import { Loader2, ChevronDown, SortAsc, SortDesc, Calendar, Star, Filter, X, ChevronRight } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { useGlobalFilters } from "./MobileMenu";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Pagination from "@/components/Pagination";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-old-new' | 'date-new-old' | 'rating-high-low';

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [productReviews, setProductReviews] = useState<{[key: string]: any[]}>({});
  const [loading, setLoading] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(
  //   categoryParams || null
  // );
  // const [selectedBrand, setSelectedBrand] = useState<string | null>(
  //   brandParams || null
  // );
  // const [selectedPrice, setSelectedPrice] = useState<{minPrice: number, maxPrice: number} | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16; // Number of products to display per page
  // const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  // Desktop filter accordion states
  const [expandedDesktopCategories, setExpandedDesktopCategories] = useState(true);
  const [expandedDesktopBrands, setExpandedDesktopBrands] = useState(true);
  const [expandedDesktopPrice, setExpandedDesktopPrice] = useState(true);
  const [expandedDesktopStock, setExpandedDesktopStock] = useState(true);

  // Use global filters
  const { selectedCategory, setSelectedCategory,
          selectedBrand, setSelectedBrand,
          selectedPrice, setSelectedPrice,
          selectedStock, setSelectedStock } = useGlobalFilters();

  // Initialize global filters from URL params on mount
  useEffect(() => {
    if (categoryParams && selectedCategory !== categoryParams) {
      setSelectedCategory(categoryParams);
    }
    if (brandParams && selectedBrand !== brandParams) {
      setSelectedBrand(brandParams);
    }
  }, [categoryParams, brandParams]); // Run only when params change

  // Create wrapper functions that update both local and global state
  const updateCategory = (category: string | null) => {
    setSelectedCategory(category);
  };

  const updateBrand = (brand: string | null) => {
    setSelectedBrand(brand);
  };

  const updatePrice = (price: { minPrice: number; maxPrice: number } | null) => {
    setSelectedPrice(price);
  };

  const updateStock = (stock: string | null) => {
    setSelectedStock(stock);
  };

  // Sync with global filters (only for initial load)
  useEffect(() => {
    console.log('Shop: Initial sync with global filters:', {
      category: selectedCategory,
      brand: selectedBrand,
      price: selectedPrice,
      stock: selectedStock
    });
    
    // No need for explicit sync here, useGlobalFilters handles it
  }, []); // Only run once on mount

  // Reset all filters function
  const resetAllFilters = () => {
    updateCategory(null);
    updateBrand(null);
    updatePrice(null);
    updateStock(null);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedCategory || selectedBrand || (selectedPrice && (selectedPrice.minPrice !== 0 || selectedPrice.maxPrice !== 10000)) || selectedStock;

  // Get filter summary for display
  const getFilterSummary = () => {
    const filters = [];
    if (selectedCategory) {
      const category = categories.find(cat => cat.slug?.current === selectedCategory);
      filters.push(`Category: ${category?.title}`);
    }
    if (selectedBrand) {
      const brand = brands.find(brand => brand.slug?.current === selectedBrand);
      filters.push(`Brand: ${brand?.title}`);
    }
    if (selectedPrice && (selectedPrice.minPrice !== 0 || selectedPrice.maxPrice !== 10000)) {
      filters.push(`Price: $${selectedPrice.minPrice} - $${selectedPrice.maxPrice}`);
    }
    if (selectedStock) {
      filters.push(`Stock: ${selectedStock === 'in-stock' ? 'In Stock' : 'Out of Stock'}`);
    }
    return filters;
  };

  // Get individual filter reset functions
  const resetCategoryFilter = () => {
    updateCategory(null);
  };

  const resetBrandFilter = () => {
    updateBrand(null);
  };

  const resetPriceFilter = () => {
    updatePrice(null);
  };

  const resetStockFilter = () => {
    updateStock(null);
  };

  // Get filter count for display
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (selectedPrice && (selectedPrice.minPrice !== 0 || selectedPrice.maxPrice !== 10000)) count++;
    if (selectedStock) count++;
    return count;
  };

  const fetchProducts = async () => {
    console.log('Shop: fetchProducts called with filters:', {
      category: selectedCategory,
      brand: selectedBrand,
      price: selectedPrice,
      stock: selectedStock
    });
    
    setLoading(true);
    try {
      let minPrice = selectedPrice?.minPrice ?? 0;
      let maxPrice = selectedPrice?.maxPrice ?? 10000;
      
      // Build stock filter condition
      let stockCondition = "";
      if (selectedStock === "in-stock") {
        stockCondition = "&& stock > 0";
      } else if (selectedStock === "out-of-stock") {
        stockCondition = "&& stock == 0";
      }
      
      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == \"category\" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == \"brand\" && slug.current == $selectedBrand]._id))
        && price >= $minPrice && price <= $maxPrice
        ${stockCondition}
      ] 
      | order(name asc) {
        ...,\"categories\": categories[]->title, _createdAt
      }`;
      
      console.log('Shop: Sanity query:', query);
      console.log('Shop: Query parameters:', { selectedCategory, selectedBrand, minPrice, maxPrice });
      
      const data = await client.fetch(query, 
        { selectedCategory, selectedBrand, minPrice, maxPrice },
        { next: { revalidate: 0 } }
      );
      
      console.log('Shop: Products fetched:', data.length);
      setProducts(data);

      // Fetch reviews for all products
      const reviewsData: {[key: string]: any[]} = {};
      for (const product of data) {
        const reviewsQuery = `*[_type == \"review\" && product._ref == $productId]{rating}`;
        const reviews = await client.fetch(reviewsQuery, { productId: product._id });
        reviewsData[product._id] = reviews;
      }
      setProductReviews(reviewsData);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Sort products based on selected sort option
  const sortedProducts = useMemo(() => {
    if (!products.length) return [];
    
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'name-asc':
        return sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'date-old-new':
        return sortedProducts.sort((a, b) => {
          const aDate = new Date(a._createdAt || 0).getTime();
          const bDate = new Date(b._createdAt || 0).getTime();
          return aDate - bDate;
        });
      case 'date-new-old':
        return sortedProducts.sort((a, b) => {
          const aDate = new Date(a._createdAt || 0).getTime();
          const bDate = new Date(b._createdAt || 0).getTime();
          return bDate - aDate;
        });
      case 'rating-high-low':
        return sortedProducts.sort((a, b) => {
          const aReviews = productReviews[a._id] || [];
          const bReviews = productReviews[b._id] || [];
          
          const aRating = aReviews.length > 0 
            ? aReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / aReviews.length 
            : 0;
          const bRating = bReviews.length > 0 
            ? bReviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / bReviews.length 
            : 0;
          
          // If ratings are equal, sort by number of reviews (more reviews = higher priority)
          if (Math.abs(aRating - bRating) < 0.01) {
            return bReviews.length - aReviews.length;
          }
          
          return bRating - aRating;
        });
      default:
        return sortedProducts;
    }
  }, [products, sortBy, productReviews]);

  const getSortOptionLabel = (option: SortOption) => {
    switch (option) {
      case 'name-asc': return 'Name (A-Z)';
      case 'name-desc': return 'Name (Z-A)';
      case 'date-old-new': return 'Date (Old to New)';
      case 'date-new-old': return 'Date (New to Old)';
      case 'rating-high-low': return 'Rating (High to Low)';
      default: return 'Name (A-Z)';
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice, selectedStock]);

  // Handle sorting changes
  useEffect(() => {
    if (products.length > 0) {
      setIsSorting(true);
      const timer = setTimeout(() => setIsSorting(false), 80);
      return () => clearTimeout(timer);
    }
  }, [sortBy, products]);

  // Calculate products for current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of product list when page changes for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.sort-dropdown')) {
        setShowSortDropdown(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSortDropdown) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSortDropdown]);

  // Get current sort display text
  const getCurrentSortText = () => {
    const option = getSortOptionLabel(sortBy);
    return option;
  };

  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative sort-dropdown">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  aria-haspopup="listbox"
                  aria-expanded={showSortDropdown}
                  aria-label={`Sort products by ${getCurrentSortText()}`}
                  className="flex items-center gap-2 px-4 py-2 border border-shop_dark_green/30 rounded-lg bg-white text-shop_dark_green hover:border-shop_dark_green transition-all duration-200 hover:shadow-sm min-w-[140px] justify-between"
                >
                  <span className="text-sm font-medium truncate">Sort: {getCurrentSortText()}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 flex-shrink-0 ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showSortDropdown && (
                  <div 
                    role="listbox"
                    aria-label="Sort options"
                    className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-in fade-in-0 zoom-in-95 duration-200 md:right-auto md:left-0"
                  >
                    {([
                      'name-asc',
                      'name-desc', 
                      'date-old-new',
                      'date-new-old',
                      'rating-high-low'
                    ] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        role="option"
                        aria-selected={sortBy === option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 ${
                          sortBy === option ? 'bg-shop_dark_green/10 text-shop_dark_green font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option === 'name-asc' && <SortAsc size={14} />}
                        {option === 'name-desc' && <SortDesc size={14} />}
                        {option === 'date-old-new' && <Calendar size={14} />}
                        {option === 'date-new-old' && <Calendar size={14} />}
                        {option === 'rating-high-low' && <Star size={14} />}
                        {getSortOptionLabel(option)}
                      </button>
                    ))}
                  </div>
                )}
                
                
              </div>

              {/* Product Count */}
              <div className="text-sm text-gray-600">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} (Page {currentPage} of {totalPages})
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-shop_dark_green underline text-sm font-medium hover:text-darkRed hoverEffect"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          {/* Desktop Filters - Hidden on Mobile */}
          <div className="hidden md:block md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_btn_dark_green/50 scrollbar-hide">
            {/* Product Categories - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setExpandedDesktopCategories(!expandedDesktopCategories)}
                className="flex items-center justify-between w-full p-3 bg-shop_dark_green/10 rounded-lg hover:bg-shop_dark_green/20 transition-colors mb-2"
              >
                <span className="font-medium text-shop_dark_green">Product Categories</span>
                {expandedDesktopCategories ? (
                  <ChevronDown size={20} className="text-shop_dark_green" />
                ) : (
                  <ChevronRight size={20} className="text-shop_dark_green" />
                )}
              </button>
              
              {expandedDesktopCategories && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <CategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={updateCategory}
                  />
                </div>
              )}
            </div>

            {/* Brands - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setExpandedDesktopBrands(!expandedDesktopBrands)}
                className="flex items-center justify-between w-full p-3 bg-shop_dark_green/10 rounded-lg hover:bg-shop_dark_green/20 transition-colors mb-2"
              >
                <span className="font-medium text-shop_dark_green">Brands</span>
                {expandedDesktopBrands ? (
                  <ChevronDown size={20} className="text-shop_dark_green" />
                ) : (
                  <ChevronRight size={20} className="text-shop_dark_green" />
                )}
              </button>
              
              {expandedDesktopBrands && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <BrandList
                    brands={brands}
                    setSelectedBrand={updateBrand}
                    selectedBrand={selectedBrand}
                  />
                </div>
              )}
            </div>

            {/* Price Range - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setExpandedDesktopPrice(!expandedDesktopPrice)}
                className="flex items-center justify-between w-full p-3 bg-shop_dark_green/10 rounded-lg hover:bg-shop_dark_green/20 transition-colors mb-2"
              >
                <span className="font-medium text-shop_dark_green">Price Range</span>
                {expandedDesktopPrice ? (
                  <ChevronDown size={20} className="text-shop_dark_green" />
                ) : (
                  <ChevronRight size={20} className="text-shop_dark_green" />
                )}
              </button>
              
              {expandedDesktopPrice && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <PriceList
                    setSelectedPrice={updatePrice}
                    selectedPrice={selectedPrice}
                  />
                </div>
              )}
            </div>

            {/* Stock Status - Collapsible */}
            <div className="mb-4">
              <button
                onClick={() => setExpandedDesktopStock(!expandedDesktopStock)}
                className="flex items-center justify-between w-full p-3 bg-shop_dark_green/10 rounded-lg hover:bg-shop_dark_green/20 transition-colors mb-2"
              >
                <span className="font-medium text-shop_dark_green">Stock Status</span>
                {expandedDesktopStock ? (
                  <ChevronDown size={20} className="text-shop_dark_green" />
                ) : (
                  <ChevronRight size={20} className="text-shop_dark_green" />
                )}
              </button>
              
              {expandedDesktopStock && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-white rounded-lg">
                    <RadioGroup value={selectedStock || ""} className="space-y-2">
                      <div
                        onClick={() => updateStock("in-stock")}
                        className="flex items-center space-x-2 hover:cursor-pointer"
                      >
                        <RadioGroupItem
                          value="in-stock"
                          id="desktop-stock-in"
                          className="rounded-sm"
                        />
                        <Label
                          htmlFor="desktop-stock-in"
                          className={`text-sm ${
                            selectedStock === "in-stock" 
                              ? "font-semibold text-shop_dark_green" 
                              : "font-normal"
                          }`}
                        >
                          In Stock
                        </Label>
                      </div>
                      <div
                        onClick={() => updateStock("out-of-stock")}
                        className="flex items-center space-x-2 hover:cursor-pointer"
                      >
                        <RadioGroupItem
                          value="out-of-stock"
                          id="desktop-stock-out"
                          className="rounded-sm"
                        />
                        <Label
                          htmlFor="desktop-stock-out"
                          className={`text-sm ${
                            selectedStock === "out-of-stock" 
                              ? "font-semibold text-shop_dark_green" 
                              : "font-normal"
                          }`}
                        >
                          Out of Stock
                        </Label>
                      </div>
                    </RadioGroup>
                    {selectedStock && (
                      <button
                        onClick={() => updateStock(null)}
                        className="text-sm font-medium mt-3 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
                      >
                        Reset selection
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Filters Info */}
          <div className="md:hidden mb-4 p-3 bg-shop_dark_green/10 rounded-lg border border-shop_dark_green/20 transition-all duration-200 hover:bg-shop_dark_green/15">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-shop_dark_green">
                <Filter size={16} />
                <span>Use the menu button to access filters</span>
                {hasActiveFilters && (
                  <span className="px-2 py-1 bg-shop_dark_green/20 rounded-full text-xs font-medium">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-shop_dark_green underline hover:text-red-500 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
                {getFilterSummary().map((filter, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-shop_dark_green/20 rounded-full text-xs text-shop_dark_green hover:bg-shop_dark_green/30 transition-colors">
                    <span>{filter}</span>
                    <button
                      onClick={() => {
                        if (filter.startsWith('Category:')) {
                          resetCategoryFilter();
                        } else if (filter.startsWith('Brand:')) {
                          resetBrandFilter();
                        } else if (filter.startsWith('Price:')) {
                          resetPriceFilter();
                        } else if (filter.startsWith('Stock:')) {
                          resetStockFilter();
                        }
                      }}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Filter Status */}
            <div className="mt-3 text-xs text-shop_dark_green/70">
              {hasActiveFilters ? (
                <span>✓ Filters applied - {sortedProducts.length} products found</span>
              ) : (
                <span>No filters applied - showing all products</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 pt-5">
            {/* Sorting Status */}
            <div className="mb-4 text-sm text-gray-600 flex items-center gap-2 flex-wrap">
              <span>
                Showing {currentProducts.length} of {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} sorted by {getCurrentSortText().toLowerCase()}
              </span>
              {isSorting && (
                <div className="flex items-center gap-1 text-shop_dark_green animate-pulse">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Sorting...</span>
                </div>
              )}
              {!isSorting && sortedProducts.length > 0 && (
                <div className="flex items-center gap-1 text-shop_dark_green">
                  <span>✓ Sorted</span>
                </div>
              )}
            </div>
            
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : currentProducts?.length > 0 ? (
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 transition-all duration-150 ${isSorting ? 'opacity-75 scale-95' : 'opacity-100 scale-100'}`}>
                  {currentProducts?.map((product) => (
                    <ProductCard 
                      key={product?._id} 
                      product={product} 
                      reviews={productReviews[product._id] || []}
                    />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
