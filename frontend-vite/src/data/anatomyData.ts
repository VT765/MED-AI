// ─────────────────────────────────────────────────────────────────────────────
// anatomyData.ts — Comprehensive data layer matching the Body Atlas+ UI
// ─────────────────────────────────────────────────────────────────────────────

export interface Hotspot {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  description: string;
  details?: string;
  anatomicalTerm?: string;
  category?: "valve" | "vessel" | "chamber" | "electrical" | "landmark";
}

export interface FactItem {
  icon: string;
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BodySystem {
  id: string;
  name: string;
  latinName: string;
  description: string;
  iconName: string;
  organIds: string[];
  color: string;
}

export interface Organ {
  id: string;
  name: string;
  latinName: string;
  tagline: string;
  category: string;
  systemId: string;
  thumbnail: string;
  modelPath: string;
  vesselsModelPath?: string;
  description: string;
  keyFacts: FactItem[];
  medicalImportance: string;
  didYouKnow: string;
  hotspots: Hotspot[];
  microscopicDescription: string;
  clinicalNotes: string[];
  quizQuestions: QuizQuestion[];
}

export const bodySystems: BodySystem[] = [
  {
    id: "all",
    name: "All Systems",
    latinName: "Systemata Corporis",
    description: "Complete anatomical library spanning all human visceral organ systems.",
    iconName: "Sparkles",
    organIds: ["heart", "brain", "lungs", "liver", "kidneys", "eye", "intestine", "pancreas", "skin"],
    color: "#e11d48",
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular",
    latinName: "Systema cardiovasculare",
    description: "The hemodynamic network of heart, arteries, veins, and microcapillaries.",
    iconName: "Heart",
    organIds: ["heart"],
    color: "#e11d48",
  },
  {
    id: "nervous",
    name: "Nervous System",
    latinName: "Systema nervosum",
    description: "Central and peripheral neural pathways regulating cognition, sensation, and reflexes.",
    iconName: "Brain",
    organIds: ["brain"],
    color: "#8b5cf6",
  },
  {
    id: "respiratory",
    name: "Respiratory",
    latinName: "Systema respiratorium",
    description: "Airways, bronchial arborization, and alveolar gas exchange structures.",
    iconName: "Wind",
    organIds: ["lungs"],
    color: "#06b6d4",
  },
  {
    id: "digestive",
    name: "Digestive",
    latinName: "Systema digestorium",
    description: "Gastrointestinal tract, hepatic metabolism, and biliary-pancreatic digestion.",
    iconName: "Utensils",
    organIds: ["liver", "intestine", "pancreas"],
    color: "#f59e0b",
  },
  {
    id: "urinary",
    name: "Urinary",
    latinName: "Systema urinarium",
    description: "Nephron filtration, osmoregulation, acid-base balance, and waste excretion.",
    iconName: "Droplets",
    organIds: ["kidneys"],
    color: "#3b82f6",
  },
  {
    id: "sensory-integumentary",
    name: "Sensory & Skin",
    latinName: "Organa sensuum & Cutis",
    description: "Photoreceptive optical apparatus and the cutaneous protective barrier.",
    iconName: "Eye",
    organIds: ["eye", "skin"],
    color: "#10b981",
  },
];

export const organs: Organ[] = [
  {
    id: "heart",
    name: "Heart",
    latinName: "Cor",
    tagline: "The tireless pump",
    category: "Cardiovascular",
    systemId: "cardiovascular",
    thumbnail: "/organs/heart.jpg",
    modelPath: "/models/heart.glb",
    vesselsModelPath: "/models/heart_vessels.glb",
    description:
      "A muscular organ that pumps blood throughout the body, delivering oxygen and nutrients to every cell while sustaining systemic blood pressure.",
    keyFacts: [
      { icon: "◇", label: "Size", value: "About the size of your closed fist" },
      { icon: "◆", label: "Weight", value: "250–350 g (adult male ~300g)" },
      { icon: "⏱", label: "Daily Output", value: "~7,200 liters (1,900 gallons)" },
      { icon: "📍", label: "Location", value: "Middle mediastinum, T5–T8 level" },
      { icon: "🩸", label: "Blood supply", value: "Left (LCA/LAD/LCx) & Right (RCA) coronary" },
      { icon: "⚡", label: "Cardiac output", value: "~5.0 L/min at rest (HR 70 × SV 70mL)" },
    ],
    medicalImportance: "Its intrinsic sinoatrial conduction coordinates every heartbeat without requiring external neural input.",
    didYouKnow:
      "It beats roughly 2.5 billion times across an average 75-year lifespan, producing enough hydraulic force to squirt blood over 9 meters.",
    hotspots: [
      {
        id: "aorta-arch",
        label: "Aortic Arch & Ascending Aorta",
        anatomicalTerm: "Arcus aortae",
        category: "vessel",
        position: [-0.35, 1.65, 0.55],
        color: "#e11d48", // Red
        description:
          "The largest systemic artery receiving oxygenated blood from the left ventricle under high systolic pressure (120 mmHg).",
        details: "Gives off the brachiocephalic trunk, left common carotid artery, and left subclavian artery before descending into the thoracic aorta.",
      },
      {
        id: "aortic-valve",
        label: "Aortic Valve",
        anatomicalTerm: "Valva aortae",
        category: "valve",
        position: [-0.15, 0.55, 0.65],
        color: "#f59e0b", // Amber/Gold
        description:
          "A trifoliate semilunar valve guarding the exit of the left ventricle into the ascending aorta.",
        details: "Consists of right coronary, left coronary, and non-coronary cusps. Prevents retrograde regurgitation into the left ventricle during diastole.",
      },
      {
        id: "mitral-valve",
        label: "Mitral (Bicuspid) Valve",
        anatomicalTerm: "Valva mitralis / bicuspidalis",
        category: "valve",
        position: [0.18, -1.35, 0.48],
        color: "#10b981", // Emerald
        description:
          "Dual-leaflet atrioventricular valve regulating unidirectional blood flow from the left atrium to the left ventricle.",
        details: "Comprises anterior and posterior leaflets tethered by chordae tendineae to papillary muscles to resist high ventricular systolic pressure.",
      },
      {
        id: "pulmonary-valve",
        label: "Pulmonary Valve",
        anatomicalTerm: "Valva trunci pulmonalis",
        category: "valve",
        position: [-0.32, 0.45, 0.85],
        color: "#06b6d4", // Cyan
        description:
          "Semilunar valve at the junction of the right ventricle conus arteriosus and the pulmonary trunk.",
        details: "Features anterior, right, and left semilunar cusps. Opens during right ventricular systole (ejection into low-resistance pulmonary circulation).",
      },
      {
        id: "tricuspid-valve",
        label: "Tricuspid Valve",
        anatomicalTerm: "Valva tricuspidalis",
        category: "valve",
        position: [-0.45, -0.15, 0.72],
        color: "#8b5cf6", // Purple
        description:
          "Tri-leaflet atrioventricular valve positioned between the right atrium and the right ventricle.",
        details: "Anterior, posterior, and septal leaflets anchor via chordae tendineae. Prevents backflow into the right atrium during RV systole.",
      },
      {
        id: "left-ventricle",
        label: "Left Ventricle",
        anatomicalTerm: "Ventriculus sinister",
        category: "chamber",
        position: [0.7, -0.75, 0.65],
        color: "#dc2626", // Deep Red
        description:
          "The high-pressure systemic pumping chamber featuring thick muscular walls (10–15 mm) to overcome systemic vascular resistance.",
        details: "Generates normal systolic pressures of 100–140 mmHg and ejects ~70 mL of oxygenated blood into the aorta with each contraction.",
      },
      {
        id: "right-ventricle",
        label: "Right Ventricle",
        anatomicalTerm: "Ventriculus dexter",
        category: "chamber",
        position: [-0.65, -0.68, 0.66],
        color: "#2563eb", // Royal Blue
        description:
          "Crescent-shaped muscular chamber pumping deoxygenated blood into the pulmonary circulation.",
        details: "Wall thickness is ~3–5 mm (one-third that of the LV), operating at lower pressures (20–30 mmHg peak systole) against low pulmonary resistance.",
      },
      {
        id: "pulmonary-trunk",
        label: "Pulmonary Trunk & Arteries",
        anatomicalTerm: "Truncus pulmonalis",
        category: "vessel",
        position: [-0.15, 0.95, 0.85],
        color: "#3b82f6", // Blue
        description:
          "Transports deoxygenated venous blood directly from the right ventricle into the left and right lungs for oxygenation.",
        details: "Bifurcates into the right and left pulmonary arteries beneath the aortic arch at the carina (ligamentum arteriosum connection).",
      },
      {
        id: "superior-vena-cava",
        label: "Superior Vena Cava",
        anatomicalTerm: "Vena cava superior",
        category: "vessel",
        position: [-0.85, 1.45, 0.25],
        color: "#1e3a8a", // Navy Blue
        description:
          "Large venous trunk draining deoxygenated blood from the head, neck, upper extremities, and thorax into the right atrium.",
        details: "Formed by the confluence of the right and left brachiocephalic veins; receives the azygos vein before piercing the pericardium.",
      },
      {
        id: "right-coronary",
        label: "Right Coronary Artery (RCA)",
        anatomicalTerm: "Arteria coronaria dextra",
        category: "vessel",
        position: [-0.55, 0.15, 0.75],
        color: "#ea580c", // Orange
        description:
          "Supplies oxygenated blood to the right atrium, right ventricle, Sinoatrial (SA) Node (60% patients), and AV Node (90% patients).",
        details: "Travels down the right atrioventricular groove and gives rise to the acute marginal branch and posterior descending artery (PDA).",
      },
      {
        id: "left-anterior-descending",
        label: "Left Anterior Descending (LAD)",
        anatomicalTerm: "Ramus interventricularis anterior",
        category: "vessel",
        position: [0.25, -0.35, 0.85],
        color: "#b91c1c", // Crimson
        description:
          "The 'widowmaker' artery supplying the anterior two-thirds of the interventricular septum, anterior LV free wall, and apex.",
        details: "Most clinically significant vessel involved in fatal myocardial infarction; occlusion leads to massive anteroseptal wall dysfunction.",
      },
      {
        id: "apex-cordis",
        label: "Apex of the Heart",
        anatomicalTerm: "Apex cordis",
        category: "landmark",
        position: [0.35, -1.75, 0.5],
        color: "#9333ea", // Purple
        description:
          "The inferior-lateral conical tip formed solely by the left ventricle, oriented towards the 5th left intercostal space.",
        details: "Corresponds clinically to the point of maximal impulse (PMI) on cardiac auscultation and palpation.",
      },
    ],
    microscopicDescription:
      "Cardiac muscle fibers are striated, branched, and interconnected by intercalated discs containing gap junctions (connexons) that enable synchronized contraction. Cardiomyocytes are mononucleated and contain abundant mitochondria (~35% cell volume) reflecting high aerobic demand.",
    clinicalNotes: [
      "Myocardial Infarction (MI): Blockage of coronary arteries leading to ischemic necrosis of cardiac tissue. Time-critical intervention (PCI within 90 minutes).",
      "Heart Failure: Reduced ejection fraction (HFrEF) vs preserved ejection fraction (HFpEF). Classified using NYHA functional classes I–IV.",
      "Valvular Disease: Stenosis or regurgitation of mitral, aortic, tricuspid, or pulmonary valves. Diagnosed via echocardiography.",
      "Arrhythmias: Atrial fibrillation is the most common sustained arrhythmia. Risk of stroke increases 5x without anticoagulation.",
    ],
    quizQuestions: [
      {
        id: "heart-q1",
        question: "Which chamber of the heart has the thickest walls?",
        options: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle"],
        correctIndex: 3,
        explanation:
          "The left ventricle has the thickest walls (1.3–1.5 cm) because it must generate enough pressure to pump blood throughout the entire body.",
      },
      {
        id: "heart-q2",
        question: "Where is the heart's natural pacemaker located?",
        options: ["AV Node", "Bundle of His", "SA Node", "Purkinje Fibers"],
        correctIndex: 2,
        explanation:
          "The sinoatrial (SA) node, located in the right atrium, initiates electrical impulses that set the heart's rhythm at 60–100 bpm.",
      },
    ],
  },
  {
    id: "brain",
    name: "Brain",
    latinName: "Encephalon",
    tagline: "The central processor",
    category: "Nervous System",
    systemId: "nervous",
    thumbnail: "/organs/brain.jpg",
    modelPath: "/models/brain.glb",
    description:
      "The command center of the nervous system, responsible for cognition, emotion, motor control, sensory processing, and autonomic regulation.",
    keyFacts: [
      { icon: "◇", label: "Size", value: "~1,400 cm³" },
      { icon: "◆", label: "Weight", value: "~1,400 g" },
      { icon: "⏱", label: "Neurons", value: "~86 billion cells" },
      { icon: "📍", label: "Location", value: "Cranial cavity (skull)" },
      { icon: "🩸", label: "Blood supply", value: "Internal carotid & vertebral arteries" },
      { icon: "⚡", label: "Energy usage", value: "20% of total body oxygen & glucose" },
    ],
    medicalImportance: "Coordinates every conscious thought, movement, and vital involuntary reflex.",
    didYouKnow:
      "Your brain produces roughly 12 to 25 watts of electricity — enough to power a low-wattage LED bulb.",
    hotspots: [
      {
        id: "frontal-lobe",
        label: "Frontal Lobe",
        anatomicalTerm: "Lobus frontalis",
        position: [-0.7, 0.65, 0.8],
        color: "#06b6d4",
        description: "Controls voluntary movement, executive function, expressive language, and higher reasoning.",
      },
      {
        id: "temporal-lobe",
        label: "Temporal Lobe",
        anatomicalTerm: "Lobus temporalis",
        position: [0.75, -0.1, 0.82],
        color: "#10b981",
        description: "Processes auditory signals, encodes long-term memory, and interprets emotional responses.",
      },
      {
        id: "cerebellum",
        label: "Cerebellum",
        anatomicalTerm: "Cerebellum",
        position: [0.72, -0.9, 0.55],
        color: "#f59e0b",
        description: "Coordinates precision motor timing, balance equilibrium, posture, and motor procedural learning.",
      },
    ],
    microscopicDescription:
      "Neural tissue comprises neurons and glial cells (astrocytes, oligodendrocytes, microglia). Neurons feature dendrites, a cell body (soma), and an axon. Myelinated axons form white matter; neuronal cell bodies cluster in gray matter. Synaptic transmission involves neurotransmitter release across the synaptic cleft.",
    clinicalNotes: [
      "Stroke (CVA): Ischemic (87%) vs hemorrhagic (13%). FAST mnemonic for recognition. tPA window: within 4.5 hours of symptom onset.",
      "Alzheimer's Disease: Progressive neurodegenerative disorder. Amyloid-beta plaques and tau neurofibrillary tangles. Most common cause of dementia.",
      "Traumatic Brain Injury (TBI): Glasgow Coma Scale (GCS) for severity. Mild (13–15), Moderate (9–12), Severe (3–8).",
    ],
    quizQuestions: [
      {
        id: "brain-q1",
        question: "Which brain region contains approximately 50% of all neurons?",
        options: ["Frontal Lobe", "Hippocampus", "Cerebellum", "Brainstem"],
        correctIndex: 2,
        explanation:
          "Despite being only ~10% of brain volume, the cerebellum contains roughly half of all neurons (~40 billion) due to densely packed granule cells.",
      },
    ],
  },
  {
    id: "lungs",
    name: "Lungs",
    latinName: "Pulmo",
    tagline: "The breath of life",
    category: "Respiratory System",
    systemId: "respiratory",
    thumbnail: "/organs/lungs.jpg",
    modelPath: "/models/lungs.glb",
    description:
      "Paired respiratory organs responsible for gas exchange — delivering oxygen to the blood and removing carbon dioxide across a massive alveolar surface.",
    keyFacts: [
      { icon: "◇", label: "Surface Area", value: "~70 m² (tennis court)" },
      { icon: "◆", label: "Weight", value: "~1,000 g total" },
      { icon: "⏱", label: "Daily", value: "~20,000 breaths" },
      { icon: "📍", label: "Location", value: "Thoracic pleural cavity" },
      { icon: "🩸", label: "Blood supply", value: "Pulmonary and bronchial circulation" },
      { icon: "⚡", label: "Function", value: "Oxygen uptake and CO₂ elimination" },
    ],
    medicalImportance: "Continuous gas exchange maintains blood pH at a strict 7.35–7.45 range.",
    didYouKnow:
      "The right lung is shorter and wider with 3 lobes, while the left lung has 2 lobes to make room for the heart.",
    hotspots: [
      {
        id: "trachea",
        label: "Trachea & Carina",
        anatomicalTerm: "Trachea",
        position: [0, 1.6, 0.2],
        color: "#06b6d4",
        description: "Cartilaginous windpipe branching at the carina into left and right main bronchi.",
      },
      {
        id: "right-bronchus",
        label: "Right Bronchus",
        anatomicalTerm: "Bronchus principalis dexter",
        position: [-0.03, 0.3, 0.35],
        color: "#10b981",
        description: "Wider, shorter, and more vertical pathway — most susceptible to foreign object aspiration.",
      },
    ],
    microscopicDescription:
      "Alveolar walls are lined by Type I pneumocytes (gas exchange, ~95% surface area) and Type II pneumocytes (surfactant production). The blood-air barrier is only 0.2–0.5 μm thick, consisting of alveolar epithelium, fused basement membranes, and capillary endothelium.",
    clinicalNotes: [
      "Pneumonia: Infection causing alveolar consolidation. Community-acquired (CAP) vs hospital-acquired (HAP). Diagnosed by chest X-ray and sputum culture.",
      "COPD: Chronic obstructive pulmonary disease including emphysema and chronic bronchitis. FEV1/FVC ratio < 0.70 confirms obstruction.",
    ],
    quizQuestions: [
      {
        id: "lungs-q1",
        question: "Why is the right main bronchus more commonly affected by aspirated objects?",
        options: [
          "It is longer",
          "It is wider, shorter, and more vertical",
          "It has more cartilage rings",
          "It connects to more alveoli",
        ],
        correctIndex: 1,
        explanation:
          "The right main bronchus is wider, shorter, and more vertically oriented than the left, making it the path of least resistance for aspirated foreign bodies.",
      },
    ],
  },
  {
    id: "liver",
    name: "Liver",
    latinName: "Hepar",
    tagline: "The chemical laboratory",
    category: "Digestive System",
    systemId: "digestive",
    thumbnail: "/organs/liver.jpg",
    modelPath: "/models/liver.glb",
    description:
      "The largest internal organ, performing over 500 vital metabolic, detoxifying, bile-producing, and glycogen storage functions.",
    keyFacts: [
      { icon: "◇", label: "Weight", value: "~1.5 kg (3.3 lbs)" },
      { icon: "◆", label: "Lobes", value: "4 (Right, Left, Caudate, Quadrate)" },
      { icon: "⏱", label: "Blood flow", value: "1.4 L/min (25% cardiac output)" },
      { icon: "📍", label: "Location", value: "Right upper abdominal quadrant" },
      { icon: "🩸", label: "Dual supply", value: "Hepatic artery (25%) & Portal vein (75%)" },
      { icon: "⚡", label: "Functions", value: "500+ metabolic and detoxification tasks" },
    ],
    medicalImportance: "Synthesizes vital clotting factors and breaks down toxins, drugs, and ammonia.",
    didYouKnow:
      "The liver is the only visceral organ capable of natural regeneration — growing back from just 25% of its mass.",
    hotspots: [
      {
        id: "right-lobe",
        label: "Right Lobe",
        anatomicalTerm: "Lobus dexter hepatis",
        position: [-0.75, 0.35, 0.75],
        color: "#e11d48",
        description: "The largest lobe, containing segments V, VI, VII, and VIII of the Couinaud classification.",
      },
      {
        id: "gallbladder",
        label: "Gallbladder & Biliary Tree",
        anatomicalTerm: "Vesica biliaris",
        position: [0.1, -0.3, 0.82],
        color: "#16a34a",
        description: "Stores and concentrates bile produced by hepatocytes for dietary fat emulsification.",
      },
    ],
    microscopicDescription:
      "Hexagonal classical liver lobules with central veins and portal triads (hepatic artery, portal vein, bile duct). Plates of hepatocytes border sinusoidal capillaries lined by fenestrated endothelia and Kupffer macrophages.",
    clinicalNotes: [
      "Cirrhosis: Fibrotic replacement of hepatic parenchyma causing portal hypertension, ascites, and varices.",
      "Hepatitis: Viral (A, B, C) or autoimmune inflammation damaging liver parenchyma.",
    ],
    quizQuestions: [],
  },
  {
    id: "kidneys",
    name: "Kidneys",
    latinName: "Ren",
    tagline: "The filtration masters",
    category: "Urinary System",
    systemId: "urinary",
    thumbnail: "/organs/kidneys.jpg",
    modelPath: "/models/kidneys.glb",
    description:
      "Bean-shaped organs that continuously filter toxins, metabolic waste, and excess fluid from blood to maintain electrolyte homeostasis.",
    keyFacts: [
      { icon: "◇", label: "Size", value: "10–12 cm long, 5–7 cm wide" },
      { icon: "◆", label: "Weight", value: "~150 g each" },
      { icon: "⏱", label: "Daily filtration", value: "180 liters of blood plasma" },
      { icon: "📍", label: "Location", value: "Retroperitoneal, T12–L3 vertebrae" },
      { icon: "🩸", label: "Blood supply", value: "Renal arteries (20% cardiac output)" },
      { icon: "⚡", label: "Unit", value: "~1 million nephrons per kidney" },
    ],
    medicalImportance: "Regulates arterial blood pressure via the renin-angiotensin-aldosterone system (RAAS).",
    didYouKnow:
      "Although making up less than 1% of body weight, kidneys receive over 20% of your total cardiac blood output.",
    hotspots: [
      {
        id: "renal-cortex",
        label: "Renal Cortex & Glomeruli",
        anatomicalTerm: "Cortex renalis",
        position: [-0.9, 0.55, 0.7],
        color: "#ea580c",
        description: "Outer region containing renal corpuscles, proximal and distal convoluted tubules.",
      },
      {
        id: "renal-pelvis",
        label: "Renal Pelvis & Ureter",
        anatomicalTerm: "Pelvis renalis",
        position: [0.4, -1.1, 0.5],
        color: "#2563eb",
        description: "Funnel-shaped basin collecting urine from major calyces and channeling into the ureter.",
      },
    ],
    microscopicDescription:
      "Functional nephrons consisting of Bowman's capsules surrounding glomerular capillary tufts, podocyte filtration slits, and tubular transport epithelia with abundant Na+/K+-ATPase pumps.",
    clinicalNotes: [
      "Chronic Kidney Disease (CKD): Progressive GFR decline requiring dialysis or renal transplantation.",
      "Nephrolithiasis: Kidney stone formation (calcium oxalate, uric acid) causing acute colicky flank pain.",
    ],
    quizQuestions: [],
  },
  {
    id: "eye",
    name: "Eye",
    latinName: "Oculus",
    tagline: "The sensory window",
    category: "Sensory System",
    systemId: "sensory-integumentary",
    thumbnail: "/organs/eye.jpg",
    modelPath: "/models/eye.glb",
    description:
      "Highly specialized photoreceptive organs that focus light onto the retina, converting optical data into electrical signals for the brain.",
    keyFacts: [
      { icon: "◇", label: "Diameter", value: "~24 mm (transverse)" },
      { icon: "◆", label: "Weight", value: "~7.5 g" },
      { icon: "⏱", label: "Photoreceptors", value: "120M rods (light), 6M cones (color)" },
      { icon: "📍", label: "Location", value: "Orbital cavity with 6 extraocular muscles" },
      { icon: "🩸", label: "Blood supply", value: "Ophthalmic artery & central retinal artery" },
      { icon: "⚡", label: "Resolution", value: "Equivalent to ~576 megapixels" },
    ],
    medicalImportance: "Over 80% of human sensory perception and environmental interaction occurs via vision.",
    didYouKnow:
      "The muscles that move your eyeball are the fastest and most active muscles in the entire human body.",
    hotspots: [
      {
        id: "cornea-lens",
        label: "Cornea & Lens",
        anatomicalTerm: "Cornea",
        position: [-0.94, 0.05, 1.47],
        color: "#06b6d4",
        description: "Transparent anterior refractive media providing ~70% of the eye's total optical focusing power.",
      },
      {
        id: "optic-nerve",
        label: "Optic Nerve (CN II)",
        anatomicalTerm: "Nervus opticus",
        position: [1.61, -0.18, 0.54],
        color: "#e11d48",
        description: "Bundle of over 1 million retinal ganglion cell axons transmitting vision signals to the occipital cortex.",
      },
    ],
    microscopicDescription:
      "Ten distinct retinal layers from internal limiting membrane through ganglion, bipolar, and photoreceptor rod/cone layers to the retinal pigment epithelium (RPE).",
    clinicalNotes: [
      "Glaucoma: Elevated intraocular pressure causing progressive optic nerve cupping and visual field loss.",
      "Cataracts: Opacification of the crystalline lens treated with phacoemulsification and IOL implantation.",
    ],
    quizQuestions: [],
  },
  {
    id: "intestine",
    name: "Intestine",
    latinName: "Intestinum",
    tagline: "The nutrient absorber",
    category: "Digestive System",
    systemId: "digestive",
    thumbnail: "/organs/intestine.jpg",
    modelPath: "/models/intestine.glb",
    description:
      "Crucial digestive tract segment comprising the duodenum, jejunum, ileum, and colon for nutrient assimilation, water balance, and immune defense.",
    keyFacts: [
      { icon: "◇", label: "Length", value: "~6–7 meters (20–22 feet)" },
      { icon: "◆", label: "Surface Area", value: "~32 m² (due to villi & microvilli)" },
      { icon: "⏱", label: "Microbiome", value: "~38 trillion bacteria (1,000+ species)" },
      { icon: "📍", label: "Location", value: "Abdominal and pelvic cavities" },
      { icon: "🩸", label: "Blood supply", value: "Superior & inferior mesenteric arteries" },
      { icon: "⚡", label: "Immunity", value: "Houses 70% of the body's immune cells" },
    ],
    medicalImportance: "Gut-associated lymphoid tissue (GALT) forms the body's primary barrier against ingested pathogens.",
    didYouKnow:
      "The enteric nervous system in the gut contains over 500 million neurons, often called our 'second brain'.",
    hotspots: [
      {
        id: "small-intestine",
        label: "Small Intestinal Loops",
        anatomicalTerm: "Intestinum tenue",
        position: [-0.45, 0.1, 0.82],
        color: "#ea580c",
        description: "Extensive mucosal folding with millions of microvilli maximizing nutrient and electrolyte absorption.",
      },
    ],
    microscopicDescription:
      "Enterocytes with apical brush borders, goblet cells producing protective mucus, and enteroendocrine cells modulating gut motility.",
    clinicalNotes: [
      "Crohn's Disease & Ulcerative Colitis: Chronic inflammatory bowel diseases (IBD).",
      "Celiac Disease: Autoimmune villous atrophy triggered by dietary gluten ingestion.",
    ],
    quizQuestions: [],
  },
  {
    id: "pancreas",
    name: "Pancreas",
    latinName: "Pancreas",
    tagline: "The dual regulator",
    category: "Digestive System",
    systemId: "digestive",
    thumbnail: "/organs/pancreas.jpg",
    modelPath: "/models/pancreas.glb",
    description:
      "An oblong retroperitoneal gland with crucial exocrine (digestive enzymes) and endocrine (insulin and glucagon) functions.",
    keyFacts: [
      { icon: "◇", label: "Length", value: "12–15 cm (6 inches)" },
      { icon: "◆", label: "Weight", value: "70–100 g" },
      { icon: "⏱", label: "Exocrine output", value: "1.5 liters of pancreatic juice/day" },
      { icon: "📍", label: "Location", value: "Posterior to stomach, nestled in duodenum C-loop" },
      { icon: "🩸", label: "Blood supply", value: "Splenic and pancreaticoduodenal arteries" },
      { icon: "⚡", label: "Endocrine cells", value: "~1 million Islets of Langerhans" },
    ],
    medicalImportance: "Islet beta cells produce insulin, the sole hormone capable of lowering blood glucose levels.",
    didYouKnow:
      "Pancreatic enzymes are so potent they are stored in inactive pro-forms (zymogens) to prevent the pancreas from digesting itself.",
    hotspots: [
      {
        id: "pancreas-head",
        label: "Head & Duodenum Loop",
        anatomicalTerm: "Caput pancreatis",
        position: [-1.32, -0.36, 0.55],
        color: "#f59e0b",
        description: "Broad medial portion cradled by the C-shaped loop of the duodenum.",
      },
    ],
    microscopicDescription:
      "Exocrine acini releasing trypsinogen, amylase, and lipase, interspersed with vascular Islets of Langerhans (alpha, beta, delta cells).",
    clinicalNotes: [
      "Diabetes Mellitus: Type 1 (autoimmune beta-cell destruction) vs Type 2 (insulin resistance with progressive secretory deficit).",
      "Acute Pancreatitis: Autodigestive inflammatory emergency commonly caused by gallstones or alcohol.",
    ],
    quizQuestions: [],
  },
  {
    id: "skin",
    name: "Skin",
    latinName: "Cutis",
    tagline: "The protective armor",
    category: "Integumentary System",
    systemId: "sensory-integumentary",
    thumbnail: "/organs/skin.jpg",
    modelPath: "/models/skin.glb",
    description:
      "The body's largest organ by surface area, serving as a dynamic barrier against pathogens, ultraviolet radiation, dehydration, and mechanical stress.",
    keyFacts: [
      { icon: "◇", label: "Surface Area", value: "~1.8–2.0 m² (20 sq ft)" },
      { icon: "◆", label: "Weight", value: "~4–5 kg (16% body weight)" },
      { icon: "⏱", label: "Cell turnover", value: "Full epidermal renewal every 28 days" },
      { icon: "📍", label: "Layers", value: "Epidermis, Dermis, Hypodermis" },
      { icon: "🩸", label: "Blood supply", value: "Dermal subpapillary & deep plexuses" },
      { icon: "⚡", label: "Sensors", value: "Meissner, Pacinian, Merkel, and Ruffini receptors" },
    ],
    medicalImportance: "Crucial thermoregulation via eccrine sweating and arteriolar vasodilation/vasoconstriction.",
    didYouKnow:
      "You shed roughly 30,000 to 40,000 dead skin cells every single minute — over 4 kg of skin in a single year!",
    hotspots: [
      {
        id: "epidermis-dermis",
        label: "Epidermal-Dermal Junction",
        anatomicalTerm: "Junctio dermoepidermalis",
        position: [-0.05, 0.88, 1.4],
        color: "#e11d48",
        description: "Basement membrane interdigitating with dermal papillae for nutrient diffusion and shear strength.",
      },
    ],
    microscopicDescription:
      "Stratified squamous keratinized epithelium (basale, spinosum, granulosum, lucidum, corneum) resting on collagen-dense papillary and reticular dermis with hair follicles and sebaceous units.",
    clinicalNotes: [
      "Melanoma: Aggressive malignancy of melanocytes identified using ABCDE criteria.",
      "Burns: Graded by depth (1st, 2nd, 3rd degree) and calculated via the Wallace Rule of Nines.",
    ],
    quizQuestions: [],
  },
];

export const getOrganById = (id: string): Organ => {
  return organs.find((o) => o.id === id) || organs[0];
};

export const getOrgansBySystem = (systemId: string): Organ[] => {
  if (systemId === "all") return organs;
  return organs.filter((o) => o.systemId === systemId);
};

export const searchOrgans = (query: string, systemId: string = "all"): Organ[] => {
  const q = query.toLowerCase().trim();
  let list = systemId === "all" ? organs : organs.filter((o) => o.systemId === systemId);
  if (!q) return list;
  return list.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.latinName.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q)
  );
};

// ── Heart vs Brain Comparative Analysis Data ──────────────────────────────

export interface ComparativeParameter {
  id: string;
  category: string;
  parameter: string;
  heart: {
    title: string;
    details: string;
    metric?: string;
  };
  brain: {
    title: string;
    details: string;
    metric?: string;
  };
  clinicalTakeaway: string;
}

export const heartBrainComparisonData: ComparativeParameter[] = [
  {
    id: "function",
    category: "Primary Function",
    parameter: "Core Physiological Role",
    heart: {
      title: "Hydraulic Fluid Pumping Engine",
      details: "Performs relentless mechanical work generating hydrostatic pressure gradients to circulate oxygenated blood, nutrients, hormones, and immune factors to all tissues.",
      metric: "~7,200 L/day pumped",
    },
    brain: {
      title: "Central Neural Processing Unit",
      details: "Processes multimodal sensory inputs, orchestrates conscious thoughts, long-term memory encoding, emotional homeostasis, executive motor control, and involuntary visceral autonomy.",
      metric: "~100 trillion synaptic calculations/sec",
    },
    clinicalTakeaway: "The heart keeps the brain perfused; 10 seconds of cardiac arrest causes brain syncope, and 4–6 minutes causes irreversible cortical necrosis.",
  },
  {
    id: "cellular",
    category: "Cellular Architecture",
    parameter: "Dominant Cell Types & Syncytium",
    heart: {
      title: "Cardiomyocytes & Intercalated Discs",
      details: "Branched, mononucleated striated cardiac myocytes interconnected end-to-end by intercalated discs with gap junctions, creating a functional electrical syncytium.",
      metric: "~2–3 billion myocytes",
    },
    brain: {
      title: "Neurons & Glial Network",
      details: "Polarized neurons with dendritic trees and elongated axons supported 1:1 by astrocytes, oligodendrocytes, ependymal cells, and resident microglia immune cells.",
      metric: "~86 billion neurons + 85 billion glia",
    },
    clinicalTakeaway: "Cardiac syncytium allows all-or-none coordinated muscular contraction, whereas neural networks operate via discrete synaptic plasticity and chemical neurotransmitters.",
  },
  {
    id: "electrical",
    category: "Electrophysiology",
    parameter: "Pacemaker Automaticity vs Synaptic Firing",
    heart: {
      title: "Intrinsic Automaticity (SA Node)",
      details: "Spontaneous Phase 4 pacemaker depolarization via If ('funny') channels in the sinoatrial node produces autorhythmic contractions without CNS innervation.",
      metric: "60–100 beats/min autorhythm",
    },
    brain: {
      title: "Synaptic Summation & Action Potentials",
      details: "Graded postsynaptic potentials (EPSPs/IPSPs) summate at axon hillocks to generate all-or-none voltage-gated Na+/K+ action potentials propagating across neural circuits.",
      metric: "Up to 500–1000 impulses/sec",
    },
    clinicalTakeaway: "A denervated transplanted heart continues to beat on its own; a brain severed from circulation dies almost immediately.",
  },
  {
    id: "metabolic",
    category: "Metabolism & Substrate",
    parameter: "Fuel Preference & Oxygen Demand",
    heart: {
      title: "Fatty Acid Beta-Oxidation Omnivore",
      details: "Consumes 60–70% free fatty acids at rest, with remarkable flexibility to burn lactate, glucose, ketone bodies, and pyruvate aerobically.",
      metric: "35% cell volume is mitochondria",
    },
    brain: {
      title: "Obligate Glucose & Ketone Consumer",
      details: "Strict dependence on continuous blood glucose (~120 g/day), shifting to beta-hydroxybutyrate and acetoacetate only during prolonged starvation.",
      metric: "Consumes 20% total body glucose & O₂",
    },
    clinicalTakeaway: "Hypoglycemia rapidly impairs cognitive alertness and causes coma, while cardiac muscle can sustain ATP generation using fatty acids and lactate.",
  },
  {
    id: "regeneration",
    category: "Regenerative Capacity",
    parameter: "Post-Injury Mitotic Potential",
    heart: {
      title: "Extremely Low (~1% per year turnover)",
      details: "Adult human cardiomyocytes are terminally differentiated post-mitotic cells. Necrotic tissue following myocardial infarction heals predominantly via non-contractile collagenous fibrotic scar.",
      metric: "< 1% myocyte renewal/yr",
    },
    brain: {
      title: "Restricted Adult Neurogenesis",
      details: "Limited neurogenesis in the subventricular zone (SVZ) and hippocampal subgranular zone (SGZ). Ischemic infarction triggers reactive astrogliosis and permanent cystic encephalomalacia.",
      metric: "Minimal functional neuronal replacement",
    },
    clinicalTakeaway: "Both organs are post-mitotic; prevention of ischemic damage (primary prevention and rapid revascularization) is paramount.",
  },
  {
    id: "ischemia",
    category: "Clinical Emergency",
    parameter: "Ischemic Vulnerability & Time Windows",
    heart: {
      title: "Acute Myocardial Infarction (STEMI)",
      details: "Coronary thrombosis causes transmural ischemia. Door-to-balloon percutaneous coronary intervention (PCI) target is < 90 minutes ('Time is Muscle').",
      metric: "PCI window: ≤ 90 minutes",
    },
    brain: {
      title: "Acute Ischemic Stroke (CVA)",
      details: "Cerebral arterial occlusion causes central ischemic core with surrounding salvageable penumbra. Intravenous thrombolytic (tPA) window is ≤ 4.5 hours ('Time is Brain').",
      metric: "tPA window: ≤ 4.5 hours",
    },
    clinicalTakeaway: "Both conditions represent atherosclerotic emergencies where rapid emergency endovascular or pharmacological reperfusion saves millions of cells.",
  },
];

// ── Microscopic Tissue / Histology Data ────────────────────────────────────

export interface HistologyStructure {
  id: string;
  name: string;
  latinName?: string;
  magnification: string;
  description: string;
  significance: string;
  tag: string;
  color: string;
}

export const cardiacHistologyStructures: HistologyStructure[] = [
  {
    id: "intercalated-discs",
    name: "Intercalated Discs & Junctional Complexes",
    latinName: "Discus intercalatus",
    magnification: "400x – 1000x",
    description: "Step-like specialized transverse boundaries between adjacent cardiomyocytes composed of three distinct junctional specializations: fascia adherens (anchoring actin microfilaments), macula adherens / desmosomes (providing high tensile strength against ripping), and gap junctions (connexin-43 hemichannels).",
    significance: "Provides mechanical anchorage during violent systolic contraction while gap junctions allow rapid ionic electrotonic current flow, turning millions of cells into a unified syncytium.",
    tag: "Syncytial Coupling",
    color: "#e11d48",
  },
  {
    id: "branching-fibers",
    name: "Branching Striated Cardiomyocytes",
    latinName: "Myocytus cardiacus",
    magnification: "100x – 400x",
    description: "Cylindrical cells 80–100 μm long and 15–20 μm wide that branch and anastomose in a complex 3D helical latticework, wrapped in delicate endomysial connective tissue rich in capillaries.",
    significance: "Helical fiber alignment causes a 'wringing' or torsional twisting contraction from apex to base, maximizing ejection fraction up to 55–70%.",
    tag: "Helical Torsion",
    color: "#f59e0b",
  },
  {
    id: "sarcomere",
    name: "Sarcomeres & Cross-Striations",
    latinName: "Sarcomera",
    magnification: "400x – 1000x",
    description: "The basic contractile unit extending from Z-disc to Z-disc (~2.0–2.4 μm resting length). Comprises thick overlapping myosin filaments and thin actin/tropomyosin/troponin filaments.",
    significance: "Follows the Frank-Starling Law: optimal sarcomere stretch increases troponin C calcium sensitivity, producing stronger contractions with increased venous return.",
    tag: "Frank-Starling Mechanism",
    color: "#10b981",
  },
  {
    id: "mitochondria",
    name: "Dense Cristae Mitochondria",
    latinName: "Mitochondrium",
    magnification: "1000x (TEM)",
    description: "Abundant, giant mitochondria packed tightly between myofibrils, accounting for 35–40% of the entire cardiomyocyte intracellular volume.",
    significance: "Prevents muscular fatigue by generating relentless ATP via oxidative phosphorylation, ensuring the heart never incurs significant oxygen debt under normal conditions.",
    tag: "High Aerobic Capacity",
    color: "#06b6d4",
  },
  {
    id: "nucleus",
    name: "Centrally Placed Oval Nucleus",
    latinName: "Nucleus myocyti",
    magnification: "200x – 400x",
    description: "Unlike skeletal muscle fibers which possess multiple peripheral nuclei, cardiomyocytes feature one (or occasionally two) large, centrally situated pale-staining oval nuclei surrounded by a juxtanuclear Golgi zone.",
    significance: "Distinctive histological hallmark distinguishing cardiac muscle from skeletal muscle (multinucleated peripheral) and smooth muscle (spindle-shaped mononucleated).",
    tag: "Histological Key Marker",
    color: "#8b5cf6",
  },
  {
    id: "t-tubule-dyad",
    name: "T-Tubules & Sarcoplasmic Dyads",
    latinName: "Systema tubulorum T",
    magnification: "1000x (Ultrastructure)",
    description: "Wide invaginations of the sarcolemma located at Z-lines (larger than skeletal muscle T-tubules) that associate with a single terminal cisterna of the sarcoplasmic reticulum to form dyads.",
    significance: "Enables rapid propagation of the L-type Ca2+ channel inward current, triggering massive Calcium-Induced Calcium Release (CICR) via RyR2 receptors.",
    tag: "Excitation-Contraction",
    color: "#ec4899",
  },
];

// ── Blood Circulation Pathway Animation Data ───────────────────────────────

export interface CirculationStep {
  step: number;
  name: string;
  latinName: string;
  type: "deoxygenated" | "oxygenated" | "exchange";
  pressure: string;
  oxygenSat: string;
  valveAction: string;
  chamberState: string;
  description: string;
  color: string;
}

export const circulationSteps: CirculationStep[] = [
  {
    step: 1,
    name: "Systemic Venous Return into Right Atrium",
    latinName: "Atrium dextrum",
    type: "deoxygenated",
    pressure: "2 – 8 mmHg (Central Venous Pressure)",
    oxygenSat: "75% SpO₂",
    valveAction: "Tricuspid valve opens in diastole",
    chamberState: "Atrial diastole filling, followed by atrial systole kick (adds 20% volume)",
    description: "Dark, deoxygenated blood returning from bodily tissues flows through the Superior Vena Cava, Inferior Vena Cava, and Coronary Sinus into the thin-walled Right Atrium.",
    color: "#1e3a8a",
  },
  {
    step: 2,
    name: "Tricuspid Flow into Right Ventricle",
    latinName: "Ventriculus dexter",
    type: "deoxygenated",
    pressure: "Peak systole: 20 – 25 mmHg, Diastole: 0 – 5 mmHg",
    oxygenSat: "75% SpO₂",
    valveAction: "Tricuspid closes (S1 sound), Pulmonary valve snaps open",
    chamberState: "Isovolumetric contraction followed by rapid ejection into the pulmonary trunk",
    description: "Blood crosses the tricuspid valve into the crescent-shaped Right Ventricle. Ventricular systole builds pressure to overcome the low resistance of the pulmonary arterial bed.",
    color: "#2563eb",
  },
  {
    step: 3,
    name: "Pulmonary Arterial Transit to Lungs",
    latinName: "Truncus & Arteriae pulmonales",
    type: "deoxygenated",
    pressure: "25/10 mmHg (Mean: ~15 mmHg)",
    oxygenSat: "75% SpO₂",
    valveAction: "Pulmonary valve prevents backflow into RV during diastole",
    chamberState: "Arterial systolic pulse wave traveling into branching lobar and segmental arteries",
    description: "The pulmonary trunk divides at the carina into right and left pulmonary arteries, carrying venous blood into the pulmonary capillary network surrounding millions of alveoli.",
    color: "#3b82f6",
  },
  {
    step: 4,
    name: "Alveolar Microcapillary Gas Exchange",
    latinName: "Capillaria alveolaria",
    type: "exchange",
    pressure: "Capillary hydrostatic pressure: ~8 – 10 mmHg",
    oxygenSat: "Rapid rise from 75% to 99% SpO₂",
    valveAction: "Microvascular laminar diffusion across blood-air barrier (0.2–0.5 μm)",
    chamberState: "Passive diffusion of CO₂ out into alveoli, O₂ binding to hemoglobin heme groups",
    description: "Red blood cells pass single-file through pulmonary capillaries. Dissolved CO₂ diffuses across the thin respiratory membrane into expired air, while fresh O₂ saturates hemoglobin.",
    color: "#06b6d4",
  },
  {
    step: 5,
    name: "Pulmonary Venous Return to Left Atrium",
    latinName: "Venae pulmonales & Atrium sinistrum",
    type: "oxygenated",
    pressure: "4 – 12 mmHg (Left Atrial Pressure)",
    oxygenSat: "98 – 100% SpO₂",
    valveAction: "Mitral (Bicuspid) valve opens widely",
    chamberState: "Passive ventricular rapid filling phase (70–80% LV filling)",
    description: "Four pulmonary veins deliver freshly oxygenated, bright scarlet blood into the smooth-walled Left Atrium, which conducts blood across the mitral valve into the left ventricle.",
    color: "#ea580c",
  },
  {
    step: 6,
    name: "Left Ventricular High-Pressure Systole",
    latinName: "Ventriculus sinister",
    type: "oxygenated",
    pressure: "Systolic: 120 mmHg, End-diastolic: 8 – 12 mmHg",
    oxygenSat: "98 – 100% SpO₂",
    valveAction: "Mitral valve snaps shut (S1 sound), Aortic valve blasts open",
    chamberState: "Powerful helical myocardial shortening generating high systemic hydrostatic pressure",
    description: "The thick-walled left ventricle generates immense force, ejecting a stroke volume of ~70 mL across the open aortic valve into the ascending aorta at speeds exceeding 1.2 m/s.",
    color: "#dc2626",
  },
  {
    step: 7,
    name: "Aortic Arch & Systemic Arterial Distribution",
    latinName: "Aorta & Circulatio systemica",
    type: "oxygenated",
    pressure: "Systolic: 120 mmHg, Diastolic: 80 mmHg (Windkessel effect)",
    oxygenSat: "98 – 100% SpO₂",
    valveAction: "Aortic valve closes sharply (S2 sound component), Coronary arteries perfuse in diastole",
    chamberState: "Elastic arterial recoil (Windkessel) maintaining continuous capillary perfusion throughout diastole",
    description: "Oxygen-rich blood surges through the carotid, subclavian, mesenteric, and femoral arterial trees, feeding every vital organ before returning via the venous capillary network.",
    color: "#b91c1c",
  },
];

// ── Common Clinical Conditions Data ─────────────────────────────────────────

export interface ClinicalCondition {
  id: string;
  name: string;
  subtitle: string;
  category: "Ischemic" | "Arrhythmic" | "Structural" | "Valvular" | "Inflammatory";
  prevalence: string;
  mortality: string;
  pathophysiology: string;
  hallmarkSymptoms: string[];
  diagnosticGoldStandard: string;
  ecgFindings: string;
  acuteTreatment: string;
  clinicalPearls: string[];
  severityColor: string;
}

export const clinicalConditions: ClinicalCondition[] = [
  {
    id: "myocardial-infarction",
    name: "Acute Myocardial Infarction (STEMI / NSTEMI)",
    subtitle: "Acute Coronary Syndrome (ACS)",
    category: "Ischemic",
    prevalence: "~805,000 cases/year in the USA alone",
    mortality: "5–10% in-hospital; up to 30% 30-day if untreated",
    pathophysiology: "Atheromatous plaque erosion or rupture in a coronary artery triggers platelet adhesion, activation, and thrombosis, resulting in total or near-total coronary lumen occlusion and transmural myocardial necrosis within 20–30 minutes.",
    hallmarkSymptoms: [
      "Crushing substernal chest pressure radiating to left arm, neck, or jaw ('Levine's sign')",
      "Diaphoresis (profuse cold sweating) & sudden dyspnea",
      "Nausea, lightheadedness, and profound sense of impending doom",
      "Atypical presentation in women, diabetics, and elderly (fatigue, epigastric discomfort, silent ischemia)",
    ],
    diagnosticGoldStandard: "Emergency 12-lead ECG within 10 minutes + High-Sensitivity Cardiac Troponin I/T (hs-cTn) elevation above 99th percentile.",
    ecgFindings: "STEMI: ST-segment elevation ≥ 1 mm in ≥ 2 contiguous leads, reciprocal ST depression in opposite leads, progressive Q waves, and T-wave inversion.",
    acuteTreatment: "Immediate Primary Percutaneous Coronary Intervention (PCI) within 90 minutes of medical contact ('Door-to-Balloon'). Dual antiplatelet therapy (Aspirin + P2Y12 inhibitor), Heparin, Nitrates, and Beta-blockers.",
    clinicalPearls: [
      "Time is Muscle: Myocardial salvage drops precipitously after 6 hours of ischemia.",
      "Right Ventricular Infarction (frequent in inferior STEMI/RCA occlusion) requires IV fluids; nitrates and diuretics are strictly contraindicated as they cause fatal hypotension.",
      "New Left Bundle Branch Block (LBBB) in the setting of acute chest pain is clinically considered a STEMI equivalent until proven otherwise.",
    ],
    severityColor: "#dc2626",
  },
  {
    id: "heart-failure",
    name: "Congestive Heart Failure (HFrEF & HFpEF)",
    subtitle: "Cardiac Decompensation Syndrome",
    category: "Structural",
    prevalence: "> 64 million individuals worldwide",
    mortality: "~50% 5-year mortality after initial diagnosis",
    pathophysiology: "Complex clinical syndrome resulting from structural or functional impairment of ventricular filling (HFpEF, EF ≥ 50%) or ejection (HFrEF, EF ≤ 40%), leading to elevated intracardiac pressures and inadequate systemic perfusion at rest or during stress.",
    hallmarkSymptoms: [
      "Paroxysmal Nocturnal Dyspnea (PND) & Orthopnea requiring multiple pillows",
      "Bilateral pitting peripheral edema in ankles and lower extremities",
      "Jugular Venous Distension (JVD) & Hepatojugular reflux",
      "Pulmonary rales (crackles) on lung auscultation and third heart sound (S3 gallop)",
    ],
    diagnosticGoldStandard: "Transthoracic Echocardiogram (TTE) for Left Ventricular Ejection Fraction (LVEF) + elevated serum B-type Natriuretic Peptide (BNP > 100 pg/mL or NT-proBNP > 300 pg/mL).",
    ecgFindings: "Left ventricular hypertrophy with strain pattern, broad notched P waves (left atrial enlargement), intraventricular conduction delays, or prior Q-wave infarctions.",
    acuteTreatment: "Guideline-Directed Medical Therapy (GDMT): 'The 4 Pillars' — SGLT2 inhibitors, ARNI (Sacubitril/Valsartan), Beta-blockers (Carvedilol/Metoprolol succinate), and Mineralocorticoid Receptor Antagonists (Spironolactone). Loop diuretics (Furosemide) for symptomatic volume overload.",
    clinicalPearls: [
      "BNP is synthesized and secreted by ventricular myocytes in direct response to increased wall tension and volume stretch.",
      "An S3 gallop represents rapid passive ventricular filling into a stiff or volume-overloaded ventricle — highly specific for decompensated systolic heart failure.",
      "Patients with LVEF ≤ 35% on optimal medical therapy are candidates for an Implantable Cardioverter-Defibrillator (ICD) for sudden death prevention.",
    ],
    severityColor: "#f59e0b",
  },
  {
    id: "atrial-fibrillation",
    name: "Atrial Fibrillation (AFib)",
    subtitle: "Supraventricular Tachyarrhythmia",
    category: "Arrhythmic",
    prevalence: "Most common sustained cardiac arrhythmia (~33 million globally)",
    mortality: "Increases risk of ischemic thromboembolic stroke 5-fold",
    pathophysiology: "Disorganized, chaotic atrial depolarization at rates of 400–600 bpm originating predominantly from ectopic pacemaker foci within the pulmonary vein sleeves. The AV node filters these irregular impulses, resulting in an irregularly irregular ventricular rhythm.",
    hallmarkSymptoms: [
      "Rapid, irregular heart palpitations ('flip-flopping' in the chest)",
      "Exercise intolerance, generalized fatigue, and syncope/presyncope",
      "Dyspnea, dizziness, and mild angina from reduced diastolic filling time",
      "Often entirely asymptomatic ('silent AFib') discovered incidentally on routine pulse checks",
    ],
    diagnosticGoldStandard: "12-lead ECG or Holter telemetry recording demonstrating ≥ 30 seconds of characteristic irregularly irregular rhythm with absent P waves.",
    ecgFindings: "Absent discrete P waves, replaced by fine or coarse fibrillatory 'f' waves with completely irregular R-R intervals ('irregularly irregular').",
    acuteTreatment: "Hemodynamically unstable: Immediate Synchronized Direct-Current Cardioversion. Stable: Rate control (Beta-blockers, Diltiazem) vs Rhythm control (Amiodarone, Flecainide) + Systemic Anticoagulation (DOAC: Apixaban, Rivaroxaban) calculated via CHA₂DS₂-VASc score.",
    clinicalPearls: [
      "Stasis of uncoordinated blood flow in the left atrial appendage (LAA) causes thrombus formation; 90% of stroke-causing emboli originate in the LAA.",
      "Cardioversion without at least 3 weeks of therapeutic anticoagulation or a transesophageal echo (TEE) confirming absence of LAA thrombus carries severe stroke risk.",
      "Catheter ablation targeting pulmonary vein isolation (PVI) provides superior long-term sinus rhythm maintenance in symptomatic paroxysmal AFib.",
    ],
    severityColor: "#8b5cf6",
  },
  {
    id: "aortic-stenosis",
    name: "Aortic Valve Stenosis (AS)",
    subtitle: "Degenerative Calcific Valvular Disease",
    category: "Valvular",
    prevalence: "~2–7% of adults aged > 65 years",
    mortality: "> 50% 2-year mortality once cardinal symptoms develop without intervention",
    pathophysiology: "Progressive fibrocalcific remodeling of aortic valve leaflets (or congenital bicuspid valve) causing severe narrowing of the valve orifice (normal 3–4 cm² reducing to < 1.0 cm²), producing chronic LV pressure overload, concentric LV hypertrophy, and eventual systolic failure.",
    hallmarkSymptoms: [
      "The Classic Symptom Triad: Dyspnea/Heart Failure (worst prognosis), Syncope (on exertion), and Angina ('SAD' triad)",
      "Pulsus parvus et tardus (weak, delayed carotid pulse upstroke)",
      "Harsh crescendo-decrescendo systolic ejection murmur loudest at right 2nd intercostal space, radiating to carotids",
      "Soft or absent second heart sound (S2) due to immobile calcified leaflets",
    ],
    diagnosticGoldStandard: "Transthoracic Doppler Echocardiography: Peak aortic jet velocity ≥ 4.0 m/s, Mean pressure gradient ≥ 40 mmHg, Aortic valve area ≤ 1.0 cm².",
    ecgFindings: "Pronounced Left Ventricular Hypertrophy (Sokolow-Lyon criteria: S in V1 + R in V5/V6 > 35 mm) with lateral ST-T wave strain patterns.",
    acuteTreatment: "Definitive intervention: Transcatheter Aortic Valve Replacement (TAVR) or Surgical Aortic Valve Replacement (SAVR). Medical therapy cannot halt mechanical progression; vasodilators must be used with extreme caution to prevent circulatory collapse.",
    clinicalPearls: [
      "Once cardinal symptoms manifest (Angina: 5-year survival, Syncope: 3-year survival, Dyspnea/HF: 2-year survival), valve replacement is urgent.",
      "Bicuspid aortic valve is the most common congenital heart anomaly (1–2% population) and accelerates severe stenosis presentation by 2–3 decades (ages 40–60).",
      "Heyde's Syndrome: The triad of aortic stenosis, acquired von Willebrand syndrome (shear-stress cleaving vWF multimers), and bleeding from gastrointestinal angiodysplasias.",
    ],
    severityColor: "#10b981",
  },
  {
    id: "coronary-atherosclerosis",
    name: "Coronary Artery Disease & Atherosclerosis",
    subtitle: "Chronic Ischemic Heart Disease",
    category: "Ischemic",
    prevalence: "Leading cause of death worldwide (~9 million deaths/year)",
    mortality: "High lifelong morbidity; leading contributor to heart failure and sudden cardiac death",
    pathophysiology: "Chronic lipid-driven, inflammatory vascular wall disease. Subendothelial retention of apolipoprotein B-containing lipoproteins (LDL) triggers endothelial injury, leukocyte recruitment, foam cell accumulation, fatty streak formation, fibrous cap remodeling, and eventual arterial lumen stenosis.",
    hallmarkSymptoms: [
      "Stable Angina: Predictable retrosternal chest tightness precipitated by physical exertion or emotional stress, relieved within minutes by rest or sublingual nitroglycerin",
      "Exertional dyspnea (angina equivalent)",
      "Decreased exercise tolerance and postprandial angina",
    ],
    diagnosticGoldStandard: "Coronary Computed Tomography Angiography (CCTA) / Invasive Coronary Angiography (ICA) with Fractional Flow Reserve (FFR ≤ 0.80).",
    ecgFindings: "Resting ECG is often completely normal. Exercise stress testing reveals exertional horizontal or downsloping ST-segment depression ≥ 1 mm.",
    acuteTreatment: "Aggressive secondary prevention: High-intensity statin (Atorvastatin 80mg) to lower LDL-C < 55 mg/dL, Aspirin 81mg, ACE inhibitors, and lifestyle optimization. Percutaneous coronary intervention (PCI) with drug-eluting stents (DES) or Coronary Artery Bypass Graft (CABG) for multivessel/left main disease.",
    clinicalPearls: [
      "Vulnerable plaque with a thin fibrous cap (< 65 μm), large necrotic lipid core, and heavy macrophage infiltration is far more likely to rupture than dense calcified stable lesions.",
      "Coronary Artery Calcium (CAC) score on non-contrast CT is the strongest predictor of future atherosclerotic cardiovascular events.",
      "The 'Widowmaker' lesion refers to critical stenosis of the proximal Left Anterior Descending (LAD) artery, which perfuses roughly 50% of the entire left ventricular myocardium.",
    ],
    severityColor: "#ea580c",
  },
  {
    id: "acute-pericarditis",
    name: "Acute Pericarditis & Cardiac Tamponade",
    subtitle: "Inflammation of the Pericardial Sac",
    category: "Inflammatory",
    prevalence: "~27.7 cases per 100,000 person-years",
    mortality: "Pericarditis has low mortality (< 1%); untreated Cardiac Tamponade is 100% fatal",
    pathophysiology: "Inflammation of the fibroserous pericardial sac (viral, post-MI Dressler's syndrome, uremic, autoimmune). Exudative pericardial effusion can accumulate rapidly, exceeding pericardial compliance and compressing cardiac chambers (Cardiac Tamponade).",
    hallmarkSymptoms: [
      "Sharp, pleuritic retrosternal chest pain that worsens when lying supine and improves markedly upon sitting upright and leaning forward",
      "Pericardial friction rub on auscultation (scratchy, high-pitched superficial sound)",
      "Beck's Triad (Cardiac Tamponade): Hypotension, Jugular Venous Distension, and Muffled Heart Sounds",
      "Pulsus paradoxus: Exaggerated drop in systolic blood pressure (> 10 mmHg) during inspiration",
    ],
    diagnosticGoldStandard: "Clinical diagnostic criteria (at least 2 of 4): Characteristic pleuritic pain, friction rub, widespread concave ST elevation, and new/worsening pericardial effusion on Echocardiogram.",
    ecgFindings: "Stage 1: Widespread, diffuse concave ST-segment elevation with reciprocal PR-segment depression across all leads except aVR and V1 (PR elevation in aVR is pathognomonic).",
    acuteTreatment: "Uncomplicated Pericarditis: High-dose NSAIDs (Ibuprofen 600–800mg TID) + Colchicine (0.5mg BID for 3 months to prevent recurrence). Cardiac Tamponade: Emergency Pericardiocentesis or surgical pericardial window.",
    clinicalPearls: [
      "PR segment depression is the earliest and most specific electrocardiographic sign of acute viral pericarditis.",
      "Unlike myocardial infarction, acute pericarditis produces diffuse concave ST elevations without localized territorial vascular distribution and without reciprocal ST depression (except in aVR).",
      "Never give anticoagulants to patients with acute pericarditis as it can cause fatal hemorrhagic transformation into hemopericardium and rapid tamponade.",
    ],
    severityColor: "#06b6d4",
  },
];

// ── AI Anatomy Assistant Presets ───────────────────────────────────────────

export interface AiPromptPreset {
  id: string;
  title: string;
  query: string;
  category: string;
}

export const aiAnatomyPresets: AiPromptPreset[] = [
  {
    id: "conduction-pathway",
    title: "Conduction Pathway",
    query: "Explain the precise electrical conduction pathway of the heart from the SA node to the Purkinje fibers, and how the AV node creates a physiological delay.",
    category: "Electrophysiology",
  },
  {
    id: "valves-mechanism",
    title: "Valve Mechanisms",
    query: "How do the atrioventricular and semilunar valves mechanically prevent retrograde blood regurgitation under high systolic pressures?",
    category: "Biomechanics",
  },
  {
    id: "mi-cellular",
    title: "Myocardial Infarction",
    query: "Walk me through the cellular and biochemical cascade that occurs in ventricular cardiomyocytes when a coronary artery is acutely occluded.",
    category: "Pathology",
  },
  {
    id: "heart-vs-brain",
    title: "Heart vs Brain Metabolism",
    query: "Compare the metabolic fuel preferences and ischemic tolerances between cardiac myocytes and cortical neurons.",
    category: "Metabolism",
  },
  {
    id: "histology-intercalated",
    title: "Intercalated Discs",
    query: "Explain the ultrastructure of intercalated discs, specifically detailing the roles of fascia adherens, desmosomes, and connexin-43 gap junctions.",
    category: "Histology",
  },
  {
    id: "wiggers-cycle",
    title: "Wiggers Cardiac Cycle",
    query: "Describe the correlation between the ECG waveform (P-Q-R-S-T), ventricular pressure curves, and heart sounds (S1, S2, S3, S4).",
    category: "Physiology",
  },
];

