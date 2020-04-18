import { Client } from './Client';
import { EmployeeView } from './EmployeeView';
import { TransactionType } from './TransactionType';

export class Transaction {
    id: number;
    client: Client;
    employee: EmployeeView;
    transactionType: TransactionType;
    amount: number;
    createdOn: Date;
}