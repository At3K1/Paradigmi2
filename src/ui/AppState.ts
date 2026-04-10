import { LocalStorageDrinkRepository } from '../services/LocalStorageDrinkRepository';

export class AppState {
  repo: LocalStorageDrinkRepository;
  activeId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.repo = new LocalStorageDrinkRepository();
    const all = this.repo.getAll();
    if (all.length > 0) {
      this.activeId = all[0].id;
    }
  }

  setActive(id: string | null): void {
    this.activeId = id;
    this.emit();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(): void {
    for (const l of this.listeners) {
      l();
    }
  }
}
