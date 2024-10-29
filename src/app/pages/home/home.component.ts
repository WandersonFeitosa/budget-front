import { Component } from '@angular/core';
import { TablesWrapperComponent } from '../../components/tables-wrapper/tables-wrapper.component';
import { AddProductFormComponent } from '../../components/add-product-form/add-product-form.component';
import { TotalSumComponent } from '../../components/total-sum/total-sum.component';
import { SwitchTableComponent } from '../../components/switch-table/switch-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TablesWrapperComponent,
    AddProductFormComponent,
    TotalSumComponent,
    SwitchTableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
