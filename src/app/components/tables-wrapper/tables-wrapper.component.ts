import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ProductCategory,
  ProductsService,
} from '../../services/products.service';
import { ProductTableComponent } from '../product-table/product-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tables-wrapper',
  templateUrl: './tables-wrapper.component.html',
  standalone: true,
  imports: [ProductTableComponent, CommonModule],
  styleUrls: ['./tables-wrapper.component.scss'],
})
export class TablesWrapperComponent implements OnDestroy {
  products: ProductCategory[] = [];
  private productsSubscription!: Subscription;

  constructor(private productsService: ProductsService) {
    this.productsSubscription = this.productsService.products$.subscribe(
      (products) => {
        this.products = products;
      }
    );
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
}
