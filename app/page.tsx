import Wall from "@/components/Wall";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-background">
      <Wall />
      <Toaster closeButton position="top-center" richColors />
    </main>
  );
}
