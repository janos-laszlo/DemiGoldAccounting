import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { TransactionModel } from "./Model/TransactionModel";
import { Papa } from "ngx-papaparse";
import { ToastrService } from "ngx-toastr";
import { ClientService } from "./client.service";
import { OperationResult } from "./Model/OperationResult";
import { CsvImportHeader, Constants } from "./constants";
import { ClientTransactionDetails } from "./Model/ClientTransactionDetails";
import { TranslationService } from "./translation.service";
import { formatDate } from "@angular/common";
import { TransactionOperationsService } from "./transaction-operations.service";

@Injectable({
  providedIn: "root"
})
export class CsvParserService {
  constructor(
    private csvParser: Papa,
    private toastr: ToastrService,
    private clientService: ClientService,
    private translationService: TranslationService,
    private transactionModelValidator: TransactionOperationsService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  parseTransactionsFromCsv(file: File, clientId: number, addTransactions) {
    let options = {
      complete: result =>
        this.onTransactionParseComplete(result, clientId, addTransactions),
      error: error => this.toastr.error(error),
      header: true
    };

    this.csvParser.parse(file, options);
  }

  createCsvContent(transactions: ClientTransactionDetails[]): string {
    let csvContent: string[] = [
      "data:text/csv;charset=utf-8,\uFEFF" + this.getCSVHeader()
    ];
    let csvRow: string[] = [];

    transactions.forEach(transaction => {
      csvRow = [];
      csvRow.push(
        this.translationService.getTextFromCache(
          transaction.type.replace(",", ";")
        )
      );
      csvRow.push(transaction.amount.toFixed(2).toString());
      csvRow.push(formatDate(transaction.createdOn, "yyyy.MM.dd", this.locale));
      csvRow.push(transaction.description.replace(",", ";"));
      csvContent.push(csvRow.join(","));
    });
    csvContent.push(
      this.translationService.getTextFromCache("Profit") +
        "=" +
        Constants.calculateProfit(transactions)
    );

    return csvContent.join("\r\n");
  }

  private onTransactionParseComplete(
    result,
    clientId: number,
    addTransactions
  ) {
    let transactions: TransactionModel[] = [];
    let transaction: TransactionModel;
    let operationResult: OperationResult;
    let lineCounter = 2;
    for (let element of result.data) {
      transaction = new TransactionModel();
      transaction.amount = +(+element[CsvImportHeader.Amount]).toFixed(2);
      if (!transaction.amount) {
        this.toastr.error(
          this.translationService
            .getTextFromCache("EC28")
            .format(lineCounter.toString())
        );
        return;
      }
      try {
        transaction.transactionTypeId = this.clientService.getTransactionTypeId(
          element[CsvImportHeader.TransactionType]
        );
      } catch {
        this.toastr.error(
          this.translationService
            .getTextFromCache("EC29")
            .format(element[CsvImportHeader.TransactionType])
        );
        return;
      }
      transaction.clientId = clientId;
      transaction.description = element[CsvImportHeader.Description];
      transaction.createdOn = element[CsvImportHeader.Date]
        ? new Date(element[CsvImportHeader.Date])
        : new Date();
      operationResult = this.transactionModelValidator.ValidateTransactionModel(
        transaction
      );
      if (operationResult.result) {
        transactions.push(transaction);
      } else {
        this.toastr.error(operationResult.error);
        return;
      }
      ++lineCounter;
    }
    addTransactions(transactions);
  }

  private getCSVHeader(): string {
    return (
      this.translationService.getTextFromCache("TransactionType") +
      "," +
      this.translationService.getTextFromCache("Amount") +
      "," +
      this.translationService.getTextFromCache("Date") +
      "," +
      this.translationService.getTextFromCache("Description")
    );
  }
}
