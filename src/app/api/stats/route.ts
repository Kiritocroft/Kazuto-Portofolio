import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projectsCount = await prisma.project.count();
    const certificatesCount = await prisma.certificate.count();

    return NextResponse.json({
      projects: projectsCount,
      certificates: certificatesCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
