"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../config/supabaseClient";
import { Button } from "../writing-results/ui/button";
import { Input } from "../writing-results/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../writing-results/ui/card";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin"); // Redirect to admin dashboard
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white p-8 transition-all transform hover:scale-105 hover:shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-sky-700 tracking-wide">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <p className="text-red-500 text-center animate-pulse">{error}</p>
            )}
            
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:ring-2 focus:ring-blue-600 transition-all duration-300 ease-in-out focus:outline-none shadow-sm hover:shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:ring-2 focus:ring-blue-600 transition-all duration-300 ease-in-out focus:outline-none shadow-sm hover:shadow-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full py-3 text-lg font-bold rounded-lg bg-gradient-to-r from-sky-400 to-sky-500 text-white hover:from-sky-500 hover:to-sky-600 focus:outline-none transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl active:scale-95"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
