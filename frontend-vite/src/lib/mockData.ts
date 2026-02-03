/**
 * Mock data for MedAI frontend.
 * Replace with API calls in production.
 */

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image?: string;
  fee: number;
  country: string;
  countryCode?: string;
}

export interface DoctorProfile extends Doctor {
  location: string;
  videoFee: number;
  writtenFee: number;
  specialty: string;
  subspecialty: string;
  diseases: string[];
  experienceList: { title: string; institution: string; location: string; period: string }[];
  education: { degree: string; institution: string; year: string }[];
  biography: string;
  affiliations: string[];
  publicationsNote: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  { id: "doc-1", slug: "sarah-chen", name: "Dr. Sarah Chen", specialization: "General Physician", experience: "12 years", rating: 4.9, fee: 25, country: "Switzerland", countryCode: "CH" },
  { id: "doc-2", slug: "james-wilson", name: "Dr. James Wilson", specialization: "Cardiologist", experience: "15 years", rating: 4.8, fee: 45, country: "United States", countryCode: "US" },
  { id: "doc-3", slug: "priya-sharma", name: "Dr. Priya Sharma", specialization: "Dermatologist", experience: "8 years", rating: 4.7, fee: 30, country: "India", countryCode: "IN" },
  { id: "doc-4", slug: "michael-okonkwo", name: "Dr. Michael Okonkwo", specialization: "Pediatrician", experience: "10 years", rating: 4.9, fee: 35, country: "United Kingdom", countryCode: "GB" },
  { id: "doc-5", slug: "marco-siano", name: "Dr. Marco Siano", specialization: "Oncology", experience: "24 years", rating: 4.9, fee: 490, country: "Switzerland", countryCode: "CH" },
];

export function getDoctorProfile(id: string): DoctorProfile | null {
  const doc = MOCK_DOCTORS.find((d) => d.id === id);
  if (!doc) return null;
  return {
    ...doc,
    location: doc.country,
    videoFee: doc.fee,
    writtenFee: doc.fee,
    specialty: doc.specialization,
    subspecialty: id === "doc-5" ? "Medical Oncology, Hematologic Oncology" : `${doc.specialization} (general)`,
    diseases: id === "doc-5" ? ["Skin Cancers", "Thyroid Disorders", "Breast Cancer", "Lung Cancer", "Head and Neck Cancer", "Lymphoma", "Myeloma", "Leukemia"] : [doc.specialization],
    experienceList: id === "doc-5"
      ? [
        { title: "Chief Physician", institution: "Hospital Biel", location: "Biel, Switzerland", period: "From 2021" },
        { title: "Senior Oncologist", institution: "University Hospital Zurich", location: "Zurich, Switzerland", period: "2015–2021" },
      ]
      : [{ title: "Physician", institution: "General Hospital", location: doc.country, period: doc.experience }],
    education: id === "doc-5" ? [{ degree: "MD", institution: "University of Zurich", year: "2001" }] : [{ degree: "MD", institution: "Medical School", year: "2000" }],
    biography: id === "doc-5"
      ? "Dr. Marco Siano is a specialist in oncology with over 24 years of experience. He leads the Head and Neck Cancer Working Group and is committed to evidence-based care and patient-centered treatment."
      : `${doc.name} specializes in ${doc.specialization} with ${doc.experience} of experience.`,
    affiliations: id === "doc-5" ? ["President of the Head and Neck Cancer Working Group (since 2016)", "Swiss Society for Medical Oncology"] : ["Medical Association"],
    publicationsNote: id === "doc-5" ? "Dr. Marco Siano has more than 40 publications" : "Multiple publications in peer-reviewed journals",
  };
}

export interface LabTest {
  id: string;
  name: string;
  price: number;
}

export const MOCK_LAB_TESTS: LabTest[] = [
  { id: "lab-1", name: "Complete Blood Count (CBC)", price: 15 },
  { id: "lab-2", name: "Blood Sugar (Fasting)", price: 10 },
  { id: "lab-3", name: "Thyroid Profile", price: 25 },
  { id: "lab-4", name: "Lipid Profile", price: 20 },
  { id: "lab-5", name: "Liver Function Test", price: 22 },
  { id: "lab-6", name: "Kidney Function Test", price: 18 },
];

export const MOCK_TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

export const MOCK_AI_RESPONSES: Record<string, string> = {
  default: "I'm your AI health assistant. To help you better, could you describe your main symptoms and how long you've had them?",
  followup: "Thank you for sharing. Based on what you've described, I recommend:\n\n1. Rest and hydration\n2. Over-the-counter pain relief if needed (e.g. paracetamol)\n3. Monitor your temperature\n\n**This is guidance only, not a diagnosis or prescription.** Please consult a certified doctor for a proper evaluation. Would you like me to help you book an appointment?",
};

export interface ReportAnalysis {
  summary: string;
  observations: string[];
  suggestedSteps: string[];
  keyMetrics?: { label: string; value: string; status: "normal" | "elevated" | "low" }[];
  severity?: "normal" | "mild" | "moderate" | "high";
}

export const MOCK_REPORT_ANALYSIS: ReportAnalysis = {
  summary: "The uploaded report appears to be a routine blood panel. Key metrics are within normal ranges with minor variations noted below.",
  observations: ["Hemoglobin: Within normal range", "Blood sugar (fasting): Slightly elevated – consider follow-up", "Cholesterol: Borderline – lifestyle advice may help"],
  suggestedSteps: ["Discuss results with a certified doctor for personalized advice", "Consider a follow-up test in 3 months if advised", "Maintain a balanced diet and regular exercise"],
  keyMetrics: [
    { label: "Hemoglobin", value: "14.2 g/dL", status: "normal" },
    { label: "Blood Sugar (Fasting)", value: "108 mg/dL", status: "elevated" },
    { label: "Cholesterol", value: "198 mg/dL", status: "normal" },
  ],
  severity: "mild",
};
