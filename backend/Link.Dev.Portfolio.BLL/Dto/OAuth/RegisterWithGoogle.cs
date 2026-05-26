using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Link.Dev.Profolie.BLL.Dto.OAuth
{
    public class RegisterWithGoogle
    {
        [Required]
        [MaxLength(30)]
        public string UserName { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Compare("Password")]
        public string ConfirmPassword { get; set; } = null!;
        [EmailAddress]
        [Required]
        [StringLength(50)]
        public string Email { get; set; } = null!;
    }
}
