"use client";

import PleaseRespond from "@/src/components/forms/PleaseRespond";
import InvitationCard from "@/src/components/layouts/InvitationCard";

export default function Home() {
    return (
        <div className="relative flex min-h-dvh lg:min-h-screen items-start lg:items-center justify-center px-4 py-10 bg-linear-to-b from-sky-300 via-sky-100 to-[#E0FFFF] overflow-x-hidden">
            <div className="z-10 w-full max-w-4xl backdrop-blur-sm flex flex-col gap-3">
                {/* Card */}
                <div className="flex flex-col lg:flex-row gap-10">
                    <InvitationCard />
                    <PleaseRespond />
                </div>
                <p className="text-center text-xs text-slate-400 max-w-md mx-auto pt-10">
                    Typography credits: Brittany Signature (Creatype Studio),
                    Keshia (Graphix Line Studio), Simple Handmade (Letter Art
                    Studio), and Papernotes (license details to be verified).
                </p>
                <p className="text-center text-xs text-slate-500 max-w-md mx-auto">
                    Developed by Paul John Judan
                </p>
            </div>
        </div>
    );
}
