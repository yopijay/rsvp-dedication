import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Isaiah Kai Judan | Baby Dedication",
    description:
        "Join us in celebrating the dedication of Isaiah Kai Judan. You are warmly invited to witness and share in this special blessing.",
    icons: {
        icon: "/images/invitation-tab-logo.png",
        shortcut: "/images/invitation-tab-logo.png",
        apple: "/images/invitation-tab-logo.png",
    },
    keywords: [
        "baby dedication",
        "Isaiah Kai Judan",
        "dedication ceremony",
        "e-invitation",
    ],
    openGraph: {
        title: "Isaiah Kai Judan | Baby Dedication",
        description:
            "Join us in celebrating the dedication of Isaiah Kai Judan. You are warmly invited to witness and share in this special blessing.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="bg-[#ffffff] antialiased [&::-webkit-scrollbar]:hidden">
                {children}
            </body>
        </html>
    );
}
