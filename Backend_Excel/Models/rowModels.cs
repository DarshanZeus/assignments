using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_Excel.Models
{
    public class RowModel
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Address1 { get; set; } = string.Empty;
        public string Address2 { get; set; } = string.Empty;
        public string DOB { get; set; } = string.Empty;
        public string FY_19_20 { get; set; } = string.Empty;
        public string FY_20_21 { get; set; } = string.Empty;
        public string FY_21_22 { get; set; } = string.Empty;
        public string FY_22_23 { get; set; } = string.Empty;
        public string FY_23_24 { get; set; } = string.Empty;
    }
}