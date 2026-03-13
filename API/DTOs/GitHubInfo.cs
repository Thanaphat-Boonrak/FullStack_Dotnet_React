using System.Text.Json.Serialization;

namespace API.DTOs;

public class GitHubInfo
{
    public class GitHubAuthRequest
    {
        public required string Code { get; set; }
        
        [JsonPropertyName("client_id")]
        public string ClientId { get; set; }
        [JsonPropertyName("client_secret")]
        public string ClientSecret { get; set; }
        [JsonPropertyName("redirect_uri")]
        public string RedirectUri { get; set; }
      
    }
    
    public class GitHubTokenResponse
    {
        [JsonPropertyName("access_token")] public string AccessToken { get; set; } = "";
    }
    
    public class GitHunUser
    {
        public string Email { get; set; } = "";
        public string Name { get; set; } = "";
        [JsonPropertyName("avatar_url")]
        public string? ImageUrl { get; set; } = "";
    }
    
    public class GitHubEmail
    {
        public string Email { get; set; } = "";
        public bool Primary { get; set; } 
        public bool Verified { get; set; } 
    }
}