import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/lib/mockData";

interface DoctorCardProps {
  doctor: Doctor;
  onSelect?: (doctor: Doctor) => void;
  selected?: boolean;
}

export function DoctorCard({ doctor, onSelect, selected }: DoctorCardProps) {
  return (
    <Card className={`transition-all hover:shadow-md ${selected ? "ring-2 ring-primary-500" : ""}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-primary-600">{doctor.specialization}</p>
            <p className="mt-1 text-xs text-gray-500">Experience: {doctor.experience}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm font-medium text-gray-700">${doctor.fee} <span className="text-gray-500">consultation</span></span>
        <Button size="sm" variant={selected ? "secondary" : "default"} onClick={() => onSelect?.(doctor)}>
          {selected ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
