import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface ScrollStickyCTAProps {
  text: string;
  href: string;
}

export function ScrollStickyCTA({ text, href }: ScrollStickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the CTA when user has scrolled past 300px
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <a 
        href={href}
        className="flex items-center gap-2 bg-[#052d3f] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-[#052d3f]/90 font-medium text-sm"
      >
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}