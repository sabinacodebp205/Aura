using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Exceptions
{
    public class ForbiddenException : Exception
    {
        public ForbiddenException()
            : base("Access denied.")
        {
        }

        public ForbiddenException(string message)
            : base(message)
        {
        }
    }
}
