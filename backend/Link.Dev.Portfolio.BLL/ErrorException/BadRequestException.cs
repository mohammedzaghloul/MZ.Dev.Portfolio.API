using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.ErrorException
{
    public class BadRequestException : Exception
    {
        public BadRequestException(string message) : base(message)
        {

        }
    }
}
