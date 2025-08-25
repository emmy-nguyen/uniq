import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";
import { loadStripe } from "@stripe/stripe-js";
import { environment } from "src/environments/environment";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [],
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  isMobile = false;
  isTablet = false;
  isDesktop = true;
  private breakpointSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.setupResponsiveBreakpoints();
    this.setupCartSubscription();
    // TODO: Local storage
  }

  private setupResponsiveBreakpoints(): void {
    const mobileBreakpoint = "(max-width: 767px)";
    const tabletBreakpoint = "(min-width: 768px) and (max-width: 1023px)";
    const desktopBreakpoint = "(min-width: 1024px)";

    this.isMobile = this.breakpointObserver.isMatched(mobileBreakpoint);
    this.isTablet = this.breakpointObserver.isMatched(tabletBreakpoint);
    this.isDesktop = this.breakpointObserver.isMatched(desktopBreakpoint);
    this.breakpointSubscription = this.breakpointObserver
      .observe([mobileBreakpoint, tabletBreakpoint, desktopBreakpoint])
      .subscribe(() => {
        this.isMobile = this.breakpointObserver.isMatched(mobileBreakpoint);
        this.isTablet = this.breakpointObserver.isMatched(tabletBreakpoint);
        this.isDesktop = this.breakpointObserver.isMatched(desktopBreakpoint);
        if (this.isTablet) {
          this.displayedColumns = [
            "product",
            "name",
            "quantity",
            "total",
            "action",
          ];
        } else {
          this.displayedColumns = [
            "product",
            "name",
            "price",
            "quantity",
            "total",
            "action",
          ];
        }
      });
  }

  private setupCartSubscription(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }
  onClearCart(): void {
    this.cartService.clearCart();
  }
  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }
  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }
  onCheckOut(): void {
    this.http
      .post(`${environment.apiUrl}/checkout`, {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51RyMsBKC5TTV9AjpkEQrY2tIQGxKu0n8FxCk8RuGvzamjTZFUJFH4oKFChlDHkbTEBXpLRf4gYhsnbgyGJrP3FsA00Ul0MzJP9"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }

  getContainerClasses(): string {
    return this.isMobile
      ? "px-4 py-4"
      : this.isTablet
      ? "px-6 py-6"
      : "px-8 py-8";
  }

  getCardClasses(): string {
    const baseClasses =
      "!shadow-md hover:!shadow-lg transition-all duration-300 overflow-hidden";
    return this.isMobile ? `${baseClasses} !mb-4` : baseClasses;
  }
}
