import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  text = 'Memuat data...', 
  fullScreen = true 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? "flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100"
    : "flex flex-col items-center justify-center gap-4 p-8";

  return (
    <div className={containerClasses}>
      <LoaderCircle className={`${sizeClasses[size]} animate-spin text-[#41366E]`} />
      <p className="text-lg font-medium text-gray-600">
        {text}
      </p>
    </div>
  );
}