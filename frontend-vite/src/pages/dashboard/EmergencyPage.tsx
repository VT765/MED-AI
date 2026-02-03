import { motion } from "framer-motion";
import { EmergencyForm } from "@/components/EmergencyForm";

export function EmergencyPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-content-primary">Book Inter-City Patient Transport</h2>
        <p className="mt-1 text-content-secondary">
          Book ambulance services for safe, professional patient transport between cities.
          Perfect for medical transfers, hospital discharges, or scheduled medical appointments requiring specialized transport.
        </p>
      </motion.div>
      <EmergencyForm />
    </div>
  );
}
