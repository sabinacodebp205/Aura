using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException()
            : base("Bad request.")
        {
        }

        public BadRequestException(string message)
            : base(message)
        {
        }
    }
}
