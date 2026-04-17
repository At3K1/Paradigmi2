import type { Drink } from '../models/Drink';
import { Action } from '../models/Action';

export function formatRecipeText(drink: Drink): string {
  const lines: string[] = [];
  lines.push(`Рецепт: ${drink.name}`);

  if (drink.elements.length === 0) {
    lines.push('');
    lines.push('(рецепт пуст)');
    return lines.join('\n');
  }

  lines.push('');
  drink.elements.forEach((el, i) => {
    const text = el instanceof Action ? el.execute() : el.describe();
    lines.push(`  ${i + 1}. ${text}`);
  });

  return lines.join('\n');
}

export function formatRecipeHtml(drink: Drink): string {
  const parts: string[] = [];
  parts.push(`<h2 class="recipe-title">${escapeHtml(drink.name)}</h2>`);

  if (drink.elements.length === 0) {
    parts.push('<p class="recipe-empty">Рецепт пуст</p>');
    return parts.join('');
  }

  parts.push('<ol class="recipe-steps">');
  for (const el of drink.elements) {
    const text = el instanceof Action ? el.execute() : el.describe();
    parts.push(`<li>${escapeHtml(text)}</li>`);
  }
  parts.push('</ol>');

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
