export const site = {
  name: 'Nguyen Le Hoang Trung',
  displayName: 'Hoang Trung',
  role: 'AI Engineer',
  location: 'Ho Chi Minh City, Vietnam',
  email: 'nguyenlehoangtrung1105@gmail.com',
  phone: '+84 384 317 014',
  github: 'https://github.com/htrung1105',
  linkedin: 'https://www.linkedin.com/in/trungnlh/',
  linkedinName: 'trungnlh',
  orcid: 'https://orcid.org/0009-0008-0343-2577',
  url: 'https://htrung1105.github.io',
  blurb:
    'Final-year Artificial Intelligence student at VNU-HCM University of Science, passionate about Information Retrieval and Multimodal AI (NLP + CV). I build RAG/GraphRAG chatbots, multimodal retrieval and document OCR pipelines.',
  badges: ['B.Sc. AI @ HCMUS', 'SOICT 2025', 'ICPC South 2024'],
  stats: [
    { value: '353K+', label: 'legal documents in a Neo4j graph' },
    { value: '0.952', label: 'Sino-Nom OCR H-mean' },
    { value: 'Top 12', label: 'of 80+ teams, AI Challenge HCMC 2025' },
  ],
  awards: [
    { title: 'Best Presentation Award', org: 'SOICT 2025', note: 'KPTER: K-Pointer for Temporal Event Retrieval' },
    { title: 'Top 12 / 80+ teams', org: 'AI Challenge HCMC 2025', note: 'Preliminary score 82/88' },
    { title: '2nd Prize', org: 'ICPC Southern Region 2024', note: 'Contestant at the ICPC Vietnam National round 2024' },
    { title: 'Consolation Prize', org: 'Vietnamese National Informatics Olympiad (VOI) 2023', note: '' },
  ],
  // Dates only as precise as the CV states them; newest first.
  timeline: [
    { date: 'Apr 2026', text: 'Started Vietnamese Legal GraphRAG and TradingClaw as AI / Backend Engineer.', href: '/work/vietlegal-graphrag' },
    { date: '2026', text: 'Completed DeepLearning.AI courses: Agentic AI, Data Analytics Foundations, Linear Algebra for ML.', href: '/certificates' },
    { date: 'Nov 2025', text: 'Fine-tuned PP-OCRv5 for Sino-Nom pages: H-mean 0.731 → 0.952.', href: '/work/sino-nom-ocr' },
    { date: '2025', text: 'Best Presentation Award at SOICT 2025 for KPTER (Springer CCIS).', href: '/publications' },
    { date: '2025', text: 'Top 12 of 80+ teams at AI Challenge HCMC 2025 (preliminary score 82/88).', href: '/work/kpter' },
    { date: 'Jul 2024', text: 'Joined Team WATLERE to build the KPTER video retrieval system.', href: '/work/kpter' },
    { date: '2024', text: '2nd Prize, ICPC Southern Region; contestant at the ICPC Vietnam National round.' },
    { date: '2023', text: 'Started a B.Sc. in Artificial Intelligence at University of Science, VNU-HCM.' },
    { date: '2023', text: 'Consolation Prize, Vietnamese National Informatics Olympiad (VOI).' },
  ],
  // Add a `url` to an entry once there is a public verification link.
  certifications: [
    { title: 'English B2 (VSTEP)', issuer: 'VSTEP', year: '', url: '' },
    { title: 'Agentic AI', issuer: 'DeepLearning.AI', year: '2026', url: '' },
    { title: 'Data Analytics Foundations', issuer: 'DeepLearning.AI', year: '2026', url: '' },
    { title: 'Linear Algebra for Machine Learning', issuer: 'DeepLearning.AI', year: '2026', url: '' },
  ],
} as const;

export const postCategoryLabels = {
  project: 'Project',
  paper: 'Paper',
  career: 'Career',
} as const;

export type Site = typeof site;
