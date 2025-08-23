'use client';

import React from 'react';
import Link from 'next/link';
import { Logs } from 'lucide-react';
import { ClerkLoaded, SignedIn, UserButton } from '@clerk/nextjs';
import SignIn from './SignIn';
import { MY_ORDERS_QUERYResult } from '@/sanity.types';

interface ClientHeaderContentProps {
  hasUser: boolean;
  orders: MY_ORDERS_QUERYResult | null;
}

const ClientHeaderContent: React.FC<ClientHeaderContentProps> = ({ hasUser, orders }) => {
  return (
    <>
      {hasUser && (
        <Link
          href={"/orders"}
          className="group relative text-shop_dark_green hover:text-white hoverEffect"
        >
          <Logs />
          <span className="absolute -top-1 -right-1 bg-shop_btn_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {orders?.length ?? 0}
          </span>
        </Link>
      )}

      <ClerkLoaded>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {!hasUser && <SignIn />}
      </ClerkLoaded>
    </>
  );
};

export default ClientHeaderContent;