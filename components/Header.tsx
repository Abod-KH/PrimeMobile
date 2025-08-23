import React from 'react'
import Container from './Container'

import Logo from './Logo'
import HeaderMenu from './HeaderMenu'
import MobileMenu from './MobileMenu'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import FavoriteButton from './FavoriteButton'
import { auth, currentUser } from "@clerk/nextjs/server";
import { getMyOrders } from "@/sanity/queries";
import ClientHeaderContent from './ClientHeaderContent';
const Header =async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }
  return (
    <header className="sticky top-0 z-50 py-5 bg-[#90D1CA] backdrop-blur-md">
    <Container className="flex items-center justify-between text-lightColor ">
      <div className="flex items-center gap-2.5 justify-start md:gap-0 flex-shrink-0">
        <MobileMenu />
        <Logo />
      </div>
      <div className="md:hidden">
        <SearchBar />
      </div>
      <HeaderMenu />
      <div className="flex items-center justify-end gap-5 flex-shrink-0">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <CartIcon />
        <FavoriteButton />

        <ClientHeaderContent hasUser={!!user} orders={orders} />
      </div>
    </Container>
  </header>
  )
}

export default Header