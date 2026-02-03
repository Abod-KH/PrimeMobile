import Container from '@/components/Container'
import HomeBanner from '@/components/HomeBanner'
import HomeCategories from '@/components/HomeCategories'
import ProductGrid from '@/components/ProductGrid'
import ShopByBrands from '@/components/ShopByBrands'
import { getCategories } from '@/sanity/queries'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "PrimeMobile | Best Smartphones & Tech Gadgets Online",
  description: "Welcome to PrimeMobile, your ultimate destination for the latest smartphones, premium tech accessories, and electronics. Unbeatable deals and fast delivery.",
};


const Home = async () => {
  const categories = await getCategories(6);
  return (
    <>
      <HomeBanner />
      <Container className=' text-xl'>
        <ProductGrid />
        <HomeCategories categories={categories} />
        <ShopByBrands />
      </Container></>
  )
}

export default Home