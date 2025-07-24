import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Pitch } from '@/lib/models/Pitch';

export async function GET() {
  console.log('Testing database connection...');
  
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('MongoDB connected successfully');

    // Try to count pitches
    console.log('Counting pitches...');
    const count = await Pitch.countDocuments();
    console.log(`Found ${count} pitches in database`);

    return NextResponse.json({ 
      status: 'success',
      message: 'Successfully connected to MongoDB',
      pitchCount: count
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 