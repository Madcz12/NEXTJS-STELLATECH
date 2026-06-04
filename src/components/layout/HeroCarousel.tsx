"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, Cpu, Terminal, ShieldAlert } from "lucide-react"
import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const slides = [
    {
      id: 1,
      tag: "SYSTEM STATUS: ACTIVE",
      title: "Future Tech, Available Today",
      subtitle: "STELLA.TECH NEXT-GEN COMPUTING",
      description: "Upgrade your hardware with our curated, high-performance computing devices and peripherals.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
      link: "/catalog",
      cta: "Explore Catalog",
      accent: "from-violet-500/20 to-cyan-500/20",
      icon: Cpu
    },
    {
      id: 2,
      tag: "HARDWARE DEPLOYMENT",
      title: "RTX 5090 Series Unleashed",
      subtitle: "MAXIMUM GRAPHICS PERFORMANCE",
      description: "Experience extreme rendering and ray tracing capabilities with the latest graphics processing units.",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2670&auto=format&fit=crop",
      link: "/catalog?cat=components",
      cta: "View Components",
      accent: "from-cyan-500/20 to-emerald-500/20",
      icon: Terminal
    },
    {
      id: 3,
      tag: "PRO-SERIES CONFIGURATION",
      title: "Workstation Supremacy",
      subtitle: "ENGINEERED FOR WORKLOADS",
      description: "Assemble the ultimate development, editing, and rendering workstation built to run 24/7.",
      image: "https://images.unsplash.com/photo-1547082299-bb196bcc44ebd?q=80&w=2670&auto=format&fit=crop",
      link: "/catalog",
      cta: "Customize Build",
      accent: "from-fuchsia-500/20 to-violet-500/20",
      icon: ShieldAlert
    }
  ]

  return (
    <div className="w-full bg-background border-b border-border/40 relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => {
            const isActive = current === index
            const SlideIcon = slide.icon

            return (
              <CarouselItem key={slide.id}>
                <div className="relative h-[550px] md:h-[600px] w-full overflow-hidden flex items-center">
                  
                  {/* Background Image with animated parallax effect */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out",
                      isActive ? "scale-105" : "scale-100"
                    )}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  >
                    {/* Multi-layered dark gradients for high text contrast and glow */}
                    <div className="absolute inset-0 bg-neutral-950/70" />
                    <div className={cn("absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent", slide.accent)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-tech-dots opacity-40 mix-blend-overlay" />
                  </div>
                  
                  {/* Decorative Tech Grid Lines */}
                  <div className="absolute right-10 bottom-10 hidden lg:flex items-center gap-4 text-xs font-mono text-muted-foreground/30 select-none">
                    <span>X: 04.992</span>
                    <span>Y: 82.103</span>
                    <span>SYS: OK</span>
                  </div>

                  <div className="container relative z-10 px-6 md:px-12 mx-auto">
                    <div className="max-w-2xl space-y-6">
                      
                      {/* Monospace System Badge */}
                      <div 
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-widest transition-all duration-700 transform",
                          isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        )}
                        style={{ transitionDelay: "100ms" }}
                      >
                        <SlideIcon className="h-3 w-3 animate-pulse" />
                        <span>{slide.tag}</span>
                      </div>

                      {/* Heading */}
                      <div className="space-y-2">
                        <p 
                          className={cn(
                            "text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase transition-all duration-700 transform",
                            isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                          )}
                          style={{ transitionDelay: "200ms" }}
                        >
                          {slide.subtitle}
                        </p>
                        <h1 
                          className={cn(
                            "text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white transition-all duration-700 transform leading-tight",
                            isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                          )}
                          style={{ transitionDelay: "300ms" }}
                        >
                          {slide.title}
                        </h1>
                      </div>

                      {/* Description */}
                      <p 
                        className={cn(
                          "text-base text-neutral-300 md:text-lg font-body-tech font-light max-w-xl transition-all duration-700 transform leading-relaxed",
                          isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        )}
                        style={{ transitionDelay: "400ms" }}
                      >
                        {slide.description}
                      </p>

                      {/* Action Button */}
                      <div 
                        className={cn(
                          "flex gap-4 pt-2 transition-all duration-700 transform",
                          isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        )}
                        style={{ transitionDelay: "500ms" }}
                      >
                        <Button 
                          size="lg" 
                          asChild 
                          className="rounded-full font-semibold border border-primary/30 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:border-primary transition-all duration-300 px-8"
                        >
                          <Link href={slide.link}>
                            {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>

                    </div>
                  </div>

                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        
        {/* Carousel controls - Custom styled and animated */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
          <CarouselPrevious className="static translate-y-0 size-10 rounded-full border border-white/10 bg-black/40 hover:bg-primary/20 hover:border-primary hover:text-white backdrop-blur-md transition-all text-white" />
          
          {/* Slide indicator dots */}
          <div className="flex gap-1.5 px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  current === idx ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <CarouselNext className="static translate-y-0 size-10 rounded-full border border-white/10 bg-black/40 hover:bg-primary/20 hover:border-primary hover:text-white backdrop-blur-md transition-all text-white" />
        </div>
      </Carousel>
    </div>
  )
}
