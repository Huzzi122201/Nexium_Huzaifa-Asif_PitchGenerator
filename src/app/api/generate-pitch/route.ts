import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { Pitch } from "@/lib/models/Pitch";
import type { PitchFormData } from "@/lib/utils";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

if (!N8N_WEBHOOK_URL) {
  throw new Error("N8N_WEBHOOK_URL is not defined");
}

// Ensure N8N_WEBHOOK_URL is a valid URL
let webhookUrl: URL;
try {
  webhookUrl = new URL(N8N_WEBHOOK_URL);
} catch (error) {
  throw new Error("N8N_WEBHOOK_URL is not a valid URL");
}

export async function POST(request: Request) {
  try {
    // Initialize Supabase client correctly for route handlers
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - No user found" },
        { status: 401 }
      );
    }

    const data: PitchFormData & { pitchId?: string } = await request.json();
    
    // Log the exact request data we're sending
    const requestData = {
      type: data.type,
      businessName: data.businessName,
      industry: data.industry,
      targetAudience: data.targetAudience,
      tone: data.tone,
      keyPoints: data.keyPoints
    };

    try {
      const n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await n8nResponse.text();

      if (!n8nResponse.ok) {
        throw new Error(`n8n request failed: ${n8nResponse.statusText}`);
      }

      // Parse the response text as JSON
      const result = responseText ? JSON.parse(responseText) : {};

      // Extract the pitch from the response
      const generatedPitch = result.pitch;

      if (!generatedPitch) {
        throw new Error("No pitch data in n8n response");
      }

      await dbConnect();

      let pitch;
      
      if (data.pitchId) {
        // If pitchId is provided, update the existing pitch
        pitch = await Pitch.findOneAndUpdate(
          { _id: data.pitchId, userId: user.id },
          { generatedPitch },
          { new: true }
        );

        if (!pitch) {
          return NextResponse.json(
            { error: "Pitch not found or unauthorized" },
            { status: 404 }
          );
        }
      } else {
        // If no pitchId, create a new pitch
        pitch = await Pitch.create({
          userId: user.id,
          ...requestData,
          generatedPitch,
        });
      }

      return NextResponse.json({
        pitch: generatedPitch,
        id: pitch._id,
      });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: "Failed to generate pitch. Please try again." },
          { status: 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 