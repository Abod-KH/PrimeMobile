import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"} className="inline-flex">
      <h2
        className={cn(
          "text-2xl text-white font-black tracking-wider hover:text-shop_dark_green hoverEffect group font-sans uppercase",
          className
        )}
      >
        <span
          className={cn(
            "text-shop_dark_green   group-hover:text-white  hoverEffect",
            spanDesign
          )}
        >
          Prime
        </span>
        Mobile
        
      </h2>
    </Link>
  );
};

export default Logo;
