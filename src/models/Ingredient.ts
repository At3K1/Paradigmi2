import type { Element } from './Element';

export abstract class Ingredient implements Element {
  abstract readonly name: string;

  netMass: number;

  constructor(netMass: number) {
    if (netMass <= 0) {
      throw new Error('Масса нетто должна быть положительной');
    }
    this.netMass = netMass;
  }

  describe(): string {
    return `${this.name} — ${this.netMass} г`;
  }
}
