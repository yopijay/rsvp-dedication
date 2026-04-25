export interface DropdownOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    isRounded?: boolean;
}
