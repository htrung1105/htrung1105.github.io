export const site = {
  name: 'Nguyen Le Hoang Trung',
  displayName: 'Hoang Trung',
  role: 'AI Engineer · AI Researcher',
  location: 'Ho Chi Minh City, Vietnam',
  email: 'nguyenlehoangtrung1105@gmail.com',
  phone: '+84 384 317 014',
  github: 'https://github.com/htrung1105',
  linkedin: 'https://www.linkedin.com/in/nguy%E1%BB%85n-trung-398283144/',
  linkedinName: 'Nguyen Trung',
  url: 'https://htrung1105.github.io',
  tagline: 'builds retrieval systems.',
  blurb:
    'Third-year Artificial Intelligence undergraduate at VNU-HCM, working on multimodal retrieval, large language models, and OCR — from research prototype through to FastAPI deployment.',
  stats: [
    { value: '7.4M', label: 'legal articles indexed' },
    { value: '+30.2%', label: 'OCR H-mean gain' },
    { value: 'Top 12', label: 'AI Challenge HCMC' },
  ],
} as const;

export const postCategoryLabels = {
  project: 'Project',
  paper: 'Paper',
  career: 'Career',
} as const;

export type Site = typeof site;
