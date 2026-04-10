# Лабораторная №2 — Напитки

CRUD-приложение для модели «Напиток» из UML-диаграммы. Сделано на TypeScript + Vite, без фреймворков.

## Модель

- **Element** — общий интерфейс для всего, что входит в напиток.
- **Ingredient** (абстрактный) — масса нетто. Наследники: Water, Syrup, CoffeeBean, Milk, Ice.
- **Action** (абстрактный) — действие с методом `execute()` и упорядоченным списком элементов. Наследники: Add, Stir, Boil, Pour, Grind, Whip.
- **Drink** — упорядоченная последовательность элементов (ингредиентов и действий).

## Возможности

- Создание, переименование, удаление напитков.
- Добавление ингредиентов с массой и действий в любой последовательности.
- Перестановка элементов вверх/вниз.
- Превью рецепта со списком ингредиентов и пронумерованными шагами.
- Кнопка «Скопировать как текст».
- Сохранение в `localStorage` — данные не теряются после перезагрузки.
- При первом запуске добавляется рецепт эспрессо по умолчанию.

## Структура

```
src/
├── models/        — классы UML-модели
│   ├── Element.ts
│   ├── Ingredient.ts
│   ├── ingredients.ts
│   ├── Action.ts
│   ├── actions.ts
│   └── Drink.ts
├── services/      — репозиторий, сериализация, форматтер, seed
│   ├── DrinkRepository.ts
│   ├── LocalStorageDrinkRepository.ts
│   ├── serialization.ts
│   ├── recipeFormatter.ts
│   └── seed.ts
├── ui/            — компоненты интерфейса
│   ├── AppState.ts
│   ├── DrinkListView.ts
│   ├── DrinkEditorView.ts
│   ├── RecipePreviewView.ts
│   └── elementFactory.ts
├── main.ts
└── style.css
```

## Запуск

```bash
npm install
npm run dev
```

Открой ссылку из вывода Vite в браузере.

## Сборка

```bash
npm run build
npm run preview
```
