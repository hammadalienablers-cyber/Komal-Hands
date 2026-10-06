import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Validates and normalizes the Supabase URL.
 * Accepts full URLs (e.g. https://xyz.supabase.co) or project IDs.
 * Returns null if the URL is invalid or a placeholder.
 */
function validateSupabaseUrl(url: string): string | null {
  if (!url) return null;

  // Reject placeholder values
  if (
    url.toUpperCase().includes('YOUR_') ||
    url.includes('placeholder.supabase.co') ||
    url.includes('example.com')
  ) {
    return null;
  }

  let formatted = url;
  // If user only provided their project reference ID (alphanumeric/hyphen without scheme)
  if (!formatted.includes('://') && /^[a-z0-9_-]+$/i.test(formatted)) {
    formatted = `https://${formatted}.supabase.co`;
  } else if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

/**
 * Validates the Supabase Anon Key.
 * Rejects placeholders, short dummy strings, or empty keys.
 */
function validateSupabaseKey(key: string): string | null {
  if (!key) return null;
  if (
    key.toUpperCase().includes('YOUR_') ||
    key === 'placeholder' ||
    key.length < 20 // Supabase keys (JWTs) are typically 100+ chars
  ) {
    return null;
  }
  return key;
}

const validatedUrl = validateSupabaseUrl(rawUrl);
const validatedKey = validateSupabaseKey(rawKey);

export const isSupabaseConfigured = Boolean(validatedUrl && validatedKey);

// Clearly invalid placeholders when Supabase is not configured
const DUMMY_UNCONFIGURED_URL = 'https://unconfigured-dummy.supabase.invalid';
const DUMMY_UNCONFIGURED_KEY = 'invalid-unconfigured-anon-key-no-network-calls';

let clientInstance: SupabaseClient<any, any, any>;
if (isSupabaseConfigured && validatedUrl && validatedKey) {
  try {
    clientInstance = createClient<any, any, any>(validatedUrl, validatedKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Supabase initialization failed:', err);
    clientInstance = createClient<any, any, any>(DUMMY_UNCONFIGURED_URL, DUMMY_UNCONFIGURED_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
} else {
  // Explicit unconfigured client instance; no network calls are permitted when unconfigured
  clientInstance = createClient<any, any, any>(DUMMY_UNCONFIGURED_URL, DUMMY_UNCONFIGURED_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export const supabase: SupabaseClient<any, any, any> = clientInstance;
