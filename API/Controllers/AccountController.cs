using System.Net.Http.Headers;
using System.Text;
using API.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<User> signInManager,IEmailSender<User> emailSender,IConfiguration configuration) : BaseController
{

    [AllowAnonymous]
    [HttpPost("github-login")]
    public async Task<ActionResult> LoginWithGitHub(string code)
    {
        if(string.IsNullOrEmpty(code)) return BadRequest("Missing authorization code");
        
        
        using var client = new HttpClient();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        
        var token = await client.PostAsJsonAsync("https://github.com/login/oauth/access_token", new GitHubInfo.GitHubAuthRequest
        {
            Code = code,
            ClientId = configuration["Authentication:GitHub:ClientId"],
            ClientSecret = configuration["Authentication:GitHub:ClientSecret"],
            RedirectUri = $"{configuration["ClientAppUrl"]}/auth-callback",
        });
        
        
        if(!token.IsSuccessStatusCode) return BadRequest("Failed to get access token");
        var tokenContent = await token.Content.ReadFromJsonAsync<GitHubInfo.GitHubTokenResponse>();
        if(string.IsNullOrEmpty(tokenContent.AccessToken)) return BadRequest("Failed to get access token");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenContent.AccessToken);
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Reactivities");
        var userResponse = await client.GetAsync("https://api.github.com/user");
        if(!userResponse.IsSuccessStatusCode) return BadRequest("Failed to get user");
        
        var user = await userResponse.Content.ReadFromJsonAsync<GitHubInfo.GitHunUser>();
        if (string.IsNullOrEmpty(user.Email))
        {
            var emailReponse = await client.GetAsync("https://api.github.com/user/emails");
            if (emailReponse.IsSuccessStatusCode)
            {
                var emails = await emailReponse.Content.ReadFromJsonAsync<List<GitHubInfo.GitHubEmail>>();
                var primary =  emails?.FirstOrDefault(e => e is {Primary: true,Verified: true})?.Email;
                if(string.IsNullOrEmpty(primary)) return BadRequest("Email not found");
                user.Email = primary;
            }
        }
        
        
        var exsitingUser = await signInManager.UserManager.FindByEmailAsync(user!.Email);
        if (exsitingUser == null)
        {
            exsitingUser = new User()
            {
                Email = user.Email,
                UserName = user.Email,
                DisplayName = user.Name,
                ImageUrl = user.ImageUrl
            };
            var createdResult = await signInManager.UserManager.CreateAsync(exsitingUser);
            if(!createdResult.Succeeded) return  BadRequest("Failed to create user");
        }
        
        await signInManager.SignInAsync(exsitingUser,false);
        return Ok(user);
    }
    
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var user = new User()
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            DisplayName = registerDto.DisplayName,
        };

        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            await SendConfirmationEmailAsync(user, registerDto.Email);
            return Ok();
        };
        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(error.Code,error.Description);
        }
        return ValidationProblem(ModelState);
    }

    [AllowAnonymous]
    [HttpGet("resendConfirmEmail")]
    public async Task<ActionResult> ResendConfirmEmail(string? email, string? userId)
    {
        if(string.IsNullOrEmpty(email) && string.IsNullOrEmpty(userId)) return BadRequest("Email and userId must be provided");
        var user = await signInManager.UserManager.Users.FirstOrDefaultAsync(u => u.Email == email || u.Id == userId);
        if(user == null) return BadRequest("User not found");
         await SendConfirmationEmailAsync(user, user.Email);
         return Ok();
    }

    private async Task SendConfirmationEmailAsync(User user, string email)
    {
        
        var code = await signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        
        var confirmEmailUrl = $"{configuration["ClientAppUrl"]}/confirm-email?userId={user.Id}&code={code}";
        await emailSender.SendConfirmationLinkAsync(user, email, confirmEmailUrl);
    }


    [AllowAnonymous]
    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
       if (User.Identity.IsAuthenticated == false) return NoContent();
       
       var user = await signInManager.UserManager.GetUserAsync(User);
       if (user == null) return Unauthorized();
       return Ok(user);
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
    {
        var user = await signInManager.UserManager.GetUserAsync(User);
        if(user == null) return Unauthorized("No user found");
        var result = await signInManager.UserManager.ChangePasswordAsync(user,changePasswordDto.CurrentPassword,changePasswordDto.NewPassword);
        
        if(result.Succeeded) return Ok();
        return BadRequest(result.Errors.First().Description);
    }

    
}