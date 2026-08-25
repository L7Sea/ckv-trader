/**
 * Firestore REST API Client for Cloudflare Workers (Edge Compatible)
 * Hỗ trợ Local Fallback & Seed Data giúp app chạy ngay lập tức mà không cần bất kỳ thao tác cấu hình phức tạp nào.
 */

export interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  timestampValue?: string;
}

export type FirestoreDocument = {
  name?: string;
  fields: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

export interface FirestoreWrite {
  update?: {
    name: string;
    fields: Record<string, FirestoreValue>;
  };
  delete?: string;
}

const now = new Date().toISOString();

// Cơ sở dữ liệu mẫu ban đầu để giao diện hiển thị ngay lập tức trực quan
const localDatabase: {
  portfolios: Record<string, any>;
  positions: Record<string, any>;
  transactions: Record<string, any>;
} = {
  portfolios: {
    default: {
      cash: 85000000,
      receiving_cash: 15000000, // 15 triệu chờ về từ lệnh bán gần nhất
      margin_debt: 0,
      total_equity: 226000000,
      total_profit_loss: 4500000,
      updated_at: now
    }
  },
  positions: {
    HPG: {
      symbol: 'HPG',
      available_quantity: 1000,
      t1_quantity: 500,
      t2_quantity: 500,
      total_quantity: 2000,
      avg_price: 27500,
      market_price: 29000,
      market_value: 58000000,
      unrealized_pnl: 3000000,
      unrealized_pnl_pct: 5.45,
      updated_at: now
    },
    FPT: {
      symbol: 'FPT',
      available_quantity: 500,
      t1_quantity: 0,
      t2_quantity: 0,
      total_quantity: 500,
      avg_price: 130000,
      market_price: 136000,
      market_value: 68000000,
      unrealized_pnl: 3000000,
      unrealized_pnl_pct: 4.62,
      updated_at: now
    }
  },
  transactions: {
    'sample-tx-1': {
      id: 'sample-tx-1',
      type: 'BUY',
      symbol: 'HPG',
      price: 27500,
      quantity: 500,
      fee: 20625,
      tax: 0,
      total_amount: 13750000,
      net_amount: 13770625,
      avg_price_at_trade: 27500,
      timestamp: now,
      trade_date: now.slice(0, 10),
      notes: 'Mua tích sản vùng hỗ trợ'
    },
    'sample-tx-2': {
      id: 'sample-tx-2',
      type: 'BUY',
      symbol: 'FPT',
      price: 130000,
      quantity: 500,
      fee: 97500,
      tax: 0,
      total_amount: 65000000,
      net_amount: 65097500,
      avg_price_at_trade: 130000,
      timestamp: now,
      trade_date: now.slice(0, 10),
      notes: 'Đầu tư dài hạn ngành công nghệ'
    }
  }
};

export function toFirestoreValue(value: any): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return { integerValue: value.toString() };
    return { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const key of Object.keys(value)) {
      fields[key] = toFirestoreValue(value[key]);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

export function toFirestoreFields(obj: Record<string, any>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) fields[key] = toFirestoreValue(value);
  }
  return fields;
}

export function fromFirestoreValue(val: FirestoreValue): any {
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
  if (val.doubleValue !== undefined) return val.doubleValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.nullValue !== undefined) return null;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.arrayValue !== undefined) return (val.arrayValue.values || []).map(fromFirestoreValue);
  if (val.mapValue !== undefined) {
    const res: Record<string, any> = {};
    const fields = val.mapValue.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = fromFirestoreValue(v);
    }
    return res;
  }
  return null;
}

export function fromFirestoreDocument(doc: FirestoreDocument): Record<string, any> {
  const res: Record<string, any> = {};
  if (!doc || !doc.fields) return res;
  for (const [key, val] of Object.entries(doc.fields)) {
    res[key] = fromFirestoreValue(val);
  }
  return res;
}

export class FirestoreClient {
  private projectId: string;
  private apiKey?: string;
  private baseUrl: string;
  private isFirebaseConfigured: boolean;

  constructor(projectId?: string, apiKey?: string) {
    this.projectId = projectId || '';
    this.apiKey = apiKey;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;
    this.isFirebaseConfigured = Boolean(
      this.projectId &&
      this.projectId !== 'YOUR_FIREBASE_PROJECT_ID' &&
      this.projectId !== 'ckv-stock-manager'
    );
  }

  private getUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${this.baseUrl}/${cleanPath}`;
    return this.apiKey ? `${url}?key=${this.apiKey}` : url;
  }

  async getDocument<T = any>(path: string): Promise<T | null> {
    const parts = path.split('/');
    const collection = parts[0] as 'portfolios' | 'positions' | 'transactions';
    const docId = parts[1];

    if (!this.isFirebaseConfigured) {
      if (localDatabase[collection] && localDatabase[collection][docId]) {
        return JSON.parse(JSON.stringify(localDatabase[collection][docId])) as T;
      }
      return null;
    }

    try {
      const url = this.getUrl(path);
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status === 404) return null;
      if (!res.ok) {
        if (localDatabase[collection] && localDatabase[collection][docId]) {
          return JSON.parse(JSON.stringify(localDatabase[collection][docId])) as T;
        }
        return null;
      }

      const doc = (await res.json()) as FirestoreDocument;
      return fromFirestoreDocument(doc) as T;
    } catch {
      if (localDatabase[collection] && localDatabase[collection][docId]) {
        return JSON.parse(JSON.stringify(localDatabase[collection][docId])) as T;
      }
      return null;
    }
  }

  async getCollection<T = any>(collectionName: string): Promise<T[]> {
    const colKey = collectionName as 'portfolios' | 'positions' | 'transactions';

    if (!this.isFirebaseConfigured) {
      if (localDatabase[colKey]) {
        return Object.values(localDatabase[colKey]).map((item) => JSON.parse(JSON.stringify(item))) as T[];
      }
      return [];
    }

    try {
      const url = this.getUrl(collectionName);
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.status === 404 || !res.ok) {
        if (localDatabase[colKey]) {
          return Object.values(localDatabase[colKey]).map((item) => JSON.parse(JSON.stringify(item))) as T[];
        }
        return [];
      }

      const data = (await res.json()) as { documents?: FirestoreDocument[] };
      if (!data.documents || !Array.isArray(data.documents)) {
        return [];
      }

      return data.documents.map((doc) => {
        const id = doc.name ? doc.name.split('/').pop() : undefined;
        const parsed = fromFirestoreDocument(doc);
        if (id && !parsed.id) parsed.id = id;
        return parsed as T;
      });
    } catch {
      if (localDatabase[colKey]) {
        return Object.values(localDatabase[colKey]).map((item) => JSON.parse(JSON.stringify(item))) as T[];
      }
      return [];
    }
  }

  createUpdateWrite(collection: string, docId: string, data: Record<string, any>): FirestoreWrite {
    const resourceName = `projects/${this.projectId || 'local'}/databases/(default)/documents/${collection}/${docId}`;
    return {
      update: {
        name: resourceName,
        fields: toFirestoreFields(data)
      }
    };
  }

  async commitBatch(writes: FirestoreWrite[]): Promise<any> {
    if (writes.length === 0) return { writeResults: [] };

    for (const write of writes) {
      if (write.update && write.update.name) {
        const parts = write.update.name.split('/');
        const docId = parts.pop() || '';
        const collection = parts.pop() as 'portfolios' | 'positions' | 'transactions';
        const docData = fromFirestoreDocument({ fields: write.update.fields });
        if (collection && docId) {
          if (!localDatabase[collection]) localDatabase[collection] = {};
          localDatabase[collection][docId] = docData;
        }
      }
    }

    if (!this.isFirebaseConfigured) {
      return { success: true, mode: 'local' };
    }

    try {
      let url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:commit`;
      if (this.apiKey) url += `?key=${this.apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ writes })
      });

      if (!res.ok) {
        console.warn('Firestore Commit returned status:', res.status);
      }
      return await res.json();
    } catch (err) {
      console.warn('Firestore Commit network error (fallback to local):', err);
      return { success: true, mode: 'local_fallback' };
    }
  }
}
