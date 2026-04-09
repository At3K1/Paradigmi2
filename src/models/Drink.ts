import type { Element } from './Element';

export class Drink {
  id: string;
  name: string;
  elements: Element[];

  constructor(id: string, name: string, elements: Element[] = []) {
    this.id = id;
    this.name = name;
    this.elements = elements;
  }

  addElement(element: Element): void {
    this.elements.push(element);
  }

  removeElementAt(index: number): void {
    if (index < 0 || index >= this.elements.length) {
      throw new Error('Индекс вне диапазона');
    }
    this.elements.splice(index, 1);
  }

  moveElement(from: number, to: number): void {
    if (
      from < 0 ||
      from >= this.elements.length ||
      to < 0 ||
      to >= this.elements.length
    ) {
      throw new Error('Индекс вне диапазона');
    }
    const [item] = this.elements.splice(from, 1);
    this.elements.splice(to, 0, item);
  }

  rename(newName: string): void {
    const trimmed = newName.trim();
    if (!trimmed) {
      throw new Error('Имя напитка не может быть пустым');
    }
    this.name = trimmed;
  }
}
