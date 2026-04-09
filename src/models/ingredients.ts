import { Ingredient } from './Ingredient';

/** Вода. */
export class Water extends Ingredient {
  readonly name = 'Вода';
}

/** Сироп (любого вкуса). */
export class Syrup extends Ingredient {
  readonly name = 'Сироп';
}

/** Кофейное зерно. */
export class CoffeeBean extends Ingredient {
  readonly name = 'Кофейное зерно';
}

/** Молоко. */
export class Milk extends Ingredient {
  readonly name = 'Молоко';
}

/** Лёд. */
export class Ice extends Ingredient {
  readonly name = 'Лёд';
}
