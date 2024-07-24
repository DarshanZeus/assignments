using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using backendAPI.Models;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// Add CORS services to allow all origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseRouting();

// Enable CORS
app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();






var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/userDetail", () =>
{
    // int[] list1 = new int[4] { 1, 2, 3, 4};
    // int[] list2 = new int[4] { 5, 6, 7, 8};
    // int[] list3 = new int[4] { 1, 3, 2, 1 };
    // int[] list4 = new int[4] { 5, 4, 3, 2 };

    // int[][] lists = new int[][] {  list1 ,  list2 ,  list3 ,  list4  };
    var data = new string[][]
{
    new string[] { "Email ID", "Name", "Country", "State", "City", "Telephone Number", "Address Line 1", "Address Line 2", "Date of Birth", "Gross Salary FY2019-20", "Gross Salary FY2020-21", "Gross Salary FY2021-22", "Gross Salary FY2022-23", "Gross Salary FY2023-24" },
    new string[] { "ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00" },
    new string[] { "kevinsandoval@rubio.net", "Nicole Benson", "Iraq", "New Hampshire", "Christineberg", "518.587.0703x626", "816 Jill Prairie", "Apt. 872", "1993-01-10", "73,747.00", "33,049.00", "101,446.00", "75,494.00", "45,470.00" },
    new string[] { "felicia57@hotmail.com", "Anita Durham", "Costa Rica", "Nevada", "Garzaborough", "868.545.7698x4073", "119 Baker Junctions Suite 423", "Suite 992", "1975-10-05", "97,402.00", "35,078.00", "134,635.00", "54,250.00", "124,625.00" },
    new string[] { "christopher55@yahoo.com", "Eric Mills", "Cameroon", "Utah", "Yolandaport", "001-985-457-0995x4529", "41848 Jones Keys Suite 472", "Apt. 238", "1984-06-08", "114,565.00", "47,645.00", "133,206.00", "124,991.00", "149,336.00" },
    new string[] { "robertseric@hotmail.com", "Sarah Taylor", "Guyana", "Massachusetts", "Reynoldsmouth", "770.567.6176x345", "686 Shelia Plaza", "Suite 205", "1987-08-22", "103,836.00", "106,379.00", "130,025.00", "66,249.00", "130,072.00" },
    new string[] { "jasonnavarro@kramer.com", "Alexander Mclean", "Benin", "Tennessee", "Diazchester", "298-770-2208x0376", "620 Carrie Roads Suite 983", "Apt. 465", "1995-07-21", "104,193.00", "34,391.00", "94,192.00", "66,993.00", "71,411.00" },
    new string[] { "urowe@gmail.com", "Diane Snyder", "Faroe Islands", "Texas", "Longton", "(110)423-2284x860", "1476 Garrett Parks", "Suite 302", "1993-03-27", "109,403.00", "44,199.00", "117,355.00", "63,013.00", "84,891.00" },
    new string[] { "staceykelly@hotmail.com", "Christine Hughes", "Angola", "Alabama", "Erikaburgh", "+1-638-750-4200x8976", "368 Williams Keys", "Suite 451", "1985-06-28", "131,342.00", "130,483.00", "147,171.00", "114,930.00", "146,871.00" },
    new string[] { "msmith@curry-hayden.org", "Heidi Thomas", "Saint Barthelemy", "Minnesota", "Stephaniebury", "+1-948-755-4141x865", "9846 Tanya Parkways", "Apt. 352", "1965-11-28", "60,366.00", "137,214.00", "32,418.00", "54,438.00", "32,527.00" },
    new string[] { "tonimartin@hotmail.com", "Thomas Smith", "France", "South Dakota", "South Kevinfurt", "001-113-205-0321x92559", "19109 Jeremy Oval Suite 075", "Apt. 071", "1967-12-18", "43,565.00", "35,045.00", "127,270.00", "85,023.00", "113,341.00" },
    new string[] { "william44@hotmail.com", "Rose Duncan", "Hong Kong", "Nebraska", "Thomasfurt", "388.809.6415x416", "6084 Vega Lodge Apt. 672", "Suite 940", "1964-02-18", "62,781.00", "135,552.00", "104,390.00", "47,053.00", "128,486.00" },
    new string[] { "rachel98@hotmail.com", "Cynthia Potter", "Uzbekistan", "Utah", "New Donald", "(193)703-0748", "5864 Garcia Fort Apt. 081", "Apt. 219", "1973-10-08", "53,353.00", "139,700.00", "75,305.00", "80,410.00", "133,889.00" },
    new string[] { "irwinlinda@curry.com", "Brittany Roberts", "Palau", "Connecticut", "Crystalview", "+1-205-749-2340x6491", "9463 Ashley Rue", "Apt. 954", "1969-02-02", "109,042.00", "82,451.00", "127,384.00", "33,828.00", "53,194.00" },
    new string[] { "daniel85@torres-irwin.com", "Gregory Barrett", "Bermuda", "Delaware", "East William", "035.554.5244x8237", "886 Amanda Road Apt. 326", "Apt. 441", "1970-11-21", "102,651.00", "84,740.00", "50,064.00", "85,628.00", "141,893.00" },
    new string[] { "jennifer94@yahoo.com", "Jeffery Hubbard DVM", "Pakistan", "Nebraska", "Livingstonton", "742.206.2238x6931", "523 Amanda Knoll Apt. 455", "Suite 292", "1967-09-05", "65,850.00", "93,589.00", "113,734.00", "128,677.00", "74,485.00" },
    new string[] { "melissafrye@hotmail.com", "Sean Aguirre", "Montserrat", "Washington", "Lake Antonio", "+1-041-742-8444x105", "8525 Patel Rapids", "Suite 623", "1985-03-22", "143,136.00", "137,012.00", "79,200.00", "108,092.00", "31,879.00" },
    new string[] { "pamela75@hotmail.com", "Amber Martinez MD", "Kenya", "Hawaii", "Jaimeton", "(953)143-7305x9661", "748 Pearson Road", "Apt. 029", "1971-10-06", "45,825.00", "32,712.00", "134,286.00", "122,301.00", "127,323.00" },
    new string[] { "ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00" },
    new string[] { "kevinsandoval@rubio.net", "Nicole Benson", "Iraq", "New Hampshire", "Christineberg", "518.587.0703x626", "816 Jill Prairie", "Apt. 872", "1993-01-10", "73,747.00", "33,049.00", "101,446.00", "75,494.00", "45,470.00" },
    new string[] { "felicia57@hotmail.com", "Anita Durham", "Costa Rica", "Nevada", "Garzaborough", "868.545.7698x4073", "119 Baker Junctions Suite 423", "Suite 992", "1975-10-05", "97,402.00", "35,078.00", "134,635.00", "54,250.00", "124,625.00" },
    new string[] { "christopher55@yahoo.com", "Eric Mills", "Cameroon", "Utah", "Yolandaport", "001-985-457-0995x4529", "41848 Jones Keys Suite 472", "Apt. 238", "1984-06-08", "114,565.00", "47,645.00", "133,206.00", "124,991.00", "149,336.00" },
    new string[] { "robertseric@hotmail.com", "Sarah Taylor", "Guyana", "Massachusetts", "Reynoldsmouth", "770.567.6176x345", "686 Shelia Plaza", "Suite 205", "1987-08-22", "103,836.00", "106,379.00", "130,025.00", "66,249.00", "130,072.00" },
    new string[] { "jasonnavarro@kramer.com", "Alexander Mclean", "Benin", "Tennessee", "Diazchester", "298-770-2208x0376", "620 Carrie Roads Suite 983", "Apt. 465", "1995-07-21", "104,193.00", "34,391.00", "94,192.00", "66,993.00", "71,411.00" },
    new string[] { "urowe@gmail.com", "Diane Snyder", "Faroe Islands", "Texas", "Longton", "(110)423-2284x860", "1476 Garrett Parks", "Suite 302", "1993-03-27", "109,403.00", "44,199.00", "117,355.00", "63,013.00", "84,891.00" },
    new string[] { "staceykelly@hotmail.com", "Christine Hughes", "Angola", "Alabama", "Erikaburgh", "+1-638-750-4200x8976", "368 Williams Keys", "Suite 451", "1985-06-28", "131,342.00", "130,483.00", "147,171.00", "114,930.00", "146,871.00" },
    new string[] { "msmith@curry-hayden.org", "Heidi Thomas", "Saint Barthelemy", "Minnesota", "Stephaniebury", "+1-948-755-4141x865", "9846 Tanya Parkways", "Apt. 352", "1965-11-28", "60,366.00", "137,214.00", "32,418.00", "54,438.00", "32,527.00" },
    new string[] { "tonimartin@hotmail.com", "Thomas Smith", "France", "South Dakota", "South Kevinfurt", "001-113-205-0321x92559", "19109 Jeremy Oval Suite 075", "Apt. 071", "1967-12-18", "43,565.00", "35,045.00", "127,270.00", "85,023.00", "113,341.00" },
    new string[] { "william44@hotmail.com", "Rose Duncan", "Hong Kong", "Nebraska", "Thomasfurt", "388.809.6415x416", "6084 Vega Lodge Apt. 672", "Suite 940", "1964-02-18", "62,781.00", "135,552.00", "104,390.00", "47,053.00", "128,486.00" },
    new string[] { "rachel98@hotmail.com", "Cynthia Potter", "Uzbekistan", "Utah", "New Donald", "(193)703-0748", "5864 Garcia Fort Apt. 081", "Apt. 219", "1973-10-08", "53,353.00", "139,700.00", "75,305.00", "80,410.00", "133,889.00" },
    new string[] { "irwinlinda@curry.com", "Brittany Roberts", "Palau", "Connecticut", "Crystalview", "+1-205-749-2340x6491", "9463 Ashley Rue", "Apt. 954", "1969-02-02", "109,042.00", "82,451.00", "127,384.00", "33,828.00", "53,194.00" },
    new string[] { "daniel85@torres-irwin.com", "Gregory Barrett", "Bermuda", "Delaware", "East William", "035.554.5244x8237", "886 Amanda Road Apt. 326", "Apt. 441", "1970-11-21", "102,651.00", "84,740.00", "50,064.00", "85,628.00", "141,893.00" },
    new string[] { "jennifer94@yahoo.com", "Jeffery Hubbard DVM", "Pakistan", "Nebraska", "Livingstonton", "742.206.2238x6931", "523 Amanda Knoll Apt. 455", "Suite 292", "1967-09-05", "65,850.00", "93,589.00", "113,734.00", "128,677.00", "74,485.00" },
    new string[] { "melissafrye@hotmail.com", "Sean Aguirre", "Montserrat", "Washington", "Lake Antonio", "+1-041-742-8444x105", "8525 Patel Rapids", "Suite 623", "1985-03-22", "143,136.00", "137,012.00", "79,200.00", "108,092.00", "31,879.00" },
    new string[] { "pamela75@hotmail.com", "Amber Martinez MD", "Kenya", "Hawaii", "Jaimeton", "(953)143-7305x9661", "748 Pearson Road", "Apt. 029", "1971-10-06", "45,825.00", "32,712.00", "134,286.00", "122,301.00", "127,323.00" }
};
    // Enumerable.Range(1, 27).Select(index =>
    //     new userDetail
    //     (   
    //         // index,
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // Random.Shared.Next(100000000, 999999999),
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // summaries[Random.Shared.Next(summaries.Length)],
    //         // DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
    //         // Random.Shared.Next(1000, 1000000),
    //         // Random.Shared.Next(1000, 1000000),
    //         // Random.Shared.Next(1000, 1000000),
    //         // Random.Shared.Next(1000, 1000000),
    //         // Random.Shared.Next(1000, 1000000)
    //     index, 
    //     "john.doe@example.com", 
    //     "John Doe", 
    //     "USA", 
    //     "California", 
    //     "Los Angeles", 
    //     1234567890, 
    //     "123 Main St", 
    //     "Apt 4B", 
    //     DateOnly.FromDateTime(DateTime.Now.AddDays(index)), 
    //     50000, 
    //     52000, 
    //     54000, 
    //     56000, 
    //     58000
    //     ))
    //     .ToArray();
    return data;
})
.WithName("GetWholeData")
.WithOpenApi();

app.Run();

// record userDetail()
// record WeatherForecast(string? Summary, DateOnly Date, int TemperatureC, string? Summar)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }
