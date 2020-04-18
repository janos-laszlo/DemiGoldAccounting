import { Language } from "./Model/Language";
import { ClientTransactionDetails } from "./Model/ClientTransactionDetails";
declare global {
  interface String {
    /**
     * Returns a formated string.
     * For example: "Hello, {0}".format("Janos") // "Hello, Janos"
     * @param formatArguments An array of string values that are replaced in the string format upon which this function is called.
     */
    format(...formatArguments: string[]): string;
  }
}

export class Constants {
  static readonly BaseUrl =
    "http://demigold-accounting.eu-central-1.elasticbeanstalk.com";
  //static readonly BaseUrl: string = "http://localhost:55097";
  
  // Storage URL
  static readonly ClientProfilePictureStorageUrl = "https://demigoldstorage.blob.core.windows.net/img/";
  static readonly EmployeeProfilePictureStorageUrl = "https://demigoldstorage.blob.core.windows.net/emp/";

  // login screen
  static readonly AuthenticationUrl: string = Constants.BaseUrl + "/token";

  // overview screen
  static readonly OverviewUrl = Constants.BaseUrl + "/overview/clients";
  static readonly ClientResourceUrl = Constants.BaseUrl + "/client";
  static readonly EmployeeResourceUrl = Constants.BaseUrl + "/employee";
  static readonly EmployeesUrl = Constants.BaseUrl + "/overview/employees";
  static readonly ClientProfilePicture = Constants.BaseUrl + "/Client/UpdateProfilePicture";
  static readonly EmployeeProfilePicture = Constants.BaseUrl + "/Employee/UpdateProfilePicture";

  // transactions screen
  static readonly TransactionResourceUrl = Constants.BaseUrl + "/transactions";
  static readonly TransactionsResourceUrl = Constants.BaseUrl + "/transactions/bulk";
  static readonly ClientTransactionsUrl =
    Constants.BaseUrl + "/transactions/client";
  static readonly TransactionTypesUrl = Constants.BaseUrl + "/transactiontypes";

  // translations
  static readonly LanguagesUrl = Constants.BaseUrl + "/translation/languages";
  static readonly TranslationsUrl = Constants.BaseUrl + "/translation";

  // SAS token  
  static readonly SharedAccessSignature = "?sv=2018-03-28&ss=b&srt=sco&sp=r&se=9999-04-13T23:27:45Z&st=2019-04-13T15:27:45Z&spr=https&sig=3Jk3%2BAukB5lATiXAuNP%2FaoKFRJ0Eenh%2B0gIcFzxtJ%2Bw%3D";

  // utility functions
  static calculateProfit(transactions: ClientTransactionDetails[]): number {
    let profit: number = 0;
    for (let transaction of transactions) {
      profit +=
        transaction.cashflow === "Positive"
          ? transaction.amount
          : -transaction.amount;
    }
    profit = parseFloat(profit.toFixed(2));
    return profit;
  }
}

export class TransactionTypes {
  static readonly Salary = "Salary";
}

export const LANGUAGES: Language[] = [
  {
    id: 1,
    name: "English",
    icon: "United-Kingdom-Flag.ico"
  },
  {
    id: 2,
    name: "Magyar",
    icon: "Hungary-Flag.png"
  },
  {
    id: 3,
    name: "Română",
    icon: "Romania-Flag.png"
  },
  {
    id: 4,
    name: "Deutsche",
    icon: "Germany-Flag.png"
  }
];

export const CsvImportHeader = {
  TransactionType: "Tip tranzacție",
  Amount: "Sumă",
  Date: "Data",
  Description: "Descriere"
};