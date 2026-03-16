import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signup } from "@/lib/auth";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null);
    try {
      await signup({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[440px]"
      >
        <Link
          to="/"
          className="mb-10 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="MedAI home"
        >
          <Logo size={40} className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight text-content-primary">MedAI</span>
        </Link>

        <Card className="shadow-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>Enter your details to get started with MedAI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose your username"
                  {...register("username")}
                  className="rounded-input h-11"
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="rounded-input h-11"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="rounded-input h-11"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="rounded-input h-11"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>
            <p className="text-center text-sm text-content-secondary">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-semibold text-primary-600 hover:underline">
                Log in
              </Link>
            </p>
            <p className="text-center text-sm text-content-secondary">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="font-medium text-primary-600 hover:underline">
                Terms & Conditions
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
