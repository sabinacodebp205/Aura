using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public UnauthorizedException()
            : base("Unauthorized access.")
        {
        }

        public UnauthorizedException(string message)
            : base(message)
        {
        }
    }
}
