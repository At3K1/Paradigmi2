import { Action } from './Action';

export class Add extends Action {
  readonly name = 'Добавить';

  execute(): string {
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return parts ? `Добавить: ${parts}` : 'Добавить';
  }
}

export class Stir extends Action {
  readonly name = 'Перемешать';

  execute(): string {
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return parts ? `Перемешать: ${parts}` : 'Перемешать';
  }
}

export class Boil extends Action {
  readonly name = 'Вскипятить';

  execute(): string {
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return parts ? `Вскипятить: ${parts}` : 'Вскипятить';
  }
}

export class Pour extends Action {
  readonly name = 'Пролить';

  execute(): string {
    if (this.elements.length < 2) {
      const parts = this.elements.map((e) => e.describe()).join(', ');
      return parts ? `Пролить: ${parts}` : 'Пролить';
    }
    const [first, ...rest] = this.elements;
    const through = rest.map((e) => e.describe()).join(', ');
    return `Пролить ${first.describe()} через ${through}`;
  }
}

export class Grind extends Action {
  readonly name = 'Перемолоть';

  execute(): string {
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return parts ? `Перемолоть: ${parts}` : 'Перемолоть';
  }
}

export class Whip extends Action {
  readonly name = 'Взбить';

  execute(): string {
    const parts = this.elements.map((e) => e.describe()).join(', ');
    return parts ? `Взбить: ${parts}` : 'Взбить';
  }
}
