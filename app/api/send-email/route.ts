import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, location } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Format the message with or without phone and location
    const formattedMessage = `
      Name: ${name}
      Email: ${email}
      ${phone ? `Phone: ${phone}` : ''}
      ${location ? `Location: ${location}` : ''}
      
      Message:
      ${message}
    `;

    const data = await resend.emails.send({
      from: 'ECOTEK Contact Form <onboarding@resend.dev>',
      to: ['ecotek.termika@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      text: formattedMessage,
      replyTo: email,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
