using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            await HandleValidationException(context, ex);
        }
        catch (Exception e)
        {
            
            await HandleException(context, e);
        }
    }

    private async Task HandleException(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        var response = env.IsDevelopment()
            ? new AppException(context.Response.StatusCode, exception.Message, exception.StackTrace) : new AppException(context.Response.StatusCode, exception.Message,null);
        var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    }

    private static async Task HandleValidationException(HttpContext context, ValidationException ex)
    {
        var validationErrors = new Dictionary<string, string[]>();

        if (ex.Errors != null)
        {
            foreach (var error in ex.Errors)
            {
                if (validationErrors.TryGetValue(error.PropertyName, out var errors))
                {
                    validationErrors[error.PropertyName] = [.. errors,error.ErrorMessage];
                }
                else
                {
                    validationErrors[error.PropertyName] = [error.ErrorMessage];
                }
            }
        }
         context.Response.StatusCode = StatusCodes.Status400BadRequest;
         var validationProblemDetails = new ValidationProblemDetails(validationErrors)
         {
             Status = StatusCodes.Status400BadRequest,
             Type = "ValidationFailure",
             Title = "Validation Error",
             Detail = "Have one or more validation errors occurred"
         };
         
         await  context.Response.WriteAsJsonAsync(validationProblemDetails);
    }
}