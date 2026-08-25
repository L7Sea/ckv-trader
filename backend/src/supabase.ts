/**
 * CKV PRO TRADER - SUPABASE POSTGRESQL REST CLIENT FOR CLOUDFLARE WORKERS
 * Tương tác trực tiếp với Supabase PostgREST API tốc độ cao, không cần thư viện cồng kềnh.
 */

export class SupabaseClient {
  private url: string;
  private apiKey: string;
  private isConfigured: boolean;

  constructor(url?: string, apiKey?: string) {
    this.url = (url || '').replace(/\/$/, '');
    this.apiKey = apiKey || '';
    this.isConfigured = Boolean(
      this.url &&
      this.apiKey &&
      !this.url.includes('YOUR_SUPABASE') &&
      !this.apiKey.includes('YOUR_SUPABASE')
    );
  }

  public isReady(): boolean {
    return this.isConfigured;
  }

  private getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...extraHeaders
    };
  }

  /** Lấy danh sách bản ghi từ 1 bảng */
  public async from<T = any>(table: string, queryParams: string = ''): Promise<T[]> {
    if (!this.isConfigured) return [];
    try {
      const q = queryParams ? `?${queryParams}` : '';
      const res = await fetch(`${this.url}/rest/v1/${table}${q}`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) {
        console.error(`Supabase query error on ${table}: ${res.statusText}`);
        return [];
      }
      return await res.json<T[]>();
    } catch (err) {
      console.error(`Supabase error on ${table}:`, err);
      return [];
    }
  }

  /** Lấy 1 bản ghi theo ID */
  public async getOne<T = any>(table: string, idColumn: string, idValue: string): Promise<T | null> {
    if (!this.isConfigured) return null;
    try {
      const res = await fetch(`${this.url}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(idValue)}&limit=1`, {
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) return null;
      const data = await res.json<T[]>();
      return data && data.length > 0 ? data[0] : null;
    } catch {
      return null;
    }
  }

  /** Thêm hoặc Cập nhật bản ghi (Upsert) */
  public async upsert<T = any>(table: string, data: any): Promise<T | null> {
    if (!this.isConfigured) return data;
    try {
      const res = await fetch(`${this.url}/rest/v1/${table}`, {
        method: 'POST',
        headers: this.getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error(`Supabase upsert error on ${table}:`, txt);
        return data;
      }
      const resData = await res.json<T[]>();
      return resData && resData.length > 0 ? resData[0] : data;
    } catch (err) {
      console.error(`Supabase upsert fail on ${table}:`, err);
      return data;
    }
  }

  /** Xóa bản ghi */
  public async delete(table: string, idColumn: string, idValue: string): Promise<boolean> {
    if (!this.isConfigured) return true;
    try {
      const res = await fetch(`${this.url}/rest/v1/${table}?${idColumn}=eq.${encodeURIComponent(idValue)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(5000)
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
