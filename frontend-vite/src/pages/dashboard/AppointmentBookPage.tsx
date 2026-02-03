import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getDoctorProfile } from "@/lib/mockData";
import { MOCK_TIME_SLOTS } from "@/lib/mockData";
import { saveAppointment } from "@/lib/appointments";

const schema = z.object({
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  issue: z.string().min(10, "Describe your issue briefly (min 10 characters)"),
});

type FormValues = z.infer<typeof schema>;

export function AppointmentBookPage() {
  const { id } = useParams<{ id: string }>();
  const profile = id ? getDoctorProfile(id) : null;
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  if (!profile || !id) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Doctor not found.</p>
        <Link to="/dashboard/appointment" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Choose Top Doctor
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    saveAppointment({
      doctorId: id,
      doctorName: profile.name,
      specialization: profile.specialization,
      date: data.date,
      time: data.time,
      issue: data.issue,
      status: "pending",
      fee: profile.fee,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-xl bg-green-50 p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Request Submitted</h3>
              <p className="mt-2 text-sm text-gray-600">Consultation fee: ${profile.fee}. In production you would receive a confirmation.</p>
              <div className="mt-6 flex gap-4 justify-center">
                <Link to={`/dashboard/appointment/doctors/${id}`} className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">View Doctor</Link>
                <Link to="/dashboard/appointment" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Book another</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-4">
        <Link to={`/dashboard/appointment/doctors/${id}`} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" aria-hidden />
          Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-primary-200 bg-primary-50 text-xl font-semibold text-primary-600">
                {profile.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
                <p className="text-primary-600">{profile.specialization}</p>
                <p className="text-sm text-gray-500">{profile.experience} · ${profile.fee} consultation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</Label>
                  <Select id="date" {...register("date")} className="mt-1 rounded-xl">
                    <option value="">Select date</option>
                    {dateOptions.map((d) => (
                      <option key={d} value={d}>{new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</option>
                    ))}
                  </Select>
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                </div>
                <div>
                  <Label htmlFor="time" className="flex items-center gap-2"><Clock className="h-4 w-4" /> Time slot</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {MOCK_TIME_SLOTS.map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input type="radio" value={t} {...register("time")} className="peer sr-only" />
                        <span className="inline-flex rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 hover:bg-gray-50">{t}</span>
                      </label>
                    ))}
                  </div>
                  {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                </div>
                <div>
                  <Label htmlFor="issue">Describe your issue briefly</Label>
                  <Textarea id="issue" placeholder="Briefly describe your symptoms or concern" rows={4} {...register("issue")} className="mt-1 rounded-xl" />
                  {errors.issue && <p className="mt-1 text-sm text-red-600">{errors.issue.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl">
                  {isSubmitting ? "Confirming..." : "Confirm appointment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
