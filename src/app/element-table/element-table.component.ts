import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {distinctUntilChanged, Observable, switchMap} from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { PeriodicElement } from '../models/periodic-element';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {DataService} from "../data.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

interface ElementTableState {
  loading: boolean;
  filterValue: string;
  elementData: PeriodicElement[];
  filteredData: PeriodicElement[];
}

@Component({
  selector: 'app-element-table',
  templateUrl: './element-table.component.html',
  styleUrls: ['./element-table.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    AsyncPipe,
    MatProgressSpinner,
    NgIf
  ],
  providers: [RxState],

})
export class ElementTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];

  dataSource = new MatTableDataSource<PeriodicElement>();
  loading$!: Observable<boolean>;

  @ViewChild('border') borderElement!: ElementRef;
  isFirstInteraction: boolean = true;

  constructor(private dialog: MatDialog,
              private dataService: DataService,
              private state: RxState<ElementTableState>) {}

  ngOnInit(): void {
    this.state.set({
      loading: true,
      filterValue: '',
      elementData: [],
      filteredData: [],
    });

    this.state.select('filteredData').pipe(
      map(data => data || [])
    ).subscribe(data => {
      this.dataSource.data = data;
      if (data.length > 0) {
        this.state.set({ loading: false });
      }
    });
    this.loading$ = this.state.select('loading');

    this.state.connect('elementData', this.dataService.getData());

    this.state.hold(this.state.select('elementData'), elementData => {
      this.state.set({ filteredData: elementData });
    });

    this.state.connect(
      'filteredData',
      this.state.select('filterValue').pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        switchMap(filterValue =>
          this.state.select('elementData').pipe(
            map(data => this.filterElements(data, filterValue))
          )
        )
      )
    );
  }

  applyFilter(filterInput: string | Event): void {
    let filterValue: string;

    if (typeof filterInput === 'string') {
      filterValue = filterInput;
    } else {
      const inputElement = filterInput.target as HTMLInputElement;
      filterValue = inputElement.value;
    }

    if (this.isFirstInteraction) {
      this.isFirstInteraction = false;
      this.startAnimation();
    } else {
      this.resetAnimation();
    }

    this.state.set({ filterValue });
  }

  startAnimation(): void {
    const border = this.borderElement.nativeElement;
    border.style.visibility = 'visible';
    border.style.animation = '';
  }

  resetAnimation(): void {
    const border = this.borderElement.nativeElement;
    border.style.animation = 'none';
    border.offsetHeight;
    border.style.animation = '';
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateElement(result);
      }
    });
  }

  private updateElement(updatedElement: PeriodicElement): void {
    const updatedData = this.state.get('elementData').map(item =>
      item.position === updatedElement.position ? { ...updatedElement } : item
    );
    this.state.set({ elementData: updatedData });
    this.applyFilter(this.state.get('filterValue'));
  }

  private filterElements(data: PeriodicElement[], filterValue: string): PeriodicElement[] {
    return data.filter(item =>
      Object.values(item).some(val =>
        val.toString().toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }
}
