import { NextRequest, NextResponse } from 'next/server';

type DeliveryReport = {
  receivedAt: string;
  headers: Record<string, string>;
  payload: unknown;
};

const deliveryReports: DeliveryReport[] = [];
const MAX_REPORTS = 20;

function rememberReport(report: DeliveryReport) {
  deliveryReports.unshift(report);

  if (deliveryReports.length > MAX_REPORTS) {
    deliveryReports.length = MAX_REPORTS;
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    endpoint: '/api/viber/delivery-reports',
    reportsCount: deliveryReports.length,
    reports: deliveryReports,
  });
}

export async function POST(request: NextRequest) {
  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = await request.text();
  }

  const report = {
    receivedAt: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries()),
    payload,
  };

  rememberReport(report);
  console.log('Viber delivery report received:', report);

  return NextResponse.json({
    success: true,
    message: 'Delivery report received',
    receivedAt: report.receivedAt,
  });
}
