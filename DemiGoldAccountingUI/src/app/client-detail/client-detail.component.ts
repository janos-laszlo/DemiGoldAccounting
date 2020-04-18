import { Component, OnInit, LOCALE_ID, Inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
declare let pdfMake;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { ClientTransactionDetails } from "../Model/ClientTransactionDetails";
import { ClientService } from "../client.service";
import { TransactionModel } from "../Model/TransactionModel";
import { Employee } from "../Model/Employe";
import { TransactionType } from "../Model/TransactionType";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material";
import { TransactionTypes, Constants } from "../constants";
import { ClientOverview } from "../Model/ClientTransactionsOverview";
import { formatDate } from "@angular/common";
import { TranslationService } from "../translation.service";
import { CsvParserService } from "../csv-parser.service";
import { OperationResult } from "../Model/OperationResult";
import { TransactionOperationsService } from "../transaction-operations.service";
import { CsvExampleComponent } from "../csv-example/csv-example.component";

@Component({
  selector: "app-client-detail",
  templateUrl: "./client-detail.component.html",
  styleUrls: ["./client-detail.component.css"]
})
export class ClientDetailComponent implements OnInit {
  PDF = "PDF";
  CSV = "CSV";
  profit = 0;
  clientId = +this.route.snapshot.paramMap.get("id");
  transactionModel: TransactionModel = {
    amount: null,
    description: "",
    createdOn: null,
    clientId: this.clientId,
    employeeId: null,
    transactionTypeId: 0
  };
  client: ClientOverview = this.clientService.getClient(this.clientId);
  transactions: ClientTransactionDetails[] = [];
  transactionTypes: TransactionType[] = [];
  employees: Employee[];
  downloadType = this.PDF;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private csvParserService: CsvParserService,
    private transactionOperations: TransactionOperationsService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit() {
    this.getTransactions();
    this.getTransactionTypes();
  }

  getTransactions(): void {
    this.clientService
      .getTransactions(this.clientId)
      .subscribe(transactions => {
        this.transactions = transactions;
        this.profit = Constants.calculateProfit(this.transactions);
      });
  }

  getEmployees(): void {
    this.clientService
      .getEmployees()
      .subscribe(emps => (this.employees = emps));
  }

  getTransactionTypes(): void {
    this.clientService
      .getTransactionTypes()
      .subscribe(
        transactionTypes =>
          (this.transactionTypes = transactionTypes.sort((a, b) =>
            a.displayIndex < b.displayIndex ? -1 : 1
          ))
      );
  }

  addTransaction(): void {
    let operationResult: OperationResult = this.transactionOperations.ValidateTransactionModel(
      this.transactionModel
    );
    if (!operationResult.result) {
      this.toastr.error(operationResult.error);
      return;
    }
    this.transactionModel.createdOn =
      this.transactionModel.createdOn || this.createNewDate();
    this.clientService.addTransaction(this.transactionModel).subscribe(() => {
      this.getTransactions();
      this.resetModel();
    });
  }

  openRemovalConfirmationDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(isConfirmed => {
      if (isConfirmed === true) {
        this.removeTransaction(id);
      }
    });
  }

  getSalarTransactionTypeId(): number {
    return this.clientService.getTransactionTypeId(TransactionTypes.Salar);
  }

  download() {
    switch (this.downloadType) {
      case this.PDF:
        this.downloadPDF();
        break;
      case this.CSV:
        this.downloadCSV();
        break;
      default:
        console.error("Unknown download type");
        break;
    }
  }

  downloadPDF(): void {
    var docDefinition = {
      content: [
        {
          text:
            this.client.clientName +
            ", " +
            this.translationService.getTextFromCache("Profit") +
            " = " +
            Constants.calculateProfit(this.transactions).toString(),
          style: "header"
        },
        {
          table: {
            widths: [80, 60, 75, "*"],
            body: [
              [
                {
                  text: this.translationService.getTextFromCache(
                    "TransactionType"
                  ),
                  style: "tableHeader"
                },
                {
                  text: this.translationService.getTextFromCache("Amount"),
                  style: "tableHeader"
                },
                {
                  text: this.translationService.getTextFromCache("Date"),
                  style: "tableHeader"
                },
                {
                  text: this.translationService.getTextFromCache("Description"),
                  style: "tableHeader"
                }
              ]
            ]
          }
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 15,
          color: "black"
        },
        tableRow: {
          bold: false,
          fontSize: 12,
          color: "black"
        },
        header: {
          marginBottom: 10,
          bold: true,
          fontSize: 18,
          color: "black"
        }
      }
    };
    this.transactions.forEach(t => {
      docDefinition.content[1].table.body.push([
        {
          text: this.translationService.getTextFromCache(t.type),
          style: "tableRow"
        },
        { text: t.amount.toFixed(2), style: "tableRow" },
        { text: this.getFormat(new Date(t.createdOn)), style: "tableRow" },
        { text: t.description, style: "tableRow" }
      ]);
    });
    pdfMake
      .createPdf(docDefinition)
      .download(
        this.client.clientName + "_" + this.getDocumentDateFormat() + ".pdf"
      );
  }

  downloadCSV() {
    var csvContent = this.csvParserService.createCsvContent(this.transactions);
    var encodedUri = encodeURI(csvContent);

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      this.client.clientName + this.getDocumentDateFormat() + ".csv"
    );
    document.body.appendChild(link);

    link.click();

    window.open(encodedUri);
  }

  getDateTimeNow(): Date {
    return new Date();
  }

  onTransactionTypeChange(): void {
    if (
      this.transactionModel.transactionTypeId ==
      this.getSalarTransactionTypeId()
    ) {
      this.getEmployees();
    }
  }

  getTransactionColor(transaction: ClientTransactionDetails): string {
    if (transaction.type === TransactionTypes.Salar) {
      return "salary-transaction";
    }

    return transaction && transaction.cashflow === "Positive"
      ? "green-row"
      : "red-row";
  }

  openCsvImportDialog(event) {
    event.target.previousSibling.click();
  }

  handleCsvImportFile(event) {
    let file: File = event.target.files[0];

    if (!file.name.endsWith(".csv")) {
      this.toastr.error(this.translationService.getTextFromCache("EC22"));
      return;
    }
    this.csvParserService.parseTransactionsFromCsv(
      file,
      this.clientId,
      (transactions: TransactionModel[]) => {
        this.addTransactions(transactions);
        event.target.value = "";
      }
    );
  }

  showCsvExample() {
    this.dialog.open(CsvExampleComponent);
  }

  // Private methods.
  private addTransactions(transactions: TransactionModel[]) {
    let index: number = this.transactionOperations.getDuplicateTransactionIndex(
      transactions
    );
    if (index === -1) {
      this.clientService
        .addTransactions(transactions)
        .subscribe(() => this.getTransactions());
    } else {      
      this.toastr.error(
        this.translationService
          .getTextFromCache("EC23")
          .format((index + 2).toString()) // + 2 because indexing starts at 0 and CSV header is counted.
      );
    }
  }

  private getFormat(date: Date): string {
    return (
      this.padLeft(date.getFullYear()) +
      "." +
      this.padLeft(date.getMonth() + 1) +
      "." +
      this.padLeft(date.getDate())
    );
  }

  private padLeft(s: number): string {
    if (s < 10) {
      return "0" + s;
    }
    return "" + s;
  }

  private removeTransaction(id: number): void {
    this.clientService
      .removeTransaction(id)
      .subscribe(() => this.getTransactions());
  }

  private createNewDate(): Date {
    let now = new Date();
    now.setMinutes(now.getMinutes() - 1);

    return now;
  }

  private resetModel(): void {
    this.transactionModel.amount = null;
    this.transactionModel.description = "";
    this.transactionModel.createdOn = null;
    this.transactionModel.employeeId = null;
    this.transactionModel.transactionTypeId = 0;
  }

  private getDocumentDateFormat(): string {
    let now = new Date();
    return formatDate(now, "yyyy_MMM_dd HH:mm", this.locale);
  }
}
