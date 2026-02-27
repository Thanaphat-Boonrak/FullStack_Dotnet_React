namespace API.Middleware;

public class AppException(int statusCode , string message,string? detail)
{
    public int StatusCode {get; set;} = statusCode;
    public string Message {get; set;} = message;
    public string? Details {get; set;}  = detail;
}