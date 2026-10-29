import { Project } from '../types/portfolio';
import { ADMIN_EMAIL } from '../constants/initialData';

/**
 * Validates whether the given user email and verification status qualify as Admin.
 */
export function isAdminEmail(email: string | null | undefined, emailVerified = true): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && emailVerified;
}

/**
 * Filter items that are marked as published.
 */
export function filterPublished<T extends { published: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.published === true);
}

/**
 * Sort items ascending by their order property.
 */
export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Reorder items moving an item from sourceIndex to destIndex.
 */
export function reorderItems<T extends { order: number }>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
    return items;
  }
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

/**
 * Validate contact message fields before submission.
 */
export function validateContactMessage(
  name: string,
  email: string,
  message: string
): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) {
    return { isValid: false, error: 'Please enter your name.' };
  }
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Name must be 100 characters or fewer.' };
  }

  if (!trimmedEmail) {
    return { isValid: false, error: 'Please enter your email address.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  if (!trimmedMessage) {
    return { isValid: false, error: 'Please enter a message.' };
  }
  if (trimmedMessage.length > 3000) {
    return { isValid: false, error: 'Message must be 3,000 characters or fewer.' };
  }

  return { isValid: true };
}

/**
 * Validate project details.
 */
export function validateProject(project: Partial<Project>): { isValid: boolean; error?: string } {
  if (!project.title || !project.title.trim()) {
    return { isValid: false, error: 'Project title is required.' };
  }
  if (!project.category || !project.category.trim()) {
    return { isValid: false, error: 'Project category is required.' };
  }
  if (!project.description || !project.description.trim()) {
    return { isValid: false, error: 'Project description is required.' };
  }
  if (!project.technologies || project.technologies.length === 0) {
    return { isValid: false, error: 'At least one technology tag is required.' };
  }
  return { isValid: true };
}

/**
 * Generate a safe unique ID matching ^[a-zA-Z0-9_\-]+$
 */
export function generateSafeId(prefix = 'item'): string {
  const rand = Math.random().toString(36).substring(2, 8);
  const time = Date.now().toString(36);
  return `${prefix}-${time}-${rand}`;
}
