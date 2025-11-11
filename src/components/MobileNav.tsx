import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface MobileNavDropdownProps {
  label: string;
  children: React.ReactNode;
}

const MobileNavLink = ({ href, children, onClick }: MobileNavLinkProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block w-full py-3 px-4 text-[#f7f6dc] hover:bg-[#f7f6dc]/10 active:bg-[#f7f6dc]/20 transition-colors text-lg font-medium border-b border-[#f7f6dc]/10"
    >
      {children}
    </a>
  );
};

const MobileNavGroupLink = ({ href, children, onClick }: MobileNavLinkProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block w-full py-2 px-8 text-[#f7f6dc]/70 hover:bg-[#f7f6dc]/10 active:bg-[#f7f6dc]/20 transition-colors text-base"
    >
      {children}
    </a>
  );
};

const MobileNavDropdown = ({ label, children }: MobileNavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="border-b border-[#f7f6dc]/10">
      <button
        onClick={toggleDropdown}
        className="flex justify-between items-center w-full py-3 px-4 text-[#f7f6dc] hover:bg-[#f7f6dc]/10 active:bg-[#f7f6dc]/20 transition-colors text-lg font-medium"
      >
        {label}
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

export default function MobileNav({ isOpen: initialIsOpen, onClose }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  
  useEffect(() => {
    // Event listener to toggle the mobile navigation
    const handleToggle = (e: CustomEvent) => {
      setIsOpen(e.detail.isOpen);
    };
    
    // Add event listener
    document.addEventListener('toggleMobileNav', handleToggle as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('toggleMobileNav', handleToggle as EventListener);
    };
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    // Send an event to let Astro know we've closed the menu
    const event = new CustomEvent('toggleMobileNav', { detail: { isOpen: false } });
    document.dispatchEvent(event);
    onClose();
  };
  
  // If the menu is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#052d3f] overflow-y-auto">
      <div className="flex justify-end p-4">
        <button
          onClick={handleClose}
          className="p-2 text-[#f7f6dc]/70 hover:text-[#f7f6dc] transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-col px-4 pb-8">
        {/* Main navigation links */}
        <div className="mb-6">
          {/* About Dropdown */}
          <MobileNavDropdown label="About">
            <MobileNavGroupLink href="/about" onClick={handleClose}>About Us</MobileNavGroupLink>
            <MobileNavGroupLink href="/about/founder-letter" onClick={handleClose}>Letter from Our Founder</MobileNavGroupLink>
            <MobileNavGroupLink href="/about/partnership-pathways" onClick={handleClose}>Partnership Pathways</MobileNavGroupLink>
            <MobileNavGroupLink href="/about/faq" onClick={handleClose}>Frequently Asked Questions</MobileNavGroupLink>
          </MobileNavDropdown>

          {/* Programs Dropdown */}
          <MobileNavDropdown label="Programs">
            <MobileNavGroupLink href="/programs" onClick={handleClose}>Programs</MobileNavGroupLink>
            <MobileNavGroupLink href="/programs/while-were-still-here" onClick={handleClose}>While We're Still Here</MobileNavGroupLink>
          </MobileNavDropdown>
          
          {/* Tools & Resources Dropdown */}
          <MobileNavDropdown label="Tools & Resources">
            <MobileNavGroupLink href="/resources" onClick={handleClose}>Legacy Insights, Tools, and Resources</MobileNavGroupLink>
            <MobileNavGroupLink href="/tools/legacy-assessment" onClick={handleClose}>Legacy Assessment</MobileNavGroupLink>
          </MobileNavDropdown>
          
          {/* IRL Advisors with dropdown */}
          <MobileNavDropdown label="IRL Advisors">
            <MobileNavGroupLink href="/advisors" onClick={handleClose}>IRL Advisors</MobileNavGroupLink>
            <MobileNavGroupLink href="/programs/black-family-business-network" onClick={handleClose}>Black Family Business Network</MobileNavGroupLink>
          </MobileNavDropdown>
          <MobileNavLink href="/contact" onClick={handleClose}>Contact</MobileNavLink>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 mt-4 px-4">
          <a
            href="/tools/legacy-assessment"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full text-center bg-[#f7f6dc] text-[#052d3f] font-medium border-2 border-[#052d3f] hover:bg-[#052d3f] hover:text-white transition-colors duration-300"
            )}
            onClick={handleClose}
          >
            Take the Legacy Assessment
          </a>
          <a
            href="/join-the-room"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full text-center bg-[#9a4a0b] text-[#f7f6dc] hover:bg-[#9a4a0b]/80 border-none"
            )}
            onClick={handleClose}
          >
            Donate Now
          </a>
        </div>
      </nav>
    </div>
  );
}