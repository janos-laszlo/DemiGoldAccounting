import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { LoaderService } from "../loader.service";
import { Subscription } from "rxjs/internal/Subscription";

@Component({
  selector: "app-scroll-down",
  templateUrl: "./scroll-down.component.html",
  styleUrls: ["./scroll-down.component.css"]
})
export class ScrollDownComponent implements OnInit, OnDestroy {
  showToScrollDown: boolean = true;
  loaderSubscription: Subscription = null;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderSubscription = this.loaderService.isLoading.subscribe((isLoading) => {
      if(!isLoading){
        setTimeout(() => {
          this.scrollHandler();
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
  }
  
  @HostListener("window:scroll", ["$event"])
  scrollHandler() {
    this.showToScrollDown = (window.innerHeight + window.scrollY + 5) < document.body.offsetHeight;
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
}
