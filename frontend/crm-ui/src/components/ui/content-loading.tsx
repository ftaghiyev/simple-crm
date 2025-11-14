import { PuffLoader } from "react-spinners";
import { cn } from "@/lib/utils";

type ContentLoadingProps = {
  loading: boolean;
  spinnerColor?: string;
  overlay?: boolean;
  message?: string;
  children?: React.ReactNode;
};

export default function ContentLoading({
  loading,
  spinnerColor = "#4F46E5", // indigo-600 by default
  overlay = false,
  message,
  children,
}: ContentLoadingProps) {
  if (!loading) return <>{children}</>;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full transition-opacity duration-300",
        overlay && "fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
      )}
    >
      <PuffLoader color={spinnerColor} size={60} speedMultiplier={0.8} />

      {message && (
        <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
