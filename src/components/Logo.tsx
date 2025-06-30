
import React from "react";
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  to?: string;
}

const Logo = ({
  className,
  textClassName,
  iconClassName,
  showText = true,
  size = "md",
  to = "/"
}: LogoProps) => {
  // Size mappings
  const sizeMap = {
    sm: {
      icon: 18,
      text: "text-lg",
      gap: "gap-1",
    },
    md: {
      icon: 24,
      text: "text-2xl",
      gap: "gap-1.5",
    },
    lg: {
      icon: 30,
      text: "text-3xl",
      gap: "gap-2",
    },
  };

  const Content = () => (
    <div className={cn("flex items-center", sizeMap[size].gap, className)}>
      <Zap 
        size={sizeMap[size].icon} 
        className={cn(
          "text-purple-600 fill-purple-200 stroke-[2.5px]", 
          iconClassName
        )} 
      />
      {showText && (
        <span 
          className={cn(
            sizeMap[size].text, 
            "font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent", 
            textClassName
          )}
        >
          AdLoot
        </span>
      )}
    </div>
  );

  // If a "to" prop is provided, wrap in Link, otherwise just return the content
  return to ? (
    <Link to={to} className="inline-flex">
      <Content />
    </Link>
  ) : (
    <Content />
  );
};

export default Logo;
