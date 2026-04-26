import type { RsvpFormValues } from "@/src/lib/validation/rsvp";
import nodemailer from "nodemailer";

type EmailSendResult = {
    attempted: boolean;
    sentToGuest: boolean;
    sentToOrganizer: boolean;
    skippedReason?: string;
    error?: string;
};

const formatNameList = (names: string[]) => {
    return names.length > 0 ? names.join(", ") : "None";
};

const createTransporter = () => {
    const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT ?? "465");
    const secure =
        process.env.SMTP_SECURE === undefined
            ? true
            : process.env.SMTP_SECURE === "true";

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });
};

export const sendRsvpEmails = async (
    rsvp: RsvpFormValues
): Promise<EmailSendResult> => {
    const transporter = createTransporter();

    if (!transporter) {
        return {
            attempted: false,
            sentToGuest: false,
            sentToOrganizer: false,
            skippedReason: "SMTP credentials are not configured.",
        };
    }

    const smtpUser = process.env.SMTP_USER as string;
    const from = process.env.SMTP_FROM ?? smtpUser;
    const organizerEmail = process.env.RSVP_NOTIFY_TO;

    const attendance =
        rsvp.isComing === "yes" ? "Count Me In" : "I Can't Make It";
    const godParentText = rsvp.isGodParent ? rsvp.isGodParent : "No preference";

    const guestMail = transporter.sendMail({
        from,
        to: rsvp.email,
        subject: "RSVP Received | Isaiah Kai Dedication",
        text: [
            `Hi ${rsvp.fullName},`,
            "",
            "Thank you for your RSVP. We have received your response.",
            "",
            `Attendance: ${attendance}`,
            `Adults: ${formatNameList(rsvp.adults)}`,
            `Kids: ${formatNameList(rsvp.kids)}`,
            `Ninong/Ninang: ${godParentText}`,
            "",
            "God bless,",
            "Judan Family",
        ].join("\n"),
    });

    const organizerMail = organizerEmail
        ? transporter.sendMail({
              from,
              to: organizerEmail,
              subject: `New RSVP | ${rsvp.fullName}`,
              text: [
                  "A new RSVP was submitted.",
                  "",
                  `Name: ${rsvp.fullName}`,
                  `Email: ${rsvp.email}`,
                  `Attendance: ${attendance}`,
                  `Adults: ${formatNameList(rsvp.adults)}`,
                  `Kids: ${formatNameList(rsvp.kids)}`,
                  `Ninong/Ninang: ${godParentText}`,
              ].join("\n"),
          })
        : Promise.resolve(null);

    try {
        const [guestInfo, organizerInfo] = await Promise.all([
            guestMail,
            organizerMail,
        ]);

        return {
            attempted: true,
            sentToGuest: Boolean(guestInfo?.messageId),
            sentToOrganizer: Boolean(organizerInfo?.messageId),
        };
    } catch (error) {
        return {
            attempted: true,
            sentToGuest: false,
            sentToOrganizer: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown email sending error.",
        };
    }
};
