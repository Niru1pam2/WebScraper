import { cn } from "@/lib/utils";
import { Shredder } from "lucide-react";
import Link from "next/link";

function Logo({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href={"/"}
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
      <div className="rounded-xl bg-gradient-to-r from-violet-400 to-violet-600 p-2">
        <Shredder size={iconSize} className="stroke-white" />
      </div>
      <div>
        <span className="bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text text-transparent">
          Web
        </span>
        <span className="text-stone-700 dark:text-stone-300">Scraper</span>
      </div>
    </Link>
  );
}
export default Logo;
