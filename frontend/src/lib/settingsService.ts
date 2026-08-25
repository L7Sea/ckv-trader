const SETTINGS_KEY = 'ckv_user_settings';

export interface UserSettings {
  capy?: 'on' | 'off';
  theme?: 'light' | 'dark' | 'auto';
  bg?: string | null;
  dim?: number;
  [key: string]: any;
}

export async function loadUserSettings(): Promise<UserSettings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { capy: 'on', theme: 'dark', dim: 35 };
  } catch {
    return { capy: 'on', theme: 'dark', dim: 35 };
  }
}

export function saveUserSetting(key: string, value: any): void {
  try {
    const current = localStorage.getItem(SETTINGS_KEY);
    const parsed = current ? JSON.parse(current) : {};
    parsed[key] = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
  } catch {}
}
