using DemiGoldAccountingWebApi.DTOs;
using DemiGoldAccountingWebApi.Persistence;
using DemiGoldAccountingWebApi.Translations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DemiGoldAccountingWebApi.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly TranslationService _translationService;

        public AccountController(UserManager<IdentityUser> userManager,
                                 TranslationService translationService)
        {
            _userManager = userManager;
            _translationService = translationService;
        }
        [Route("/register")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserModel userModel)
        {
            if (_userManager.Users.Any())
            {
                return BadRequest(_translationService.Translate(Request.Headers, "EC3"));
            }

            var user = new IdentityUser { UserName = userModel.username, Email = userModel.password };
            var result = await _userManager.CreateAsync(user, userModel.password);
            if (result.Succeeded)
            {
                return Ok();
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return BadRequest(ModelState);
        }

        [Route("/token")]
        [HttpPost]
        public async Task<IActionResult> GetToken([FromBody] UserModel userModel)
        {
            IdentityUser user = await _userManager.FindByNameAsync(userModel.username);
            if (user == null)
            {
                return BadRequest(_translationService.Translate(Request.Headers, "EC4"));
            }

            var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, userModel.password);
            if (isPasswordCorrect)
            {
                return Ok(new
                {
                    Token = GenerateToken(userModel.username)
                });
            }

            return BadRequest();
        }

        private string GenerateToken(string username)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("a secret that needs to be at least 16 characters long"));
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "http://localhost",
                audience: "http://localhost",
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );
            string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);

            return jwtToken;
        }
    }
}