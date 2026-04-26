import { rsvpSchema, type RsvpFormValues } from "@/src/lib/validation/rsvp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "../ui/button";
import Field from "../ui/field";
import CapsuleField from "../ui/field/capsule";
import { addName, removeName } from "../ui/field/helpers";

const PleaseRespond = () => {
    const [adultInput, setAdultInput] = useState("");
    const [kidInput, setKidInput] = useState("");
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RsvpFormValues>({
        resolver: zodResolver(rsvpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            adults: [],
            kids: [],
            isGodParent: "",
            isComing: "yes",
        },
    });

    const adults = useWatch({ control, name: "adults" }) ?? [];
    const kids = useWatch({ control, name: "kids" }) ?? [];
    const isGodParent = useWatch({ control, name: "isGodParent" }) ?? "";
    const isComing = useWatch({ control, name: "isComing" }) ?? "yes";
    const [submitMessage, setSubmitMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        if (submitMessage?.type !== "success") {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSubmitMessage(null);
        }, 4000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [submitMessage]);

    const setAdults = (nextValues: string[]) => {
        setValue("adults", nextValues, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const setKids = (nextValues: string[]) => {
        setValue("kids", nextValues, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const handleFormSubmit = async (data: RsvpFormValues) => {
        setSubmitMessage(null);

        const response = await fetch("/api/rsvp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            setSubmitMessage({
                type: "error",
                text: "Unable to save your RSVP right now. Please try again.",
            });
            return;
        }

        reset({
            fullName: "",
            email: "",
            adults: [],
            kids: [],
            isGodParent: "",
            isComing: "yes",
        });
        setAdultInput("");
        setKidInput("");
        setSubmitMessage({
            type: "success",
            text: "RSVP received. Thank you!",
        });
    };

    return (
        <div className="w-full flex flex-col justify-center gap-y-5 sm:max-w-103 sm:mx-auto">
            <div className="flex flex-col gap-y-2">
                <h2 className="text-3xl font-bold text-[#4A78A8] font-simple-handmade">
                    Let Us Know You’re Coming
                </h2>
                <p className="text-sm text-[#6E9CC6] leading-none font-papernotes z-10">
                    Kindly respond by May 1, 2026. Your presence and prayers
                    will be a cherished blessing for our family and especially
                    for Isaiah Kai as he embarks on this spiritual journey.
                </p>
            </div>
            <form
                className="flex flex-col gap-y-3"
                autoComplete="off"
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <div className="flex flex-col gap-y-3">
                    <div className="flex flex-col gap-y-1">
                        <label className="font-papernotes text-[#3F6F9B] leading-none">
                            Full name*
                        </label>
                        <Field
                            {...register("fullName")}
                            isRounded
                            variant="outlined"
                            className="font-papernotes"
                        />
                        <p className="text-sm text-right pr-3 text-red-400 font-papernotes">
                            {errors.fullName?.message ?? ""}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label className="font-papernotes text-[#3F6F9B] leading-none">
                            Email*
                        </label>
                        <Field
                            {...register("email")}
                            isRounded
                            variant="outlined"
                            type="email"
                            className="font-papernotes"
                        />
                        <p className="text-sm text-right pr-3 text-red-400 font-papernotes">
                            {errors.email?.message ?? ""}
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <label className="font-papernotes text-[#3F6F9B] leading-none ">
                            Will you bring someone with you? (Adults and kids
                            can be added separately)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <CapsuleField
                                label="Adults"
                                placeholder=""
                                values={adults}
                                inputValue={adultInput}
                                onInputChange={setAdultInput}
                                onAddValue={() =>
                                    addName(
                                        adultInput,
                                        adults,
                                        setAdults,
                                        () => {
                                            setAdultInput("");
                                        }
                                    )
                                }
                                onRemoveValue={(index) =>
                                    removeName(index, adults, setAdults)
                                }
                            />
                            <CapsuleField
                                label="Kids"
                                placeholder=""
                                values={kids}
                                inputValue={kidInput}
                                onInputChange={setKidInput}
                                onAddValue={() =>
                                    addName(kidInput, kids, setKids, () => {
                                        setKidInput("");
                                    })
                                }
                                onRemoveValue={(index) =>
                                    removeName(index, kids, setKids)
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="font-papernotes text-[#3F6F9B] leading-none">
                            Would you be open to serving as Ninong/Ninang?
                        </label>
                        <div className="flex flex-row gap-x-3">
                            <Button
                                type="button"
                                onClick={() =>
                                    setValue(
                                        "isGodParent",
                                        isGodParent === "ninong"
                                            ? ""
                                            : "ninong",
                                        { shouldDirty: true }
                                    )
                                }
                                className="grow font-simple-handmade cursor-pointer"
                                size="small"
                                color={
                                    isGodParent === "ninong"
                                        ? "#fff"
                                        : "#3F6F9B"
                                }
                                isRounded
                                bgColor="#3F6F9B"
                                variant={
                                    isGodParent === "ninong"
                                        ? "filled"
                                        : "outlined"
                                }
                            >
                                Ninong
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    setValue(
                                        "isGodParent",
                                        isGodParent === "ninang"
                                            ? ""
                                            : "ninang",
                                        { shouldDirty: true }
                                    )
                                }
                                isRounded
                                className="grow font-simple-handmade cursor-pointer"
                                size="small"
                                color={
                                    isGodParent === "ninang"
                                        ? "#fff"
                                        : "#3F6F9B"
                                }
                                bgColor="#3F6F9B"
                                variant={
                                    isGodParent === "ninang"
                                        ? "filled"
                                        : "outlined"
                                }
                            >
                                Ninang
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <label className="font-papernotes text-[#3F6F9B] leading-none">
                            Kindly confirm your attendance*
                        </label>
                        <div className="flex flex-row gap-x-3">
                            <Button
                                type="button"
                                onClick={() =>
                                    setValue("isComing", "yes", {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    })
                                }
                                isRounded
                                size="small"
                                className="grow font-simple-handmade cursor-pointer"
                                color={isComing === "yes" ? "#fff" : "#3F6F9B"}
                                bgColor="#3F6F9B"
                                variant={
                                    isComing === "yes" ? "filled" : "outlined"
                                }
                            >
                                Count Me In
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    setValue("isComing", "no", {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    })
                                }
                                isRounded
                                size="small"
                                className="grow font-simple-handmade cursor-pointer"
                                color={isComing === "no" ? "#fff" : "#3F6F9B"}
                                bgColor="#3F6F9B"
                                variant={
                                    isComing === "no" ? "filled" : "outlined"
                                }
                            >
                                {`I Can't Make It`}
                            </Button>
                        </div>
                    </div>
                </div>
                <Button
                    type="submit"
                    variant="filled"
                    isRounded
                    bgColor="#3F6F9B"
                    disabled={isSubmitting}
                    className="text-white mt-4 w-full font-simple-handmade uppercase cursor-pointer"
                >
                    {isSubmitting ? "Saving..." : "Confirm attendance"}
                </Button>
                {submitMessage && (
                    <p
                        className={`text-sm text-center font-papernotes ${
                            submitMessage.type === "success"
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {submitMessage.text}
                    </p>
                )}
            </form>
        </div>
    );
};

export default PleaseRespond;
