import { Component, OnDestroy, OnInit } from "@angular/core";
import { finalize, Subscription } from "rxjs";
import { Product } from "src/app/models/product.model";
import { CartService } from "src/app/services/cart.service";
import { StoreService } from "src/app/services/store.service";

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 355, 4: 350 };
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  category: string | undefined;
  rowHeight = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  sort = "desc";
  count = "12";
  productsSubscription: Subscription | undefined;

  isLoading = false;

  // inject cartSerivce to home component
  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getRowHeight(): string {
    if (this.cols === 1) {
      return "400px";
    } else if (this.cols === 4) {
      return "430px";
    } else {
      return "420px";
    }
  }

  getProducts(): void {
    this.isLoading = true;

    this.productsSubscription = this.storeService
      .getAllProducts(this.count, this.sort, this.category)
      .pipe(
        // Ensure loading is set to false when the observable completes or errors
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((_products) => {
        this.products = _products;
      });
  }
  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }
  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }
  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
  }
  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }
  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }
  getProductBoxClasses(): string {
    const baseClasses =
      "bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden";

    if (this.cols === 1) {
      return `${baseClasses} flex flex-row`;
    }

    return `${baseClasses} flex flex-col`;
  }
}
