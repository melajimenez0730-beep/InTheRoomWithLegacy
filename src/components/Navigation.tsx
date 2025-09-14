import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ghost";
}

const NavItem = ({ href, children, className, variant = "ghost" }: NavItemProps) => {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({
          variant,
          size: "sm",
        }),
        "font-medium transition-colors",
        className
      )}
    >
      {children}
    </a>
  );
};

interface NavDropdownProps {
  trigger: string;
  items: {
    href: string;
    label: string;
  }[];
  className?: string;
}

const NavDropdown = ({ trigger, items, className }: NavDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        buttonVariants({
          variant: "ghost",
          size: "sm",
        }),
        "inline-flex items-center gap-1 font-medium transition-colors",
        className
      )}>
        {trigger} <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <a href={item.href} className="cursor-pointer">
              {item.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function Navigation() {
  return (
    <nav className="flex items-center gap-1 md:gap-2">
      <NavItem href="/about">About</NavItem>
      
      <NavDropdown 
        trigger="About Us" 
        items={[
          { href: "/about", label: "About Us" },
          { href: "/about/founder-letter", label: "Read the Letter from Our Founder" }
        ]} 
        className="hidden"
      />
      
      <NavDropdown 
        trigger="Programs" 
        items={[
          { href: "/programs/while-were-still-here", label: "While We're Still Here" },
          { href: "/programs/black-family-business-network", label: "Black Family Business Network" }
        ]} 
      />
      
      <NavDropdown 
        trigger="Tools & Resources" 
        items={[
          { href: "/tools", label: "View All Tools & Resources" },
          { href: "/tools/legacy-assessment", label: "Legacy Assessment" }
        ]} 
      />
      
      <NavDropdown 
        trigger="Blog" 
        items={[
          { href: "/blog", label: "Read the Blog" },
          { href: "/blog/submit-story", label: "Submit Your Family Story" }
        ]} 
      />
      
      <NavItem href="/contact">Contact</NavItem>
    </nav>
  );
}