import { DrinkRepository } from './DrinkRepository';
import { Drink } from '../models/Drink';
import type { Element } from '../models/Element';
import {
  serializeDrink,
  deserializeDrink,
  type SerializedDrink,
} from './serialization';

const STORAGE_KEY = 'paradigmi2:drinks';

export class LocalStorageDrinkRepository extends DrinkRepository {
  constructor() {
    super();
    this.load();
  }

  override create(name: string, elements: Element[] = []): Drink {
    const drink = super.create(name, elements);
    this.save();
    return drink;
  }

  override update(
    id: string,
    changes: { name?: string; elements?: Element[] },
  ): Drink {
    const drink = super.update(id, changes);
    this.save();
    return drink;
  }

  override delete(id: string): boolean {
    const ok = super.delete(id);
    if (ok) {
      this.save();
    }
    return ok;
  }

  private save(): void {
    const data = this.getAll().map(serializeDrink);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      const data: SerializedDrink[] = JSON.parse(raw);
      for (const item of data) {
        const drink = deserializeDrink(item);
        this.drinks.set(drink.id, drink);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
