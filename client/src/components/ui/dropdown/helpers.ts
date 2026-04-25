import { DropdownOption } from "@/src/types/dropdown";

/**
 * Get padding based on isRounded prop
 * @param isRounded - Whether the dropdown is rounded
 * @returns Padding string
 */
export const getPadding = (isRounded?: boolean): string => {
    return isRounded ? "4px 12px" : "4px 8px";
};

/**
 * Get border radius based on isRounded prop
 * @param isRounded - Whether the dropdown is rounded
 * @returns Border radius string
 */
export const getBorderRadius = (isRounded?: boolean): string => {
    return isRounded ? "20px" : "4px";
};

/**
 * Check if an option is currently selected
 * @param optionValue - The value to check
 * @param currentValue - The current selected value
 * @returns True if the option is selected
 */
export const isOptionSelected = (
    optionValue: string | number,
    currentValue?: string | number
): boolean => {
    return currentValue === optionValue;
};

/**
 * Get selected option from the options array
 * @param options - All available options
 * @param value - Current selected value
 * @returns Selected option or undefined
 */
export const getSelectedOption = (
    options: DropdownOption[],
    value?: string | number
): DropdownOption | undefined => {
    return options.find((option) => option.value === value);
};

/**
 * Get display text for the dropdown input
 * @param selectedOption - The currently selected option
 * @param placeholder - Placeholder text
 * @returns Display text
 */
export const getDisplayText = (
    selectedOption: DropdownOption | undefined,
    placeholder: string
): string => {
    return selectedOption ? selectedOption.label : placeholder;
};

/**
 * Get background color for an option item
 * @param option - The option to style
 * @param index - Index of the option
 * @param highlightedIndex - Currently highlighted index
 * @param currentValue - Current selected value
 * @returns Background color string
 */
export const getOptionBackgroundColor = (
    option: DropdownOption,
    index: number,
    highlightedIndex: number,
    currentValue?: string | number
): string => {
    // Highlighted option (keyboard navigation)
    if (index === highlightedIndex) {
        return "#e5e7eb";
    }

    // Disabled option
    if (option.disabled) {
        return "#f5f5f5";
    }

    // Selected option
    if (isOptionSelected(option.value, currentValue)) {
        return "#f5f5f5"; // Gray for selected
    }

    // Default
    return "#ffffff";
};

/**
 * Filter options based on search term
 * @param options - All options
 * @param searchTerm - Current search term
 * @returns Filtered options
 */
export const filterOptions = (
    options: DropdownOption[],
    searchTerm: string
): DropdownOption[] => {
    if (!searchTerm.trim()) return options;

    return options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
};
