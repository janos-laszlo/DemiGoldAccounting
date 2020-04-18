import { Injectable } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { HttpOptions } from "./authentication.service";

@Injectable()
export class AppLoadService {
  constructor() {
    this.addFormatMethodToStrinPrototype();
  }

  initialize(router: Router): Promise<any> {
    this.initializeAuthentication(router);

    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  private addFormatMethodToStrinPrototype() {
    if (!String.prototype.format) {
      String.prototype.format = function(...formatArguments) {
        return this.replace(/{(\d+)}/g, function(match: any, index: number) {
          return typeof formatArguments[index] != "undefined"
            ? formatArguments[index]
            : match;
        });
      };
    }
  }

  private initializeAuthentication(router: Router) {
    router.events.subscribe(event => {
      if (
        event instanceof NavigationStart &&
        !sessionStorage.getItem("token") &&
        event.url !== "/login"
      ) {
        router.navigate(["login"]);
      }
    });
    let token = sessionStorage.getItem("token");
    if (token) {
      HttpOptions.headers = HttpOptions.headers.set(
        "Authorization",
        "Bearer " + token
      );
    } else {
      router.navigate(["login"]);
    }
  }
}
