import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

import { ClientOverview } from "./Model/ClientTransactionsOverview";
import { ClientTransactionDetails } from "./Model/ClientTransactionDetails";
import { TransactionModel } from "./Model/TransactionModel";
import { HttpOptions } from "./authentication.service";
import { Client } from "./Model/Client";
import { Employee } from "./Model/Employe";
import { Constants } from "./constants";
import { EmployeeView } from "./Model/EmployeeView";
import { TransactionType } from "./Model/TransactionType";
import { TranslationText } from "./Model/TranslationText";
import { Language } from "./Model/Language";

@Injectable({
  providedIn: "root"
})
export class ClientService {
  ClientsKey: string = "ClientsKey";
  transactionTypes: TransactionType[];
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getClients(): Observable<ClientOverview[]> {
    return this.http
      .get<ClientOverview[]>(Constants.OverviewUrl, HttpOptions)
      .pipe(
        tap(clients => {
          sessionStorage.setItem(this.ClientsKey, JSON.stringify(clients));
          clients.forEach(client => {
            this.calculateProfit(client);
          });
          clients.sort(c => -c.id);
        }),
        catchError(this.handleError())
      );
  }

  getClient(id: number): ClientOverview {
    return JSON.parse(sessionStorage.getItem(this.ClientsKey)).find(
      c => c.id == id
    );
  }

  getEmployeesOverview(): Observable<EmployeeView[]> {
    return this.http
      .get<EmployeeView[]>(Constants.EmployeesUrl, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(Constants.EmployeeResourceUrl, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  getTransactions(clientId: number): Observable<ClientTransactionDetails[]> {
    const url = `${Constants.ClientTransactionsUrl}/${clientId}`;
    return this.http
      .get<ClientTransactionDetails[]>(url, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  addClient(name: string): Observable<Client> {
    var client: Client = {
      id: 0,
      name: name
    };

    return this.http
      .post<Client>(Constants.ClientResourceUrl, client, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  addEmployee(name: string): Observable<Employee> {
    return this.http
      .post<Employee>(
        Constants.EmployeeResourceUrl,
        { name } as Employee,
        HttpOptions
      )
      .pipe(catchError(this.handleError()));
  }

  removeClient(id: number): Observable<any> {
    const url = `${Constants.ClientResourceUrl}/${id}`;
    return this.http
      .delete<Client>(url, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  removeEmployee(id: number): Observable<any> {
    const url = `${Constants.EmployeeResourceUrl}/${id}`;
    return this.http
      .delete<Employee>(url, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  addTransaction(
    transactionModel: TransactionModel
  ): Observable<TransactionModel> {
    return this.http
      .post<TransactionModel>(
        Constants.TransactionResourceUrl,
        transactionModel,
        HttpOptions
      )
      .pipe(catchError(this.handleError()));
  }

  removeTransaction(id: number): Observable<any> {
    const url = `${Constants.TransactionResourceUrl}/${id}`;

    return this.http
      .delete<ClientTransactionDetails>(url, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  getTransactionTypes(): Observable<TransactionType[]> {
    if (this.transactionTypes) {
      return of(this.transactionTypes);
    }

    return this.http
      .get<TransactionType[]>(Constants.TransactionTypesUrl, HttpOptions)
      .pipe(
        tap(transactionTypes => (this.transactionTypes = transactionTypes)),
        catchError(this.handleError())
      );
  }

  getTranslationTextForLanguage(
    languageId: number
  ): Observable<TranslationText> {
    const url = `${Constants.TranslationsUrl}/${languageId}`;
    return this.http
      .get<TranslationText>(url, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  getLanguages(): Observable<Language[]> {
    return this.http
      .get<Language[]>(Constants.LanguagesUrl, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  addTransactions(transactions: TransactionModel[]): Observable<number[]> {
    return this.http
      .post<number[]>(
        Constants.TransactionsResourceUrl,
        transactions,
        HttpOptions
      )
      .pipe(catchError(this.handleError()));
  }

  getTransactionTypeId(transactionType: string): number {
    return this.transactionTypes.find(t => t.name === transactionType).id;
  }

  setClientProfilePicture(clientId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("File", file);
    formData.append("entityId", clientId.toString());

    return this.http
      .post(Constants.ClientProfilePicture, formData, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  setEmployeeProfilePicture(employeeId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    formData.append("entityId", employeeId.toString());

    return this.http
      .post(Constants.EmployeeProfilePicture, formData, HttpOptions)
      .pipe(catchError(this.handleError()));
  }

  private handleError() {
    return (error: HttpErrorResponse): Observable<never> => {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error("An error occurred:", error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${error.error}`
        );
      }

      this.toastr.error(error.error);

      return throwError(error);
    };
  }

  private calculateProfit(client: ClientOverview): void {
    client.profit = 0;
    client.transactionTypeSummaries.forEach(t => {
      client.profit += (t.cashflowType === "Negative" && -t.amount) || t.amount;
    });
  }
}
