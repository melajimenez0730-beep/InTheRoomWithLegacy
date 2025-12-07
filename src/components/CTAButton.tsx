import React from "react";
import { Button } from "./ui/button";

export default function CTAButton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden" id="join-the-room">
      <div className="bg-primary/5 p-6 border-b border-primary/10">
        <h3 className="font-display text-2xl font-bold text-primary mb-2">Join the Room</h3>
        <p className="text-foreground/80">
          Be the first to receive new tools, resources and event invitations to help preserve your family's legacy.
        </p>
      </div>
      
      <div className="p-6 flex justify-center">
        <a 
          href="https://laurenrosamiller.kit.com/25d26f1801" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto min-w-[250px]"
        >
          Join the Room
        </a>
      </div>
    </div>
  );
}