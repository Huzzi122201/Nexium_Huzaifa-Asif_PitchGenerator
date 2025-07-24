import PitchForm from "@/components/PitchForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Create Your Perfect Pitch</h1>
          <PitchForm />
        </div>
      </main>
    </ProtectedRoute>
  );
} 