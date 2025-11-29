import { hasPassword } from '../../src/utils/hash';

describe('hasPassword', () => {
    describe('should return true', () => {
        it('when user has a valid password with 4 characters', () => {
            const user = { password: 'test' };
            expect(hasPassword(user)).toBe(true);
        });

        it('when user has a valid password with more than 4 characters', () => {
            const user = { password: 'validpassword123' };
            expect(hasPassword(user)).toBe(true);
        });

        it('when user has a password that is exactly 4 characters', () => {
            const user = { password: '1234' };
            expect(hasPassword(user)).toBe(true);
        });
    });

    describe('should return false', () => {
        it('when user object is null', () => {
            expect(hasPassword(null as any)).toBe(false);
        });

        it('when user object is undefined', () => {
            expect(hasPassword(undefined as any)).toBe(false);
        });

        it('when user has no password property', () => {
            const user = {} as any;
            expect(hasPassword(user)).toBe(false);
        });

        it('when password is undefined', () => {
            const user = { password: undefined as any };
            expect(hasPassword(user)).toBe(false);
        });

        it('when password is null', () => {
            const user = { password: null as any };
            expect(hasPassword(user)).toBe(false);
        });

        it('when password is empty string', () => {
            const user = { password: '' };
            expect(hasPassword(user)).toBe(false);
        });

        it('when password is less than 4 characters', () => {
            const user = { password: '123' };
            expect(hasPassword(user)).toBe(false);
        });

        it('when password is only 1 character', () => {
            const user = { password: 'a' };
            expect(hasPassword(user)).toBe(false);
        });
    });
});
