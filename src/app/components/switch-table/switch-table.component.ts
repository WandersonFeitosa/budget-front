import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-switch-table',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './switch-table.component.html',
  styleUrls: ['./switch-table.component.scss'],
})
export class SwitchTableComponent {
  tableForm = new FormGroup({
    tableId: new FormControl('', Validators.required),
  });
  lastTableId: string | null = null;

  constructor(
    private productsService: ProductsService,
    private toastr: ToastrService
  ) {
    this.productsService.selectedId$.subscribe((id) => {
      this.lastTableId = id;
      this.tableForm.patchValue({ tableId: this.lastTableId });
    });
  }

  switchTable() {
    if (this.tableForm.valid) {
      if (!this.tableForm.value.tableId) return;
      if (!/^[a-zA-Z0-9-]+$/.test(this.tableForm.value.tableId)) {
        this.toastr.error('Please use only letters, numbers and -');
        return;
      }
      this.productsService.switchTable(this.tableForm.value.tableId);
    }
  }
}
