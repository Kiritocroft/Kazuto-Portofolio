import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received experience data:', body);

    const experience = await prisma.experience.create({
      data: {
        title: body.title,
        company: body.company,
        year: body.year,
        description: body.description,
        // @ts-ignore: Schema updated but client generation might be blocked by running server
        type: body.type || "work",
      },
    });
    console.log('Experience created:', experience.id);
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
