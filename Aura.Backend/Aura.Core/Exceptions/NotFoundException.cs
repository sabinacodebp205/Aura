using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aura.Core.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException()
            : base("Resource not found.")
        {
        }

        public NotFoundException(string message)
            : base(message)
        {
        }
    }
}
