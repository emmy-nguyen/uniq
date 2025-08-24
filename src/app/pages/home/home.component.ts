import { BreakpointObserver } from "@angular/cdk/layout";
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
  breakpointSubscription: Subscription | undefined;

  isLoading = false;

  // responsive properties
  isMobile = false;
  isTablet = false;
  isDesktop = true;
  drawerMode: "over" | "push" | "side" = "side";
  drawerOpened = true;
  showDrawerToggle = false;

  // inject cartSerivce to home component
  constructor(
    private cartService: CartService,
    private storeService: StoreService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.setupResponsiveBreakpoints();
    this.getProducts();
  }

  private setupResponsiveBreakpoints(): void {
    const mobileBreakpoint = "(max-width: 767px)";
    const tabletBreakpoint = "(min-width: 768px) and (max-width: 1023px)";
    const desktopBreakpoint = "(min-width: 1024px)";

    this.breakpointSubscription = this.breakpointObserver
      .observe([mobileBreakpoint, tabletBreakpoint, desktopBreakpoint])
      .subscribe((result) => {
        this.isMobile = this.breakpointObserver.isMatched(mobileBreakpoint);
        this.isTablet = this.breakpointObserver.isMatched(tabletBreakpoint);
        this.isDesktop = this.breakpointObserver.isMatched(desktopBreakpoint);

        if (this.isMobile) {
          this.handleMobileLayout();
        } else if (this.isTablet) {
          this.handleTabletLayout();
        } else {
          this.handleDesktopLayout();
        }
      });
  }

  private handleMobileLayout(): void {
    this.drawerMode = "over";
    this.drawerOpened = false;
    this.showDrawerToggle = true;
    this.cols = 1;
    this.updateRowHeight();
  }
  private handleTabletLayout(): void {
    this.drawerMode = "over";
    this.drawerOpened = false;
    this.showDrawerToggle = true;
    this.cols = 2;
    this.updateRowHeight();
  }
  private handleDesktopLayout(): void {
    this.drawerMode = "side";
    this.drawerOpened = true;
    this.showDrawerToggle = false;
    if (this.cols === 2 || this.cols === 1) {
      this.cols = 3;
    }
    this.updateRowHeight();
  }
  private updateRowHeight(): void {
    this.rowHeight = ROWS_HEIGHT[this.cols] || 350;
  }
  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
  }
  onBackdropClick(): void {
    if (this.isMobile || this.isTablet) {
      this.drawerOpened = false;
    }
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
    if (this.isDesktop) {
      this.cols = colsNum;
      this.rowHeight = ROWS_HEIGHT[this.cols];
    }
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();

    if (this.isMobile || this.isTablet) {
      this.drawerOpened = false;
    }
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
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
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

  getDrawerClasses(): string {
    return this.isMobile
      ? "w-full max-w-sm bg-white shadow-2xl"
      : "w-80 bg-white/95 backdrop-blur-sm border-gray-200/60 shadow-lg";
  }

  getContentClass(): string {
    return this.isMobile ? "p-4" : "p-6";
  }

  getContainerClasses(): string {
    return this.isMobile ? "px-2 py-4" : "p-6";
  }
  getSkeletonGridClasses(): string {
    const baseClasses = "grid gap-4";
    const gapClass = this.isMobile ? "gap-4" : "gap-6";

    if (this.cols === 1) return `${baseClasses} grid-cols-1 ${gapClass}`;
    if (this.cols === 2) return `${baseClasses} grid-cols-2 ${gapClass}`;
    if (this.cols === 3) return `${baseClasses} grid-cols-3 ${gapClass}`;
    if (this.cols === 4) return `${baseClasses} grid-cols-4 ${gapClass}`;

    return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gapClass}`;
  }
}
