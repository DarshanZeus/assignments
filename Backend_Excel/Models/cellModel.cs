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

    public class findAndReplace
    {
        public string findStr { get; set; } = string.Empty;

        public string replaceStr { get; set; } = string.Empty;
    }

    public class foundData
    {
        public string Sheet { get; set; } = string.Empty;

        public string Cell { get; set; } = string.Empty;
        
        public string Value { get; set; } = string.Empty;
    }
}