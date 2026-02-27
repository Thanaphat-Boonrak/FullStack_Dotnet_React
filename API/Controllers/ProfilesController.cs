using API.DTOs;
using Application.Profile.Command;
using Application.Profile.DTOs;
using Application.Profile.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ProfilesController : BaseController
{
    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
    {
        return HandleResult(await Mediator.Send(new AddPhoto.Command(file)));
    }

    [HttpGet("{userId}/photos")]
    public async Task<ActionResult<List<Photo>>> GetProfilePhotos(string userId)
    {
        return HandleResult(await Mediator.Send(new GetPhotos.Query(userId)));
    }



    [HttpDelete("{photoId}/photos")]
    public async Task<ActionResult> DeleteProfilePhoto(string photoId)
    {
        return HandleResult(await Mediator.Send(new DeletePhoto.Command(photoId)));
    }


    [HttpPut("{photoId}/setMain")]
    public async Task<ActionResult> UpdateProfilePhoto(string photoId)
    {
        return HandleResult(await Mediator.Send(new SetMainPhoto.Command(photoId)));
    }


    [HttpGet("{userId}")]
    public async Task<ActionResult<UserProfile>> GetProfiles(string userId)
    {
        return HandleResult(await Mediator.Send(new GetProfile.Query(userId)));
    }


    [HttpPut]
    public async Task<ActionResult> EditProfile(UserBioDto userBioDto)
    {
        return HandleResult(await Mediator.Send(new EditProfile.Command(userBioDto)));
    }


    [HttpPost("{userId}/follow")]
    public async Task<ActionResult> FollowProfile(string userId)
    {
        return HandleResult(await Mediator.Send(new FollowToggle.Command(userId)));
    }
}