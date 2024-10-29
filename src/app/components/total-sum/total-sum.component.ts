import { Component } from '@angular/core';
import {
  ProductCategory,
  ProductsService,
} from '../../services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-total-sum',
  standalone: true,
  imports: [],
  templateUrl: './total-sum.component.html',
  styleUrl: './total-sum.component.scss',
})
export class TotalSumComponent {
  totalSum = 0;
  private productsSubscription!: Subscription;
  products: ProductCategory[] = [];

  constructor(private productsService: ProductsService) {
    this.productsSubscription = this.productsService.products$.subscribe(
      (products) => {
        this.products = products;
        this.calculateTotalSum();
      }
    );
  }

  calculateTotalSum() {
    this.totalSum = 0;
    for (const product of this.products) {
      for (const item of product.dataSource) {
        const selectedProduct = item.selected ? parseFloat(item.price) : 0;
        this.totalSum += selectedProduct;
      }
    }
  }
}
