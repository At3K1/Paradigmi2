import type { Element } from './Element';

export abstract class Action implements Element {
  abstract readonly name: string;

  elements: Element[];

  constructor(elements: Element[] = []) {
    this.elements = elements;
  }

  abstract execute(): string;

  describe(): string {
    if (this.elements.length === 0) {
      return this.name;
    }
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return `${this.name}: ${parts}`;
  }
}
