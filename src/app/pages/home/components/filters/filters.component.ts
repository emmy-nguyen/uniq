import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Subscription } from "rxjs";
import { StoreService } from "src/app/services/store.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  @Output() showCategory = new EventEmitter<string>();

  categoriesSubcription: Subscription | undefined;
  categories: Array<string> | undefined;
  selectedCategory: string | undefined;

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    this.categoriesSubcription = this.storeService
      .getAllCategories()
      .subscribe((res) => {
        this.categories = res;
      });
  }

  onShowCategory(category: string): void {
    this.selectedCategory = category;
    this.showCategory.emit(category);
  }
  ngOnDestroy(): void {
    if (this.categoriesSubcription) {
      this.categoriesSubcription.unsubscribe();
    }
  }
}
