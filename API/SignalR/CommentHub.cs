using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class CommentHub(IMediator mediator) : Hub
{
    public async Task SendComment(AddComment.Command command)
    {
        var comment = await mediator.Send(command);
        
        await Clients.Group(command.ActivityId).SendAsync("ReceiveComment", comment.Value);
    }
    
    override public async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var acitivtyId = httpContext?.Request.Query["activityId"].ToString();
        if (string.IsNullOrWhiteSpace(acitivtyId)) throw new HubException("No activity Id");
        
        
        await Groups.AddToGroupAsync(Context.ConnectionId, acitivtyId);
        
        var result = await mediator.Send(new GetComments.Query(acitivtyId));
        await Clients.Caller.SendAsync("LoadComments", result.Value);
    }
}