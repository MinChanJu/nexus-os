"use client";

import { Suspense, useEffect, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { AlertCircle, ArrowRight, Lock, Mail, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import Input from "@/components/Input";
import OAuthButton from "@/components/OAuthButton";

type AuthMode = "signin" | "signup";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState<string>("/");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseParams = () => {
      const errorParam = searchParams.get("error");
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      setCallbackUrl(callbackUrl);

      if (errorParam) {
        if (errorParam === "SessionRequired") {
          setError("로그인이 필요합니다.");
        } else {
          setError(errorParam);
        }
      }

      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    };

    parseParams();
  }, [searchParams]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (mode === "signin") {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
          setIsLoading(false);
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (error) {
        console.error("Login error:", error);
        setError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(`/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || "회원가입에 실패했습니다.");
        } else {
          setMode("signin");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Signup error:", error);
        setError(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 p-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={mode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="mb-2 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent"
              >
                {mode === "signin" ? "Welcome Back" : "Create Account"}
              </motion.h1>
            </AnimatePresence>
            <p className="text-sm text-purple-300/60">
              {mode === "signin" ? "Sign in to continue to NexusOS" : "Join the NexusOS platform"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  <p className="text-sm break-all text-red-300">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="ml-auto rounded-full bg-red-500/20 p-1 text-red-400 transition-colors duration-200 hover:bg-red-500/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <Input
                  name="name"
                  type="text"
                  Icon={User}
                  placeholder="Full Name"
                  autoComplete="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            <Input
              name="email"
              type="email"
              Icon={Mail}
              placeholder="Email Address"
              autoComplete="email"
              required
              layout
            />
            <Input name="password" type="password" Icon={Lock} placeholder="Password" required layout />

            {mode === "signin" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  className="text-sm text-purple-400/80 transition-colors duration-200 hover:text-purple-300"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}

            <motion.button
              type="submit"
              layout
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <div className="mt-8 text-center">
            <p className="text-sm text-purple-300/60">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <motion.button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-semibold text-purple-400 transition-colors duration-200 hover:text-purple-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </motion.button>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-4 text-purple-300/60">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <OAuthButton name="github" backgroundColor="#282828" title="GitHub" />
              <OAuthButton name="naver" backgroundColor="#03A94D" title="Naver" />
              <OAuthButton name="kakao" backgroundColor="#FEE500" color="#000000" title="Kakao" />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-sm text-purple-300/40"
        >
          © 2026 NexusOS. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
