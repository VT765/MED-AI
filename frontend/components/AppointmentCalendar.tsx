"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, X, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAppointments, type Appointment } from "@/lib/appointments";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS = {
  pending: AlertCircle,
  confirmed: CheckCircle2,
  completed: CheckCircle2,
  cancelled: XCircle,
};

export function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setAppointments(getAppointments());
    // Refresh appointments when storage changes
    const handleStorageChange = () => {
      setAppointments(getAppointments());
    };
    window.addEventListener("storage", handleStorageChange);
    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      setAppointments(getAppointments());
    }, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const monthStart = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    return date;
  }, [currentMonth]);

  const monthEnd = useMemo(() => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return date;
  }, [currentMonth]);

  const startDate = useMemo(() => {
    const start = new Date(monthStart);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }, [monthStart]);

  const endDate = useMemo(() => {
    const end = new Date(monthEnd);
    end.setDate(end.getDate() + (6 - end.getDay()));
    return end;
  }, [monthEnd]);

  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [startDate, endDate]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((apt) => {
      const dateKey = apt.date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(apt);
    });
    return map;
  }, [appointments]);

  const selectedDateAppointments = useMemo(() => {
    const dateKey = selectedDate.toISOString().split("T")[0];
    return appointmentsByDate.get(dateKey) || [];
  }, [selectedDate, appointmentsByDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointments Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth("prev")}
                className="rounded-button px-3 py-1.5 text-sm font-medium text-content-secondary hover:bg-surface-muted"
              >
                ← Previous
              </button>
              <h3 className="text-lg font-semibold text-content-primary">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="rounded-button px-3 py-1.5 text-sm font-medium text-content-secondary hover:bg-surface-muted"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-content-tertiary"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((date, idx) => {
                const dateKey = date.toISOString().split("T")[0];
                const dayAppointments = appointmentsByDate.get(dateKey) || [];
                const hasAppointments = dayAppointments.length > 0;
                const isSelected =
                  selectedDate.toISOString().split("T")[0] === dateKey;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(new Date(date))}
                    className={cn(
                      "relative rounded-button p-2 text-sm transition-colors",
                      !isCurrentMonth(date) && "text-content-tertiary opacity-50",
                      isToday(date) &&
                        "bg-primary-50 font-semibold text-primary-700",
                      isSelected &&
                        !isToday(date) &&
                        "bg-primary-100 text-primary-700",
                      !isSelected &&
                        !isToday(date) &&
                        "hover:bg-surface-muted",
                      hasAppointments && "font-medium"
                    )}
                  >
                    <span>{date.getDate()}</span>
                    {hasAppointments && (
                      <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Appointments */}
            {selectedDateAppointments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-content-primary">
                  Appointments on {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>
                <div className="space-y-2">
                  {selectedDateAppointments.map((apt) => {
                    const StatusIcon = STATUS_ICONS[apt.status];
                    return (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-card border border-stone-200 bg-surface-elevated p-3 hover:border-primary-200 cursor-pointer transition-colors"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-content-tertiary" />
                              <span className="font-medium text-content-primary">
                                {apt.doctorName}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-content-secondary">
                              {apt.specialization}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-content-tertiary">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {apt.time}
                              </span>
                              <span>${apt.fee}</span>
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              "border text-xs",
                              STATUS_COLORS[apt.status]
                            )}
                          >
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {apt.status}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDateAppointments.length === 0 && (
              <div className="mt-4 rounded-card border border-stone-200 bg-surface-muted/50 p-4 text-center text-sm text-content-secondary">
                No appointments on this date
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-card border border-stone-200 bg-surface-elevated shadow-cardHover"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Appointment Details</CardTitle>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="rounded-button p-1 text-content-tertiary hover:bg-surface-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-content-tertiary">Doctor</div>
                  <div className="mt-1 text-base font-semibold text-content-primary">
                    {selectedAppointment.doctorName}
                  </div>
                  <div className="mt-1 text-sm text-content-secondary">
                    {selectedAppointment.specialization}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-content-tertiary">Date & Time</div>
                  <div className="mt-1 text-base text-content-primary">
                    {new Date(selectedAppointment.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="mt-1 text-sm text-content-secondary">
                    {selectedAppointment.time}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-content-tertiary">Issue</div>
                  <div className="mt-1 text-sm text-content-primary">
                    {selectedAppointment.issue}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-content-tertiary">Status</div>
                  <div className="mt-1">
                    <Badge
                      className={cn(
                        "border",
                        STATUS_COLORS[selectedAppointment.status]
                      )}
                    >
                      {(() => {
                        const StatusIcon = STATUS_ICONS[selectedAppointment.status];
                        return <StatusIcon className="mr-1 h-3 w-3" />;
                      })()}
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-content-tertiary">Consultation Fee</div>
                  <div className="mt-1 text-base font-semibold text-content-primary">
                    ${selectedAppointment.fee}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

