import { LoaderCircle } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <LoaderCircle className="h-12 w-12 animate-spin text-[#41366E]" />
      <p className="text-lg font-medium text-gray-600">
        Memuat data...
      </p>
    </div>
  );
}