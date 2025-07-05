import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

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

    // Check if Resend is properly initialized
    if (!resend) {
      console.warn('Resend API key is missing. Email functionality is disabled.');
      return NextResponse.json(
        { success: true, message: 'Email would have been sent (API key not configured)' },
        { status: 200 }
      );
    }

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
