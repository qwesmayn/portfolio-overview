import { cn } from "../lib/utils";
import React from "react";

interface LoadingSpinnerProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: number;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-center h-full", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={"animate-spin"}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  );
};
