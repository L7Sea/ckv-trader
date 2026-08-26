/**
 * CKV PRO TRADER - WALLPAPER STORAGE & CROSS-DEVICE SYNC SERVICE
 * Single Source of Truth for Wallpapers & Themes
 */

export interface WallpaperPreset {
  id: string;
  name: string;
  url: string;
  previewClass: string;
  description: string;
}

export interface WallpaperConfig {
  activePresetId: string | null;
  customUrl: string | null;
  dim: number; // 0 to 100
  updatedAt: string;
}

const WALLPAPER_CONFIG_KEY = 'ckv_wallpaper_config_v1';
const DEFAULT_DIM = 35;

export const PRESET_WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'cyberpunk',
    name: '🏙️ Cyberpunk Trading',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    previewClass: 'from-cyan-900 to-indigo-950',
    description: 'Bảng điện tử công nghệ cao đa sắc neon'
  },
  {
    id: 'wallstreet',
    name: '🐂 Wall Street Bull',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop',
    previewClass: 'from-amber-900 to-stone-950',
    description: 'Biểu tượng bò tót tăng trưởng phố Wall'
  },
  {
    id: 'bloomberg',
    name: '📊 Bloomberg Dark',
    url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop',
    previewClass: 'from-slate-900 to-zinc-950',
    description: 'Giao diện thiết bị đầu cuối tài chính tối giản'
  },
  {
    id: 'deepsea',
    name: '🌊 Deep Sea Obsidian',
    url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2070&auto=format&fit=crop',
    previewClass: 'from-blue-950 to-slate-950',
    description: 'Đại dương tĩnh lặng, tập trung kỷ luật'
  },
  {
    id: 'aurora',
    name: '✨ Emerald Matrix',
    url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=2070&auto=format&fit=crop',
    previewClass: 'from-emerald-950 to-slate-950',
    description: 'Sắc xanh tím thịnh vượng'
  }
];

class WallpaperService {
  private config: WallpaperConfig;

  constructor() {
    this.config = this.loadConfig();
    this.cleanLegacyStorage();
  }

  /**
   * Dọn dẹp triệt để chuỗi base64 nặng trong localStorage cũ
   */
  private cleanLegacyStorage(): void {
    try {
      localStorage.removeItem('ckv_background_image');
      localStorage.removeItem('ckv_background_preset_id');
      localStorage.removeItem('ckv_background_dim');
    } catch {}
  }

  private loadConfig(): WallpaperConfig {
    try {
      const raw = localStorage.getItem(WALLPAPER_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          activePresetId: parsed.activePresetId ?? null,
          customUrl: parsed.customUrl ?? null,
          dim: typeof parsed.dim === 'number' ? parsed.dim : DEFAULT_DIM,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    } catch {}

    return {
      activePresetId: null,
      customUrl: null,
      dim: DEFAULT_DIM,
      updatedAt: new Date().toISOString()
    };
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(WALLPAPER_CONFIG_KEY, JSON.stringify(this.config));
    } catch {}
  }

  public getConfig(): WallpaperConfig {
    return { ...this.config };
  }

  public getActiveBackgroundUrl(): string | null {
    if (this.config.customUrl) return this.config.customUrl;
    if (this.config.activePresetId) {
      const preset = PRESET_WALLPAPERS.find((p) => p.id === this.config.activePresetId);
      if (preset) return preset.url;
    }
    return null;
  }

  public setPreset(presetId: string): void {
    this.config.activePresetId = presetId;
    this.config.customUrl = null;
    this.config.updatedAt = new Date().toISOString();
    this.saveConfig();
  }

  public setCustomUrl(url: string): void {
    this.config.customUrl = url.trim();
    this.config.activePresetId = null;
    this.config.updatedAt = new Date().toISOString();
    this.saveConfig();
  }

  public setDim(dim: number): void {
    this.config.dim = Math.max(0, Math.min(90, dim));
    this.config.updatedAt = new Date().toISOString();
    this.saveConfig();
  }

  public resetToDefault(): void {
    this.config = {
      activePresetId: null,
      customUrl: null,
      dim: DEFAULT_DIM,
      updatedAt: new Date().toISOString()
    };
    this.saveConfig();
  }

  public importConfig(config: Partial<WallpaperConfig>): void {
    if (config.activePresetId !== undefined) this.config.activePresetId = config.activePresetId;
    if (config.customUrl !== undefined) this.config.customUrl = config.customUrl;
    if (typeof config.dim === 'number') this.config.dim = config.dim;
    this.config.updatedAt = new Date().toISOString();
    this.saveConfig();
  }
}

export const wallpaperService = new WallpaperService();
