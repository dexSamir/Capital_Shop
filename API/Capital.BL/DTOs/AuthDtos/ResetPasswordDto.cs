﻿namespace Capital.BL.DTOs.AuthDtos;

public class ResetPasswordDto
{
    public string Email { get; set; }
    public string Code { get; set; } 
    public string NewPassword { get; set; } 
}

