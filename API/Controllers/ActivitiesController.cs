using Application.Activities.Commands;
using Application.Activities.Queries;
using Application.Core;
using Application.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;



public class ActivitiesController: BaseController
{


    [HttpGet]
    public async Task<ActionResult<PageList<ActivityDto, DateTime?>>> GetAllActivity([FromQuery]ActivityParams request)
    {
        return HandleResult(await Mediator.Send(new GetActivityList.Query(request)));
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDto>> GetActivityById(string id)
    {
        return HandleResult(await Mediator.Send(new GetActivityDetail.Query(id)));
        
    }


    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity([FromBody] CreateActivityDto activity)
    {
        return HandleResult(await Mediator.Send(new CreateActivity.Command(activity)));
    }
    
    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> UpdateActivity(string id ,[FromBody]  EditActivityDto activity)
    {
        activity.Id = id;
         return HandleResult(await Mediator.Send(new EditActivity.Command(activity)));
    }


    [HttpPost("{id}/attend")]
    public async Task<ActionResult> AttendActivity(string id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command(id))); 
    }
    
    
    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> DeleteActivity([FromRoute]string id)
    {
       return HandleResult(await Mediator.Send(new DeleteActivity.Command(id)));
       
    }


} 