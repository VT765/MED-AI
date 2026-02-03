"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/lib/mockData";

/** Single doctor card for Choose Top Doctor grid: circular photo, flag, name, specialization, country, years, rating stars, fee badge. */
export function DoctorListCard({ doctor }: { doctor: Doctor }) {
  const href = `/dashboard/appointment/doctors/${doctor.id}`;
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-all hover:border-primary-300 hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative pt-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-primary-50 text-primary-600">
              <span className="text-2xl font-semibold">
                {doctor.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div className="absolute right-6 top-6 flex h-6 w-8 items-center justify-center rounded border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm">
              {doctor.countryCode ?? doctor.country.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
            <p className="mt-1 text-sm text-primary-600">{doctor.specialization}</p>
            <p className="mt-0.5 text-sm text-gray-500">{doctor.country}</p>
            <p className="mt-1 text-xs text-gray-500">{doctor.experience} of experience</p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
            </div>
            <div className="mt-2 inline-flex rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
              ${doctor.fee} consultation
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
