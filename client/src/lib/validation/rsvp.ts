import { z } from "zod";

const nameListItemSchema = z.string().trim().min(1);

export const rsvpSchema = z.object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Please enter a valid email"),
    adults: z.array(nameListItemSchema),
    kids: z.array(nameListItemSchema),
    isGodParent: z.enum(["", "ninong", "ninang"]),
    isComing: z.enum(["yes", "no"]),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
