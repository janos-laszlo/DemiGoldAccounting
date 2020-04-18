// import { InMemoryDbService } from "angular-in-memory-web-api";
// import { Employee } from "./Model/Employee";
// import { ClientTransactionsOverview } from "./Model/ClientTransactionsOverview";
// import { ClientTransactionDetails } from "./Model/ClientTransactionDetails";

// export class InMemoryDataService implements InMemoryDbService {
//   createDb() {
//     const ClientTransactionsOverviewData: ClientTransactionsOverview[] = [
//       {
//         id: 1,
//         name: "Vasile",
//         received: 20000.31,
//         factura: 3902,
//         bonFiscal: 412.51,
//         aviz: 5646.3,
//         salar: 489,
//         altele: 4656
//       },
//       {
//         id: 2,
//         name: "Mircea",
//         received: 2058,
//         factura: 392,
//         bonFiscal: 442.42,
//         aviz: 5696.46,
//         salar: 4849.31,
//         altele: 4646
//       }
//     ];

//     const EMPLOYEES: Employee[] = [
//       {
//         id: 1,
//         name: "Razvan",
//         given: 5224
//       },
//       {
//         id: 2,
//         name: "Petre",
//         given: 8413
//       }
//     ];

//     const ClientTransactionDetailsData: ClientTransactionDetails[] = [
//       {
//         id: 1,
//         clientId: 1,
//         type: "factura",
//         amount: 214,
//         description: "cumparat ciment 300 kg",
//         date: new Date(2018, 8, 15, 13, 30, 0),
//         cashflow: "negative"
//       },
//       {
//         id: 2,
//         clientId: 1,
//         type: "salar",
//         amount: 314,
//         description: "",
//         date: new Date(2018, 8, 19, 17, 30, 0),
//         cashflow: "negative"
//       },
//       {
//         id: 3,
//         clientId: 1,
//         type: "aviz",
//         amount: 544,
//         description: "cumparat vopsea 30 kg",
//         date: new Date(2018, 8, 11, 13, 30, 0),
//         cashflow: "negative"
//       },
//       {
//         id: 4,
//         clientId: 2,
//         type: "received",
//         amount: 1214,
//         description: "primit bani de la client",
//         date: new Date(2018, 8, 5, 13, 30, 0),
//         cashflow: "positive"
//       }
//     ];

//     return {
//       EMPLOYEES,
//       ClientTransactionsOverviewData,
//       ClientTransactionDetailsData
//     };
//   }
// }
