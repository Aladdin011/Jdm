import React, { useState } from "react";

interface SmartLogoProps {
  className?: string;
  alt?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
}

const SmartLogo: React.FC<SmartLogoProps> = ({
  className = "",
  alt = "JD Marc Limited Logo",
  variant = "light",
  size = "md",
}) => {
  const [hasWebpFailed, setHasWebpFailed] = useState(false);
  const [hasJpgFailed, setHasJpgFailed] = useState(false);

  // Size classes mapping - properly scaled for containers
  const sizeClasses = {
    sm: "w-6 h-6", // 24px - for small contexts
    md: "w-10 h-10", // 40px - for navigation (fits better in 56px container)
    lg: "w-14 h-14", // 56px - for larger contexts
    xl: "w-20 h-20", // 80px - for hero sections
  };

  // Image sources priority: WebP → JPEG → CDN fallback
  const getImageSrc = () => {
    const baseLocal = `/images/brand/logo${variant === "dark" ? "-dark" : ""}`;

    if (!hasWebpFailed) {
      return `${baseLocal}.webp`;
    } else if (!hasJpgFailed) {
      return `${baseLocal}.jpg`;
    } else {
      // SVG fallback (most compatible)
      return `${baseLocal}.svg`;
    }
  };

  const handleImageError = () => {
    if (!hasWebpFailed) {
      setHasWebpFailed(true);
    } else if (!hasJpgFailed) {
      setHasJpgFailed(true);
    }
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={`${sizeClasses[size]} object-contain rounded-lg ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default SmartLogo;
