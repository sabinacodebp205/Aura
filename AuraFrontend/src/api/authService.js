import client from './client';

/**
 * Register a new user.
 * Backend route: POST /api/Auth/register
 * Payload: { name, surname, userName, email, password, confirmPassword }
 */
export async function register(dto) {
  const { data } = await client.post('/Auth/register', dto);
  return data;
}

/**
 * Login user and store JWT token in localStorage under 'jwt'.
 * Backend route: POST /api/Auth/login
 * Payload: { email, password }
 * Response: { token: "JWT..." }
 */
export async function login(dto) {
  try {
    const { data } = await client.post('/Auth/login', dto);
    if (data?.token) {
      localStorage.setItem('jwt', data.token);
    } else {
      throw new Error('No token returned from authentication endpoint.');
    }
    return data;
  } catch (err) {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    throw err;
  }
}

/**
 * Fetch authenticated user profile data.
 * Backend route: GET /api/Auth/me
 * Returns UserGetDto: { id, name, surname, userName, email, profileImageUrl }
 */
export async function getMe() {
  const { data } = await client.get('/Auth/me');
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
}

/**
 * Update authenticated user profile details.
 * Backend route: PUT /api/Auth/profile
 * Payload: { name, surname, userName, email, profileImageUrl }
 */
export async function updateProfile(dto) {
  const { data } = await client.put('/Auth/profile', dto);
  return data;
}

/**
 * Logout user by clearing stored token, session data, and dispatching logout event.
 */
export function logout() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  localStorage.removeItem('aura_cart');
  localStorage.removeItem('aura_favorites');
  window.dispatchEvent(new Event('aura_logout'));
}

/**
 * Legacy aliases for backwards compatibility
 */
export const registerUser = register;
export const loginUser = login;
export const logoutUser = logout;
export function getCurrentUser() {
  const token = localStorage.getItem('jwt');
  if (!token) return null;
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      // Fallback
    }
  }
  return null;
}
