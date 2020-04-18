import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthenticationService } from "../authentication.service";
import { TranslationService } from "../translation.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  password: string = "";
  error: string = "";

  constructor(
    private authenticationService: AuthenticationService,
    private translationService: TranslationService,
    private router: Router
  ) {}

  login(): void {
    this.authenticationService
      .authenticate(this.password)
      .subscribe(isSuccess => {
        if (isSuccess) {
          this.error = "";
          this.router.navigate(["overview"]);
        } else {
          this.error = this.translationService.getTextFromCache("EC27");
        }
      });
  }
}
