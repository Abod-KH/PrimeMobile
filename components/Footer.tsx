import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";

const Footer = () => {
  return (
    <footer className="bg-[#90D1CA] text-white">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-6">
            <Logo />
            <SubText className="text-white">
              Discover curated mobile collections at PrimeMobile, blending
              innovation and quality to elevate your tech experience.
            </SubText>
            <SocialMedia
              className="text-white"
              iconClassName="border-white/60 hover:border-shop_dark_green hover:text-shop_dark_green"
              tooltipClassName="bg-white text-darkColor"
            />
          </div>
          <div>
            <SubTitle className="text-shop_dark_green mb-6">Quick Links</SubTitle>
            <ul className="space-y-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-white hover:text-shop_dark_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubTitle className="text-shop_dark_green mb-6">Categories</SubTitle>
            <ul className="space-y-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-white hover:text-shop_dark_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <SubTitle className="text-shop_dark_green">Get In Touch</SubTitle>
            
            <ul className="space-y-4">
              <li className="text-white flex items-center gap-3 group">
                <span className="p-1.5 bg-shop_dark_green rounded-full group-hover:bg-green-500/20 transition-colors">
                  <MapPin className="h-4 w-4 text-white" />
                </span>
                <div>
                  
                  <span className="text-sm">Amman, Jordan</span>
                </div>
              </li>
              <li className="text-white flex items-center gap-3 group">
                <span className="p-1.5 bg-shop_dark_green rounded-full group-hover:bg-green-500/20 transition-colors">
                  <Phone className="h-4 w-4 text-white" />
                </span>
                <div>
                  
                  <span className="text-sm">+962-79999999</span>
                </div>
              </li>
              <li className="text-white flex items-center gap-3 group">
                <span className="p-1.5 bg-shop_dark_green rounded-full group-hover:bg-green-500/20 transition-colors">
                  <Mail className="h-4 w-4 text-white" />
                </span>
                <div>
                 
                  <span className="text-sm">info@primemobile.com</span>
                </div>
              </li>
              <li className="text-white flex items-center gap-3 group">
                <span className="p-1.5 bg-shop_dark_green rounded-full group-hover:bg-green-500/20 transition-colors">
                  <Clock className="h-4 w-4 text-white" />
                </span>
                <div>
                  
                  <span className="text-sm">Mon - Sat: 10:00 AM - 7:00 PM</span>
                </div>
              </li>
            </ul>
            <div className="mb-6">
              <SubTitle className="text-shop_dark_green text-sm mb-2">Select Language</SubTitle>
              <GoogleTranslate />
            </div>
          </div>
        </div>
        <div className="py-3 border-t border-gray-800 text-center text-sm text-white">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm text-white" />. All
            rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;