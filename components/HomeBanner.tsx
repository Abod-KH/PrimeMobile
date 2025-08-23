"use client";

import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import type { UseEmblaCarouselType } from "embla-carousel-react";

import headphone2 from "@/images/banner/headphone2.png";
import s23Ultra from "@/images/banner/111.png";
import image5 from "@/images/banner/5.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface SlideType {
  title: string;
  subtitle: string;
  image: StaticImageData;
  price?: string;
  subtext?: string;
  imageWidth: number;
  imageHeight: number;
  right: string;
  bottom: string;
  shadow: string;
}

const slides: SlideType[] = [
  {
    title: "Work Smart, Play Hard",
    subtitle: "Discover high-performance laptops designed for work and game",
    image: s23Ultra,
    subtext: "",
    imageWidth: 400,
    imageHeight: 360,
    right: "5rem",
    bottom: "35px",
    shadow: "drop-shadow-[-15px_20px_25px_rgba(0,0,0,0.65)]",
  },
  {
    title: "Grab Upto 50% off on",
    subtitle: "Selected headphone",
    image: headphone2,
    imageWidth: 420,
    imageHeight: 360,
    right: "4rem",
    bottom: "30px",
    shadow: "drop-shadow-[0_25px_40px_rgba(0,0,0,0.60)]",
  },
  {
    title: "Best Collection, Best Price",
    subtitle: "Upgrade your tech with the newest smartphones today.",
    image: image5,
    imageWidth: 420,
    imageHeight: 300,
    right: "6rem",
    bottom: "30px",
    shadow: "drop-shadow-[15px_20px_25px_rgba(0,0,0,0.65)]",
  },
];

const HomeBanner = () => {
  const [api, setApi] = React.useState<UseEmblaCarouselType[1] | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const handleApiChange = React.useCallback((newApi: UseEmblaCarouselType[1]) => {
    setApi(newApi);
  }, []);

  const autoplay = React.useCallback(
    () => Autoplay({ delay: 4000, stopOnInteraction: true }),
    []
  );

  React.useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplay()]}
        setApi={handleApiChange}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative overflow-visible pb-32">
                {/* Blue Banner */}
                <div className="py-8 md:py-12 px-6 md:px-24 flex items-center justify-between min-h-[350px] max-h-[350px] bg-[#90D1CA] relative">
                  <div className="space-y-5 max-w-[60%] z-10">
                    <Title className="text-2xl md:text-5xl font-bold text-white">
                      {slide.title} <br />
                      <span className="text-lg md:text-4xl">
                        {slide.subtitle}
                      </span>
                    </Title>

                    {slide.price && (
                      <>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">
                          {slide.price}
                        </p>
                        <p className="text-sm text-gray-700">{slide.subtext}</p>
                      </>
                    )}

                    <div className="flex gap-4">
                      <Link
                        href={"/shop"}
                        className="bg-[#096B68] text-white/90 px-4 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop_dark_green transition-colors"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Image (now also on mobile, but smaller) */}
                <Image
                  src={slide.image}
                  alt={`banner_${index + 1}`}
                  className={`object-contain ${slide.shadow}`}
                  width={slide.imageWidth}
                  height={slide.imageHeight}
                  style={{
                    position: "absolute",
                    right: slide.right,
                    bottom: slide.bottom,
                    maxWidth: "60%", // shrink image for mobile
                  }}
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentSlide === index
                ? "bg-shop_dark_green w-4"
                : "bg-gray-300"
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
