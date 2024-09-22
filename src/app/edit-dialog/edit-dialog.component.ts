import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PeriodicElement } from '../models/periodic-element';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class EditDialogComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      position: [this.data.position],
      name: [this.data.name],
      weight: [this.data.weight],
      symbol: [this.data.symbol]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
