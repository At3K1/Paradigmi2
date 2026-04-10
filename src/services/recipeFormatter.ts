import type { Drink } from '../models/Drink';
import { Ingredient } from '../models/Ingredient';
import { Action } from '../models/Action';

export function formatRecipeText(drink: Drink): string {
  const lines: string[] = [];
  lines.push(`Рецепт: ${drink.name}`);

  const ingredients = drink.elements.filter(
    (e): e is Ingredient => e instanceof Ingredient,
  );
  const actions = drink.elements.filter(
    (e): e is Action => e instanceof Action,
  );

  if (ingredients.length > 0) {
    lines.push('');
    lines.push('Ингредиенты:');
    for (const ing of ingredients) {
      lines.push(`  • ${ing.describe()}`);
    }
  }

  if (actions.length > 0) {
    lines.push('');
    lines.push('Приготовление:');
    actions.forEach((action, index) => {
      lines.push(`  ${index + 1}. ${action.execute()}`);
    });
  }

  if (ingredients.length === 0 && actions.length === 0) {
    lines.push('');
    lines.push('(рецепт пуст)');
  }

  return lines.join('\n');
}

export function formatRecipeHtml(drink: Drink): string {
  const ingredients = drink.elements.filter(
    (e): e is Ingredient => e instanceof Ingredient,
  );
  const actions = drink.elements.filter(
    (e): e is Action => e instanceof Action,
  );

  const parts: string[] = [];
  parts.push(`<h2 class="recipe-title">${escapeHtml(drink.name)}</h2>`);

  if (ingredients.length > 0) {
    parts.push('<h3>Ингредиенты</h3>');
    parts.push('<ul class="recipe-ingredients">');
    for (const ing of ingredients) {
      parts.push(`<li>${escapeHtml(ing.describe())}</li>`);
    }
    parts.push('</ul>');
  }

  if (actions.length > 0) {
    parts.push('<h3>Приготовление</h3>');
    parts.push('<ol class="recipe-steps">');
    for (const action of actions) {
      parts.push(`<li>${escapeHtml(action.execute())}</li>`);
    }
    parts.push('</ol>');
  }

  if (ingredients.length === 0 && actions.length === 0) {
    parts.push('<p class="recipe-empty">Рецепт пуст</p>');
  }

  return parts.join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
