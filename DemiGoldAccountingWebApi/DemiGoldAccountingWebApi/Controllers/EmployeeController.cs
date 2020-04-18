using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Persistence;
using DemiGoldAccountingWebApi.Translations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;

namespace DemiGoldAccountingWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeesRepository _employeesRepository;
        private readonly TranslationService _translationService;
        private readonly IConfiguration _configuration;

        public EmployeeController(EmployeesRepository employeesRepository, TranslationService translationService, IConfiguration configuration)
        {
            _employeesRepository = employeesRepository;
            _translationService = translationService;
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Employee>> Get()
        {
            return _employeesRepository.GetAll();
        }

        [HttpPost]
        public ActionResult<Employee> Post([FromBody]Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _employeesRepository.Add(employee);
                _employeesRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return Ok(employee);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (id <= 0)
            {
                return BadRequest(_translationService.Translate(Request.Headers, "EC7"));
            }

            try
            {
                _employeesRepository.Delete(id);
                _employeesRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return Ok(id);
        }

        [HttpPost]
        [Route("UpdateProfilePicture")]
        public ActionResult UpdateProfilePicture([FromForm]ProfilePicture profilePicture)
        {
            int MaxFileSize = int.Parse(_configuration[Constants.MaxFileSizeKey]);
            if (profilePicture.File.Length > MaxFileSize)
            {
                return BadRequest(_translationService.Translate(Request.Headers, "EC5", (MaxFileSize / (1024 * 1024)).ToString()));
            }

            try
            {
                _employeesRepository.SetProfilePicture(profilePicture);
                _employeesRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return Created("UpdateProfilePicture", null);
        }
    }
}