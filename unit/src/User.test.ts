import { describe, it, expect, beforeEach } from 'vitest';
import { User } from './User';
import { UserCategory } from './types';

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = new User('u1', 'Alice', 'alice@example.com');
  });

  it('should initialize with empty loans and category "standard"', () => {
    expect(user.currentLoans).toEqual([]);
    expect(user.category).toBe('standard');
  });

  it('should allow borrowing if under limit', () => {
    user.currentLoans = ['b1', 'b2'];
    expect(user.canBorrow()).toBe(true); // 2 < 3 for standard
  });

  it('should not allow borrowing if at limit', () => {
    user.currentLoans = ['b1', 'b2', 'b3'];
    expect(user.canBorrow()).toBe(false); // 3 == 3 for standard
  });

  it('should allow more loans for premium users', () => {
    const premiumUser = new User(
      'u2',
      'Bob',
      'bob@example.com',
      'premium'
    );
    premiumUser.currentLoans = ['b1', 'b2', 'b3', 'b4'];
    expect(premiumUser.canBorrow()).toBe(true);
    premiumUser.currentLoans.push('b5');
    expect(premiumUser.canBorrow()).toBe(false);
  });

  it('should add a loan if not already borrowed', () => {
    user.addLoan('book123');
    expect(user.currentLoans).toContain('book123');
  });

  it('should not add the same loan twice', () => {
    user.addLoan('book123');
    user.addLoan('book123');
    expect(user.currentLoans.length).toBe(1);
  });

  it('should remove a loan correctly', () => {
    user.currentLoans = ['b1', 'b2', 'b3'];
    user.removeLoan('b2');
    expect(user.currentLoans).toEqual(['b1', 'b3']);
  });

  it('should do nothing if removing a loan that does not exist', () => {
    user.currentLoans = ['b1'];
    user.removeLoan('b99');
    expect(user.currentLoans).toEqual(['b1']);
  });
});
