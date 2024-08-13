using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE_Practice.Models
{
    public partial class ExcelCellProp
    {
        public string MatrixName { get; set; } = null!;

        public int RowNo { get; set; }

        public int ColNo { get; set; }

        public string? CellValue { get; set; }
    }
}