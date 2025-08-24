import { Component, Input, OnInit } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  private _cart: Cart = { items: [] };
  itemQuantity = 0;

  isMobile = false;
  isTablet = false;
  private breakpointSubscription: Subscription | undefined;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curr) => prev + curr, 0);
  }
  constructor(
    private cartService: CartService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.setupResponsiveBreakpoints();
  }

  ngOnDestroy(): void {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  private setupResponsiveBreakpoints(): void {
    const mobileBreakpoint = "(max-width: 767px)";
    const tableBreakpoint = "(min-width: 768px) and (max-width: 1023px)";

    this.breakpointSubscription = this.breakpointObserver
      .observe([mobileBreakpoint, tableBreakpoint])
      .subscribe(() => {
        this.isMobile = this.breakpointObserver.isMatched(mobileBreakpoint);
        this.isTablet = this.breakpointObserver.isMatched(tableBreakpoint);
      });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    return this.cartService.clearCart();
  }

  getToolbarClasses(): string {
    return this.isMobile
      ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60 sticky top-0 z-50 transition-all duration-300 min-h-16"
      : "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/60 sticky top-0 z-50 transition-all duration-300";
  }

  getContainerClasses(): string {
    return this.isMobile
      ? "max-w-7xl mx-auto w-full px-4 flex items-center justify-between py-2"
      : "max-w-7xl mx-auto w-full px-6 flex items-center justify-between";
  }
  getLogoClasses(): string {
    return this.isMobile
      ? "flex items-center space-x-2"
      : "flex items-center space-x-3";
  }

  getBrandTextClasses(): string {
    return this.isMobile
      ? "text-lg font-semibold transition-all duration-300 no-underline"
      : "text-xl font-semibold transition-all duration-300 no-underline";
  }

  getCartMenuClasses(): string {
    return this.isMobile
      ? "w-72 flex flex-col max-h-[70vh]"
      : "w-80 flex flex-col max-h-[min(80vh, 32rem]";
  }
}
