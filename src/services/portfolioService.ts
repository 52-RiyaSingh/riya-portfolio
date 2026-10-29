import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  writeBatch,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Profile,
  SkillGroup,
  Project,
  Education,
  Training,
  Certification,
  ContactMessage,
} from '../types/portfolio';
import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_EDUCATION,
  INITIAL_TRAINING,
  INITIAL_CERTIFICATIONS,
} from '../constants/initialData';
import { generateSafeId } from '../utils/portfolioLogic';

// --- PROFILE ---
export async function getProfile(): Promise<Profile> {
  const path = 'profile/main';
  try {
    const docRef = doc(db, 'profile', 'main');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Profile;
    }
    return INITIAL_PROFILE;
  } catch (error) {
    console.warn('Could not read remote profile, falling back to initial data:', error);
    return INITIAL_PROFILE;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  const path = 'profile/main';
  try {
    const docRef = doc(db, 'profile', 'main');
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- SKILLS ---
export async function getSkills(isAdmin = false): Promise<SkillGroup[]> {
  const path = 'skills';
  try {
    const colRef = collection(db, path);
    const q = isAdmin ? query(colRef, orderBy('order', 'asc')) : query(colRef, where('published', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as SkillGroup));
    }
    return INITIAL_SKILLS;
  } catch (error) {
    console.warn('Could not read remote skills, falling back to initial data:', error);
    return INITIAL_SKILLS;
  }
}

export async function saveSkill(skill: SkillGroup): Promise<void> {
  const path = `skills/${skill.id}`;
  try {
    const docRef = doc(db, 'skills', skill.id);
    await setDoc(docRef, skill);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const path = `skills/${id}`;
  try {
    await deleteDoc(doc(db, 'skills', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- PROJECTS ---
export async function getProjects(isAdmin = false): Promise<Project[]> {
  const path = 'projects';
  try {
    const colRef = collection(db, path);
    const q = isAdmin ? query(colRef, orderBy('order', 'asc')) : query(colRef, where('published', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Project));
    }
    return INITIAL_PROJECTS;
  } catch (error) {
    console.warn('Could not read remote projects, falling back to initial data:', error);
    return INITIAL_PROJECTS;
  }
}

export async function saveProject(project: Project): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    const docRef = doc(db, 'projects', project.id);
    await setDoc(docRef, {
      ...project,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProject(id: string): Promise<void> {
  const path = `projects/${id}`;
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- EDUCATION ---
export async function getEducation(isAdmin = false): Promise<Education[]> {
  const path = 'education';
  try {
    const colRef = collection(db, path);
    const q = isAdmin ? query(colRef, orderBy('order', 'asc')) : query(colRef, where('published', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Education));
    }
    return INITIAL_EDUCATION;
  } catch (error) {
    console.warn('Could not read remote education, falling back to initial data:', error);
    return INITIAL_EDUCATION;
  }
}

export async function saveEducation(edu: Education): Promise<void> {
  const path = `education/${edu.id}`;
  try {
    const docRef = doc(db, 'education', edu.id);
    await setDoc(docRef, edu);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteEducation(id: string): Promise<void> {
  const path = `education/${id}`;
  try {
    await deleteDoc(doc(db, 'education', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- TRAINING ---
export async function getTrainings(isAdmin = false): Promise<Training[]> {
  const path = 'trainings';
  try {
    const colRef = collection(db, path);
    const q = isAdmin ? query(colRef, orderBy('order', 'asc')) : query(colRef, where('published', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Training));
    }
    return INITIAL_TRAINING;
  } catch (error) {
    console.warn('Could not read remote trainings, falling back to initial data:', error);
    return INITIAL_TRAINING;
  }
}

export async function saveTraining(training: Training): Promise<void> {
  const path = `trainings/${training.id}`;
  try {
    const docRef = doc(db, 'trainings', training.id);
    await setDoc(docRef, training);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTraining(id: string): Promise<void> {
  const path = `trainings/${id}`;
  try {
    await deleteDoc(doc(db, 'trainings', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- CERTIFICATIONS ---
export async function getCertifications(isAdmin = false): Promise<Certification[]> {
  const path = 'certifications';
  try {
    const colRef = collection(db, path);
    const q = isAdmin ? query(colRef, orderBy('order', 'asc')) : query(colRef, where('published', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Certification));
    }
    return INITIAL_CERTIFICATIONS;
  } catch (error) {
    console.warn('Could not read remote certifications, falling back to initial data:', error);
    return INITIAL_CERTIFICATIONS;
  }
}

export async function saveCertification(cert: Certification): Promise<void> {
  const path = `certifications/${cert.id}`;
  try {
    const docRef = doc(db, 'certifications', cert.id);
    await setDoc(docRef, cert);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCertification(id: string): Promise<void> {
  const path = `certifications/${id}`;
  try {
    await deleteDoc(doc(db, 'certifications', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- CONTACT MESSAGES ---
export async function sendContactMessage(msg: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const id = generateSafeId('msg');
  const path = `messages/${id}`;
  try {
    const docRef = doc(db, 'messages', id);
    await setDoc(docRef, {
      ...msg,
      id,
      createdAt: new Date().toISOString(),
      read: false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const path = 'messages';
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ContactMessage));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function markMessageRead(id: string, read: boolean): Promise<void> {
  const path = `messages/${id}`;
  try {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { read });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const path = `messages/${id}`;
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- SEED ALL INITIAL DATA ---
export async function seedAllInitialData(): Promise<{ success: boolean; count: number }> {
  try {
    const batch = writeBatch(db);

    // Profile
    const profileRef = doc(db, 'profile', 'main');
    batch.set(profileRef, INITIAL_PROFILE);

    // Skills
    for (const skill of INITIAL_SKILLS) {
      batch.set(doc(db, 'skills', skill.id), skill);
    }

    // Projects
    for (const proj of INITIAL_PROJECTS) {
      batch.set(doc(db, 'projects', proj.id), proj);
    }

    // Education
    for (const edu of INITIAL_EDUCATION) {
      batch.set(doc(db, 'education', edu.id), edu);
    }

    // Trainings
    for (const trn of INITIAL_TRAINING) {
      batch.set(doc(db, 'trainings', trn.id), trn);
    }

    // Certifications
    for (const cert of INITIAL_CERTIFICATIONS) {
      batch.set(doc(db, 'certifications', cert.id), cert);
    }

    await batch.commit();
    return { success: true, count: 1 + INITIAL_SKILLS.length + INITIAL_PROJECTS.length + INITIAL_EDUCATION.length + INITIAL_TRAINING.length + INITIAL_CERTIFICATIONS.length };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
  }
}
