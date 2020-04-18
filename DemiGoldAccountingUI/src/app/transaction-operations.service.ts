import { Injectable } from "@angular/core";
import { TransactionModel } from "./Model/TransactionModel";
import { ClientService } from "./client.service";
import { OperationResult } from "./Model/OperationResult";
import { TransactionTypes } from "./constants";
import { TranslationService } from "./translation.service";

@Injectable({
  providedIn: "root"
})
export class TransactionOperationsService {
  constructor(
    private clientService: ClientService,
    private translationService: TranslationService
  ) {}

  ValidateTransactionModel(
    transactionModel: TransactionModel
  ): OperationResult {
    let operationResult: OperationResult = new OperationResult();
    if (transactionModel.amount <= 0) {
      operationResult.error = this.translationService.getTextFromCache("EC15");
      operationResult.result = false;
      return operationResult;
    }
    if (!transactionModel.transactionTypeId) {
      operationResult.error = this.translationService.getTextFromCache("EC16");
      operationResult.result = false;
      return operationResult;
    } else if (
      transactionModel.transactionTypeId ==
        this.clientService.getTransactionTypeId(TransactionTypes.Salary) &&
      (!transactionModel.employeeId || isNaN(transactionModel.employeeId))
    ) {
      operationResult.error = this.translationService.getTextFromCache("EC24");
      operationResult.result = false;
      return operationResult;
    }

    operationResult.result = true;
    return operationResult;
  }

  getDuplicateTransactionIndex(transactions: TransactionModel[]): number {
    for (let i = 0; i < transactions.length - 1; ++i) {
      for (let j = i + 1; j < transactions.length; ++j) {
        if (this.areTransactionsEqual(transactions[i], transactions[j])) {
          return j;
        }
      }
    }

    return -1;
  }

  areTransactionsEqual(
    transaction1: TransactionModel,
    transaction2: TransactionModel
  ) {
    return (
      transaction1.transactionTypeId === transaction2.transactionTypeId &&
      transaction1.description === transaction2.description &&
      transaction1.createdOn.toString() === transaction2.createdOn.toString() &&
      transaction1.amount === transaction2.amount
    );
  }
}
