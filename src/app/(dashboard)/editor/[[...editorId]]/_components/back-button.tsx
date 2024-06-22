"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/dashboard");
      }}
      className="text-violet-400 bg-violet-500/20 border border-violet-500 hover:bg-violet-700 hover:text-white"
    >
      <ChevronLeft size={16} />
      <span className="hidden lg:block lg:ml-3">Back</span>
    </Button>
  );
}
