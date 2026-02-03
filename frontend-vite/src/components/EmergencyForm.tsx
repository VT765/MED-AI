import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Calendar, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const emergencySchema = z.object({
  patientName: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(1).max(120),
  pickupCity: z.string().min(2, "Pickup city is required"),
  destinationCity: z.string().min(2, "Destination city is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  transportReason: z.string().min(10, "Please describe the reason for transport"),
  contactPhone: z.string().min(10, "Contact phone is required"),
});

type EmergencyFormValues = z.infer<typeof emergencySchema>;

export function EmergencyForm() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmergencyFormValues>({ resolver: zodResolver(emergencySchema) });
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

  const onSubmit = async (_data: EmergencyFormValues) => {
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="rounded-lg bg-white p-6 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Navigation className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Transport Booking Request Received</h3>
            <p className="mt-2 text-sm text-gray-600">Your inter-city patient transport request has been submitted. Our team will contact you shortly to confirm the details and schedule.</p>
            <p className="mt-4 text-sm font-medium text-gray-700">For urgent medical emergencies, please call local emergency services (e.g. 911) immediately.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary-200 bg-white">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Inter-City Patient Transport Booking</h3>
        <p className="text-sm text-gray-500">Fill in the details to book ambulance transport between cities. Our professional medical transport service ensures safe patient transfer.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input id="patientName" placeholder="Full name" {...register("patientName")} className="mt-1" />
            {errors.patientName && <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>}
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Age" {...register("age")} className="mt-1" />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
          </div>
          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input id="contactPhone" type="tel" placeholder="+1 (555) 123-4567" {...register("contactPhone")} className="mt-1" />
            {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pickupCity" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pickup City</Label>
              <Input id="pickupCity" placeholder="City name" {...register("pickupCity")} className="mt-1" />
              {errors.pickupCity && <p className="mt-1 text-sm text-red-600">{errors.pickupCity.message}</p>}
            </div>
            <div>
              <Label htmlFor="destinationCity" className="flex items-center gap-2"><Navigation className="h-4 w-4" /> Destination City</Label>
              <Input id="destinationCity" placeholder="City name" {...register("destinationCity")} className="mt-1" />
              {errors.destinationCity && <p className="mt-1 text-sm text-red-600">{errors.destinationCity.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="pickupDate" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Pickup Date</Label>
              <Select id="pickupDate" {...register("pickupDate")} className="mt-1">
                <option value="">Select date</option>
                {dateOptions.map((d) => (
                  <option key={d} value={d}>{new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</option>
                ))}
              </Select>
              {errors.pickupDate && <p className="mt-1 text-sm text-red-600">{errors.pickupDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="pickupTime" className="flex items-center gap-2"><Clock className="h-4 w-4" /> Pickup Time</Label>
              <Select id="pickupTime" {...register("pickupTime")} className="mt-1">
                <option value="">Select time</option>
                {timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}
              </Select>
              {errors.pickupTime && <p className="mt-1 text-sm text-red-600">{errors.pickupTime.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="transportReason">Reason for Transport</Label>
            <Textarea id="transportReason" placeholder="Describe the reason for transport (e.g. hospital discharge, scheduled appointment, medical transfer)" rows={4} {...register("transportReason")} className="mt-1" />
            {errors.transportReason && <p className="mt-1 text-sm text-red-600">{errors.transportReason.message}</p>}
          </div>
          <Button type="submit" variant="emergency" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Book Transport"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
