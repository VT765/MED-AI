const APPOINTMENTS_KEY = "medai_appointments";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  issue: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  fee: number;
  createdAt: string;
}

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    return stored ? (JSON.parse(stored) as Appointment[]) : [];
  } catch {
    return [];
  }
}

export function saveAppointment(appointment: Omit<Appointment, "id" | "createdAt">): Appointment {
  if (typeof window === "undefined") {
    throw new Error("Cannot save appointment on server");
  }
  const appointments = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  return newAppointment;
}

export function updateAppointmentStatus(id: string, status: Appointment["status"]): void {
  if (typeof window === "undefined") return;
  const appointments = getAppointments();
  const updated = appointments.map((apt) =>
    apt.id === id ? { ...apt, status } : apt
  );
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
}

export function deleteAppointment(id: string): void {
  if (typeof window === "undefined") return;
  const appointments = getAppointments();
  const filtered = appointments.filter((apt) => apt.id !== id);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
}
