import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    createdAt: new Date().toISOString(),
  },
];

// Test credentials for e2e tests
export const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123',
};
