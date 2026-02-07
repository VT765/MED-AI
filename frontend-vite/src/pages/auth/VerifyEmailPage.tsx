import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resendEmailOtp, verifyEmailOtp } from "@/lib/auth";

const verifySchema = z.object({
  email: z.string().email("Valid email required"),
  otp: z.string().min(6, "Enter the 6-digit code").max(6, "Enter the 6-digit code"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

const VERIFY_EMAIL_KEY = "medai_verify_email";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const emailFromQuery = searchParams.get("email") || "";
  const initialEmail = useMemo(() => {
    if (emailFromQuery) return emailFromQuery;
    if (typeof window === "undefined") return "";
    return localStorage.getItem(VERIFY_EMAIL_KEY) || "";
  }, [emailFromQuery]);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: initialEmail, otp: "" },
  });

  const watchedEmail = watch("email");

  useEffect(() => {
    if (watchedEmail && typeof window !== "undefined") {
      localStorage.setItem(VERIFY_EMAIL_KEY, watchedEmail);
    }
  }, [watchedEmail]);

  const onSubmit = async (data: VerifyFormValues) => {
    setError(null);
    setInfo(null);
    try {
      await verifyEmailOtp(data.email, data.otp);
      if (typeof window !== "undefined") {
        localStorage.removeItem(VERIFY_EMAIL_KEY);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Verify error:", err);
      setError(err.message || "Verification failed. Please try again.");
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    try {
      if (!watchedEmail) {
        setError("Please enter your email first.");
        return;
      }
      await resendEmailOtp(watchedEmail);
      setInfo("A new verification code has been sent.");
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.message || "Failed to resend code.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-[400px]">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90" aria-label="MedAI home">
          <Logo size={40} className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight text-content-primary">MedAI</span>
        </Link>

        <Card className="shadow-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Verify your email</CardTitle>
            <CardDescription>Enter the 6-digit code sent to your email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {info && <div className="rounded-input border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{info}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} className="h-11" autoComplete="email" />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input id="otp" inputMode="numeric" autoComplete="one-time-code" placeholder="123456" {...register("otp")} className="h-11 tracking-[0.3em]" />
                {errors.otp && <p className="text-sm text-red-600">{errors.otp.message}</p>}
              </div>
              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Verifying…" : "Verify & continue"}
              </Button>
            </form>
            <Button type="button" variant="outline" className="w-full" onClick={onResend}>
              Resend code
            </Button>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-content-secondary">
          Already verified? <Link to="/auth/login" className="font-semibold text-primary-600 hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
