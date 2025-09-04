import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
  disabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function DashboardButton({
  label,
  icon,
  onClick,
  variant = 'default',
  gradientFrom,
  gradientTo,
  disabled = false,
  size = 'default',
  className,
}: DashboardButtonProps) {
  // Add error logging to track button clicks
  const handleClick = () => {
    try {
      console.log(`Button clicked: ${label}`);
      onClick();
    } catch (error) {
      console.error(`Error in button handler for ${label}:`, error);
    }
  };

  // Determine button class based on variant
  let buttonClass = className || '';
  
  if (variant === 'gradient' && gradientFrom && gradientTo) {
    buttonClass = cn(
      buttonClass,
      `bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`,
      `hover:from-${gradientFrom}-600 hover:to-${gradientTo}-600`,
      'text-white'
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant === 'gradient' ? 'default' : variant}
      size={size}
      disabled={disabled}
      className={buttonClass}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
}