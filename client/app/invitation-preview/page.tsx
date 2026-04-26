import InvitationCard from "@/src/components/layouts/InvitationCard";

export default function InvitationPreviewPage() {
    return (
        <main className="min-h-screen bg-[#eaf5ff] flex items-center justify-center p-8">
            <InvitationCard captureId="email-card" className="max-w-103" />
        </main>
    );
}
