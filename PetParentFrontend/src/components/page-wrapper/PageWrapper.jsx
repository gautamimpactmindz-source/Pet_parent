"use client";
import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import AOS from "aos";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function PageWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      once: true,
    });
  }, []);

  useGSAP(() => {
    console.log(ScrollTrigger.isTouch);

    // Locomotive scroll instance
    const locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        duration: 1.7,
        wheelMultiplier: 0.8,
        smoothWheel: true,
      },
    });

    // Synchronize Lenis scrolling with ScrollTrigger
    locomotiveScroll.lenisInstance.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Page scroll to top
    locomotiveScroll.scrollTo(0, {
      immediate: true,
    });

    // Cleanup
    return () => {
      locomotiveScroll.destroy();
    };
  }, [pathname]);

  // Footer height → wrapper padding
  useEffect(() => {
    const setPadding = () => {
      const pageWrapper = document.querySelector(".page-wrapper");
      const footer = document.querySelector("footer");

      const footerHeight = footer?.offsetHeight;
      const sixtyVh = window.innerHeight * 0.6;

      pageWrapper.style.paddingBottom = `${footerHeight}px`;
      pageWrapper.style.minHeight = `${footerHeight + sixtyVh}px`;
    };

    setPadding();
    window.addEventListener("resize", setPadding);

    return () => window.removeEventListener("resize", setPadding);
  }, []);

  return (
    <div className="page-wrapper position-relative z-1">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
