import type { AppState } from './AppState';
import type { Element } from '../models/Element';
import { Ingredient } from '../models/Ingredient';
import { Action } from '../models/Action';
import { INGREDIENT_OPTIONS, ACTION_OPTIONS } from './elementFactory';

export class DrinkEditorView {
  private state: AppState;
  private bodyEl: HTMLDivElement;

  constructor(state: AppState) {
    this.state = state;
    this.bodyEl = document.querySelector<HTMLDivElement>('#editor-body')!;
    this.state.subscribe(() => this.render());
    this.render();
  }

  private render(): void {
    this.bodyEl.innerHTML = '';

    const drink =
      this.state.activeId !== null
        ? this.state.repo.getById(this.state.activeId)
        : undefined;

    if (!drink) {
      const hint = document.createElement('p');
      hint.className = 'hint';
      hint.textContent = 'Выбери напиток или создай новый.';
      this.bodyEl.appendChild(hint);
      return;
    }

    this.bodyEl.appendChild(this.renderNameRow(drink.name));
    this.bodyEl.appendChild(this.renderElementsList(drink.elements));
    this.bodyEl.appendChild(this.renderAddIngredient());
    this.bodyEl.appendChild(this.renderAddAction());
    this.bodyEl.appendChild(this.renderDeleteRow(drink.name));
  }

  private renderDeleteRow(name: string): HTMLElement {
    const row = document.createElement('div');
    row.className = 'form-row';
    row.style.marginTop = '1.5rem';
    row.style.borderTop = '1px solid var(--border)';
    row.style.paddingTop = '1rem';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-danger';
    btn.textContent = 'Удалить напиток';
    btn.addEventListener('click', () => {
      if (this.state.activeId === null) return;
      const ok = confirm(`Удалить напиток «${name}»? Это действие нельзя отменить.`);
      if (!ok) return;
      const id = this.state.activeId;
      this.state.repo.delete(id);
      const remaining = this.state.repo.getAll();
      this.state.setActive(remaining.length > 0 ? remaining[0].id : null);
    });
    row.appendChild(btn);
    return row;
  }

  private renderNameRow(name: string): HTMLElement {
    const row = document.createElement('div');
    row.className = 'form-row';
    const label = document.createElement('label');
    label.textContent = 'Название';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = name;
    input.addEventListener('change', () => {
      if (this.state.activeId === null) return;
      try {
        this.state.repo.update(this.state.activeId, { name: input.value });
        this.state.emit();
      } catch (e) {
        alert((e as Error).message);
        input.value = name;
      }
    });
    row.appendChild(label);
    row.appendChild(input);
    return row;
  }

  private renderElementsList(elements: Element[]): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'elements-list';
    const title = document.createElement('h3');
    title.textContent = 'Элементы';
    title.style.fontSize = '0.95rem';
    title.style.margin = '0.5rem 0';
    wrap.appendChild(title);

    if (elements.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'hint';
      empty.textContent = 'Пока нет элементов.';
      wrap.appendChild(empty);
      return wrap;
    }

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';

    elements.forEach((el, index) => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '0.4rem';
      li.style.padding = '0.35rem 0.5rem';
      li.style.background = 'var(--bg-panel-2)';
      li.style.borderRadius = '6px';
      li.style.marginBottom = '0.35rem';

      const label = document.createElement('span');
      label.style.flex = '1';
      const tag = el instanceof Ingredient ? '🧂' : el instanceof Action ? '⚙️' : '•';
      label.textContent = `${tag} ${el.describe()}`;
      li.appendChild(label);

      const upBtn = this.makeBtn('↑', () => this.move(index, index - 1));
      upBtn.disabled = index === 0;
      const downBtn = this.makeBtn('↓', () => this.move(index, index + 1));
      downBtn.disabled = index === elements.length - 1;
      const delBtn = this.makeBtn('✕', () => this.removeAt(index));
      delBtn.classList.add('btn-danger');

      li.appendChild(upBtn);
      li.appendChild(downBtn);
      li.appendChild(delBtn);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  }

  private renderAddIngredient(): HTMLElement {
    const row = document.createElement('div');
    row.className = 'form-row';
    const label = document.createElement('label');
    label.textContent = 'Добавить ингредиент';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '0.4rem';

    const select = document.createElement('select');
    for (const opt of INGREDIENT_OPTIONS) {
      const o = document.createElement('option');
      o.value = opt.key;
      o.textContent = opt.label;
      select.appendChild(o);
    }

    const mass = document.createElement('input');
    mass.type = 'number';
    mass.min = '1';
    mass.value = '30';
    mass.style.width = '90px';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-primary btn-small';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => {
      const opt = INGREDIENT_OPTIONS.find((i) => i.key === select.value);
      if (!opt) return;
      const m = Number(mass.value);
      if (!m || m <= 0) {
        alert('Введи положительную массу');
        return;
      }
      try {
        const ing = new opt.ctor(m);
        this.appendElement(ing);
      } catch (e) {
        alert((e as Error).message);
      }
    });

    controls.appendChild(select);
    controls.appendChild(mass);
    controls.appendChild(addBtn);

    row.appendChild(label);
    row.appendChild(controls);
    return row;
  }

  private renderAddAction(): HTMLElement {
    const row = document.createElement('div');
    row.className = 'form-row';
    const label = document.createElement('label');
    label.textContent = 'Добавить действие';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '0.4rem';

    const select = document.createElement('select');
    for (const opt of ACTION_OPTIONS) {
      const o = document.createElement('option');
      o.value = opt.key;
      o.textContent = opt.label;
      select.appendChild(o);
    }

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-primary btn-small';
    addBtn.textContent = '+';
    addBtn.addEventListener('click', () => {
      const opt = ACTION_OPTIONS.find((a) => a.key === select.value);
      if (!opt) return;
      const action = opt.create([]);
      this.appendElement(action);
    });

    controls.appendChild(select);
    controls.appendChild(addBtn);

    row.appendChild(label);
    row.appendChild(controls);
    return row;
  }

  private appendElement(el: Element): void {
    if (this.state.activeId === null) return;
    const drink = this.state.repo.getById(this.state.activeId);
    if (!drink) return;
    drink.addElement(el);
    this.state.repo.update(drink.id, { elements: drink.elements });
    this.state.emit();
  }

  private removeAt(index: number): void {
    if (this.state.activeId === null) return;
    const drink = this.state.repo.getById(this.state.activeId);
    if (!drink) return;
    drink.removeElementAt(index);
    this.state.repo.update(drink.id, { elements: drink.elements });
    this.state.emit();
  }

  private move(from: number, to: number): void {
    if (this.state.activeId === null) return;
    const drink = this.state.repo.getById(this.state.activeId);
    if (!drink) return;
    drink.moveElement(from, to);
    this.state.repo.update(drink.id, { elements: drink.elements });
    this.state.emit();
  }

  private makeBtn(text: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-small';
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }
}
