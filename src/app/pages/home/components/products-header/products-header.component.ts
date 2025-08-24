import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-products-header",
  templateUrl: "./products-header.component.html",
})
export class ProductsHeaderComponent implements OnInit {
  @Input() isMobile = false;
  @Input() isTablet = false;
  @Input() isDesktop = true;
  @Input() currentCols = 3;
  @Input() currentSort = "desc";
  @Input() currentItemsCount = "12";

  // using Output to send data from a child to a parent
  @Output() columnsCountChange = new EventEmitter<number>();
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

  sort = "desc";
  itemsShowCount = 12;

  constructor() {}

  ngOnInit(): void {
    this.sort = this.currentSort;
    this.itemsShowCount = parseInt(this.currentItemsCount);
  }

  onSortUpdated(newSort: string): void {
    this.sort = newSort;
    this.sortChange.emit(newSort);
  }
  onItemsUpdated(count: number): void {
    this.itemsShowCount = count;
    this.itemsCountChange.emit(count);
  }
  onColumnsUpdated(colsNum: number): void {
    this.columnsCountChange.emit(colsNum);
  }

  toggleMobileView(): void {
    if (this.isMobile) {
      const newCols = this.currentCols === 1 ? 2 : 1;
      this.columnsCountChange.emit(newCols);
    }
  }
}
