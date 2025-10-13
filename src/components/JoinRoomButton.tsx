import React from 'react';
import { useJoinRoomModal } from './JoinRoomModalProvider';
import { buttonVariants } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface JoinRoomButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  children?: React.ReactNode;
}

export default function JoinRoomButton({ 
  className,
  variant = "default",
  size = "default", 
  children = "Join the Room"
}: JoinRoomButtonProps) {
  const { openJoinRoomModal } = useJoinRoomModal();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        openJoinRoomModal();
      }}
      className={cn(
        buttonVariants({
          variant,
          size,
          class: className
        })
      )}
    >
      {children}
    </button>
  );
}