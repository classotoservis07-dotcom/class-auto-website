import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apt = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });
    if (!apt) return NextResponse.json({ error: 'Talep bulunamadı' }, { status: 404 });
    return NextResponse.json(apt);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, adminNote } = body;

    const apt = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(adminNote !== undefined && { adminNote }),
        updatedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'appointment_updated',
        target: `Talep #${id}`,
        detail: status ? `Durum → ${status}` : 'Not güncellendi',
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, appointment: apt });
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
