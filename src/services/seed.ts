import type { DrinkRepository } from './DrinkRepository';
import { Water, CoffeeBean } from '../models/ingredients';
import { Grind, Boil, Pour } from '../models/actions';

export function seedIfEmpty(repo: DrinkRepository): void {
  if (repo.getAll().length > 0) {
    return;
  }

  const water = new Water(30);
  const beans = new CoffeeBean(18);

  repo.create('Эспрессо', [
    new Grind([beans]),
    new Boil([new Water(30)]),
    new Pour([water, beans]),
  ]);
}
