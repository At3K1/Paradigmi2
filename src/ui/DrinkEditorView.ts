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
    this.bodyEl.appendChild(
      this.renderElementsTree(drink.elements, () => this.save()),
    );
    this.bodyEl.appendChild(
      this.renderAddControls(drink.elements, () => this.save()),
    );
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
      const ok = confirm(
        `Удалить напиток «${name}»? Это действие нельзя отменить.`,
      );
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

  private renderElementsTree(
    elements: Element[],
    onChanged: () => void,
    depth: number = 0,
  ): HTMLElement {
    const wrap = document.createElement('div');

    if (depth === 0) {
      const title = document.createElement('h3');
      title.textContent = 'Элементы';
      title.style.fontSize = '0.95rem';
      title.style.margin = '0.5rem 0';
      wrap.appendChild(title);
    }

    if (elements.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'hint';
      empty.style.paddingLeft = depth > 0 ? '1rem' : '0';
      empty.textContent = depth === 0 ? 'Пока нет элементов.' : '(пусто)';
      wrap.appendChild(empty);
      return wrap;
    }

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    if (depth > 0) {
      ul.style.marginLeft = '1rem';
      ul.style.borderLeft = '2px solid var(--border)';
      ul.style.paddingLeft = '0.5rem';
    }

    elements.forEach((el, index) => {
      const li = document.createElement('li');
      li.style.marginBottom = '0.35rem';

      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '0.4rem';
      row.style.padding = '0.35rem 0.5rem';
      row.style.background = 'var(--bg-panel-2)';
      row.style.borderRadius = '0';

      const label = document.createElement('span');
      label.style.flex = '1';
      const isAction = el instanceof Action;
      const isIngredient = el instanceof Ingredient;
      const tag = isIngredient ? '[И]' : isAction ? '[Д]' : '•';
      label.textContent = isAction
        ? `${tag} ${el.name}`
        : `${tag} ${el.describe()}`;
      row.appendChild(label);

      const upBtn = this.makeBtn('↑', () => {
        if (index === 0) return;
        const [item] = elements.splice(index, 1);
        elements.splice(index - 1, 0, item);
        onChanged();
      });
      upBtn.disabled = index === 0;

      const downBtn = this.makeBtn('↓', () => {
        if (index === elements.length - 1) return;
        const [item] = elements.splice(index, 1);
        elements.splice(index + 1, 0, item);
        onChanged();
      });
      downBtn.disabled = index === elements.length - 1;

      const delBtn = this.makeBtn('X', () => {
        elements.splice(index, 1);
        onChanged();
      });
      delBtn.classList.add('btn-danger');

      row.appendChild(upBtn);
      row.appendChild(downBtn);
      row.appendChild(delBtn);
      li.appendChild(row);

      if (isAction) {
        const action = el as Action;
        li.appendChild(
          this.renderElementsTree(action.elements, onChanged, depth + 1),
        );
        li.appendChild(
          this.renderAddControls(action.elements, onChanged, depth + 1),
        );
      }

      ul.appendChild(li);
    });

    wrap.appendChild(ul);
    return wrap;
  }

  private renderAddControls(
    targetArray: Element[],
    onChanged: () => void,
    depth: number = 0,
  ): HTMLElement {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '0.3rem';
    wrap.style.flexWrap = 'nowrap';
    wrap.style.alignItems = 'center';
    wrap.style.marginBottom = depth === 0 ? '0.5rem' : '0.25rem';
    if (depth > 0) {
      wrap.style.marginLeft = '1rem';
      wrap.style.paddingLeft = '0.5rem';
    }

    const ingSelect = document.createElement('select');
    for (const opt of INGREDIENT_OPTIONS) {
      const o = document.createElement('option');
      o.value = opt.key;
      o.textContent = opt.label;
      ingSelect.appendChild(o);
    }

    const mass = document.createElement('input');
    mass.type = 'number';
    mass.min = '1';
    mass.value = '30';
    mass.style.width = '70px';
    mass.placeholder = 'г';

    const addIngBtn = this.makeBtn('+ Ингр.', () => {
      const opt = INGREDIENT_OPTIONS.find((i) => i.key === ingSelect.value);
      if (!opt) return;
      const m = Number(mass.value);
      if (!m || m <= 0) {
        alert('Введи положительную массу');
        return;
      }
      targetArray.push(new opt.ctor(m));
      onChanged();
    });
    addIngBtn.classList.add('btn-primary');

    const actSelect = document.createElement('select');
    for (const opt of ACTION_OPTIONS) {
      const o = document.createElement('option');
      o.value = opt.key;
      o.textContent = opt.label;
      actSelect.appendChild(o);
    }

    const addActBtn = this.makeBtn('+ Действ.', () => {
      const opt = ACTION_OPTIONS.find((a) => a.key === actSelect.value);
      if (!opt) return;
      targetArray.push(opt.create([]));
      onChanged();
    });
    addActBtn.classList.add('btn-primary');

    wrap.appendChild(ingSelect);
    wrap.appendChild(mass);
    wrap.appendChild(addIngBtn);
    wrap.appendChild(actSelect);
    wrap.appendChild(addActBtn);

    return wrap;
  }

  private save(): void {
    if (this.state.activeId === null) return;
    const drink = this.state.repo.getById(this.state.activeId);
    if (!drink) return;
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
