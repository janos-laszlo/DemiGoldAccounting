using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemiGoldAccountingWebApi.Persistence
{
    public class TransactionsRepository : RepositoryBase<Transaction>
    {
        public TransactionsRepository(DemiGoldAccountingContext db) : base(db) { }

        public void Add(Transaction transaction)
        {
            CheckTransactionCreationDate(transaction);
            Validate(transaction);

            _db.Transactions.Add(transaction);
        }

        public void Add(IEnumerable<Transaction> transactions)
        {
            foreach (var transaction in transactions)
            {
                CheckTransactionCreationDate(transaction);
                Validate(transaction);
            }
            _db.Transactions.AddRange(transactions);
        }

        public void Delete(int transactionId)
        {
            if (transactionId <= 0) throw new TranslatableException(TranslationCodes.ErrorCode + 1);

            var transaction = _db.Transactions.Find(transactionId);

            if (transaction == null) throw new TranslatableException(TranslationCodes.ErrorCode + 2);

            _db.Transactions.Remove(transaction);
        }

        public IEnumerable<ClientOverview> GetClientsOverview()
        {
            IQueryable<ClientOverview> clientsTransactionsOverview = _db.Clients.Select(c => new ClientOverview
            {
                Id = c.Id,
                ClientName = c.Name,
                HasProfilePicture = c.HasProfilePicture,
                TransactionTypeSummaries = _db.TransactionTypes
                    .OrderBy(t => t.DisplayIndex)
                    .Select(tt => new TransactionTypeSummary
                    {
                        TransactionType = tt.Name,
                        Amount = tt.Transactions.Where(tr => !tr.RowDeleted && tr.ClientId == c.Id).Sum(tr => tr.Amount),
                        CashflowType = tt.Cashflow.Name
                    })
            });

            return clientsTransactionsOverview.ToList();
        }

        public IEnumerable<EmployeeOverview> GetEmployeesOverview()
        {
            var employeesTransactionsOverview = _db.Employees.Select(e => new EmployeeOverview
            {
                Id = e.Id,
                Name = e.Name,
                HasProfilePicture = e.HasProfilePicture,
                TotalGiven = e.Transactions.Sum(t => t.Amount)
            });

            return employeesTransactionsOverview.ToList();
        }

        public IEnumerable<ClientTransactionDetails> GetClientsTransactions(int clientId)
        {
            var clientsTransactions = _db.Transactions
                .Where(t => !t.RowDeleted && t.ClientId == clientId)
                .OrderBy(t => t.CreatedOn)
                .Select(t => new ClientTransactionDetails
                {
                    Id = t.Id,
                    Type = t.TransactionType.Name,
                    Amount = t.Amount,
                    CreatedOn = t.CreatedOn,
                    Description = t.Description,
                    Cashflow = t.TransactionType.Cashflow.Name
                });

            return clientsTransactions.ToList();
        }

        public IEnumerable<EmployeeTransactionDetails> GetEmployeesTransactions(int employeeId)
        {
            var employeesTransactions = _db.Transactions
                .Where(t => !t.RowDeleted && t.EmployeeId == employeeId)
                .Select(t => new EmployeeTransactionDetails
                {
                    ClientName = t.Client.Name,
                    Amount = t.Amount,
                    CreatedOn = t.CreatedOn,
                    Description = t.Description
                });

            return employeesTransactions.ToList();
        }

        public IEnumerable<TransactionType> GetTransactionTypes()
        {
            return _db.TransactionTypes;
        }

        private void Validate(Transaction transaction)
        {
            if (transaction.Client == null && (transaction.ClientId == null || transaction.ClientId == 0))
            {
                throw new TranslatableException("EC14");
            }

            if (transaction.Amount <= 0) throw new TranslatableException("EC15");

            if (transaction.TransactionType == null && transaction.TransactionTypeId == 0)
            {
                throw new TranslatableException("EC16");
            }
            else
            {
                if (transaction.TransactionType == null)
                {
                    transaction.TransactionType = _db.TransactionTypes.SingleOrDefault(t => t.Id == transaction.TransactionTypeId);
                }
                if (transaction.TransactionType == null)
                {
                    throw new TranslatableException("EC17", transaction.TransactionTypeId.ToString());
                }

                if (transaction.TransactionType != null &&
                    transaction.TransactionType.Name == Constants.TransactionTypes.Salary.ToString() &&
                    transaction.Employee == null && transaction.EmployeeId == 0)
                {
                    throw new TranslatableException("EC24");
                }
            }

            if (transaction.CreatedOn != null && transaction.CreatedOn > DateTime.UtcNow)
            {
                throw new TranslatableException("EC19");
            }

            if (!_db.TransactionTypes.Any(t => t.Id == transaction.TransactionTypeId))
            {
                throw new TranslatableException("EC17", transaction.TransactionTypeId.ToString());
            }

            if (!_db.Clients.Any(c => c.Id == transaction.ClientId))
            {
                throw new TranslatableException("EC9", transaction.ClientId.ToString());
            }

            if (transaction.EmployeeId != null && transaction.EmployeeId > 0 && !_db.Employees.Any(e => e.Id == transaction.EmployeeId))
            {
                throw new TranslatableException("EC20", transaction.EmployeeId.ToString());
            }

            if (transaction.Amount > Constants.MaxTransactionAmount) throw new TranslatableException("EC21", Constants.MaxTransactionAmount.ToString());
        }

        private void CheckTransactionCreationDate(Transaction transaction)
        {
            if (transaction.CreatedOn == null || transaction.CreatedOn == DateTime.MinValue)
            {
                transaction.CreatedOn = DateTime.UtcNow;
            }
        }
    }
}
