import { ButtonProps } from "@/src/types/button";
import { getButtonClassNames, getButtonStyles } from "./helpers";

const Button = ({
    variant,
    isRounded,
    bgColor,
    color,
    children,
    size,
    fullWidth,
    ...props
}: ButtonProps) => {
    const buttonStyles = getButtonStyles({
        variant,
        bgColor,
        color,
        size,
        isRounded,
        fullWidth,
    });

    const buttonClasses = getButtonClassNames(variant);

    return (
        <button style={buttonStyles} className={buttonClasses} {...props}>
            {children}
        </button>
    );
};

export default Button;
