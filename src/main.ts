import './style.css';
import { AppState } from './ui/AppState';
import { DrinkListView } from './ui/DrinkListView';
import { DrinkEditorView } from './ui/DrinkEditorView';

const state = new AppState();
new DrinkListView(state);
new DrinkEditorView(state);
