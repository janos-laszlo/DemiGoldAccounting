import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { MatDialog } from "@angular/material";

import { ClientOverview } from "../Model/ClientTransactionsOverview";
import { EmployeeView } from "../Model/EmployeeView";
import { ClientService } from "../client.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { TransactionTypeSummary } from "../Model/TransactionTypeSummary";
import { TransactionTypes, Constants } from "../constants";
import { TranslationService } from "../translation.service";

@Component({
  selector: "app-client-overview",
  templateUrl: "./client-overview.component.html",
  styleUrls: ["./client-overview.component.css"]
})
export class ClientOverviewComponent implements OnInit {
  CLIENTS = "Clients";
  EMPLOYEES = "Employees";
  DEMIGOLDLINK = "demi-gold-link";
  entityType = this.CLIENTS;
  entityName: string = "";
  employees: EmployeeView[] = [];
  clients: ClientOverview[] = [];

  constructor(
    private clientService: ClientService,
    private translationService: TranslationService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getClients();
  }

  @ViewChildren("clientsForLoop") clientElements: QueryList<any>;
  ngAfterViewInit() {
    this.clientElements.changes.subscribe(t => {
      this.clientsRendered();
    });
  }

  clientsRendered() {
    if (this.entityName) {
      this.scrollToNewClient(this.entityName);
      setTimeout(() => (this.entityName = ""));
    }
  }

  onOptionChange(): void {
    if (this.employees.length === 0) this.getEmployees();
  }

  addEntity(): void {
    if (!this.isEntityNameValid()) {
      return;
    }
    if (this.entityType === this.CLIENTS) {
      this.clientService.addClient(this.entityName).subscribe(() => {
        this.getClients();
      });
    } else {
      this.clientService.addEmployee(this.entityName).subscribe(() => {
        this.getEmployees();
        this.entityName = "";
      });
    }
  }

  openRemovalConfirmationDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(isConfirmed => {
      if (!isConfirmed) {
        return;
      }
      if (this.entityType == this.CLIENTS) {
        this.removeClient(id);
      } else {
        this.removeEmployee(id);
      }
    });
  }

  getTransactionSummaryColor(
    transactionSummary: TransactionTypeSummary
  ): string {
    if (!transactionSummary) return "";
    let classes = "transaction-type";
    if (transactionSummary.transactionType === TransactionTypes.Salar) {
      classes += " salary-transaction";
      return classes;
    }
    classes +=
      transactionSummary.cashflowType === "Negative"
        ? " outgoing-transaction"
        : " incoming-transaction";

    return classes;
  }

  openUploadProfilePicture(event) {
    event.target.previousSibling.click();
  }

  handleUploadProfilePicture(event, entityId) {
    let file: File = event.target.files[0];

    if (
      !file.name.endsWith(".png") &&
      !file.name.endsWith(".jpg") &&
      !file.name.endsWith(".jpeg")
    ) {
      this.toastr.error(this.translationService.getTextFromCache("EC26"));
      return;
    }

    if (this.entityType === this.CLIENTS) {
      this.clientService
        .setClientProfilePicture(entityId, file)
        .subscribe(() => {
          this.setProfilePictureForClient(entityId);
        });
    } else {
      this.clientService
        .setEmployeeProfilePicture(entityId, file)
        .subscribe(() => {
          this.setProfilePictureForEmployee(entityId);
        });
    }
  }

  // Private methods.
  private scrollToNewClient(entityName: string) {
    let clientNameElements = document.getElementsByClassName(this.DEMIGOLDLINK);
    let clientNameElement = Array.prototype.find.call(
      clientNameElements,
      element => element.innerHTML === entityName
    );
    clientNameElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  private getClients() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.setProfilePictureForClients();
    });
  }

  private getEmployees(): void {
    this.clientService.getEmployeesOverview().subscribe(employees => {
      this.employees = employees;
      this.setProfilePictureForEmployees();
    });
  }

  private isEntityNameValid(): boolean {
    if (!this.entityName || this.entityName.length < 3) {
      this.toastr.error(this.translationService.getTextFromCache("EC25"));

      return false;
    }

    return true;
  }

  private removeClient(id: number): void {
    this.clientService.removeClient(id).subscribe(() => {
      this.clients = this.clients.filter(c => c.id !== id);
    });
  }

  private removeEmployee(id: number): void {
    this.clientService.removeEmployee(id).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== id);
    });
  }

  private setProfilePictureForClients() {
    for (let client of this.clients) {
      client.profilePicture = client.hasProfilePicture
        ? Constants.ClientProfilePictureStorageUrl +
          client.clientName +
          ".png" +
          Constants.SharedAccessSignature
        : "https://www.imsa-search.com/wp-content/uploads/2018/06/avatar.png";
    }
  }

  private setProfilePictureForEmployees() {
    for (let employee of this.employees) {
      employee.profilePicture = employee.hasProfilePicture
        ? Constants.EmployeeProfilePictureStorageUrl +
          employee.name +
          ".png" +
          Constants.SharedAccessSignature
        : "https://www.imsa-search.com/wp-content/uploads/2018/06/avatar.png";
    }
  }

  private setProfilePictureForClient(clientId: number) {
    let client = this.clients.find(c => c.id === clientId);
    client.profilePicture =
      Constants.ClientProfilePictureStorageUrl +
      client.clientName +
      ".png" +
      Constants.SharedAccessSignature +
      "&" +
      new Date().getTime();
  }

  private setProfilePictureForEmployee(employeeId: number) {
    let employee = this.employees.find(e => e.id === employeeId);
    employee.profilePicture =
      Constants.EmployeeProfilePictureStorageUrl +
      employee.name +
      ".png" +
      Constants.SharedAccessSignature +
      "&" +
      new Date().getTime();
  }
}
