import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAdminEmail,
  filterPublished,
  sortByOrder,
  reorderItems,
  validateContactMessage,
  validateProject,
  generateSafeId,
} from './portfolioLogic';

test('isAdminEmail identifies singhriya53225@gmail.com with verified email', () => {
  assert.equal(isAdminEmail('singhriya53225@gmail.com', true), true);
  assert.equal(isAdminEmail('SINGHRIYA53225@GMAIL.COM', true), true);
  assert.equal(isAdminEmail('singhriya53225@gmail.com', false), false);
  assert.equal(isAdminEmail('other@example.com', true), false);
  assert.equal(isAdminEmail(null, true), false);
  assert.equal(isAdminEmail(undefined, true), false);
});

test('filterPublished removes unpublished items', () => {
  const items = [
    { id: '1', published: true, name: 'Item 1' },
    { id: '2', published: false, name: 'Item 2' },
    { id: '3', published: true, name: 'Item 3' },
  ];
  const published = filterPublished(items);
  assert.equal(published.length, 2);
  assert.equal(published[0].id, '1');
  assert.equal(published[1].id, '3');
});

test('sortByOrder sorts ascending by order property', () => {
  const items = [
    { id: 'a', order: 3 },
    { id: 'b', order: 1 },
    { id: 'c', order: 2 },
  ];
  const sorted = sortByOrder(items);
  assert.equal(sorted[0].id, 'b');
  assert.equal(sorted[1].id, 'c');
  assert.equal(sorted[2].id, 'a');
});

test('reorderItems shifts element and reassigns 1-based order', () => {
  const items = [
    { id: 'a', order: 1 },
    { id: 'b', order: 2 },
    { id: 'c', order: 3 },
  ];
  const reordered = reorderItems(items, 2, 0); // move 'c' to front
  assert.equal(reordered[0].id, 'c');
  assert.equal(reordered[0].order, 1);
  assert.equal(reordered[1].id, 'a');
  assert.equal(reordered[1].order, 2);
  assert.equal(reordered[2].id, 'b');
  assert.equal(reordered[2].order, 3);
});

test('validateContactMessage checks mandatory inputs and formats', () => {
  const valid = validateContactMessage('John Doe', 'john@example.com', 'Hello Riya!');
  assert.equal(valid.isValid, true);

  const emptyName = validateContactMessage('', 'john@example.com', 'Hello');
  assert.equal(emptyName.isValid, false);

  const invalidEmail = validateContactMessage('John', 'notanemail', 'Hello');
  assert.equal(invalidEmail.isValid, false);

  const emptyMessage = validateContactMessage('John', 'john@example.com', '  ');
  assert.equal(emptyMessage.isValid, false);
});

test('validateProject ensures title, category, description, and technologies exist', () => {
  const valid = validateProject({
    title: 'EventVerse',
    category: 'Academic Project',
    description: 'Booking web platform',
    technologies: ['Java', 'JSP'],
  });
  assert.equal(valid.isValid, true);

  const missingTech = validateProject({
    title: 'EventVerse',
    category: 'Academic Project',
    description: 'Booking web platform',
    technologies: [],
  });
  assert.equal(missingTech.isValid, false);
});

test('generateSafeId produces valid alphanumeric hyphenated id', () => {
  const id = generateSafeId('test');
  assert.match(id, /^test-[a-z0-9]+-[a-z0-9]+$/);
});
