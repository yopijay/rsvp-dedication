import { FieldProps } from "@/src/types/field";

const normalizeName = (value: string): string =>
    value.trim().replace(/\s+/g, " ").replace(/,$/, "");

// Helper function to get field styles based on props
export const getFieldStyles = ({
    bgColor,
    variant,
    isRounded,
    color,
}: Partial<FieldProps>) => {
    return {
        color: getTextColor(color),
        backgroundColor: getBackgroundColor(variant, bgColor),
        outline: "none",
        padding: getPadding(isRounded),
        border: getBorder(variant),
        borderRadius: getBorderRadius(isRounded),
    };
};

// Get text color
export const getTextColor = (color?: string): string => {
    return color ?? "#565555";
};

// Get background color based on variant
export const getBackgroundColor = (
    variant?: string,
    bgColor?: string
): string => {
    if (variant === "outlined") {
        return "#ffffff";
    }
    return bgColor ?? "#f4f4f5";
};

// Get border styles
export const getBorder = (variant?: string): string => {
    if (variant === "outlined") {
        return "solid 1px #e4e4e7";
    }
    return "solid 0px transparent";
};

// Get border radius
export const getBorderRadius = (isRounded?: boolean): string => {
    return isRounded ? "20px" : "4px";
};

// Get padding
export const getPadding = (isRounded: boolean): string => {
    return isRounded ? "4px 12px" : "4px 8px";
};

// Get field state classes
export const getFieldStateClasses = (
    isDisabled?: boolean,
    isError?: boolean,
    isFocused?: boolean
): string => {
    const baseClasses = "transition-colors duration-200";

    if (isDisabled) {
        return `${baseClasses} opacity-50 cursor-not-allowed`;
    }

    if (isError) {
        return `${baseClasses} border-red-500 focus:border-red-600 focus:ring-red-500`;
    }

    if (isFocused) {
        return `${baseClasses} focus:border-blue-500 focus:ring-blue-500`;
    }

    return baseClasses;
};

// Validate field value
export const validateField = (
    value: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    pattern?: RegExp
): { isValid: boolean; error?: string } => {
    if (required && !value.trim()) {
        return { isValid: false, error: "This field is required" };
    }

    if (minLength && value.length < minLength) {
        return {
            isValid: false,
            error: `Minimum length is ${minLength} characters`,
        };
    }

    if (maxLength && value.length > maxLength) {
        return {
            isValid: false,
            error: `Maximum length is ${maxLength} characters`,
        };
    }

    if (pattern && !pattern.test(value)) {
        return { isValid: false, error: "Invalid format" };
    }

    return { isValid: true };
};

export const addName = (
    inputValue: string,
    values: string[],
    setValues: (nextValues: string[]) => void,
    clearInput: () => void
) => {
    const formatted = normalizeName(inputValue);

    if (!formatted) {
        clearInput();
        return;
    }

    const alreadyAdded = values.some(
        (item) => item.toLowerCase() === formatted.toLowerCase()
    );

    if (!alreadyAdded) {
        setValues([...values, formatted]);
    }

    clearInput();
};

export const removeName = (
    index: number,
    values: string[],
    setValues: (nextValues: string[]) => void
) => {
    setValues(values.filter((_, itemIndex) => itemIndex !== index));
};
