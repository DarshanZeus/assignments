using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_Excel.Models
{
    public class cellModel
    {
        public int MatrixName { get; set; } 

        public int RowNo { get; set; }

        public int ColNo { get; set; }

        public string CellValue { get; set; } = string.Empty;
    }

    public class pathToFile
    {
        public string path { get; set; } = string.Empty;
    }
}