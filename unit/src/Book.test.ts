import { describe, it, expect } from 'vitest';
import { Book } from './Book';
import { BookStatus } from './types';

describe('Book', () => {
  it('should be initialized with status "available"', () => {
    const book = new Book('b1', '1984', 'George Orwell');
    expect(book.status).toBe('available');
    expect(book.isAvailable()).toBe(true);
    expect(book.isBorrowed()).toBe(false);
    expect(book.isInMaintenance()).toBe(false);
  });

  it('should correctly identify as borrowed', () => {
    const book = new Book('b2', 'Brave New World', 'Aldous Huxley');
    book.status = 'borrowed';
    expect(book.isBorrowed()).toBe(true);
    expect(book.isAvailable()).toBe(false);
    expect(book.isInMaintenance()).toBe(false);
  });

  it('should correctly identify as in maintenance', () => {
    const book = new Book('b3', 'The Hobbit', 'J.R.R. Tolkien');
    book.status = 'maintenance';
    expect(book.isInMaintenance()).toBe(true);
    expect(book.isAvailable()).toBe(false);
    expect(book.isBorrowed()).toBe(false);
  });
});
