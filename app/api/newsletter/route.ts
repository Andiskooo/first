import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Email i pavlefshëm' },
        { status: 400 }
      );
    }

    // You can replace this URL with your actual webhook URL
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL || 'https://hook.eu1.make.com/your-webhook-id';

    // Send the email to your webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source: 'blog_subscription',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!webhookResponse.ok) {
      console.error('Webhook error:', await webhookResponse.text());
      return NextResponse.json(
        { success: false, message: 'Gabim në dërgimin e të dhënave' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Abonimi u krye me sukses' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Gabim i brendshëm i serverit' },
      { status: 500 }
    );
  }
}
