import { UserRole } from '../types';

export function getRoleRedirectPath(role?: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return '/super-admin';
    case UserRole.HOSPITAL_ADMIN:
      return '/hospital-admin';
    case UserRole.DIABETOLOGIST:
    case UserRole.NURSE_EDUCATOR:
    case UserRole.NUTRITIONIST:
      return '/clinician';
    case UserRole.PATIENT:
      return '/patient';
    default:
      return '/login';
  }
}
