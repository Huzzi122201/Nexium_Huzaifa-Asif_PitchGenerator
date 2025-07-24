'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, Send, Copy, Check } from "lucide-react";
import { PitchFormData } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  tone: z.string().min(1, "Tone is required"),
  keyPoints: z.array(z.string()).min(1, "At least one key point is required"),
});

export default function PitchForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [keyPointInput, setKeyPointInput] = useState("");
  const [error, setError] = useState("");
  const [generatedPitch, setGeneratedPitch] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PitchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyPoints: [],
    },
  });

  const keyPoints = watch("keyPoints");

  const addKeyPoint = () => {
    if (keyPointInput.trim()) {
      setValue("keyPoints", [...keyPoints, keyPointInput.trim()]);
      setKeyPointInput("");
    }
  };

  const removeKeyPoint = (index: number) => {
    setValue(
      "keyPoints",
      keyPoints.filter((_, i) => i !== index)
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const onSubmit = async (data: PitchFormData) => {
    setIsLoading(true);
    setError("");
    setGeneratedPitch("");

    try {
      const response = await fetch("/api/generate-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate pitch");
      }

      setGeneratedPitch(result.pitch);
      
      // Navigate to the pitch page after successful generation
      if (result.id) {
        router.push(`/pitch/${result.id}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to generate pitch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Business Type</label>
            <input
              {...register("type")}
              className="w-full p-2 border rounded-md dark:bg-zinc-700"
              placeholder="e.g., startup, enterprise, small business"
            />
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              {...register("businessName")}
              className="w-full p-2 border rounded-md dark:bg-zinc-700"
              placeholder="Your business name"
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input
              {...register("industry")}
              className="w-full p-2 border rounded-md dark:bg-zinc-700"
              placeholder="e.g., technology, healthcare, retail"
            />
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <input
              {...register("targetAudience")}
              className="w-full p-2 border rounded-md dark:bg-zinc-700"
              placeholder="e.g., young professionals, small business owners"
            />
            {errors.targetAudience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.targetAudience.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
            <select
              {...register("tone")}
              className="w-full p-2 border rounded-md dark:bg-zinc-700"
            >
              <option value="">Select a tone</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="inspiring">Inspiring</option>
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
            </select>
            {errors.tone && (
              <p className="text-red-500 text-sm mt-1">{errors.tone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Key Points</label>
            <div className="flex gap-2 mb-2">
              <input
                value={keyPointInput}
                onChange={(e) => setKeyPointInput(e.target.value)}
                className="flex-1 p-2 border rounded-md dark:bg-zinc-700"
                placeholder="Add a key point"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyPoint())}
              />
              <button
                type="button"
                onClick={addKeyPoint}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {keyPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-700 p-2 rounded-md"
                >
                  <span className="flex-1">{point}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyPoint(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {errors.keyPoints && (
              <p className="text-red-500 text-sm mt-1">{errors.keyPoints.message}</p>
            )}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Generate Pitch
            </>
          )}
        </button>
      </motion.form>

      {generatedPitch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Generated Pitch</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {generatedPitch.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
} 