import { Card } from "@/components/ui/card";
import { FiArrowLeft } from "react-icons/fi";

type AuthenticationLayoutProps = {
  children: React.ReactNode;
};

export default function AuthenticationLayout({
  children,
}: AuthenticationLayoutProps) {
  const MARKETING_SITE_URL = "https://github.com/ftaghiyev";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-background">
      <div className="absolute top-4 left-4">
        <a
          href={MARKETING_SITE_URL}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <FiArrowLeft className="mr-1 h-5 w-5" />
          Visit Profile
        </a>
      </div>

      <div className="mb-8 text-center">
        <h1 className="font-inter font-bold text-3xl md:text-4xl tracking-tight">
          Simple CRM
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome! Please sign in to continue.
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg p-6">{children}</Card>
    </div>
  );
}
