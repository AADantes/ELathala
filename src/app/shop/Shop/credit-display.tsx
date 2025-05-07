"use client";

import { useEffect, useState } from "react";
import { CreditCard, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import supabase from "../../../../config/supabaseClient";

export function CreditDisplay() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCredits() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("User")
        .select("userCredits")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching credits:", error);
      } else {
        setCredits(data.userCredits);
      }

      setLoading(false);
    }

    fetchCredits();
  }, []);

  return (
    <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        <span className="font-medium">Your Credits:</span>
        <span className="font-bold">
          {loading ? "Loading..." : credits ?? "N/A"}
        </span>
      </div>
      <Button onClick={() => router.push("/homepage")} variant="secondary">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Homepage
      </Button>
    </div>
  );
}
