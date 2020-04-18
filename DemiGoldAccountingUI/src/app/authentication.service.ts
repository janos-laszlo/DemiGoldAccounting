import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";

import { User } from "./Model/User";
import { catchError, tap, map } from "rxjs/operators";
import { Constants } from "./constants";

export const HttpOptions = {
  headers: new HttpHeaders({
    "Content-Language": "1",
    "Authorization": ""
  })
};

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  private token: string = "";
  private user: User = null;

  constructor(private http: HttpClient, private router: Router) {
    if (!this.token) {
      this.token = sessionStorage.getItem("token");
    }

    if (!this.token) {
      this.router.navigate(["login"]);
    }
  }

  authenticate(password: string): Observable<boolean | {}> {
    this.user = {
      username: "JanosLaszlo",
      password: password
    };

    return this.http
      .post<any>(Constants.AuthenticationUrl, this.user, HttpOptions)
      .pipe(
        tap(response => {
          this.token = response.token;
          sessionStorage.setItem("token", response.token);
          HttpOptions.headers = HttpOptions.headers.set(
            "Authorization",
            "Bearer " + this.token
          );
        }),
        map(response => {
          return !!response.token;
        }),
        catchError(this.handleError<string>("authenticate"))
      );
  }

  getToken(): string {
    return this.token;
  }

  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      return of(result as T);
    };
  }
}
