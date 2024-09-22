import { Routes } from '@angular/router';
import {ElementTableComponent} from "./element-table/element-table.component";

export const routes: Routes = [
  { path: '', redirectTo: 'elements', pathMatch: 'full' },
  { path: 'elements', component: ElementTableComponent },
  { path: '**', redirectTo: 'elements' }
];

