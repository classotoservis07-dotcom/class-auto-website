import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({ appointments, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Talepler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, phone, vehicleBrand, vehicleModel, plate,
      serviceId, serviceName, preferredDate, message, kvkkApproved,
      source, landingPage, utmSource, utmMedium, utmCampaign, utmContent,
      gclid, gbraid, wbraid,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'Ad soyad ve telefon zorunludur' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

    const appointment = await prisma.appointment.create({
      data: {
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        vehicleBrand: vehicleBrand ? String(vehicleBrand).trim() : null,
        vehicleModel: vehicleModel ? String(vehicleModel).trim() : null,
        plate: plate ? String(plate).trim().toUpperCase() : null,
        serviceId: serviceId ? parseInt(serviceId) : null,
        serviceName: serviceName ? String(serviceName).trim() : null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        message: message ? String(message).trim() : null,
        kvkkApproved: Boolean(kvkkApproved),
        status: 'new',
        source: source ?? 'form',
        landingPage: landingPage ?? null,
        utmSource: utmSource ?? null,
        utmMedium: utmMedium ?? null,
        utmCampaign: utmCampaign ?? null,
        utmContent: utmContent ?? null,
        gclid: gclid ?? null,
        gbraid: gbraid ?? null,
        wbraid: wbraid ?? null,
        ipAddress: ip.split(',')[0].trim(),
      },
    });

    return NextResponse.json({ success: true, id: appointment.id });
  } catch (error) {
    console.error('Appointment create error:', error);
    return NextResponse.json({ error: 'Talep kaydedilemedi' }, { status: 500 });
  }
}
