import type { Element } from './Element';

/**
 * Абстрактный класс «Ингредиент».
 * Реализует общий интерфейс Element и хранит массу нетто (в граммах).
 * Конкретные ингредиенты (вода, молоко, сироп и т.д.) наследуются от него.
 */
export abstract class Ingredient implements Element {
  /** Название ингредиента (задаётся в наследниках). */
  abstract readonly name: string;

  /** Масса нетто в граммах. */
  netMass: number;

  constructor(netMass: number) {
    if (netMass <= 0) {
      throw new Error('Масса нетто должна быть положительной');
    }
    this.netMass = netMass;
  }

  /** Текстовое описание ингредиента — например, «Вода — 30 г». */
  describe(): string {
    return `${this.name} — ${this.netMass} г`;
  }
}
