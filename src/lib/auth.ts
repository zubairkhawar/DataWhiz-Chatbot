// src/lib/auth.ts

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/auth';

export async function signIn(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Sign in failed');
  }
  const data = await res.json();
  localStorage.setItem('auth', 'true');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
}

export async function signUp(
  email: string,
  password: string,
  confirmPassword: string,
  terms: boolean,
  firstName: string,
  lastName: string,
  username?: string,
  avatar?: File | null
): Promise<void> {
  if (!terms) throw new Error('You must agree to the terms.');
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('password2', confirmPassword);
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  if (username) formData.append('username', username);
  if (avatar) formData.append('avatar', avatar);

  const res = await fetch(`${API_BASE}/register/`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data.email?.[0] || data.password?.[0] || data.detail || 'Sign up failed'
    );
  }
  // Auto-login after signup
  await signIn(email, password);
} 