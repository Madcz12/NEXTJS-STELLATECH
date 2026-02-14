"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const slides = [
    {
      id: 1,
      title: "Future Tech, Available Today",
      description: "Upgrade your setup with the world's most advanced computing gear.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
      link: "/catalog",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "RTX 5090 Series",
      description: "Experience the ultimate gaming performance with the new generation.",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2670&auto=format&fit=crop",
      link: "/product/1",
      cta: "View Collection"
    },
    {
      id: 3,
      title: "Workstation Supremacy",
      description: "Build the perfect setup for content creation and development.",
      image: "https://images.unsplash.com/photo-1547082299-bb196bcc44ebd?q=80&w=2670&auto=format&fit=crop",
      link: "/catalog?cat=workstation",
      cta: "Build Yours"
    }
  ]

  return (
    <div className="w-full bg-background">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[500px] w-full overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="absolute inset-0 bg-black/60 md:bg-black/40 bg-gradient-to-r from-black/80 to-transparent"></div>
                </div>
                
                <div className="container relative h-full flex flex-col justify-center px-4 md:px-6">
                  <div className="max-w-xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                      {slide.title}
                    </h1>
                    <p className="text-lg text-gray-200 md:text-xl">
                      {slide.description}
                    </p>
                    <div className="flex gap-4 pt-2">
                       <Button size="lg" asChild className="rounded-full">
                        <Link href={slide.link}>
                            {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious className="left-4 bg-background/20 hover:bg-background/40 border-none text-white" />
            <CarouselNext className="right-4 bg-background/20 hover:bg-background/40 border-none text-white" />
        </div>
      </Carousel>
    </div>
  )
}
