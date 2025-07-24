'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Building2, Users, Lightbulb } from 'lucide-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { PitchFormData } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PitchWithId extends PitchFormData {
  _id: string;
  generatedPitch: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [pitches, setPitches] = useState<PitchWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        
        // Initialize Supabase client
        const supabase = createClientComponentClient();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!user) {
          setError('Authentication required');
          return;
        }

        // Make request to API
        const url = `/api/pitches?userId=${user.id}`;
        
        const response = await fetch(url);
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch pitches');
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setPitches(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch pitches');
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Pitches</h1>
          <button
            onClick={() => window.location.href = '/create'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Pitch
          </button>
        </div>
        
        {pitches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pitches.map((pitch, index) => (
              <motion.div
                key={pitch._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-semibold">{pitch.businessName}</h2>
                </div>
                
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{pitch.type}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{pitch.industry}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{pitch.targetAudience}</p>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(pitch.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = `/pitch/${pitch._id}`}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Full Pitch
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl opacity-70">No pitches yet. Create your first pitch!</p>
            <button
              onClick={() => window.location.href = '/create'}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Pitch
            </button>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
} 