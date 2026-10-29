export interface Profile {
  id?: string;
  name: string;
  role: string;
  location: string;
  intro: string;
  about: string;
  email: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  resumeFilename?: string;
  openToWork: boolean;
  openToWorkText: string;
  published: boolean;
  updatedAt?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
  order: number;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  technologies: string[];
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  isFeatured: boolean;
  order: number;
  published: boolean;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  score: string;
  order: number;
  published: boolean;
}

export interface Training {
  id: string;
  title: string;
  organization: string;
  location: string;
  topic: string;
  duration: string;
  year: string;
  order: number;
  published: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  details: string;
  credentialUrl?: string;
  order: number;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface UserAuth {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}
