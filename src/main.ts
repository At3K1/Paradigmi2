import './style.css';
import { AppState } from './ui/AppState';
import { DrinkListView } from './ui/DrinkListView';

const state = new AppState();
new DrinkListView(state);
