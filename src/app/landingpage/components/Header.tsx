'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Menu, X } from 'lucide-react';
import { Button } from "@/app/landingpage/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/landingpage/ui/dialog";
import { Input } from "@/app/landingpage/ui/input";
import supabase from "../../../../config/supabaseClient";
import { Bebas_Neue } from "next/font/google";

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

export default function Header() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setIsLoading(false);

    if (error) {
      setLoginError("Invalid email or password. Please try again.");
      return;
    }

    router.push('/homepage');
    setLoginEmail('');
    setLoginPassword('');
  };

  const registerUser = async (email: string, password: string, username: string) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Signup error:", error.message);
      setIsLoading(false);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      const { error: insertError } = await supabase.from("Accounts").insert([
        {
          userId,
          email,
          password,
          isVerified: data.user?.email_confirmed_at ? true : false,
          isAdmin: false,
          dateRegistered: new Date(),
          lastLoggedIn: null,
          created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting into Accounts:", insertError.message);
        setIsLoading(false);
        return;
      }

      const { error: userInsertError } = await supabase.from("User").insert([
        {
          id: userId,
          username,
          highestNumOfWords: 0,
          userLevel: 1,
          usercurrentExp: 0,
          targetExp: 100,
          worksDone: 0,
          created_at: new Date(),
        },
      ]);

      if (userInsertError) {
        console.error("Error inserting into User table:", userInsertError.message);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(false);
    setIsSignUpOpen(false);
    alert("Signup successful!");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(signUpEmail, signUpPassword, signUpUsername);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center bg-[#4F8FB7] text-white z-50">
      <div className="container mx-auto flex items-center justify-between px-4 w-full">

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center pr-4">
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white bg-transparent border-none focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Logo and Text */}
        <Link className="flex items-center space-x-3" href="/">
          <img
            src="/logos/logo.png"
            alt="E-Lathala Logo"
            className="h-12 w-auto"
          />
          <span
            className={`font-bold text-3xl text-white ${bebasNeue.className}`}
            style={{
              letterSpacing: '1px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            E-LATHALA
          </span>
        </Link>

        {/* Auth Buttons */}
        <nav className="flex gap-2 items-center">
          <Button
            className="text-white border-2 border-white bg-transparent hover:bg-white hover:text-[#0074B7] hover:border-[#0074B7] transition-colors font-bold rounded-lg"
            onClick={() => setIsLoginOpen(true)}
          >
            Log In
          </Button>

          {/* Login Dialog */}
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle className="text-[#005A8C] text-xl text-center">Log in to E-Lathala</DialogTitle>
                <DialogDescription className="text-center">Enter your email and password to access your account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input id="email" type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="pl-10" />
                </div>
                <div className="space-y-2 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input id="password" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="pl-10" />
                </div>
                {loginError && (
                  <p className="text-red-500 text-sm text-center">{loginError}</p>
                )}
                <Button type="submit" className="w-full bg-[#0074B7] text-white hover:bg-[#005A8C] font-bold transition-colors rounded-lg" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Sign Up Button */}
          <Button
            className="bg-[#4FC3F7] text-white font-bold hover:bg-[#0288D1] rounded-lg transition-colors"
            onClick={() => setIsSignUpOpen(true)}
          >
            Sign Up
          </Button>

          {/* Sign Up Dialog */}
          <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle className="text-[#005A8C] text-xl text-center">Sign Up</DialogTitle>
                <DialogDescription className="font-bold text-center">Join E-Lathala by creating an account.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                <div className="space-y-2 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Enter your email"
                    className="pl-10"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Enter your Username"
                    className="pl-10"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="pl-10"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full mt-4 bg-[#0074B7] text-white hover:bg-[#005A8C] font-bold transition-colors rounded-lg"
                  onClick={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </Button>
                <p className="text-sm text-center mt-4">
                  Already got an account?{' '}
                  <span
                    className="text-[#0074B7] font-bold cursor-pointer"
                    onClick={() => { setIsSignUpOpen(false); setIsLoginOpen(true); }}
                  >
                    Log in
                  </span>
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </header>
  );
}
