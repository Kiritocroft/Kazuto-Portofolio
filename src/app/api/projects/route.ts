import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received project data:', { ...body, image: body.image ? 'Base64 String (' + body.image.length + ' chars)' : 'null' });

    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        tags: body.tags,
        link: body.link,
        github: body.github,
        featured: body.featured,
        category: body.category,
      },
    });
    console.log('Project created:', project.id);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
