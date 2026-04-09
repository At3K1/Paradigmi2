import type { Element } from './Element';

/**
 * Абстрактный класс «Действие».
 * Действие — это тоже Элемент (может стоять в последовательности напитка),
 * но оно ещё и оперирует над списком других элементов (композиция «ordered»).
 *
 * Например, действие «Пролить» содержит элементы «вода» и «кофе» —
 * именно над ними оно выполняется.
 */
export abstract class Action implements Element {
  abstract readonly name: string;

  /** Упорядоченный список элементов, над которыми выполняется действие. */
  elements: Element[];

  constructor(elements: Element[] = []) {
    this.elements = elements;
  }

  /**
   * Выполнить действие. Возвращает текстовое описание выполнения —
   * это удобно использовать при выводе рецепта.
   */
  abstract execute(): string;

  /** Описание самого действия (без выполнения) — для рецепта. */
  describe(): string {
    if (this.elements.length === 0) {
      return this.name;
    }
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return `${this.name}: ${parts}`;
  }
}
