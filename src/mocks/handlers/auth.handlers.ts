import { http, HttpResponse } from 'msw';
import { mockUsers, TEST_CREDENTIALS } from '../data/users';
import { User, AuthResponse } from '@/types';

// Simple JWT token generator (not for production!)
function generateToken(payload: any, expiresIn: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const body = btoa(JSON.stringify({ ...payload, exp }));
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
}

function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

// In-memory user storage
const users: User[] = [...mockUsers];

const API_URL = 'http://localhost:3000';

export const authHandlers = [
  // Signup
  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      name?: string;
    };

    // Validate input
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.find((u) => u.email === body.email)) {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: body.email,
      name: body.name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate tokens
    const accessToken = generateToken({ userId: newUser.id }, 15 * 60); // 15 min
    const refreshToken = generateToken({ userId: newUser.id }, 7 * 24 * 60 * 60); // 7 days

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: newUser,
    };

    return HttpResponse.json(response, { status: 201 });
  }),

  // Login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
    };

    // Validate credentials (simplified - just check email exists and password is correct)
    const user = users.find((u) => u.email === body.email);

    if (!user || body.password !== TEST_CREDENTIALS.password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const accessToken = generateToken({ userId: user.id }, 15 * 60); // 15 min
    const refreshToken = generateToken({ userId: user.id }, 7 * 24 * 60 * 60); // 7 days

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user,
    };

    return HttpResponse.json(response);
  }),

  // Refresh token
  http.post(`${API_URL}/auth/refresh`, async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };

    if (!body.refreshToken) {
      return HttpResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Decode and validate refresh token
    const payload = decodeToken(body.refreshToken);

    if (!payload || !payload.userId) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return HttpResponse.json(
        { message: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Generate new access token
    const accessToken = generateToken({ userId: payload.userId }, 15 * 60);

    return HttpResponse.json({ accessToken });
  }),

  // Get current user
  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = decodeToken(token);

    if (!payload || !payload.userId) {
      return HttpResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return HttpResponse.json(
        { message: 'Token expired' },
        { status: 401 }
      );
    }

    const user = users.find((u) => u.id === payload.userId);

    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(user);
  }),
];
