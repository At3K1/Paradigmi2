import type { Element } from '../models/Element';
import { Water, Syrup, CoffeeBean, Milk, Ice } from '../models/ingredients';
import { Ingredient } from '../models/Ingredient';
import { Add, Stir, Boil, Pour, Grind, Whip } from '../models/actions';

type IngredientCtor = new (netMass: number) => Ingredient;

export interface IngredientOption {
  key: string;
  label: string;
  ctor: IngredientCtor;
}

export const INGREDIENT_OPTIONS: IngredientOption[] = [
  { key: 'Water', label: 'Вода', ctor: Water },
  { key: 'Syrup', label: 'Сироп', ctor: Syrup },
  { key: 'CoffeeBean', label: 'Кофейное зерно', ctor: CoffeeBean },
  { key: 'Milk', label: 'Молоко', ctor: Milk },
  { key: 'Ice', label: 'Лёд', ctor: Ice },
];

export interface ActionOption {
  key: string;
  label: string;
  create: (elements: Element[]) => Element;
}

export const ACTION_OPTIONS: ActionOption[] = [
  { key: 'Add', label: 'Добавить', create: (els) => new Add(els) },
  { key: 'Stir', label: 'Перемешать', create: (els) => new Stir(els) },
  { key: 'Boil', label: 'Вскипятить', create: (els) => new Boil(els) },
  { key: 'Pour', label: 'Пролить', create: (els) => new Pour(els) },
  { key: 'Grind', label: 'Перемолоть', create: (els) => new Grind(els) },
  { key: 'Whip', label: 'Взбить', create: (els) => new Whip(els) },
];
