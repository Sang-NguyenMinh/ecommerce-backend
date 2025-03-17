import { UserRole } from 'src/config/types';

export interface AuthenticatedUser {
  // _id: string;
  role: UserRole;
}
