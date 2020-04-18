using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Persistence;
using DemiGoldAccountingWebApi.Translations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemiGoldAccountingWebApi.Controllers
{
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionsRepository _transactionsRepository;
        private readonly TranslationService _translationService;

        public TransactionsController(TransactionsRepository transactionsRepository, TranslationService translationService)
        {
            _transactionsRepository = transactionsRepository;
            _translationService = translationService;
        }

        [Route("overview/clients")]
        [HttpGet]
        public IEnumerable<ClientOverview> GetClientsOverview()
        {
            return _transactionsRepository.GetClientsOverview();
        }

        [Route("overview/employees")]
        [HttpGet]
        public IEnumerable<EmployeeOverview> GetEmployeesOverview()
        {
            return _transactionsRepository.GetEmployeesOverview();
        }

        [Route("transactions/client/{clientId}")]
        [HttpGet]
        public IEnumerable<ClientTransactionDetails> GetClientsTransactions(int clientId)
        {
            return _transactionsRepository.GetClientsTransactions(clientId);
        }

        [Route("transactions/employee/{employeeId}")]
        [HttpGet]
        public IEnumerable<EmployeeTransactionDetails> GetEmployeesTransactions(int employeeId)
        {
            return _transactionsRepository.GetEmployeesTransactions(employeeId);
        }

        [Route("transactiontypes")]
        [HttpGet]
        public IEnumerable<TransactionType> GetTransactionTypes()
        {
            return _transactionsRepository.GetTransactionTypes();
        }

        [Route("[controller]")]
        [HttpPost]
        public ActionResult<Transaction> Post([FromBody]Transaction transaction)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _transactionsRepository.Add(transaction);
                _transactionsRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return CreatedAtAction("post", transaction.Id);
        }

        [Route("[controller]/bulk")]
        [HttpPost]
        public ActionResult<Transaction> PostTransactions([FromBody] IEnumerable<Transaction> transactions)
        {
            try
            {
                _transactionsRepository.Add(transactions);
                _transactionsRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return CreatedAtAction("post", transactions.Select(t => t.Id));
        }

        [Route("[controller]/{transactionId}")]
        [HttpDelete("{transactionId}")]
        public ActionResult Delete(int transactionId)
        {
            try
            {
                _transactionsRepository.Delete(transactionId);
                _transactionsRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return Ok(transactionId);
        }
    }
}