using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Exceptions
{
    public class ConflictException : Exception
    {
        public ConflictException()
            : base("Conflict occurred.")
        {
        }

        public ConflictException(string message)
            : base(message)
        {
        }
    }
}
