import { ButtonProps } from "@/src/types/button";

// Helper function to get button styles based on props
export const getButtonStyles = ({
    variant,
    bgColor,
    color,
    size,
    isRounded,
    fullWidth,
}: Partial<ButtonProps>) => {
    return {
        backgroundColor: getBackgroundColor(variant, bgColor),
        color: getTextColor(variant, color),
        border: getBorder(variant, color),
        width: getWidth(fullWidth),
        borderRadius: getBorderRadius(isRounded),
        padding: getPadding(variant, size),
    };
};

// Get background color based on variant
export const getBackgroundColor = (
    variant?: string,
    bgColor?: string
): string => {
    if (variant === "filled") {
        return bgColor ?? "#29377E";
    }
    return "transparent";
};

// Get text color based on variant and background
export const getTextColor = (variant?: string, color?: string): string => {
    if (color) return color;

    if (variant === "filled") {
        return "#ffffff";
    }
    return "#29377E";
};

// Get border styles
export const getBorder = (variant?: string, color?: string): string => {
    if (variant === "outlined") {
        return `1px solid ${color ?? "#29377E"}`;
    }
    return "none";
};

// Get width styles
export const getWidth = (fullWidth?: boolean): string => {
    return fullWidth ? "100%" : "auto";
};

// Get border radius
export const getBorderRadius = (isRounded?: boolean): string => {
    return isRounded ? "20px" : "4px";
};

// Get padding based on variant and size
export const getPadding = (
    variant?: string,
    size?: "small" | "medium" | "large"
): string => {
    if (!variant) return "0px";

    switch (size) {
        case "small":
            return "4px 8px";
        case "large":
            return "12px 24px";
        default: // medium
            return "8px 16px";
    }
};

// Utility to combine all button classes
export const getButtonClassNames = (variant?: string): string => {
    const baseClasses =
        "transition-colors duration-200 focus:outline-none";

    switch (variant) {
        case "filled":
            return `${baseClasses}`;
        case "outlined":
            return `${baseClasses}`;
        default:
            return baseClasses;
    }
};
