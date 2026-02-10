import { useState, useRef } from "react";
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
import { sendPhoneOtp, setupRecaptcha } from "@/lib/auth";
import type { RecaptchaVerifier } from "firebase/auth";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Enter a valid phone number with country code")
    .regex(/^\+\d{10,15}$/, "Phone number must start with + and country code (e.g. +91XXXXXXXXXX)"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  const onSubmit = async (data: PhoneFormValues) => {
    setError(null);
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = setupRecaptcha("recaptcha-container");
      }

      await sendPhoneOtp(data.phone, recaptchaVerifierRef.current);
      navigate(`/auth/verify-phone?phone=${encodeURIComponent(data.phone)}`);
    } catch (err: any) {
      console.error("Phone OTP error:", err);
      // Reset reCAPTCHA on error so it can be retried
      recaptchaVerifierRef.current = null;
      if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Use format: +91XXXXXXXXXX");
      } else {
        setError(err.message || "Failed to send OTP. Please try again.");
      }
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
            <CardTitle className="text-xl">Welcome to MedAI</CardTitle>
            <CardDescription>Enter your phone number to sign in or create an account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-input border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91XXXXXXXXXX"
                  {...register("phone")}
                  className="rounded-input h-11"
                  autoComplete="tel"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                <p className="text-xs text-content-tertiary">Include country code (e.g. +91 for India)</p>
              </div>
              <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending OTP…" : "Send OTP"}
              </Button>
            </form>
            <div id="recaptcha-container"></div>
            <p className="text-center text-sm text-content-secondary">
              By continuing, you agree to our <Link to="/terms" className="font-medium text-primary-600 hover:underline">Terms & Conditions</Link>.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
