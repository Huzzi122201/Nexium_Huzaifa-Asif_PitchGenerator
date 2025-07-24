'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Trash, RefreshCcw } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PitchData {
  _id: string;
  businessName: string;
  type: string;
  industry: string;
  targetAudience: string;
  tone: string;
  keyPoints: string;
  generatedPitch: string;
  createdAt: string;
}

interface PitchSections {
  problem: string;
  solution: string;
  productDescription: string;
  targetAudience: string;
  businessModel: string;
  competitiveAdvantage: string;
  callToAction: string;
}

type SectionKey = keyof PitchSections;

const extractSections = (pitch: string): PitchSections => {
  const sections: PitchSections = {
    problem: '',
    solution: '',
    productDescription: '',
    targetAudience: '',
    businessModel: '',
    competitiveAdvantage: '',
    callToAction: '',
  };

  try {
    // Split the pitch into sections
    const lines = pitch.split('\n');
    let currentSection: SectionKey | '' = '';

    for (const line of lines) {
      // Clean up the line by removing asterisks and extra whitespace
      const cleanLine = line.replace(/\*/g, '').trim();
      
      if (cleanLine.toLowerCase().includes('problem:')) {
        currentSection = 'problem';
        sections.problem = '';
      } else if (cleanLine.toLowerCase().includes('solution:')) {
        currentSection = 'solution';
        sections.solution = '';
      } else if (cleanLine.toLowerCase().includes('product description:')) {
        currentSection = 'productDescription';
        sections.productDescription = '';
      } else if (cleanLine.toLowerCase().includes('target audience:')) {
        currentSection = 'targetAudience';
        sections.targetAudience = '';
      } else if (cleanLine.toLowerCase().includes('business model:')) {
        currentSection = 'businessModel';
        sections.businessModel = '';
      } else if (cleanLine.toLowerCase().includes('competitive advantage:')) {
        currentSection = 'competitiveAdvantage';
        sections.competitiveAdvantage = '';
      } else if (cleanLine.toLowerCase().includes('call to action:')) {
        currentSection = 'callToAction';
        sections.callToAction = '';
      } else if (currentSection && cleanLine) {
        // Remove any remaining markdown formatting
        const cleanContent = cleanLine
          .replace(/^[-*]\s+/, '') // Remove list markers
          .replace(/^\d+\.\s+/, '') // Remove numbered list markers
          .trim();
        
        if (cleanContent) {
          sections[currentSection] += (sections[currentSection] ? '\n' : '') + cleanContent;
        }
      }
    }
  } catch (error) {
    // Silently fail
  }

  return sections;
};

export default function PitchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [pitch, setPitch] = useState<PitchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<PitchSections | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const fetchPitch = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`/api/pitches/${id}?userId=${user.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch pitch');
        }

        setPitch(data);
        if (data.generatedPitch) {
          setSections(extractSections(data.generatedPitch));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch pitch');
      } finally {
        setLoading(false);
      }
    };

    fetchPitch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this pitch?')) {
      return;
    }

    try {
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/pitches/${id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete pitch');
      }

      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete pitch');
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const supabase = createClientComponentClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !pitch) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          businessName: pitch.businessName,
          type: pitch.type,
          industry: pitch.industry,
          targetAudience: pitch.targetAudience,
          tone: pitch.tone,
          keyPoints: pitch.keyPoints,
          pitchId: pitch._id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to regenerate pitch');
      }

      // Refresh the page to show new pitch
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to regenerate pitch');
    } finally {
      setRegenerating(false);
    }
  };

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

  if (!pitch) {
    return <div>Pitch not found</div>;
  }

  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{pitch.businessName}</h1>
            <div className="space-x-4 flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-800"
                title="Back to Dashboard"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                title="Delete Pitch"
                aria-label="Delete Pitch"
              >
                <Trash className="h-5 w-5" />
              </button>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className={`p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 ${regenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Regenerate Pitch"
                aria-label="Regenerate Pitch"
              >
                {regenerating ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <RefreshCcw className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium">{pitch.type}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Industry</p>
                <p className="font-medium">{pitch.industry}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Target Audience</p>
                <p className="font-medium">{pitch.targetAudience}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Tone</p>
                <p className="font-medium">{pitch.tone}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 dark:text-gray-400 mb-2">Key Points</p>
              <p className="whitespace-pre-wrap">{pitch.keyPoints}</p>
            </div>
          </div>

          {sections && (
            <div className="space-y-8">
              {(Object.entries(sections) as [SectionKey, string][]).map(([key, value]) => {
                if (!value) return null;
                const title = key.replace(/([A-Z])/g, ' $1').trim();
                return (
                  <div key={key} className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 capitalize">
                      {title}
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-lg leading-relaxed">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
} 