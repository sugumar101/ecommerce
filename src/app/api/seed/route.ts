import { NextResponse } from 'next/server';
import { seedProducts } from '@/lib/seed/products';

export async function POST() {
  try {
    await seedProducts();
    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}