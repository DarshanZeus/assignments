using System;
using System.Collections.Generic;

namespace BE_Practice.DataObjects;

public partial class ExcelDatum
{
    public string MatrixName { get; set; } = null!;

    public int RowNo { get; set; }

    public int ColNo { get; set; }

    public string? CellValue { get; set; }
}
