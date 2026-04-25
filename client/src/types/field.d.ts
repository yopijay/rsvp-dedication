export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
    isRequired?: boolean;
    variant?: "outlined" | "filled";
    isRounded?: boolean;
    bgColor?: string;
    color?: string;
};

export type CapsuleFieldProps = {
    label: string;
    placeholder: string;
    values: string[];
    inputValue: string;
    onInputChange: (value: string) => void;
    onAddValue: () => void;
    onRemoveValue: (index: number) => void;
};
