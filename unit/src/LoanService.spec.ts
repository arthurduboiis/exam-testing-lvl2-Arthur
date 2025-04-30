import { describe, it, expect, beforeEach } from 'vitest';
import { LoanService } from './LoanService';
import { Book } from './Book';
import { User } from './User';
import { UserCategory } from './types';

describe('LoanService', () => {
  let loanService: LoanService;
  let user: User;
  let book: Book;

  beforeEach(() => {
    loanService = new LoanService();
    user = new User('u1', 'Alice', 'alice@gmail.com'); // Ajuste en fonction du constructeur réel
    book = new Book('b1', 'Le Petit Prince', 'François Damiens');
    loanService.addUser(user);
    loanService.addBook(book);
  });

  it('should borrow a book when available and user can borrow', () => {
    const success = loanService.borrowBook('b1', 'u1');
    expect(success).toBe(true);
    expect(book.status).toBe('borrowed');
    expect(book.borrowedBy).toBe('u1');
    expect(book.dueDate).toBeInstanceOf(Date);
  });

  it('should not borrow a book if already borrowed', () => {
    loanService.borrowBook('b1', 'u1');
    const result = loanService.borrowBook('b1', 'u1');
    expect(result).toBe(false);
  });

  it('should return a book and calculate no penalty when on time', () => {
    loanService.borrowBook('b1', 'u1');
    const returnDate = new Date(book.dueDate!);
    const penalty = loanService.returnBook('b1', returnDate);
    expect(penalty).toBe(0);
    expect(book.status).toBe('available');
    expect(book.borrowedBy).toBeUndefined();
  });

  it('should return a book and calculate penalty when overdue', () => {
    loanService.borrowBook('b1', 'u1');
    const lateDate = new Date(book.dueDate!.getTime());
    lateDate.setDate(lateDate.getDate() + 3);
    const penalty = loanService.returnBook('b1', lateDate);
    // 3 jours x 0.5 par jour
    expect(penalty).toBe(1.5);
  });

  it('should not return a book that was never borrowed', () => {
    const result = loanService.returnBook('b1');
    expect(result).toBe(-1);
  });
});
