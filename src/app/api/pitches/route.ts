import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import dbConnect from '@/lib/mongodb';
import { Pitch } from '@/lib/models/Pitch';

export async function GET(request: Request) {
  
  try {
    // 1. Get userId from query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 2. Connect to MongoDB first
    await dbConnect();

    // 3. Fetch all pitches for this user
    const pitches = await Pitch.find({ userId }).sort({ createdAt: -1 });

    // 4. Return the pitches
    return NextResponse.json(pitches);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pitches' },
      { status: 500 }
    );
  }
} 