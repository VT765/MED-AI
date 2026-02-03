"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MOCK_LAB_TESTS, MOCK_TIME_SLOTS } from "@/lib/mockData";

const labTestSchema = z.object({
  testType: z.string().min(1, "Select a test"),
  address: z.string().min(5, "Enter full address"),
  preferredTime: z.string().min(1, "Select time slot"),
});

type LabTestFormValues = z.infer<typeof labTestSchema>;

export default function LabTestsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [mockLocation] = useState("123 Main St, City (Mock)");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LabTestFormValues>({
    resolver: zodResolver(labTestSchema),
  });

  const testType = watch("testType");
  const selectedTest = MOCK_LAB_TESTS.find((t) => t.id === testType);

  const onSubmit = async (data: LabTestFormValues) => {
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-md"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Lab Test Request Submitted
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                In production, a phlebotomist would be scheduled. This is a mock
                confirmation.
              </p>
              <Button
                className="mt-4"
                onClick={() => setSubmitted(false)}
                variant="outline"
              >
                Book another test
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Book Lab Test at Home
        </h2>
        <p className="mt-1 text-gray-600">
          Select test type, enter address, and choose a time slot. Location is
          mocked.
        </p>
      </motion.div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Test & Address</h3>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>Detected location (mock): {mockLocation}</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="testType">Test type</Label>
              <Select id="testType" {...register("testType")} className="mt-1">
                <option value="">Select test</option>
                {MOCK_LAB_TESTS.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.name} — ${test.price}
                  </option>
                ))}
              </Select>
              {errors.testType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.testType.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Full address</Label>
              <Input
                id="address"
                placeholder="Street, city, postal code"
                {...register("address")}
                className="mt-1"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="preferredTime">Preferred time slot</Label>
              <Select
                id="preferredTime"
                {...register("preferredTime")}
                className="mt-1"
              >
                <option value="">Select time</option>
                {MOCK_TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
              {errors.preferredTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>
            {selectedTest && (
              <p className="text-sm text-gray-600">
                Test: <strong>{selectedTest.name}</strong> — $
                {selectedTest.price}
              </p>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Confirm booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
