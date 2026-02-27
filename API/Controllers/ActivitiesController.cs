using Application.Activities.Commands;
using Application.Activities.Queries;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;



public class ActivityController: BaseController
{


    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetAllActivity()
    {
        return await Mediator.Send(new GetActivityList.Query());
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivityById(string id)
    {
        return await Mediator.Send(new GetActivityDetail.Query(id));
    }


    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity([FromBody] Activity activity)
    {
        return await Mediator.Send(new CreateActivity.Command(activity));
    }
}