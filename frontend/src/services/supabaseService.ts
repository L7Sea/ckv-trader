/**
 * CKV PRO TRADER - FRONTEND SUPABASE CONNECTOR
 * Kết nối trực tiếp hoặc thông qua Cloudflare Worker REST API
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const SUPABASE_CONFIG_KEY = 'CKV_SUPABASE_CONFIG_V1';

export const getSupabaseConfig = (): SupabaseConfig => {
  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''
  };
};

export const saveSupabaseConfig = (cfg: SupabaseConfig) => {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(cfg));
};

export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey && !cfg.url.includes('YOUR_SUPABASE'));
};
