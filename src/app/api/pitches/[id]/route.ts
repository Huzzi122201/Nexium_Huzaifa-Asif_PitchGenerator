import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import dbConnect from '@/lib/mongodb';
import { Pitch } from '@/lib/models/Pitch';

// Helper function to get user silently
async function getUser() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore
    });
    
    // Suppress console errors by catching them silently
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return null;
      return user;
    } catch {
      return null;
    }
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    await dbConnect();
    const pitch = await Pitch.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!pitch) {
      return NextResponse.json(
        { error: 'Pitch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pitch);
  } catch (error) {
    console.error('Error fetching pitch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pitch' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    await dbConnect();
    const result = await Pitch.deleteOne({
      _id: params.id,
      userId: user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Pitch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Pitch deleted successfully' });
  } catch (error) {
    console.error('Error deleting pitch:', error);
    return NextResponse.json(
      { error: 'Failed to delete pitch' },
      { status: 500 }
    );
  }
} 