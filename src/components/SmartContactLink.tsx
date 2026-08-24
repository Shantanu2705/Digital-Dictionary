"use client";

import React from "react";

interface SmartContactLinkProps {
  type: "phone" | "email";
  value: string;
  displayValue?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SmartContactLink({ type, value, displayValue, className, children }: SmartContactLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (type === "phone") {
      // Check if the user is on a mobile device capable of dialing
      const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
      
      if (!isMobile) {
        e.preventDefault();
        alert(`Please dial ${displayValue || value} from your mobile device to connect with us.`);
      }
    }
    // For emails, let the default mailto: behavior handle it (opens default mail client).
  };

  const href = type === "phone" 
    ? `tel:${value.replace(/[^0-9+]/g, '')}` 
    : `mailto:${value}`;

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children || displayValue || value}
    </a>
  );
}
