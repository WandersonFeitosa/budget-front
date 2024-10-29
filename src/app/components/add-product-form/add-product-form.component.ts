import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  ProductCategory,
  ProductsService,
} from '../../services/products.service';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PriceFormatDirective } from '../../directives/price-format.directive';

@Component({
  selector: 'app-add-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    PriceFormatDirective, // Import your standalone directive here
  ],
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss'],
})
export class AddProductFormComponent {
  productForm = new FormGroup({
    productName: new FormControl('', Validators.required),
    link: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required]),
    category: new FormControl('', Validators.required),
  });
  customCategory = new FormControl('');
  useNewCategory = new FormControl(false);
  productsSubscription!: Subscription;
  products: ProductCategory[] = [];

  categories: {
    id: string;
    name: string;
  }[] = [];

  constructor(private productsService: ProductsService) {
    this.productsSubscription = this.productsService.products$.subscribe(
      (products) => {
        this.products = products;
        this.categories = products.map((product) => {
          return {
            id: product.title,
            name: product.title,
          };
        });
      }
    );

    // Add this new subscription
    this.useNewCategory.valueChanges.subscribe((useNew) => {
      const categoryControl = this.productForm.get('category');
      if (useNew) {
        categoryControl?.clearValidators();
        categoryControl?.updateValueAndValidity();
        this.customCategory.setValidators(Validators.required);
      } else {
        categoryControl?.setValidators(Validators.required);
        categoryControl?.updateValueAndValidity();
        this.customCategory.clearValidators();
      }
      this.customCategory.updateValueAndValidity();
    });
  }

  addProduct() {
    if (this.productForm.valid && (!this.useNewCategory.value || this.customCategory.valid)) {
      if (this.useNewCategory.value) {
        const categoryControl = this.productForm.get('category');
        if (categoryControl) {
          categoryControl.setValue(this.customCategory.value);
        }
      }

      const product = this.productForm.value;

      const price = product.price?.replace(/[^\d]/g, '') || '';
      const firstPart = price.slice(0, -2);

      const secondPart = price.slice(-2);
      const formattedPrice = `${firstPart}.${secondPart}`;
      const inputProduct: Partial<ProductCategory> = {
        title: product.category || '',
        dataSource: [
          {
            id: uuidv4(),
            name: product.productName || '',
            link: product.link || '',
            price: formattedPrice || '',
            selected: false,
          },
        ],
      };

      this.productsService.addProduct(inputProduct as ProductCategory);

      this.useNewCategory.setValue(false);
      this.resetForm();
    }
  }

  resetForm() {
    this.productForm.reset({
      productName: '',
      link: '',
      price: '',
      category: '',
    });
    this.customCategory.reset('');
    this.useNewCategory.reset(false);

    // Reset main form controls
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });

    // Reset custom category control
    this.customCategory.setErrors(null);
    this.customCategory.markAsUntouched();
    this.customCategory.markAsPristine();

    // Reset useNewCategory control
    this.useNewCategory.setErrors(null);
    this.useNewCategory.markAsUntouched();
    this.useNewCategory.markAsPristine();

    this.productForm.markAsUntouched();
    this.productForm.markAsPristine();
  }

  // Add this new method
  isFormValid(): boolean {
    if (this.useNewCategory.value) {
      return this.productForm.valid && this.customCategory.valid;
    } else {
      return this.productForm.valid;
    }
  }
}
