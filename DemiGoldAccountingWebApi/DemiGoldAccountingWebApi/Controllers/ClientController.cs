using DemiGoldAccountingWebApi.Domain;
using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Persistence;
using DemiGoldAccountingWebApi.Translations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;

namespace DemiGoldAccountingWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ClientController : ControllerBase
    {
        private readonly ClientsRepository _clientsRepository;
        private readonly TranslationService _translationService;
        private readonly IConfiguration _configuration;

        public ClientController(ClientsRepository clientsRepository, TranslationService translationService, IConfiguration configuration)
        {
            _clientsRepository = clientsRepository;
            _translationService = translationService;
            _configuration = configuration;
        }

        [HttpPost(Name = "client")]
        public ActionResult<Client> Post([FromBody]Client client)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _clientsRepository.Add(client);
                _clientsRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return CreatedAtRoute("client", client);
        }

        [HttpDelete("{clientId}")]
        public ActionResult Delete(int clientId)
        {
            if (clientId <= 0)
            {
                return BadRequest(_translationService.Translate(Request.Headers, "EC6"));
            }

            try
            {
                _clientsRepository.Delete(clientId);
                _clientsRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return Ok(clientId);
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
                _clientsRepository.SetProfilePicture(profilePicture);
                _clientsRepository.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(_translationService.TranslateException(ex, Request.Headers));
            }

            return Created("UpdateProfilePicture", null);
        }
    }
}