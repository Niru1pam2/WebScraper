import { Home } from "lucide-react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-semibold text-2xl mb-2">Page not found</h2>
        <p className="text-muted-foreground  max-w-md">
          The page your&apos;e looking for can&apos;t be found.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link
            href={"/"}
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Home />
              <p className="font-medium">Go home</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default NotFoundPage;
