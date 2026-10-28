import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStore {
  tenantId?: string;
  userId?: string;
  role?: string;
}

export class TenantContext {
  private static readonly storage = new AsyncLocalStorage<TenantStore>();

  static run(store: TenantStore, callback: () => void): void {
    this.storage.run(store, callback);
  }

  static getTenantId(): string | undefined {
    return this.storage.getStore()?.tenantId;
  }

  static getUserId(): string | undefined {
    return this.storage.getStore()?.userId;
  }

  static getRole(): string | undefined {
    return this.storage.getStore()?.role;
  }

  static getStore(): TenantStore | undefined {
    return this.storage.getStore();
  }
}
