"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useReducedMotion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    eyebrow: "A neighborhood reading room",
    title: <>Some stories are<br />better <em>shared.</em></>,
    description: "Find the books waiting for you on a neighbor’s shelf. Leave a favorite behind for someone else.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=85",
    position: "center 54%",
  },
  {
    eyebrow: "Turn a page, pass it on",
    title: <>A good book<br />finds its <em>people.</em></>,
    description: "Browse a thoughtful little collection, and let your next favorite find its way to you.",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=2000&q=85",
    position: "center 57%",
  },
  {
    eyebrow: "Make room on your shelf",
    title: <>Your next chapter<br />is <em>closer.</em></>,
    description: "Share a book you’ve loved. Discover a story you haven’t met yet.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2000&q=85",
    position: "center 52%",
  },
];

export default function HeroSlider() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[#0f172a]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={reduceMotion ? false : { delay: 6500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="!h-[590px] md:!h-[620px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.eyebrow}>
            <div
              className="absolute inset-0 bg-cover"
              style={{ backgroundImage: `url("${slide.image}")`, backgroundPosition: slide.position }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/75 to-[#0f172a]/15" />
            <div className="page-width relative flex h-full items-center pb-10 pt-5">
              <div className="max-w-[660px] text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.21em] text-[#bae6fd]">{slide.eyebrow}</p>
                <h1 className="serif mt-6 text-[3.6rem] leading-[0.99] tracking-[-0.05em] sm:text-7xl lg:text-[5.55rem]">
                  {slide.title}
                </h1>
                <p className="mt-6 max-w-lg text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                  {slide.description}
                </p>
                <Link href="/books" className="button-primary mt-8 !bg-white !text-[#0f172a] hover:!bg-white">
                  Browse books <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-[#0f172a]/15 to-transparent" />
      <span className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[0.65rem] font-semibold tracking-[0.2em] text-white/75 sm:hidden">01 — 03</span>
    </section>
  );
}
