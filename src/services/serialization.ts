import type { Element } from '../models/Element';
import { Ingredient } from '../models/Ingredient';
import { Water, Syrup, CoffeeBean, Milk, Ice } from '../models/ingredients';
import { Action } from '../models/Action';
import { Add, Stir, Boil, Pour, Grind, Whip } from '../models/actions';
import { Drink } from '../models/Drink';

type IngredientCtor = new (netMass: number) => Ingredient;
type ActionCtor = new (elements: Element[]) => Action;

const ingredientTypes: Record<string, IngredientCtor> = {
  Water,
  Syrup,
  CoffeeBean,
  Milk,
  Ice,
};

const actionTypes: Record<string, ActionCtor> = {
  Add,
  Stir,
  Boil,
  Pour,
  Grind,
  Whip,
};

export type SerializedElement =
  | { kind: 'ingredient'; type: string; netMass: number }
  | { kind: 'action'; type: string; elements: SerializedElement[] };

export interface SerializedDrink {
  id: string;
  name: string;
  elements: SerializedElement[];
}

export function serializeElement(element: Element): SerializedElement {
  if (element instanceof Ingredient) {
    const type = element.constructor.name;
    return { kind: 'ingredient', type, netMass: element.netMass };
  }
  if (element instanceof Action) {
    const type = element.constructor.name;
    return {
      kind: 'action',
      type,
      elements: element.elements.map(serializeElement),
    };
  }
  throw new Error('Неизвестный тип элемента');
}

export function deserializeElement(data: SerializedElement): Element {
  if (data.kind === 'ingredient') {
    const Ctor = ingredientTypes[data.type];
    if (!Ctor) {
      throw new Error(`Неизвестный ингредиент: ${data.type}`);
    }
    return new Ctor(data.netMass);
  }
  if (data.kind === 'action') {
    const Ctor = actionTypes[data.type];
    if (!Ctor) {
      throw new Error(`Неизвестное действие: ${data.type}`);
    }
    const children = data.elements.map(deserializeElement);
    return new Ctor(children);
  }
  throw new Error('Неизвестный kind элемента');
}

export function serializeDrink(drink: Drink): SerializedDrink {
  return {
    id: drink.id,
    name: drink.name,
    elements: drink.elements.map(serializeElement),
  };
}

export function deserializeDrink(data: SerializedDrink): Drink {
  const elements = data.elements.map(deserializeElement);
  return new Drink(data.id, data.name, elements);
}
