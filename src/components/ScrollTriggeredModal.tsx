import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { LeadCaptureForm } from "./LeadCaptureForm";
import "../styles/modal-overrides.css";

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
      const isMobile = window.innerWidth < 768;
      
      console.log(
        `[ScrollModal Debug] On mobile: ${isMobile}, Target section "${targetSectionId}" exists: ${!!section}`,
        section ? `Scroll position: ${window.scrollY}, Section position: ${section.getBoundingClientRect().top}` : ''
      );
      
      // Special handling for mobile devices
      if (isMobile) {
        // For mobile, check localStorage first
        try {
          // Uncomment the following lines to force the modal to show during testing
          // localStorage.removeItem(`scrollModal_${guideName.replace(/\s+/g, '_')}`);
          // localStorage.removeItem(`scrollModal_${guideName.replace(/\s+/g, '_')}_date`);
          
          console.log('[ScrollModal] Mobile device detected - setting up enhanced triggers');
          
          // Set a more aggressive check for mobile
          const checkForTrigger = () => {
            const scrollY = window.scrollY;
            const docHeight = document.body.clientHeight;
            const windowHeight = window.innerHeight;
            const scrollPercentage = (scrollY / (docHeight - windowHeight)) * 100;
            
            console.log('[ScrollModal] Mobile scroll check:', scrollPercentage);
            if (scrollPercentage >= 30 && !hasTriggered) {
              console.log('[ScrollModal] Mobile trigger threshold reached');
              setIsModalOpen(true);
              setHasTriggered(true);
            }
          };
          
          // Set multiple checks to ensure we catch the scroll
          setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
            checkForTrigger();
          }, 1000);
          
          setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
            checkForTrigger();
          }, 2000);
          
          setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
            checkForTrigger();
          }, 4000);
        } catch (e) {
          console.error('[ScrollModal] Error in mobile initialization:', e);
        }
      } else {
        // Standard behavior for desktop
        setTimeout(() => {
          window.dispatchEvent(new Event('scroll'));
        }, 1000);
      }
    };
    
    // Run the debug check when component mounts
    initialDebugCheck();
  }, [targetSectionId, guideName, hasTriggered]); // Run once on mount

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
      
      // Mobile-specific hard override - show the modal when scrolled to about 40% on mobile
      if (isMobile) {
        const scrollY = window.scrollY;
        const docHeight = document.body.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = (scrollY / (docHeight - windowHeight)) * 100;
        
        // More aggressive threshold for mobile - show earlier
        if (scrollPercentage >= 40) {
          console.log('[ScrollModal] Triggering on mobile at scroll percentage:', scrollPercentage);
          setIsModalOpen(true);
          setHasTriggered(true);
          return;
        }
      }
      
      // If a specific section is targeted, check if it's in view
      if (targetSectionId) {
        const section = document.getElementById(targetSectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          
          // Super aggressive triggering for mobile
          const triggerDistance = isMobile 
            ? window.innerHeight * 3  // Much earlier on mobile - almost as soon as section exists
            : window.innerHeight;
          
          console.log(`[ScrollModal] Section ${targetSectionId} position:`, rect.top, 'Trigger at:', triggerDistance);
          
          // Check if the target section is approaching the viewport or in it
          if ((rect.top <= triggerDistance && rect.bottom >= 0) || 
              (isMobile && rect.top <= window.innerHeight * 3)) {
            console.log('[ScrollModal] Triggering based on section visibility');
            setIsModalOpen(true);
            setHasTriggered(true);
          }
        } else {
          console.log(`[ScrollModal] Section ${targetSectionId} not found, falling back to scroll percentage`);
          // If section not found, fallback to percentage
          const scrollY = window.scrollY;
          const docHeight = document.body.clientHeight;
          const windowHeight = window.innerHeight;
          const scrollPercentage = (scrollY / (docHeight - windowHeight)) * 100;
          
          if ((isMobile && scrollPercentage >= 30) || scrollPercentage >= scrollThreshold) {
            console.log('[ScrollModal] Triggering on fallback scroll percentage:', scrollPercentage);
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
        const effectiveThreshold = isMobile ? 30 : scrollThreshold;
        
        console.log('[ScrollModal] Current scroll percentage:', scrollPercentage, 'Threshold:', effectiveThreshold);
        
        if (scrollPercentage >= effectiveThreshold) {
          console.log('[ScrollModal] Triggering based on scroll percentage');
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

  // Handle body overflow when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  // FOR TESTING: Force modal to show on mobile during development
  // Uncomment the following line to force modal visibility for testing
  // if (window.innerWidth < 768) setIsModalOpen(true);

  if (!isModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-[99999] flex items-center justify-center p-4 md:p-6 animate-fade-in overflow-y-auto mobile-modal-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: '100vw',
        height: '100vh',
        overflow: 'auto'
      }}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-fade-in-up border border-primary/20 my-auto mobile-modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          maxWidth: '90vw',
          width: '100%',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          transform: 'none',
          opacity: 1,
          visibility: 'visible'
        }}
      >
        {/* Close button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors z-[9999] p-2"
          aria-label="Close modal"
          style={{ touchAction: 'manipulation' }}
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