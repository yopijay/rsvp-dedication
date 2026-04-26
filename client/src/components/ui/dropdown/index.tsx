"use client";

import { DropdownOption, DropdownProps } from "@/src/types/dropdown";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Field from "../field";
import {
    filterOptions,
    getBorderRadius,
    getDisplayText,
    getOptionBackgroundColor,
    getPadding,
    getSelectedOption,
} from "./helpers";

const Dropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select option...",
    disabled,
    searchable,
    searchPlaceholder = "Search...",
    isRounded,
}: DropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState("");
    const isDropdownOpen = isOpen && !disabled;

    const selectedOption = getSelectedOption(options, value);

    const filteredOptions = useMemo(
        () => filterOptions(options, searchTerm),
        [options, searchTerm]
    );

    const handleOptionSelect = (option: DropdownOption) => {
        onChange(option.value);
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
    };

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
    }, []);

    const handleTriggerClick = () => {
        if (disabled) return;
        if (isDropdownOpen) {
            closeDropdown();
            return;
        }

        setHighlightedIndex(-1);
        setIsOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (disabled) {
            if (
                event.key === "Enter" ||
                event.key === " " ||
                event.key === "ArrowDown" ||
                event.key === "ArrowUp"
            ) {
                event.preventDefault();
            }
            return;
        }

        if (!isDropdownOpen || filteredOptions.length === 0) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                event.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case "Enter":
                event.preventDefault();
                if (
                    highlightedIndex >= 0 &&
                    highlightedIndex < filteredOptions.length
                ) {
                    const selectedOption = filteredOptions[highlightedIndex];
                    if (!selectedOption.disabled) {
                        handleOptionSelect(selectedOption);
                    }
                }
                break;
            case "Escape":
            case "Tab":
                closeDropdown();
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                closeDropdown();
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen, closeDropdown]);

    useEffect(() => {
        if (!isDropdownOpen || !searchable || !searchInputRef.current) return;

        const focusTimeoutId = window.setTimeout(() => {
            searchInputRef.current?.focus();
        }, 50);

        return () => {
            window.clearTimeout(focusTimeoutId);
        };
    }, [isDropdownOpen, searchable]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="focus:outline-none"
                onClick={handleTriggerClick}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                style={{
                    padding: getPadding(isRounded),
                    border: "1px solid #d1d5db",
                    borderRadius: getBorderRadius(isRounded),
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                    backgroundColor: "#ffffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    gap: "8px",
                }}
            >
                <p
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {getDisplayText(
                        selectedOption,
                        placeholder || "Select an option"
                    )}
                </p>
                <span
                    className="text-[#6b7280] leading-none"
                    aria-hidden="true"
                >
                    {isDropdownOpen ? "▴" : "▾"}
                </span>
            </div>
            {isDropdownOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        maxHeight: "200px",
                        overflowY: "auto",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        marginTop: "2px",
                        zIndex: 1000,
                    }}
                >
                    {searchable && (
                        <div className="p-2">
                            <Field
                                className="focus:outline-none"
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSearchTerm(e.target.value);
                                    setHighlightedIndex(-1);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                variant="outlined"
                                style={{ width: "100%" }}
                                onClick={(e: React.MouseEvent) =>
                                    e.stopPropagation()
                                }
                            />
                        </div>
                    )}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                style={{
                                    padding: "8px 12px",
                                    cursor: option.disabled
                                        ? "not-allowed"
                                        : "pointer",
                                    backgroundColor: getOptionBackgroundColor(
                                        option,
                                        index,
                                        highlightedIndex,
                                        value
                                    ),
                                    opacity: option.disabled ? 0.6 : 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                key={option.value}
                                onClick={() => {
                                    if (!option.disabled) {
                                        handleOptionSelect(option);
                                    }
                                }}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="py-2 px-3 text-[#6b7280] italic text-center">
                            No options found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
