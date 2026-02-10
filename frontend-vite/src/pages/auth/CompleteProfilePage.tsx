import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { completeProfile, getCurrentUser } from "@/lib/auth";

const profileSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function CompleteProfilePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const phone = useMemo(() => getCurrentUser()?.phone ?? "", []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setError(null);
    try {
      await completeProfile({
        username: data.username,
        email: data.email,
        password: data.password || undefined,
      });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Complete profile error:", err);
      setError(err.message || "Something went wrong.");
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
            <CardTitle className="text-xl">Complete your profile</CardTitle>
            <CardDescription>
              Just a few details to get you started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Phone (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-tertiary" />
                  <Input
                    id="phone"
                    value={phone}
                    readOnly
                    disabled
                    className="rounded-input h-11 bg-surface-muted pl-10 text-content-secondary"
                  />
                </div>
                <p className="text-xs text-content-tertiary">Verified via OTP — cannot be changed.</p>
              </div>

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

              {/* Password (optional) */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-content-tertiary">(optional)</span>
                </Label>
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
                <p className="text-xs text-content-tertiary">
                  Optional. Set a password if you'd like to log in with email in the future.
                </p>
              </div>

              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save & continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
