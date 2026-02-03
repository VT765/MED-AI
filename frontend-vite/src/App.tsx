import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { HomePage } from "@/pages/HomePage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactPage } from "@/pages/ContactPage";
import { TermsPage } from "@/pages/TermsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ChatPage } from "@/pages/dashboard/ChatPage";
import { ReportsPage } from "@/pages/dashboard/ReportsPage";
import { AppointmentPage } from "@/pages/dashboard/AppointmentPage";
import { AppointmentDoctorPage } from "@/pages/dashboard/AppointmentDoctorPage";
import { AppointmentBookPage } from "@/pages/dashboard/AppointmentBookPage";
import { EmergencyPage } from "@/pages/dashboard/EmergencyPage";
import { LabTestsPage } from "@/pages/dashboard/LabTestsPage";
import { HealthPlanPage } from "@/pages/dashboard/HealthPlanPage";
import { HelpPage } from "@/pages/dashboard/HelpPage";
import { ProfilePage } from "@/pages/dashboard/ProfilePage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="appointment" element={<AppointmentPage />} />
        <Route path="appointment/doctors/:id" element={<AppointmentDoctorPage />} />
        <Route path="appointment/doctors/:id/book" element={<AppointmentBookPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="lab-tests" element={<LabTestsPage />} />
        <Route path="health-plan" element={<HealthPlanPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
