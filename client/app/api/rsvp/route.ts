import { rsvpSchema } from "@/src/lib/validation/rsvp";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const databaseUrl = process.env.DATABASE_URL;

export async function POST(request: Request) {
    if (!databaseUrl) {
        return NextResponse.json(
            {
                error: "DATABASE_URL is missing. Connect Neon/Vercel Postgres first.",
            },
            { status: 500 }
        );
    }

    const payload = await request.json().catch(() => null);
    const parsed = rsvpSchema.safeParse(payload);

    if (!parsed.success) {
        return NextResponse.json(
            {
                error: "Please review your RSVP details.",
                details: parsed.error.flatten(),
            },
            { status: 400 }
        );
    }

    const sql = neon(databaseUrl);
    const { fullName, email, adults, kids, isGodParent, isComing } =
        parsed.data;

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS rsvp_responses (
                id SERIAL PRIMARY KEY,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                adults JSONB NOT NULL DEFAULT '[]'::jsonb,
                kids JSONB NOT NULL DEFAULT '[]'::jsonb,
                is_god_parent TEXT NOT NULL DEFAULT '',
                is_coming TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `;

        const rows = await sql`
            INSERT INTO rsvp_responses (
                full_name,
                email,
                adults,
                kids,
                is_god_parent,
                is_coming
            )
            VALUES (
                ${fullName},
                ${email},
                ${JSON.stringify(adults)}::jsonb,
                ${JSON.stringify(kids)}::jsonb,
                ${isGodParent},
                ${isComing}
            )
            ON CONFLICT (email)
            DO UPDATE SET
                full_name = EXCLUDED.full_name,
                adults = EXCLUDED.adults,
                kids = EXCLUDED.kids,
                is_god_parent = EXCLUDED.is_god_parent,
                is_coming = EXCLUDED.is_coming,
                updated_at = NOW()
            RETURNING id
        `;

        return NextResponse.json({ ok: true, id: rows[0]?.id ?? null });
    } catch (error) {
        console.error("Failed to save RSVP", error);

        return NextResponse.json(
            {
                error: "Unable to save RSVP right now. Please try again.",
            },
            { status: 500 }
        );
    }
}
