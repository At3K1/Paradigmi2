import './style.css';
import { AppState } from './ui/AppState';
import { DrinkListView } from './ui/DrinkListView';
import { DrinkEditorView } from './ui/DrinkEditorView';
import { RecipePreviewView } from './ui/RecipePreviewView';

const state = new AppState();
new DrinkListView(state);
new DrinkEditorView(state);
new RecipePreviewView(state);
