import type { AppState } from './AppState';
import { formatRecipeHtml, formatRecipeText } from '../services/recipeFormatter';

export class RecipePreviewView {
  private state: AppState;
  private bodyEl: HTMLDivElement;

  constructor(state: AppState) {
    this.state = state;
    this.bodyEl = document.querySelector<HTMLDivElement>('#preview-body')!;
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
      hint.textContent = 'Здесь появится рецепт.';
      this.bodyEl.appendChild(hint);
      return;
    }

    const recipe = document.createElement('div');
    recipe.innerHTML = formatRecipeHtml(drink);
    this.bodyEl.appendChild(recipe);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-small';
    copyBtn.textContent = 'Скопировать как текст';
    copyBtn.style.marginTop = '1rem';
    copyBtn.addEventListener('click', () => {
      const text = formatRecipeText(drink);
      navigator.clipboard
        .writeText(text)
        .then(() => {
          copyBtn.textContent = 'Скопировано!';
          setTimeout(() => {
            copyBtn.textContent = 'Скопировать как текст';
          }, 1500);
        })
        .catch(() => alert('Не удалось скопировать'));
    });
    this.bodyEl.appendChild(copyBtn);
  }
}
