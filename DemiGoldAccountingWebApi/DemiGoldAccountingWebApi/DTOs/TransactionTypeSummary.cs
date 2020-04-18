namespace DemiGoldAccountingWebApi.DTOs
{
    public class TransactionTypeSummary
    {
        public string TransactionType { get; set; }
        public decimal Amount { get; set; }
        public string CashflowType { get; set; }
    }
}