using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistent.Data;

namespace API.Controllers;



public class ActivityController(AppDbContext dbContext) : BaseController
{


    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetAllActivity()
    {
        return await dbContext.Activities.ToListAsync();
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<List<Activity>>> GetActivityById(string id)
    {
        var activity = await dbContext.Activities.FindAsync(id);
        if (activity == null) return NotFound($"Activity {id} not found");
        return Ok(activity);
    }
}