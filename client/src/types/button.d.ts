export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "filled" | "outlined";
    isRounded?: boolean;
    bgColor?: string;
    color?: string;
    children?: React.ReactNode;
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
};
