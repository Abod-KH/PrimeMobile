"use client";

import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import tablet from '@/images/banner/tablet.png'
import headphone2 from '@/images/banner/headphone2.png'
import s23Ultra from '@/images/banner/s23Ultra.png'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface SlideType {
  title: string;
  subtitle: string;
  image: any;
  price?: string;
  subtext?: string;
}

const slides: SlideType[] = [
	{
		title: "Grab Upto 50% off on",
		subtitle: "Selected headphone",
		image: headphone2
	},
	{
		title: "New Galaxy S23+ Ultra",
		subtitle: "Supercharged for pros",
		image: s23Ultra,
		price: "$999.00",
		subtext: ""
	},
	{
		title: "Special Offer",
		subtitle: "Latest Collection",
		image: tablet
	}
];

const HomeBanner = () => {
	const [api, setApi] = React.useState<any>(null);
	const [currentSlide, setCurrentSlide] = React.useState(0);
	
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
				setApi={setApi}
				className="w-full"
			>
				<CarouselContent>
					{slides.map((slide, index) => (
						<CarouselItem key={index}>
							<div className="py-8 md:py-12 rounded-lg px-10 lg:px-24 flex items-center justify-between min-h-[350px] max-h-[350px] overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                <div className="space-y-5 max-w-[50%]">
                  <Title className="text-4xl md:text-5xl font-bold text-gray-900">
                    {slide.title} <br />
                    <span className="text-3xl md:text-4xl">{slide.subtitle}</span>
                  </Title>
                  {slide.price && (
                    <>
                      <p className="text-2xl font-bold text-gray-900">{slide.price}</p>
                      <p className="text-sm text-gray-600">{slide.subtext}</p>
                    </>
                  )}
                  <div className="flex gap-4">
                    <Link
                      href={"/shop"}
                      className="bg-shop_dark_green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop_dark_green transition-colors"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
                <div className="flex-1 flex justify-end items-center">
                  <Image
                    src={slide.image}
                    alt={`banner_${index + 1}`}
                    className={cn(
                      "hidden md:block object-contain max-h-[300px]",
                      index === 0 ? "w-[400px]" : "w-80"
                    )}
                    priority={index === 0}
                  />
                </div>
              </div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="left-4" />
				<CarouselNext className="right-4" />
			</Carousel>
			<div className="flex justify-center gap-2 mt-4">
				{slides.map((_, index) => (
					<button
						key={index}
						className={cn(
							"h-2 w-2 rounded-full transition-all",
							currentSlide === index ? "bg-shop_dark_green w-4" : "bg-gray-300"
						)}
						onClick={() => api?.scrollTo(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default HomeBanner;
