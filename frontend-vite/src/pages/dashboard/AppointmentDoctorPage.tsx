import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Video, MessageSquare, Shield, Building2, GraduationCap, BookOpen, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDoctorProfile } from "@/lib/mockData";

export function AppointmentDoctorPage() {
  const { id } = useParams<{ id: string }>();
  const profile = id ? getDoctorProfile(id) : null;

  if (!profile) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Doctor not found.</p>
        <Link to="/dashboard/appointment" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Choose Top Doctor
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link to="/dashboard/appointment" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" aria-hidden />
          Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">Doctor&apos;s Biography</h1>
      </motion.div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-primary-50 text-3xl font-semibold text-primary-600">
                {profile.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-8 items-center justify-center rounded border border-gray-200 bg-white text-xs font-medium shadow-sm">
                {profile.countryCode ?? profile.country.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-primary-600">{profile.specialization}</p>
              <p className="mt-1 text-sm text-gray-600">{profile.location}</p>
              <p className="mt-1 text-sm text-gray-600">{profile.experience} of experience</p>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700">Consultation fees</h4>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2"><Video className="h-4 w-4" aria-hidden /> Video consultation: ${profile.videoFee}</span>
                  <span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" aria-hidden /> Written consultation: ${profile.writtenFee}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600"><Shield className="h-5 w-5" aria-hidden /></div>
          <h3 className="text-lg font-semibold text-gray-900">Area of expertise</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><h4 className="text-sm font-medium text-gray-500">Specialty</h4><p className="text-gray-900">{profile.specialty}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500">Subspecialty</h4><p className="text-gray-900">{profile.subspecialty}</p></div>
          <div><h4 className="text-sm font-medium text-gray-500">Diseases</h4><p className="text-gray-900">{profile.diseases.join(", ")}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600"><Building2 className="h-5 w-5" aria-hidden /></div>
            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          </div>
          <Link to={`/dashboard/appointment/doctors/${id}/book`} className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
            Choose for Consultation
          </Link>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            {profile.experienceList.map((exp, i) => (
              <li key={i}>{exp.title}, {exp.institution}, {exp.location}. {exp.period}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600"><GraduationCap className="h-5 w-5" aria-hidden /></div>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {profile.education.map((e, i) => (
              <li key={i}>{e.degree}: {e.institution} — {e.year}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600"><BookOpen className="h-5 w-5" aria-hidden /></div>
          <h3 className="text-lg font-semibold text-gray-900">Biography</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{profile.biography}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600"><Users className="h-5 w-5" aria-hidden /></div>
          <h3 className="text-lg font-semibold text-gray-900">Affiliations</h3>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            {profile.affiliations.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600"><FileText className="h-5 w-5" aria-hidden /></div>
          <h3 className="text-lg font-semibold text-gray-900">Publications</h3>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>{profile.publicationsNote}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
