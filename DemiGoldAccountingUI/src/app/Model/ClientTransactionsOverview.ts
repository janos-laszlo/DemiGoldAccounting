import { TransactionTypeSummary } from './TransactionTypeSummary';

export class ClientOverview {
  id: number;
  clientName: string;
  transactionTypeSummaries: TransactionTypeSummary[];
  profit: number;
  hasProfilePicture: boolean;
  profilePicture: string;
}
