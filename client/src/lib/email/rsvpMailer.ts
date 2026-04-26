import type { RsvpFormValues } from "@/src/lib/validation/rsvp";
import fs from "node:fs";
import path from "node:path";
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

const formatGodParentText = (value: RsvpFormValues["isGodParent"]) => {
    if (!value) {
        return "No preference";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
};

const invitationCardCid = "invitation-card@isaiahkai";

const escapeHtml = (value: string) => {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
};

const getInvitationImagePath = () => {
    const configuredPath =
        process.env.RSVP_INVITATION_IMAGE_PATH ??
        "public/images/invitation-card-email.png";

    return path.isAbsolute(configuredPath)
        ? configuredPath
        : path.resolve(process.cwd(), configuredPath);
};

const getImageContentType = (filePath: string) => {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === ".png") {
        return "image/png";
    }

    if (extension === ".jpg" || extension === ".jpeg") {
        return "image/jpeg";
    }

    if (extension === ".webp") {
        return "image/webp";
    }

    return "application/octet-stream";
};

const createGuestText = (
    rsvp: RsvpFormValues,
    attendance: string,
    godParentText: string
) => {
    return [
        `Hi ${rsvp.fullName},`,
        "",
        "Your RSVP for Isaiah Kai's Child Dedication has been received with gratitude.",
        "We are so thankful that you took the time to respond.",
        "",
        "RSVP Summary",
        `Attendance: ${attendance}`,
        `Adults: ${formatNameList(rsvp.adults)}`,
        `Kids: ${formatNameList(rsvp.kids)}`,
        `Ninong/Ninang: ${godParentText}`,
        "",
        "Event Details",
        "May 9, 2026",
        "3:30 o'clock in the afternoon",
        "Jollibee Quirino Highway Gulod",
        "",
        "We look forward to celebrating and praying over this special moment with you.",
        "",
        "With love and gratitude,",
        "Judan Family",
    ].join("\n");
};

const createOrganizerText = (
    rsvp: RsvpFormValues,
    attendance: string,
    godParentText: string
) => {
    return [
        "A new RSVP has been received for Isaiah Kai's Child Dedication.",
        "",
        `Name: ${rsvp.fullName}`,
        `Email: ${rsvp.email}`,
        `Attendance: ${attendance}`,
        `Adults: ${formatNameList(rsvp.adults)}`,
        `Kids: ${formatNameList(rsvp.kids)}`,
        `Ninong/Ninang: ${godParentText}`,
    ].join("\n");
};

const createGuestHtml = (
    rsvp: RsvpFormValues,
    attendance: string,
    godParentText: string,
    showInvitationImage: boolean
) => {
    const summaryRows = [
        ["Attendance", attendance],
        ["Adults", formatNameList(rsvp.adults)],
        ["Kids", formatNameList(rsvp.kids)],
        ["Ninong/Ninang", godParentText],
    ]
        .map(
            ([label, value]) => `
                <tr>
                    <td style="padding: 0 0 10px; font-size: 13px; line-height: 20px; color: #6b7280; width: 150px;">${escapeHtml(label)}</td>
                    <td style="padding: 0 0 10px; font-size: 14px; line-height: 20px; color: #1f2937; font-weight: 600;">${escapeHtml(value)}</td>
                </tr>
            `
        )
        .join("");

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Isaiah Kai Dedication RSVP</title>
            </head>
            <body style="margin: 0; padding: 24px 12px; background-color: #edf7ff; font-family: Georgia, 'Times New Roman', serif; color: #243b53;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse; max-width: 680px; background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%); border: 1px solid #d6e9fb; border-radius: 24px; overflow: hidden; box-shadow: 0 18px 50px rgba(74, 120, 168, 0.12);">
                                <tr>
                                    <td style="padding: 36px 36px 24px; background: linear-gradient(135deg, #fef6ea 0%, #eef7ff 45%, #f7fbff 100%); text-align: center;">
                                        <div style="font-size: 12px; letter-spacing: 0.32em; text-transform: uppercase; color: #7b9ec4; margin-bottom: 12px;">RSVP Confirmed</div>
                                        <div style="font-size: 38px; line-height: 44px; color: #4a78a8; font-weight: 700;">Isaiah Kai</div>
                                        <div style="font-size: 20px; line-height: 30px; color: #6e9cc6; font-style: italic; margin-top: 10px;">Child Dedication</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 36px 16px;">
                                        <p style="margin: 0; font-size: 18px; line-height: 30px; color: #36597b;">Hi ${escapeHtml(rsvp.fullName)},</p>
                                        <p style="margin: 16px 0 0; font-size: 16px; line-height: 28px; color: #4f6b88;">
                                            Your RSVP has been received with joy and gratitude. Thank you for taking part in this special celebration as we dedicate Isaiah Kai to the Lord.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 36px 12px;">
                                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse; background: #ffffff; border: 1px solid #dce9f8; border-radius: 18px;">
                                            <tr>
                                                <td style="padding: 22px 24px;">
                                                    <div style="font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #8ba9c8; margin-bottom: 14px;">Your Response</div>
                                                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse;">
                                                        ${summaryRows}
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 36px 12px;">
                                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse; background: #f9fcff; border: 1px solid #dce9f8; border-radius: 18px;">
                                            <tr>
                                                <td style="padding: 22px 24px; text-align: center;">
                                                    <div style="font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #8ba9c8; margin-bottom: 12px;">Celebration Details</div>
                                                    <div style="font-size: 30px; line-height: 38px; color: #4a78a8; font-weight: 400;">May 9, 2026</div>
                                                    <div style="font-size: 17px; line-height: 28px; color: #46688d; margin-top: 10px;">At 3:30 o'clock in the afternoon</div>
                                                    <div style="font-size: 15px; line-height: 26px; color: #6b87a6; margin-top: 8px; text-transform: uppercase;">Jollibee Quirino Highway Gulod</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ${
                                    showInvitationImage
                                        ? `
                                <tr>
                                    <td style="padding: 16px 36px 8px;">
                                        <div style="font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #8ba9c8; text-align: center; margin-bottom: 12px;">Invitation Card</div>
                                        <img src="cid:${invitationCardCid}" alt="Isaiah Kai invitation card" width="608" style="display: block; width: 100%; max-width: 608px; height: auto; border: 1px solid #dce9f8; border-radius: 18px; margin: 0 auto;" />
                                    </td>
                                </tr>`
                                        : ""
                                }
                                <tr>
                                    <td style="padding: 18px 36px 36px;">
                                        <p style="margin: 0; font-size: 15px; line-height: 27px; color: #4f6b88; text-align: center;">
                                            We would be honored to celebrate and pray with you during this meaningful day for our family.
                                        </p>
                                        <p style="margin: 18px 0 0; font-size: 15px; line-height: 27px; color: #4a78a8; text-align: center; font-weight: 600;">
                                            With love and gratitude,<br />Judan Family
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `.trim();
};

const createOrganizerHtml = (
    rsvp: RsvpFormValues,
    attendance: string,
    godParentText: string
) => {
    const summaryRows = [
        ["Name", rsvp.fullName],
        ["Email", rsvp.email],
        ["Attendance", attendance],
        ["Adults", formatNameList(rsvp.adults)],
        ["Kids", formatNameList(rsvp.kids)],
        ["Ninong/Ninang", godParentText],
    ]
        .map(
            ([label, value]) => `
                <tr>
                    <td style="padding: 0 0 10px; font-size: 13px; line-height: 20px; color: #6b7280; width: 150px;">${escapeHtml(label)}</td>
                    <td style="padding: 0 0 10px; font-size: 14px; line-height: 20px; color: #1f2937; font-weight: 600;">${escapeHtml(value)}</td>
                </tr>
            `
        )
        .join("");

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>New RSVP Received</title>
            </head>
            <body style="margin: 0; padding: 24px 12px; background-color: #edf7ff; font-family: Arial, Helvetica, sans-serif; color: #243b53;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse; max-width: 640px; background: #ffffff; border: 1px solid #d6e9fb; border-radius: 20px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 28px 32px; background: #f3f9ff; text-align: center;">
                                        <div style="font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #8ba9c8; margin-bottom: 10px;">New RSVP</div>
                                        <div style="font-size: 28px; line-height: 36px; color: #4a78a8; font-weight: 700;">Isaiah Kai Dedication</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 28px 32px;">
                                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse: collapse;">
                                            ${summaryRows}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `.trim();
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
    const godParentText = formatGodParentText(rsvp.isGodParent);

    const invitationImagePath = getInvitationImagePath();
    const hasInvitationImage = fs.existsSync(invitationImagePath);

    const guestHtml = createGuestHtml(
        rsvp,
        attendance,
        godParentText,
        hasInvitationImage
    );
    const organizerHtml = createOrganizerHtml(rsvp, attendance, godParentText);

    const invitationAttachment = hasInvitationImage
        ? [
              {
                  filename: "isaiah-kai-invitation.png",
                  content: fs.readFileSync(invitationImagePath),
                  contentDisposition: "inline" as const,
                  contentType: getImageContentType(invitationImagePath),
                  cid: invitationCardCid,
                  headers: {
                      "X-Attachment-Id": invitationCardCid,
                  },
              },
          ]
        : [];

    const guestMail = transporter.sendMail({
        from,
        to: rsvp.email,
        subject: "Your RSVP Is Confirmed | Isaiah Kai Dedication",
        html: guestHtml,
        attachments: invitationAttachment,
        text: createGuestText(rsvp, attendance, godParentText),
    });

    const organizerMail = organizerEmail
        ? transporter.sendMail({
              from,
              to: organizerEmail,
              subject: `New RSVP | ${rsvp.fullName}`,
              html: organizerHtml,
              text: createOrganizerText(rsvp, attendance, godParentText),
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
