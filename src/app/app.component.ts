import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatFormField} from "@angular/material/form-field";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatFormField],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
