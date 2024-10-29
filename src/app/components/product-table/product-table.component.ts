import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductTableItemDto } from './dto/product-table.dto';
import { Subscription } from 'rxjs';
import {
  ProductCategory,
  ProductsService,
} from '../../services/products.service';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, FormsModule, MatIconModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {
  displayedColumns: string[] = ['name', 'link', 'price', 'remove', 'selected'];
  @Input() dataSource!: ProductTableItemDto[];
  @Input() tableTitle!: string;
  productsSubscription!: Subscription;
  products: ProductCategory[] = [];

  constructor(
    private toastr: ToastrService,
    private productsService: ProductsService
  ) {
    this.productsSubscription = this.productsService.products$.subscribe(
      (products) => {
        this.products = products;
      }
    );
  }

  ngOnInit(): void {}

  copyLink(link: string) {
    navigator.clipboard.writeText(link);
    this.toastr.success('Link copied to clipboard');
  }

  navigateToLink(link: string) {
    window.open(link, '_blank');
  }

  removeProduct(product: ProductTableItemDto) {
    this.productsService.removeProduct(product.id);
  }

  removeProductCategory(productTitle: string) {
    this.productsService.removeProductCategory(productTitle);
  }

  toggleProductSelection(product: ProductTableItemDto) {
    this.productsService.markProductAsSelected(product.id, !product.selected);
  }
}
