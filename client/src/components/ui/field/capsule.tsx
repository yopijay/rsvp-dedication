import { CapsuleFieldProps } from "@/src/types/field";
import {
    KeyboardEvent,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

const CapsuleField = ({
    label,
    placeholder,
    values,
    inputValue,
    onInputChange,
    onAddValue,
    onRemoveValue,
}: CapsuleFieldProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const measureChipRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const measureBadgeRef = useRef<HTMLSpanElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [chipWidths, setChipWidths] = useState<number[]>([]);
    const [badgeBaseWidth, setBadgeBaseWidth] = useState(0);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const updateWidth = () => {
            setContainerWidth(container.clientWidth);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, []);

    useLayoutEffect(() => {
        const measuredChipWidths = values.map(
            (_, index) => measureChipRefs.current[index]?.offsetWidth ?? 0
        );
        const measuredBadgeWidth = measureBadgeRef.current?.offsetWidth ?? 0;

        setChipWidths((currentWidths) => {
            const hasChanged =
                currentWidths.length !== measuredChipWidths.length ||
                currentWidths.some(
                    (width, index) => width !== measuredChipWidths[index]
                );

            return hasChanged ? measuredChipWidths : currentWidths;
        });

        setBadgeBaseWidth((currentWidth) => {
            return currentWidth !== measuredBadgeWidth
                ? measuredBadgeWidth
                : currentWidth;
        });
    }, [values, containerWidth]);

    const visibleCountWhenCollapsed = useMemo(() => {
        if (values.length === 0) {
            return 0;
        }

        if (containerWidth <= 0) {
            return 1;
        }

        // Leave room for container horizontal padding and chip gaps.
        const availableWidth = Math.max(80, containerWidth - 24);
        const gapWidth = 8;
        const digitWidth = 8;
        const badgeWidth = (hidden: number) => {
            return (
                badgeBaseWidth +
                Math.max(0, `${hidden}`.length - 1) * digitWidth
            );
        };

        for (let visible = values.length; visible >= 1; visible -= 1) {
            const hidden = values.length - visible;
            const visibleUnits = chipWidths
                .slice(0, visible)
                .reduce((total, width) => total + width, 0);
            const totalUnits =
                visibleUnits +
                Math.max(0, visible - 1) * gapWidth +
                (hidden > 0 ? badgeWidth(hidden) + visible * gapWidth : 0);

            if (totalUnits <= availableWidth) {
                return visible;
            }
        }

        return 1;
    }, [badgeBaseWidth, chipWidths, containerWidth, values]);

    const displayedValues = isExpanded
        ? values.map((value, index) => ({ value, originalIndex: index }))
        : values
              .slice(0, visibleCountWhenCollapsed)
              .map((value, index) => ({ value, originalIndex: index }));
    const hiddenCount = values.length - displayedValues.length;

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            onAddValue();
            return;
        }

        if (event.key === " ") {
            // Convert on space only after at least two words are present.
            if (inputValue.trim().includes(" ")) {
                event.preventDefault();
                onAddValue();
            }
            return;
        }

        if (
            event.key === "Backspace" &&
            !inputValue.trim() &&
            values.length > 0
        ) {
            onRemoveValue(values.length - 1);
        }
    };

    const handleInputBlur = () => {
        onAddValue();
        setIsExpanded(false);
    };

    const showCollapsedCount = !isExpanded && hiddenCount > 0;
    const isCollapsed = !isExpanded && values.length > 0;

    const handleCollapsedContainerClick = () => {
        if (!isCollapsed) {
            return;
        }

        setIsExpanded(true);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    };

    return (
        <div className="flex flex-col gap-y-1 flex-1 min-w-0">
            <label className="font-papernotes text-[#3F6F9B] text-sm">
                {label}
            </label>
            <div
                ref={containerRef}
                onClick={handleCollapsedContainerClick}
                className={`w-full min-h-8 rounded-[20px] border border-[#e4e4e7] bg-white px-3 py-1 flex items-center gap-2 ${
                    isCollapsed
                        ? "flex-nowrap overflow-hidden cursor-text"
                        : "flex-wrap"
                }`}
            >
                {displayedValues.map(({ value, originalIndex }) => (
                    <span
                        key={`${value}-${originalIndex}`}
                        className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#DCEEFF] px-3 py-1 text-sm text-[#2F5F8B] font-papernotes"
                    >
                        <span className="truncate">{value}</span>
                    </span>
                ))}
                {showCollapsedCount && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(true)}
                        aria-label={`Show all ${values.length} ${label.toLowerCase()} names`}
                        className="inline-flex items-center rounded-full bg-[#DCEEFF] px-3 py-1 text-sm text-[#2F5F8B] font-papernotes hover:bg-[#c8e3ff]"
                    >
                        {`+${hiddenCount}`}
                    </button>
                )}
                {!isCollapsed && (
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(event) => onInputChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleInputBlur}
                        onFocus={() => setIsExpanded(true)}
                        placeholder={placeholder}
                        className="min-w-20 w-auto flex-1 bg-transparent outline-none text-[#565555] font-papernotes"
                    />
                )}
            </div>
            <p className="text-xs text-[#6E9CC6] font-papernotes px-2">
                Type a name and press Enter, or comma.
            </p>
            <div className="absolute invisible pointer-events-none -z-10 whitespace-nowrap">
                {values.map((value, index) => (
                    <span
                        key={`measure-${value}-${index}`}
                        ref={(element) => {
                            measureChipRefs.current[index] = element;
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#DCEEFF] px-3 py-1 text-sm text-[#2F5F8B] font-papernotes"
                    >
                        <span>{value}</span>
                    </span>
                ))}
                <span
                    ref={measureBadgeRef}
                    className="inline-flex items-center rounded-full bg-[#DCEEFF] px-3 py-1 text-sm text-[#2F5F8B] font-papernotes"
                >
                    +9
                </span>
            </div>
        </div>
    );
};

export default CapsuleField;
