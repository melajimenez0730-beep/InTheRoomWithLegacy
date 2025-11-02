import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { LeadCaptureForm } from "./LeadCaptureForm";

interface ScrollTriggeredModalProps {
  guideName: string;
  pdfPath?: string;
  targetSectionId?: string;
  scrollThreshold?: number; // Percentage of page scrolled (0-100)
  onClose?: () => void;
}

export function ScrollTriggeredModal({
  guideName,
  pdfPath = "/pdfs/parenting-a-parent-a-guide-for-adult-children_nw_fa0eeee7.pdf",
  targetSectionId = "conversation", // Default to conversation section
  scrollThreshold = 60, // Default to 60% scroll depth if no section ID provided
  onClose
}: ScrollTriggeredModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
    
    try {
      // Store in localStorage that this modal has been shown and closed
      const modalKey = `scrollModal_${guideName.replace(/\s+/g, '_')}`;
      localStorage.setItem(modalKey, "true");
      localStorage.setItem(`${modalKey}_date`, new Date().toISOString());
    } catch (e) {
      // Silent fail if localStorage is not available
      console.error("LocalStorage error:", e);
    }
  };

  // Force check if we're on a mobile device and should show the modal
  useEffect(() => {
    // Initial check for debug purposes - run once on component mount
    const initialDebugCheck = () => {
      const section = targetSectionId ? document.getElementById(targetSectionId) : null;
      console.log(
        `[ScrollModal Debug] Target section "${targetSectionId}" exists: ${!!section}`,
        section ? `Scroll position: ${window.scrollY}, Section position: ${section.getBoundingClientRect().top}` : ''
      );
      
      // Force trigger a scroll event to ensure our handler runs
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
      }, 1000);
    };
    
    // Run the debug check when component mounts
    initialDebugCheck();
  }, [targetSectionId]); // Run once on mount

  // Check if user has already interacted with the modal in this session or in the past
  useEffect(() => {
    try {
      // For debugging/testing, uncomment to clear localStorage
      // localStorage.removeItem(`scrollModal_${guideName.replace(/\s+/g, '_')}`);
      // localStorage.removeItem(`scrollModal_${guideName.replace(/\s+/g, '_')}_date`);
      
      // Use a more specific key that includes the guide name to avoid conflicts
      const modalKey = `scrollModal_${guideName.replace(/\s+/g, '_')}`;
      const hasBeenShown = localStorage.getItem(modalKey);
      const lastShownDate = localStorage.getItem(`${modalKey}_date`);
      
      // If shown before, check if it was more than 30 days ago
      if (hasBeenShown === "true" && lastShownDate) {
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const lastShown = new Date(lastShownDate).getTime();
        const now = new Date().getTime();
        
        // If less than 30 days, don't show again
        if (now - lastShown < thirtyDaysInMs) {
          return;
        }
      }
    } catch (e) {
      // If localStorage access fails (e.g., in incognito mode), continue normally
      console.error("LocalStorage error:", e);
    }
    
    const handleScroll = () => {
      if (hasTriggered) return;
      
      // Detect if user is on mobile (rough approximation)
      const isMobile = window.innerWidth < 768;
      
      // If a specific section is targeted, check if it's in view
      if (targetSectionId) {
        const section = document.getElementById(targetSectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          // On mobile, trigger when section is closer to viewport
          const triggerDistance = isMobile ? window.innerHeight * 1.5 : window.innerHeight;
          
          // Check if the target section is approaching the viewport or in it
          if ((rect.top <= triggerDistance && rect.bottom >= 0) || 
              (isMobile && rect.top <= window.innerHeight * 2)) {
            setIsModalOpen(true);
            setHasTriggered(true);
          }
        }
      } else {
        // Otherwise, use scroll percentage
        const scrollY = window.scrollY;
        const docHeight = document.body.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = (scrollY / (docHeight - windowHeight)) * 100;
        
        // Lower threshold for mobile devices to ensure it triggers
        const effectiveThreshold = isMobile ? Math.min(40, scrollThreshold) : scrollThreshold;
        
        if (scrollPercentage >= effectiveThreshold) {
          setIsModalOpen(true);
          setHasTriggered(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetSectionId, scrollThreshold, hasTriggered]);

  // Close modal when clicking/touching outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      // Add both mouse and touch events for better cross-device compatibility
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isModalOpen]);

  // Form submit success handler
  const handleFormSuccess = () => {
    // Auto-close after success and download
    setTimeout(() => closeModal(), 6000);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-fade-in-up border border-primary/20 my-auto"
      >
        {/* Close button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-5 md:p-8">
          <div className="bg-primary/5 -m-5 md:-m-8 mb-5 md:mb-6 p-5 md:p-8 border-b border-primary/10">
            <h2 className="text-xl md:text-2xl font-display font-bold text-primary mb-2">
              Download the Guide for free
            </h2>
            
            <p className="text-sm md:text-base text-foreground/80">
              Enter your details below to receive your free copy of "{guideName}".
            </p>
          </div>
          
          <LeadCaptureForm 
            guideName={guideName}
            pdfPath={pdfPath}
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>
    </div>
  );
}