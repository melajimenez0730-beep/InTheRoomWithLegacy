import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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

const MobileNavLink = ({ href, children, onClick }: MobileNavLinkProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block w-full py-3 px-4 text-foreground hover:bg-primary/5 active:bg-primary/10 transition-colors text-lg font-medium border-b border-border/20"
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
      className="block w-full py-2 px-8 text-foreground/80 hover:bg-primary/5 active:bg-primary/10 transition-colors text-base"
    >
      {children}
    </a>
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
    <div className="fixed inset-0 z-50 bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="flex justify-end p-4">
        <button
          onClick={handleClose}
          className="p-2 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-col px-4 pb-8">
        {/* Main navigation links */}
        <div className="mb-6">
          <MobileNavLink href="/about" onClick={handleClose}>About</MobileNavLink>
          <MobileNavGroupLink href="/about/founder-letter" onClick={handleClose}>Letter from Our Founder</MobileNavGroupLink>
          <MobileNavGroupLink href="/about/partnership-pathways" onClick={handleClose}>Partnership Pathways</MobileNavGroupLink>
          <MobileNavGroupLink href="/about/faq" onClick={handleClose}>Frequently Asked Questions</MobileNavGroupLink>

          <MobileNavLink href="/programs" onClick={handleClose}>Programs</MobileNavLink>
          <MobileNavGroupLink href="/programs" onClick={handleClose}>Programs</MobileNavGroupLink>
          <MobileNavGroupLink href="/programs/while-were-still-here" onClick={handleClose}>While We're Still Here</MobileNavGroupLink>
          <MobileNavGroupLink href="/programs/black-family-business-network" onClick={handleClose}>Black Family Business Network</MobileNavGroupLink>

          <MobileNavLink href="/tools" onClick={handleClose}>Tools & Resources</MobileNavLink>
          <MobileNavGroupLink href="/tools/legacy-assessment" onClick={handleClose}>Legacy Assessment</MobileNavGroupLink>

          <MobileNavLink href="/blog" onClick={handleClose}>Blog</MobileNavLink>
          <MobileNavGroupLink href="/blog/submit-story" onClick={handleClose}>Submit Your Family Story</MobileNavGroupLink>

          <MobileNavLink href="/advisors" onClick={handleClose}>IRL Advisors</MobileNavLink>

          <MobileNavLink href="/contact" onClick={handleClose}>Contact</MobileNavLink>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 mt-4 px-4">
          <a
            href="/tools/legacy-assessment"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full text-center"
            )}
            onClick={handleClose}
          >
            Take the Legacy Assessment
          </a>
          <a
            href="#join-the-room"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full text-center border-primary text-primary hover:bg-primary/10"
            )}
            onClick={handleClose}
          >
            Join the Room
          </a>
        </div>
      </nav>
    </div>
  );
}