import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recentProjects = await prisma.project.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true, category: true }
    });

    const recentCertificates = await prisma.certificate.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true, issuer: true }
    });

    const recentExperience = await prisma.experience.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true, company: true }
    });

    return NextResponse.json({
      projects: recentProjects,
      certificates: recentCertificates,
      experiences: recentExperience,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}
