import type { AppState } from './AppState';

export class DrinkListView {
  private state: AppState;
  private listEl: HTMLUListElement;
  private newBtn: HTMLButtonElement;

  constructor(state: AppState) {
    this.state = state;
    this.listEl = document.querySelector<HTMLUListElement>('#drink-list')!;
    this.newBtn = document.querySelector<HTMLButtonElement>('#btn-new-drink')!;

    this.newBtn.addEventListener('click', () => this.handleNew());
    this.state.subscribe(() => this.render());
    this.render();
  }

  private handleNew(): void {
    const drink = this.state.repo.create('Новый напиток');
    this.state.setActive(drink.id);
  }

  private render(): void {
    const drinks = this.state.repo.getAll();
    this.listEl.innerHTML = '';

    if (drinks.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'hint';
      empty.style.cursor = 'default';
      empty.textContent = 'Пока ничего. Нажми «+ Новый».';
      this.listEl.appendChild(empty);
      return;
    }

    for (const drink of drinks) {
      const li = document.createElement('li');
      li.dataset.id = drink.id;
      if (drink.id === this.state.activeId) {
        li.classList.add('active');
      }
      const nameSpan = document.createElement('span');
      nameSpan.textContent = drink.name;
      li.appendChild(nameSpan);
      li.addEventListener('click', () => {
        this.state.setActive(drink.id);
      });
      this.listEl.appendChild(li);
    }
  }
}
