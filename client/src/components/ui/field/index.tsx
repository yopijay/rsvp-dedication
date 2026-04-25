import { FieldProps } from "@/src/types/field";
import { getFieldStateClasses, getFieldStyles } from "./helpers";

const Field = ({
    bgColor,
    variant,
    isRounded,
    color,
    disabled,
    ...props
}: FieldProps) => {
    const fieldStyles = getFieldStyles({
        bgColor,
        variant,
        isRounded,
        color,
    });

    const fieldClasses = getFieldStateClasses(disabled);

    return (
        <input
            style={{
                ...fieldStyles,
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
            className={fieldClasses}
            disabled={disabled}
            {...props}
        />
    );
};

export default Field;
