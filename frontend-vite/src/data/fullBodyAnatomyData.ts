// ─────────────────────────────────────────────────────────────────────────────
// fullBodyAnatomyData.ts — Comprehensive 3D Full-Body Anatomy & Skeletal System
// ─────────────────────────────────────────────────────────────────────────────

export type AnatomicalSystem = "all" | "skeletal" | "organ" | "vascular" | "nervous";

export interface AnatomicalStructure {
  id: string;
  name: string;
  latinName: string;
  system: AnatomicalSystem;
  region: "Head & Neck" | "Thorax" | "Abdomen" | "Pelvis" | "Upper Limbs" | "Lower Limbs";
  position: [number, number, number]; // [x, y, z] in normalized 3D space
  scale?: [number, number, number];
  color: string;
  emissiveColor: string;
  description: string;
  clinicalSignificance: string;
  vitalFunctions: string[];
  vitalMetrics: { label: string; value: string; normal: string }[];
  commonPathologies: string[];
  aiPrompt: string;
  relatedOrganId?: string; // Links to existing isolated 3D organ if available (e.g. "heart", "brain")
}

export const FULL_BODY_STRUCTURES: AnatomicalStructure[] = [
  // ── SKELETAL SYSTEM (BONES) ────────────────────────────────────────────────
  {
    id: "bone_cranium",
    name: "Cranium (Skull)",
    latinName: "Neurocranium & Viscerocranium",
    system: "skeletal",
    region: "Head & Neck",
    position: [0, 2.38, 0],
    color: "#e2e8f0",
    emissiveColor: "#94a3b8",
    description:
      "A rigid bony structure composed of 22 bones joined by immovable sutures, enclosing and safeguarding the brain while supporting facial structures.",
    clinicalSignificance:
      "Vulnerable to traumatic cranial fractures, intracranial hematomas (epidural/subdural), and elevated intracranial pressure.",
    vitalFunctions: [
      "Protects cerebral parenchyma and brainstem from blunt trauma",
      "Houses sensory sensory apparatus (vision, hearing, olfaction)",
      "Provides muscle anchoring for mastication and facial expression",
    ],
    vitalMetrics: [
      { label: "Total Bone Count", value: "22 bones", normal: "8 cranial + 14 facial" },
      { label: "Intracranial Pressure", value: "7-15 mmHg", normal: "< 15 mmHg supine" },
    ],
    commonPathologies: ["Basilar Skull Fracture", "Concussion", "Craniosynostosis", "Cranial Neuropathy"],
    aiPrompt: "Explain the clinical signs of a basilar skull fracture and when a CT head scan is urgent.",
    relatedOrganId: "brain",
  },
  {
    id: "bone_spine",
    name: "Vertebral Column (Spine)",
    latinName: "Columna vertebralis",
    system: "skeletal",
    region: "Thorax",
    position: [0, 0.95, -0.15],
    color: "#cbd5e1",
    emissiveColor: "#64748b",
    description:
      "The central skeletal axis consisting of 33 vertebrae (7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, and 4 coccygeal) housing the spinal cord.",
    clinicalSignificance:
      "Crucial for upright posture and neural transmission; common site for herniated nucleus pulposus, spinal stenosis, and spondylolisthesis.",
    vitalFunctions: [
      "Protects the vulnerable spinal cord and nerve roots",
      "Transfers cranial and torso load downward through pelvis to legs",
      "Permits multidirectional flexion, extension, lateral bend, and axial rotation",
    ],
    vitalMetrics: [
      { label: "Vertebral Segments", value: "33 total", normal: "7C, 12T, 5L, Sacrum, Coccyx" },
      { label: "Range of Motion", value: "Full Curvature", normal: "Lordosis/Kyphosis balance" },
    ],
    commonPathologies: ["Herniated Disc (Sciatica)", "Lumbar Spinal Stenosis", "Scoliosis", "Ankylosing Spondylitis"],
    aiPrompt: "What are red flag symptoms of spinal cord compression or cauda equina syndrome?",
  },
  {
    id: "bone_ribcage",
    name: "Thoracic Cage (Ribs & Sternum)",
    latinName: "Cavea thoracis",
    system: "skeletal",
    region: "Thorax",
    position: [0, 1.25, 0.05],
    color: "#e2e8f0",
    emissiveColor: "#94a3b8",
    description:
      "A flexible osseocartilaginous framework made of 12 rib pairs, coastal cartilage, and sternum that protects vital cardiopulmonary organs and expands during respiration.",
    clinicalSignificance:
      "Rib fractures can cause secondary pneumothorax, flail chest, or pulmonary contusion; costochondritis is a frequent non-cardiac mimic of chest pain.",
    vitalFunctions: [
      "Shields the heart, great vessels, and lungs from kinetic impact",
      "Provides muscular biomechanical leverage for diaphragmatic and intercostal breathing",
      "Serves as hematopoietically active red bone marrow reservoir",
    ],
    vitalMetrics: [
      { label: "Rib Pairs", value: "12 pairs", normal: "7 True, 3 False, 2 Floating" },
      { label: "Thoracic Expansion", value: "3-5 cm", normal: "> 2.5 cm on deep inhalation" },
    ],
    commonPathologies: ["Rib Fractures", "Costochondritis", "Flail Chest", "Pectus Excavatum"],
    aiPrompt: "How can a doctor differentiate between cardiac chest pain and ribcage costochondritis?",
    relatedOrganId: "lungs",
  },
  {
    id: "bone_pelvis",
    name: "Pelvic Girdle",
    latinName: "Cingulum pelvicum",
    system: "skeletal",
    region: "Pelvis",
    position: [0, 0.05, 0],
    color: "#cbd5e1",
    emissiveColor: "#64748b",
    description:
      "A massive basin-shaped bony ring connecting the axial skeleton to lower limbs, formed by the sacrum and paired hip bones (ilium, ischium, pubis).",
    clinicalSignificance:
      "Houses pelvic viscera and reproductive organs. High-energy pelvic fractures are medical emergencies due to torrential retroperitoneal arterial hemorrhage.",
    vitalFunctions: [
      "Transmits axial trunk weight directly into lower extremities",
      "Protects bladder, terminal digestive tract, and reproductive organs",
      "Provides insertion base for trunk, pelvic floor, and thigh musculature",
    ],
    vitalMetrics: [
      { label: "Pelvic Ring Integrity", value: "Intact", normal: "Stable closed ring" },
      { label: "Acetabular Alignment", value: "Congruent", normal: "Stable femoral articulation" },
    ],
    commonPathologies: ["Pelvic Ring Fracture", "Sacroiliitis", "Hip Osteoarthritis", "Pelvic Organ Prolapse"],
    aiPrompt: "Why are pelvic fractures classified as high-risk hemorrhage emergencies?",
  },
  {
    id: "bone_clavicle_arms",
    name: "Pectoral Girdle & Upper Limbs",
    latinName: "Ossa membri superioris",
    system: "skeletal",
    region: "Upper Limbs",
    position: [0, 1.45, 0],
    color: "#e2e8f0",
    emissiveColor: "#94a3b8",
    description:
      "Composed of clavicles, scapulae, humerus, radius, ulna, and 27 hand bones, delivering maximum rotational dexterity and manual articulation.",
    clinicalSignificance:
      "Clavicle fractures are among the most common sports injuries; distal radius fractures (Colles') occur frequently in falls on outstretched hands.",
    vitalFunctions: [
      "Enables multi-axis shoulder circumduction and reach",
      "Permits forearm pronation/supination and fine manual grip",
      "Dissipates upper body deceleration impacts",
    ],
    vitalMetrics: [
      { label: "Joint Mobility", value: "Full Range", normal: "180° shoulder abduction" },
      { label: "Bone Mineral Density", value: "T-Score > -1.0", normal: "Normal adult density" },
    ],
    commonPathologies: ["Clavicle Fracture", "Rotator Cuff Impingement", "Colles' Wrist Fracture", "Carpal Tunnel Syndrome"],
    aiPrompt: "What is the emergency management protocol for a suspected humerus or clavicle fracture?",
  },
  {
    id: "bone_femur_legs",
    name: "Lower Limb Skeleton (Femur & Tibia)",
    latinName: "Ossa membri inferioris",
    system: "skeletal",
    region: "Lower Limbs",
    position: [0, -1.15, 0],
    color: "#e2e8f0",
    emissiveColor: "#94a3b8",
    description:
      "The strongest load-bearing columns in the human body, featuring the femur (longest and densest bone), patella, tibia, fibula, and foot arch architecture.",
    clinicalSignificance:
      "Femoral neck fractures in elderly patients carry high morbidity and deep vein thrombosis risk; knee ligament and meniscus tears are prevalent in athletics.",
    vitalFunctions: [
      "Bears up to 4x total body weight during bipedal locomotion and running",
      "Houses substantial hematopoietic bone marrow reserve in the diaphysis",
      "Absorbs vertical kinetic ground reaction forces",
    ],
    vitalMetrics: [
      { label: "Femur Tensile Strength", value: "135 MPa", normal: "Resists > 1,000 kg load" },
      { label: "Knee Joint Stability", value: "Normal laxity", normal: "Intact ACL/PCL/MCL/LCL" },
    ],
    commonPathologies: ["Femoral Neck Fracture", "Osteoarthritis of Knee", "Tibia Stress Fracture", "Achilles Tendinopathy"],
    aiPrompt: "Explain post-operative rehabilitation and thrombosis prophylaxis after a femur fracture.",
  },

  // ── INTERNAL ORGANS (VISCERAL SYSTEM) ───────────────────────────────────────
  {
    id: "organ_brain",
    name: "Brain (Cerebrum & Brainstem)",
    latinName: "Encephalon",
    system: "organ",
    region: "Head & Neck",
    position: [0, 2.38, 0.05],
    color: "#f472b6",
    emissiveColor: "#db2777",
    description:
      "The command centre of the nervous system, with ~86 billion neurons orchestrating cognitive reasoning, motor control, emotional processing, and autonomic homeostasis.",
    clinicalSignificance:
      "Highly susceptible to ischemic strokes (time is brain: 1.9 million neurons lost per minute), traumatic brain injury, and neurodegenerative disorders.",
    vitalFunctions: [
      "Directs high-level cognition, sensory analysis, and memory consolidation",
      "Controls voluntary motor kinematics and involuntary vegetative reflexes",
      "Regulates autonomic respiration, blood pressure, and core temperature via the brainstem",
    ],
    vitalMetrics: [
      { label: "Cerebral Blood Flow", value: "750 mL/min", normal: "15% of Cardiac Output" },
      { label: "Oxygen Consumption", value: "20%", normal: "Consumes 20% of resting O2" },
      { label: "Mass", value: "1,350 g", normal: "Approx 2% body mass" },
    ],
    commonPathologies: ["Ischemic / Hemorrhagic Stroke", "Glioblastoma", "Alzheimer's Disease", "Epilepsy"],
    aiPrompt: "What are the FAST warning signs of an acute stroke and immediate treatment window?",
    relatedOrganId: "brain",
  },
  {
    id: "organ_heart",
    name: "Heart (Myocardium & Valves)",
    latinName: "Cor",
    system: "organ",
    region: "Thorax",
    position: [-0.08, 1.28, 0.12],
    color: "#ef4444",
    emissiveColor: "#dc2626",
    description:
      "A four-chambered electromechanical muscular pump that beats over 100,000 times daily, propelling oxygenated blood through the systemic circulation.",
    clinicalSignificance:
      "Ischemic heart disease and myocardial infarction remain the leading global cause of mortality; cardiac dysrhythmias require prompt ECG triage.",
    vitalFunctions: [
      "Circulates ~5 litres of blood every minute through vascular loops",
      "Generates continuous systemic blood pressure to perfuse vital capillary beds",
      "Coordinates electrical conduction via SA and AV nodes with rhythmic atrial/ventricular contraction",
    ],
    vitalMetrics: [
      { label: "Resting Heart Rate", value: "60-100 BPM", normal: "60-100 BPM" },
      { label: "Cardiac Output", value: "5.0 L/min", normal: "4.5 - 6.5 L/min" },
      { label: "Left Ventricle EF", value: "55-65%", normal: ">= 50% ejection fraction" },
    ],
    commonPathologies: ["Myocardial Infarction (Heart Attack)", "Atrial Fibrillation", "Heart Failure", "Aortic Valve Stenosis"],
    aiPrompt: "How do cardiac troponin markers and 12-lead ECG help rule in a STEMI heart attack?",
    relatedOrganId: "heart",
  },
  {
    id: "organ_lungs",
    name: "Lungs (Left & Right Lobes)",
    latinName: "Pulmones",
    system: "organ",
    region: "Thorax",
    position: [0, 1.26, 0.08],
    color: "#06b6d4",
    emissiveColor: "#0891b2",
    description:
      "Essential pair of sponge-like respiratory organs encompassing 300+ million alveoli, executing rapid alveolar-capillary O2 and CO2 diffusion.",
    clinicalSignificance:
      "Prone to pneumonia, asthma, COPD, and pulmonary embolism; evaluated with pulse oximetry, arterial blood gases, and chest imaging.",
    vitalFunctions: [
      "Saturates arterial hemoglobin with alveolar atmospheric oxygen",
      "Clears metabolic carbon dioxide to maintain arterial pH (7.35 - 7.45)",
      "Filters minute microemboli from returning venous blood",
    ],
    vitalMetrics: [
      { label: "SpO2 (Pulse Oximetry)", value: "95-100%", normal: ">= 95% on room air" },
      { label: "Respiratory Rate", value: "12-18 /min", normal: "12 - 20 breaths/min" },
      { label: "Total Lung Capacity", value: "6.0 Litres", normal: "Varies with height/gender" },
    ],
    commonPathologies: ["Pneumonia", "Asthma", "COPD Exacerbation", "Pulmonary Embolism"],
    aiPrompt: "What are the clinical differences between viral vs bacterial pneumonia on chest auscultation?",
    relatedOrganId: "lungs",
  },
  {
    id: "organ_liver",
    name: "Liver (Hepatic Lobes)",
    latinName: "Hepar",
    system: "organ",
    region: "Abdomen",
    position: [0.18, 0.78, 0.12],
    color: "#b45309",
    emissiveColor: "#92400e",
    description:
      "The largest solid internal organ and metabolic powerhouse, performing 500+ vital physiological tasks including detoxification, protein synthesis, and bile secretion.",
    clinicalSignificance:
      "Vulnerable to viral hepatitis, non-alcoholic fatty liver disease (MASLD), cirrhosis, and medication hepatotoxicity (e.g. acetaminophen overdose).",
    vitalFunctions: [
      "Synthesizes crucial plasma clotting factors (fibrinogen, prothrombin) and albumin",
      "Detoxifies pharmaceutical agents, alcohol, and endogenous ammonia via the urea cycle",
      "Produces digestive bile acids stored in gallbladder for dietary lipid emulsification",
    ],
    vitalMetrics: [
      { label: "ALT / AST (Transaminases)", value: "< 40 U/L", normal: "7 - 56 U/L" },
      { label: "Total Bilirubin", value: "0.2-1.2 mg/dL", normal: "< 1.2 mg/dL" },
      { label: "Organ Mass", value: "1.5 kg", normal: "Largest internal visceral organ" },
    ],
    commonPathologies: ["Cirrhosis", "Nonalcoholic Fatty Liver (MASLD)", "Viral Hepatitis B/C", "Hepatocellular Carcinoma"],
    aiPrompt: "Explain elevated AST/ALT liver enzymes and what tests differentiate viral vs metabolic liver injury.",
    relatedOrganId: "liver",
  },
  {
    id: "organ_stomach",
    name: "Stomach & Spleen",
    latinName: "Gaster & Splen",
    system: "organ",
    region: "Abdomen",
    position: [-0.16, 0.76, 0.14],
    color: "#f59e0b",
    emissiveColor: "#d97706",
    description:
      "A muscular J-shaped digestive reservoir that churns ingested food with gastric hydrochloric acid and pepsin, positioned adjacent to the immune-filtering spleen.",
    clinicalSignificance:
      "Subject to Helicobacter pylori peptic ulcers, acid reflux (GERD), and gastritis; splenic rupture presents high risk of hemoperitoneum.",
    vitalFunctions: [
      "Secretes gastric juice (pH 1.5 - 2.0) for chemical protein denaturation",
      "Propels enzymatic chyme in measured pulses into the duodenum",
      "Synthesizes intrinsic factor necessary for ileal Vitamin B12 absorption",
    ],
    vitalMetrics: [
      { label: "Gastric Luminal pH", value: "1.5 - 2.0", normal: "Highly acidic" },
      { label: "Storage Capacity", value: "1.5 - 2.0 L", normal: "Distensible reservoir" },
    ],
    commonPathologies: ["Peptic Ulcer Disease", "GERD", "Gastritis", "Gastric Adenocarcinoma"],
    aiPrompt: "What are the first-line therapies for H. pylori eradication and peptic ulcer healing?",
  },
  {
    id: "organ_kidneys",
    name: "Kidneys (Renal Filtration Units)",
    latinName: "Renes",
    system: "organ",
    region: "Abdomen",
    position: [0, 0.62, -0.08],
    color: "#831843",
    emissiveColor: "#9d174d",
    description:
      "Pair of retroperitoneal bean-shaped organs containing two million nephrons, filtering ~180 litres of blood plasma daily to regulate volume, electrolytes, and waste.",
    clinicalSignificance:
      "Susceptible to diabetic nephropathy, hypertensive glomerulosclerosis, acute kidney injury (AKI), and excruciating nephrolithiasis (kidney stones).",
    vitalFunctions: [
      "Filters nitrogenous urea, creatinine, and metabolic toxins into urine",
      "Maintains precise sodium, potassium, calcium, and phosphate electrolyte equilibrium",
      "Secretes erythropoietin to stimulate erythrocyte production and renin for blood pressure regulation",
    ],
    vitalMetrics: [
      { label: "Glomerular Filtration (eGFR)", value: "> 90 mL/min", normal: ">= 90 mL/min/1.73m²" },
      { label: "Serum Creatinine", value: "0.7 - 1.2 mg/dL", normal: "0.6 - 1.2 mg/dL" },
      { label: "Daily Urine Output", value: "1.5 - 2.0 L", normal: ">= 0.5 mL/kg/hour" },
    ],
    commonPathologies: ["Chronic Kidney Disease (CKD)", "Kidney Stones (Nephrolithiasis)", "Acute Tubular Necrosis", "Glomerulonephritis"],
    aiPrompt: "How do doctors interpret eGFR and microalbuminuria in chronic kidney disease staging?",
    relatedOrganId: "kidneys",
  },
  {
    id: "organ_intestines",
    name: "Intestinal Tract (Small & Large Colon)",
    latinName: "Intestinum tenue et crassum",
    system: "organ",
    region: "Abdomen",
    position: [0, 0.32, 0.12],
    color: "#ea580c",
    emissiveColor: "#c2410c",
    description:
      "Extensive continuous luminal canal spanning the duodenum, jejunum, ileum, and colon, hosting the gut microbiome and assimilating nutrients and water.",
    clinicalSignificance:
      "Acute appendicitis is a surgical emergency; inflammatory bowel disease (Crohn's, Ulcerative Colitis) and colorectal cancer mandate routine colonoscopy screening.",
    vitalFunctions: [
      "Absorbs amino acids, simple carbohydrates, lipids, electrolytes, and water across microvilli",
      "Houses 100 trillion microbiome microorganisms aiding immunity and vitamin K synthesis",
      "Propels fecal residue via coordinated peristaltic contractions toward the rectum",
    ],
    vitalMetrics: [
      { label: "Total Length", value: "7.5 metres", normal: "6m small + 1.5m large intestine" },
      { label: "Absorptive Surface Area", value: "32 m²", normal: "Equivalent to half a badminton court" },
    ],
    commonPathologies: ["Acute Appendicitis", "Crohn's Disease", "Ulcerative Colitis", "Colorectal Polyps & Cancer"],
    aiPrompt: "What are the classic clinical signs of acute appendicitis vs diverticulitis?",
    relatedOrganId: "intestine",
  },
  {
    id: "organ_bladder",
    name: "Urinary Bladder",
    latinName: "Vesica urinaria",
    system: "organ",
    region: "Pelvis",
    position: [0, -0.08, 0.1],
    color: "#eab308",
    emissiveColor: "#ca8a04",
    description:
      "A distensible pelvic hollow muscular organ lined with transitional epithelium that holds urine delivered continuously from the bilateral ureters.",
    clinicalSignificance:
      "Urinary tract infections (UTIs) are among the most common bacterial infections; painless hematuria warrants urgent cystoscopic evaluation for urothelial cancer.",
    vitalFunctions: [
      "Stores 400-600 mL of sterile urine under low intravesical pressure",
      "Coordinates detrusor muscle contraction with external sphincter relaxation during micturition",
    ],
    vitalMetrics: [
      { label: "Functional Capacity", value: "400 - 500 mL", normal: "First urge at ~150-250 mL" },
      { label: "Post-Void Residual", value: "< 50 mL", normal: "< 50 mL is normal" },
    ],
    commonPathologies: ["Cystitis (UTI)", "Overactive Bladder", "Urinary Retention", "Bladder Carcinoma"],
    aiPrompt: "When is hematuria (blood in urine) concerning for bladder or kidney pathology?",
  },

  // ── CARDIOVASCULAR / VASCULAR SYSTEM ───────────────────────────────────────
  {
    id: "vascular_aorta_network",
    name: "Cardiovascular Vascular Network",
    latinName: "Systema cardiovasculare",
    system: "vascular",
    region: "Thorax",
    position: [0, 0.85, 0],
    color: "#f43f5e",
    emissiveColor: "#be123c",
    description:
      "High-pressure arterial tree (Ascending Aorta, Carotid, Femoral, Radial arteries) and low-pressure venous return channels (Superior & Inferior Vena Cava) spanning ~100,000 kilometres.",
    clinicalSignificance:
      "Aortic dissection is a catastrophic vascular tear; deep vein thrombosis (DVT) can migrate to cause lethal pulmonary embolisms.",
    vitalFunctions: [
      "Delivers oxygenated blood and nutrients to every living somatic cell",
      "Maintains systemic vascular resistance (SVR) and baroreceptor blood pressure reflexes",
      "Enables leukocyte homing to sites of infection and tissue trauma",
    ],
    vitalMetrics: [
      { label: "Blood Pressure", value: "120/80 mmHg", normal: "< 120/80 mmHg" },
      { label: "Pulse Pressure", value: "40 mmHg", normal: "30 - 50 mmHg" },
      { label: "Circulation Time", value: "~20 seconds", normal: "One complete circulatory loop" },
    ],
    commonPathologies: ["Aortic Aneurysm / Dissection", "Atherosclerosis (PAD)", "Deep Vein Thrombosis (DVT)", "Hypertension"],
    aiPrompt: "Explain the classic symptoms of an acute aortic dissection vs myocardial infarction.",
  },

  // ── NERVOUS SYSTEM ─────────────────────────────────────────────────────────
  {
    id: "nervous_spinal_cord",
    name: "Spinal Cord & Peripheral Nerves",
    latinName: "Medulla spinalis & Nervi peripherici",
    system: "nervous",
    region: "Thorax",
    position: [0, 1.05, -0.12],
    color: "#38bdf8",
    emissiveColor: "#0284c7",
    description:
      "The body's high-speed neural superhighway passing through the vertebral foramina, giving rise to 31 pairs of spinal nerves distributing somatic motor and sensory innervation.",
    clinicalSignificance:
      "Acute spinal cord trauma causes quadriplegia or paraplegia; peripheral neuropathy (e.g. diabetic stocking-glove) leads to neuropathic ulceration.",
    vitalFunctions: [
      "Conveys ascending sensory proprioception, pain, and thermal signals to the brain",
      "Carries descending pyramidal motor commands to drive skeletal muscle groups",
      "Mediates rapid spinal cord reflex arcs independent of conscious cerebral input",
    ],
    vitalMetrics: [
      { label: "Nerve Conduction Speed", value: "120 m/s", normal: "Myelinated A-alpha fibers" },
      { label: "Spinal Nerve Pairs", value: "31 pairs", normal: "8C, 12T, 5L, 5S, 1Co" },
    ],
    commonPathologies: ["Spinal Cord Injury", "Diabetic Neuropathy", "Guillain-Barré Syndrome", "Radiculopathy"],
    aiPrompt: "How are dermatomes and myotomes tested during an emergency neurological assessment?",
  },
];

export const SYSTEM_TABS: { id: AnatomicalSystem; label: string; count: number; color: string }[] = [
  { id: "all", label: "All Systems", count: 12, color: "text-primary-600 bg-primary-50 border-primary-200" },
  { id: "skeletal", label: "Skeleton (Bones)", count: 6, color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "organ", label: "Internal Organs", count: 7, color: "text-rose-700 bg-rose-50 border-rose-200" },
  { id: "vascular", label: "Cardiovascular", count: 1, color: "text-red-700 bg-red-50 border-red-200" },
  { id: "nervous", label: "Nervous System", count: 2, color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
];

export function getStructureById(id: string): AnatomicalStructure | undefined {
  return FULL_BODY_STRUCTURES.find((s) => s.id === id);
}
