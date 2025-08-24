import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Product } from "src/app/models/product.model";

@Component({
  selector: "app-product-box",
  templateUrl: "./product-box.component.html",
})
export class ProductBoxComponent implements OnInit {
  @Input() fullWidthMode = false;
  @Input() isMobile = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  getImageClasses(): string {
    if (this.fullWidthMode) {
      return this.isMobile ? "h-[200px] w-full" : "h-[392px] w-[600px]";
    }
    return this.isMobile ? "h-[180px] w-full" : "h-[200px] w-full";
  }

  getCardClasses(): string {
    const baseClasses =
      "h-full !overflow-hidden !shadow-lg hover:!shadow-xl !transition-all !duration-300 !border-0 !bg-white !p-0";

    if (this.isMobile && !this.fullWidthMode) {
      return `${baseClasses} !min-h-[300px]`;
    }

    if (this.fullWidthMode) {
      return `${baseClasses} h-full`;
    }
    return `${baseClasses} h-auto min-h-[450px] hover:!scale-[1.02]`;
  }

  getContentClasses(): string {
    const baseClasses = "flex-1 flex flex-col";

    if (this.fullWidthMode) {
      return this.isMobile
        ? `${baseClasses} !p-4`
        : `${baseClasses} !px-8 !flex !flex-col !justify-between`;
    }
    return this.isMobile ? `${baseClasses} !p-4` : `${baseClasses} !p-6`;
  }

  getTitleClasses(): string {
    const baseClasses = "!font-bold !text-gray-900 !mb-3 !leading-tight !pt-2";
    if (this.fullWidthMode && !this.isMobile) {
      return `${baseClasses} !text-lg !line-clamp-none`;
    }
    return this.isMobile
      ? `${baseClasses} !text-base !line-clamp-2`
      : `${baseClasses} !text-lg !line-clamp-2`;
  }
}
