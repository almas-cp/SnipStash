"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("text-primary", sizeClasses[size])}>
        <Image
          src="/icons/snipstash-logo.svg"
          alt="SnipStash Logo"
          width={24}
          height={24}
          className="w-full h-full"
        />
      </div>
      {showText && (
        <span className={cn("font-bold", textSizeClasses[size])}>
          SnipStash
        </span>
      )}
    </Link>
  );
} 