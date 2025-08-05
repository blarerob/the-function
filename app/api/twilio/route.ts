import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
    try {
        const { to, message } = await req.json();

        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
    }
}