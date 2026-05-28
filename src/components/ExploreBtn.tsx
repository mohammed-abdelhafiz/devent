import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExploreBtn = () => {
  return (
    <Link
      href="#events"
      className={cn(
        buttonVariants({
          variant: "default",
        }),
        "w-52 h-10 font-semibold text-lg mt-7",
      )}
    >
      Explore Events
      <ArrowDown className="size-5 animate-pulse" />
    </Link>
  );
};
