const SETTINGS_KEY = 'ckv_user_settings';

export interface UserSettings {
  capy?: 'on' | 'off';
  theme?: 'light' | 'dark' | 'auto';
  bg?: string | null;
  dim?: number;
  [key: string]: any;
}

