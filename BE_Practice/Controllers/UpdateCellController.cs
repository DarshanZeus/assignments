using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using BE_Practice.DataObjects; 
using BE_Practice.Models;

namespace BE_Practice.Controllers
{

    [ApiController]
    [Route("api")]
    public class UpdateCellController : ControllerBase
    {
        private readonly ExcelCloneContext excelCloneContext;

        [HttpPost("updateCell")]
        public async Task<ActionResult> updateCellValueAsync(ExcelDatum xlData)
        {
            try
            {
                

    
                ExcelCloneContext excelCloneContext = new ExcelCloneContext();
                excelCloneContext.ExcelData.Add(xlData);
                Console.WriteLine("Hi");
                
                // excelCloneContext.ExcelData.ToList()
                return Ok(excelCloneContext.ExcelData.ToList());
                
            }
            catch (Exception ex)
            {
                return BadRequest();
                    // _responseHandler.BadRequest(CustomErrorCode.IsRegister, ex.Message, ""));
            }
        }
        
    }
}