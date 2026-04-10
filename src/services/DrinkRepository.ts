import { Drink } from '../models/Drink';
import type { Element } from '../models/Element';

export class DrinkRepository {
  protected drinks: Map<string, Drink> = new Map();

  create(name: string, elements: Element[] = []): Drink {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Имя напитка не может быть пустым');
    }
    const id = this.generateId();
    const drink = new Drink(id, trimmed, elements);
    this.drinks.set(id, drink);
    return drink;
  }

  getById(id: string): Drink | undefined {
    return this.drinks.get(id);
  }

  getAll(): Drink[] {
    return Array.from(this.drinks.values());
  }

  update(id: string, changes: { name?: string; elements?: Element[] }): Drink {
    const drink = this.drinks.get(id);
    if (!drink) {
      throw new Error(`Напиток с id "${id}" не найден`);
    }
    if (changes.name !== undefined) {
      drink.rename(changes.name);
    }
    if (changes.elements !== undefined) {
      drink.elements = changes.elements;
    }
    return drink;
  }

  delete(id: string): boolean {
    return this.drinks.delete(id);
  }

  private generateId(): string {
    return `drink_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
