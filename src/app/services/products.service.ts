import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductTableItemDto } from '../components/product-table/dto/product-table.dto';
import * as SocketIoClient from 'socket.io-client';

export interface ProductCategory {
  title: string;
  dataSource: ProductTableItemDto[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsSubject = new BehaviorSubject<ProductCategory[]>([]);
  private selectedIdSubject = new BehaviorSubject<string>('');
  products$ = this.productsSubject.asObservable();
  selectedId$ = this.selectedIdSubject.asObservable();
  private clientSocket: SocketIoClient.Socket;

  constructor() {
    this.clientSocket = SocketIoClient.connect(
      'https://api.akavan.com.br:3005'
    );
    const lastTableId = localStorage.getItem('lastTableId');
    if (lastTableId) {
      this.switchTable(lastTableId);
    }
    this.onEvent('products').subscribe((products) => {
      this.productsSubject.next(!products || products === '' ? [] : products);
    });
    this.getProducts();
  }
  onEvent(event: string): Observable<any> {
    return new Observable((observer) => {
      this.clientSocket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }

  emit(event: string, data: any): void {
    this.clientSocket.emit(event, data);
  }

  getProducts() {
    this.emit('getProducts', {
      id: this.selectedIdSubject.getValue() || 'default',
    });
  }

  updateProducts(productsCategory: ProductCategory[]) {
    this.emit('updateProducts', {
      id: this.selectedIdSubject.getValue() || 'default',
      productsCategory,
    });
  }

  addProduct(product: ProductCategory) {
    const currentProducts = this.productsSubject.getValue();

    const referenceProductIndex = currentProducts.findIndex(
      (p) => p.title === product.title
    );

    if (referenceProductIndex === -1) {
      this.updateProducts([...currentProducts, product]);
    } else {
      const updatedProducts = [...currentProducts];
      updatedProducts[referenceProductIndex] = {
        ...updatedProducts[referenceProductIndex],
        dataSource: [
          ...updatedProducts[referenceProductIndex].dataSource,
          ...product.dataSource,
        ],
      };
      this.updateProducts(updatedProducts);
    }
  }

  removeProduct(id: string) {
    let updatedProducts: ProductCategory[] = [];
    for (const product of this.productsSubject.value) {
      updatedProducts.push({
        ...product,
        dataSource: product.dataSource.filter((p) => p.id !== id),
      });
    }
    this.updateProducts(updatedProducts);
  }

  removeProductCategory(title: string) {
    const updatedProducts = this.productsSubject.value.filter(
      (product) => product.title !== title
    );
    this.updateProducts(updatedProducts);
  }

  markProductAsSelected(productId: string, checked: boolean) {
    let products = this.productsSubject.value;
    const productIndex = products.findIndex((product) =>
      product.dataSource.some((p) => p.id === productId)
    );

    if (productIndex === -1) return;

    const currentProductCategory = this.productsSubject.value[productIndex];
    let updatedProductCategory: ProductCategory;
    if (!checked) {
      updatedProductCategory = {
        ...currentProductCategory,
        dataSource: currentProductCategory.dataSource.map((product) => {
          if (product.id === productId) return { ...product, selected: true };
          return { ...product, selected: false };
        }),
      };
    } else {
      updatedProductCategory = {
        ...currentProductCategory,
        dataSource: currentProductCategory.dataSource.map((product) => ({
          ...product,
          selected: false,
        })),
      };
    }
    products[productIndex] = updatedProductCategory;

    this.updateProducts(products);
    return;
  }

  switchTable(tableId: string) {
    this.emit('getProducts', {
      id: tableId,
    });
    this.selectedIdSubject.next(tableId);
    localStorage.setItem('lastTableId', tableId);
  }
}
