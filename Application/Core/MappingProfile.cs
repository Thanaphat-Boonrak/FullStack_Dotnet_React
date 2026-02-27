using API.DTOs;
using Application.DTOs;
using Application.Profile.DTOs;
using AutoMapper;
using Domain.Entities;
using Microsoft.Win32.SafeHandles;

namespace Application.Core;

public class MappingProfile: AutoMapper.Profile
{
    public MappingProfile()
    {
        CreateMap<Activity, Activity>();
        CreateMap<CreateActivityDto, Activity>();
        CreateMap<EditActivityDto, Activity>();
        CreateMap<Activity, ActivityDto>().ForMember(d => d.HostDisplayName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).User.DisplayName))
            .ForMember(d => d.HostId, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).User.Id));
        CreateMap<ActivityAttendee,UserProfile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
            .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id));
        CreateMap<User,UserProfile>();
        CreateMap<User, UserBioDto>();
        CreateMap<Comment, CommentDto>().ForMember(d => d.DisplayName, o=> o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.UserId, o => o.MapFrom(s => s.User.Id))
            .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));
    }
}