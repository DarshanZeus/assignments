using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using backendAPI.Models;

using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text.Json; // if using ReadFromJsonAsync

using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;

using backendAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Reflection;




internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddControllers();

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<SampleDBContext>(options => options.UseSqlServer(connectionString));


        Console.WriteLine(connectionString);
        var connection = new MySqlConnection(connectionString);
        connection.Open();
        MySqlCommand command = new MySqlCommand("SELECT * FROM excel_rows_clone limit 0,100;", connection);
        var reader = command.ExecuteReader();

        Type type = reader.GetType();
        Console.WriteLine($"Object Type: {type.Name}");
        var properties = type.GetProperties();
        
        var results = new List<string>();

        foreach (var property in properties)
        {
            object propertyValue = property.GetValue(reader, null);

            // Print the property name and value
            Console.WriteLine($"{property.Name}: {propertyValue}");

            // If the property is a complex type (not a primitive type or string), recursively traverse it
            if (propertyValue != null && !property.PropertyType.IsPrimitive && property.PropertyType != typeof(string))
            {
                // TraverseObject(propertyValue);
                Console.WriteLine(propertyValue);
            }
        }
        while (reader.Read()){
            // Console.WriteLine(reader);
            
            // Console.WriteLine(reader["email_id"]);
            // Console.WriteLine(reader["name"]);
            // Console.WriteLine(reader["country"]);
            // Console.WriteLine(reader["state"]);
            // Console.WriteLine(reader["city"]);
            // Console.WriteLine(reader["telephone_number"]);
            // Console.WriteLine(reader["address_line_1"]);
            // Console.WriteLine(reader["address_line_2"]);
            // Console.WriteLine(reader["date_of_birth"]);
            // Console.WriteLine(reader["gross_salary_FY2019_20"]);
            // Console.WriteLine(reader["gross_salary_FY2020_21"]);
            // Console.WriteLine(reader["gross_salary_FY2021_22"]);
            // Console.WriteLine(reader["gross_salary_FY2022_23"]);
            // Console.WriteLine(reader["gross_salary_FY2023_24"]);
        }
        
        


        builder.Services.AddSwaggerGen();
        // Add CORS services to allow all origins
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder => builder.AllowAnyOrigin()
                                  .AllowAnyHeader()
                                  .AllowAnyMethod());
        });

        var app = builder.Build();

        app.UseCors("AllowAllOrigins");

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();

        app.UseRouting();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapGet("/getAllData", async (context) =>
            {
                await context.Response.WriteAsync("This is All the Data");
            });

        });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapPost("/getAllData", async (context) =>
            {
                var data = await new StreamReader(context.Request.Body).ReadToEndAsync();
                await context.Response.WriteAsync(data);
            });
        });

        // Enable CORS




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
            // var connection = new MySqlConnection(_connectionString);
            

            // int[][] lists = new int[][] {  list1 ,  list2 ,  list3 ,  list4  };
            var data = new string[][]
            {
        new string[] { "email_id", "name", "country", "state", "city", "telephone_number", "address_line_1", "address_line_2", "date_of_birth", "gross_salary_FY2019_20", "gross_salary_FY2020_21", "gross_salary_FY2021_22", "gross_salary_FY2022_23", "gross_salary_FY2023_24" },
        new string[] { "CLFgOvwObp@example.com", "Chris kO5yb", "Australia", "NY", "New York", "6689068265", "TfBhldG1qFrhx2jSzi0K", "5qRK6mEbs5k9KArzbNXu", "6/10/1958", "62128", "113207", "135097", "43942", "86738" },
        new string[] { "pUUL9EVd0N@example.com", "Emily FQbt6", "Australia", "TX", "Houston", "5457952956", "ArkzbJ6IcHKp2d8dZOhI", "gCm82qRCp6sR9mGRelKe", "1/10/1988", "71987", "74470", "118674", "111997", "52402" },
        new string[] { "48UKKww2bU@example.com", "Jane OZUPM", "Germany", "IL", "New York", "3553305164", "C06k7F09GrJuKLIozpzS", "OXNcxGQ7XVmJCePpJmNS", "4/15/1987", "137336", "41923", "80143", "87229", "73409" },
        new string[] { "j2jUweIYRd@example.com", "Katie HyTYR", "UK", "IL", "Chicago", "669768290", "zHBmY1RNuh4dECG1izdi", "Cq1QWX8XyMZ4ecvQrzTl", "4/6/1957", "140482", "92176", "73337", "66622", "147714" },
        new string[] { "lMwIoLRXKy@example.com", "Katie aJetY", "UK", "CA", "Los Angeles", "8141480576", "7MOzsPj6vDUq1BkbssgY", "UctLTa7nursayIcFrygd", "5/16/1951", "140968", "116895", "145380", "75615", "122402" },
        new string[] { "MQh3ipK8vk@example.com", "Jane jGX3L", "Germany", "CA", "New York", "353482959", "0P6sJj6yIaWdQ71shk3j", "rYQP8dGLWTApoOfswzUp", "11/6/1974", "75468", "58173", "133088", "146254", "94909" },
        new string[] { "dEAhspOnE9@example.com", "Chris 9Rdzx", "USA", "FL", "New York", "4041565147", "n0bl5BfoNp1R0GH4gmbL", "RfjwOa8sCIu1RUEuvkS8", "10/14/1976", "51297", "76342", "52802", "41781", "148994" },
        new string[] { "F98LTtwLvL@example.com", "Katie X3Gx5", "UK", "CA", "Phoenix", "3469563819", "4fSCVcd0yxXzBVYFXDv8", "3KBvyigH8mbUZNhpDJcE", "2/16/1972", "82928", "75816", "61833", "65611", "50962" },
        new string[] { "sRFSuwChN0@example.com", "Katie Bktxk", "Australia", "NY", "Los Angeles", "2712084976", "tpMd6sJVbsuDY1NNiCC1", "1m5LeC8uT0rSH3YkduV0", "1/20/1999", "144688", "38226", "139676", "83774", "64938" },
        new string[] { "hjSb7LElfd@example.com", "Emily LPuzu", "Germany", "NY", "Phoenix", "9893149547", "mjqWuBarPXNSxNF3m1MI", "RtVYU6yyExZk0T43ghsH", "12/27/1973", "63291", "76657", "69692", "105696", "70419" },
        new string[] { "i2cQYHnN6L@example.com", "Jane zngX4", "USA", "IL", "Houston", "273436682", "QwN4MLhgSVNqHXZwzhzv", "3DfRLGpdGsmWo61OmF4W", "8/28/1984", "133321", "114253", "111180", "141386", "71835" },
        new string[] { "8kG0oVSMaL@example.com", "Alex kXRmf", "UK", "CA", "Houston", "2148165184", "bKW3l4AvIKU82hZB2zdy", "kpTq0Od6St7paXsWi5A5", "11/17/1972", "88439", "44598", "112272", "39311", "83349" },
        new string[] { "e99xmD9Hyt@example.com", "Emily 9kjPw", "USA", "TX", "Houston", "1313221870", "4GRXfRO8FNSYHM3P4Mqv", "S6OWVbxqrtMUGnBd2k49", "1/10/1997", "137643", "67790", "88627", "124546", "44625" },
        new string[] { "OsUyCsR1US@example.com", "Emily va43C", "USA", "IL", "Chicago", "7089910029", "yPdfeXuJmtj6QYltH3MX", "eqRzVPUj2xM1yPfHsNVv", "10/28/1991", "108629", "59682", "47352", "140016", "45580" },
        new string[] { "cSfQnk9FkA@example.com", "Chris P8cHX", "Australia", "TX", "Phoenix", "8052835565", "2OfMm2JnDuxA04KtdNp1", "FPgrQQfQjVY1uJfTuftm", "3/29/1973", "69460", "138752", "95032", "119769", "66099" },
        new string[] { "ilGuaLdTsQ@example.com", "Chris TeV18", "USA", "NY", "New York", "1284070085", "f1WUEXB7kxusePIGMJni", "aLgFnVoa2oN4TAN3Lv6z", "1/9/1989", "146852", "94918", "102026", "82699", "91803" },
        new string[] { "ZLqf9iYVHx@example.com", "Katie 0LpNB", "Germany", "NY", "Los Angeles", "3148045878", "3LHoLbk8Z0lQYf3a4bqX", "f1PqHnZIMfcWKCXGcWHK", "2/19/1951", "50021", "135559", "98509", "34825", "120590" },
        new string[] { "hoo5WxVWmK@example.com", "Katie csnVg", "Canada", "IL", "New York", "3777400485", "eTBAPcShR9uMSk6yZliL", "JbTmSUBOYULVIr84F6TX", "3/3/1992", "105875", "133601", "133361", "35466", "45354" },
        new string[] { "a6sCkwzMeL@example.com", "Emily wB02d", "Australia", "CA", "New York", "2166261664", "gLch7bLvUXBHLfioSXRw", "QbtvCjGYpixfoVoZcVuh", "9/29/1997", "48985", "82031", "149330", "48564", "88813" },
        new string[] { "CLFgOvwObp@example.com", "Chris kO5yb", "Australia", "NY", "New York", "6689068265", "TfBhldG1qFrhx2jSzi0K", "5qRK6mEbs5k9KArzbNXu", "6/10/1958", "62128", "113207", "135097", "43942", "86738" },
        new string[] { "pUUL9EVd0N@example.com", "Emily FQbt6", "Australia", "TX", "Houston", "5457952956", "ArkzbJ6IcHKp2d8dZOhI", "gCm82qRCp6sR9mGRelKe", "1/10/1988", "71987", "74470", "118674", "111997", "52402" },
        new string[] { "48UKKww2bU@example.com", "Jane OZUPM", "Germany", "IL", "New York", "3553305164", "C06k7F09GrJuKLIozpzS", "OXNcxGQ7XVmJCePpJmNS", "4/15/1987", "137336", "41923", "80143", "87229", "73409" },
        new string[] { "j2jUweIYRd@example.com", "Katie HyTYR", "UK", "IL", "Chicago", "669768290", "zHBmY1RNuh4dECG1izdi", "Cq1QWX8XyMZ4ecvQrzTl", "4/6/1957", "140482", "92176", "73337", "66622", "147714" },
        new string[] { "lMwIoLRXKy@example.com", "Katie aJetY", "UK", "CA", "Los Angeles", "8141480576", "7MOzsPj6vDUq1BkbssgY", "UctLTa7nursayIcFrygd", "5/16/1951", "140968", "116895", "145380", "75615", "122402" },
        new string[] { "MQh3ipK8vk@example.com", "Jane jGX3L", "Germany", "CA", "New York", "353482959", "0P6sJj6yIaWdQ71shk3j", "rYQP8dGLWTApoOfswzUp", "11/6/1974", "75468", "58173", "133088", "146254", "94909" },
        new string[] { "dEAhspOnE9@example.com", "Chris 9Rdzx", "USA", "FL", "New York", "4041565147", "n0bl5BfoNp1R0GH4gmbL", "RfjwOa8sCIu1RUEuvkS8", "10/14/1976", "51297", "76342", "52802", "41781", "148994" },
        new string[] { "F98LTtwLvL@example.com", "Katie X3Gx5", "UK", "CA", "Phoenix", "3469563819", "4fSCVcd0yxXzBVYFXDv8", "3KBvyigH8mbUZNhpDJcE", "2/16/1972", "82928", "75816", "61833", "65611", "50962" },
        new string[] { "sRFSuwChN0@example.com", "Katie Bktxk", "Australia", "NY", "Los Angeles", "2712084976", "tpMd6sJVbsuDY1NNiCC1", "1m5LeC8uT0rSH3YkduV0", "1/20/1999", "144688", "38226", "139676", "83774", "64938" },
        new string[] { "hjSb7LElfd@example.com", "Emily LPuzu", "Germany", "NY", "Phoenix", "9893149547", "mjqWuBarPXNSxNF3m1MI", "RtVYU6yyExZk0T43ghsH", "12/27/1973", "63291", "76657", "69692", "105696", "70419" },
        new string[] { "i2cQYHnN6L@example.com", "Jane zngX4", "USA", "IL", "Houston", "273436682", "QwN4MLhgSVNqHXZwzhzv", "3DfRLGpdGsmWo61OmF4W", "8/28/1984", "133321", "114253", "111180", "141386", "71835" },
        new string[] { "8kG0oVSMaL@example.com", "Alex kXRmf", "UK", "CA", "Houston", "2148165184", "bKW3l4AvIKU82hZB2zdy", "kpTq0Od6St7paXsWi5A5", "11/17/1972", "88439", "44598", "112272", "39311", "83349" },
        new string[] { "e99xmD9Hyt@example.com", "Emily 9kjPw", "USA", "TX", "Houston", "1313221870", "4GRXfRO8FNSYHM3P4Mqv", "S6OWVbxqrtMUGnBd2k49", "1/10/1997", "137643", "67790", "88627", "124546", "44625" },
        new string[] { "OsUyCsR1US@example.com", "Emily va43C", "USA", "IL", "Chicago", "7089910029", "yPdfeXuJmtj6QYltH3MX", "eqRzVPUj2xM1yPfHsNVv", "10/28/1991", "108629", "59682", "47352", "140016", "45580" },
        new string[] { "cSfQnk9FkA@example.com", "Chris P8cHX", "Australia", "TX", "Phoenix", "8052835565", "2OfMm2JnDuxA04KtdNp1", "FPgrQQfQjVY1uJfTuftm", "3/29/1973", "69460", "138752", "95032", "119769", "66099" },
        new string[] { "ilGuaLdTsQ@example.com", "Chris TeV18", "USA", "NY", "New York", "1284070085", "f1WUEXB7kxusePIGMJni", "aLgFnVoa2oN4TAN3Lv6z", "1/9/1989", "146852", "94918", "102026", "82699", "91803" },
        new string[] { "ZLqf9iYVHx@example.com", "Katie 0LpNB", "Germany", "NY", "Los Angeles", "3148045878", "3LHoLbk8Z0lQYf3a4bqX", "f1PqHnZIMfcWKCXGcWHK", "2/19/1951", "50021", "135559", "98509", "34825", "120590" },
        new string[] { "hoo5WxVWmK@example.com", "Katie csnVg", "Canada", "IL", "New York", "3777400485", "eTBAPcShR9uMSk6yZliL", "JbTmSUBOYULVIr84F6TX", "3/3/1992", "105875", "133601", "133361", "35466", "45354" },
        new string[] { "a6sCkwzMeL@example.com", "Emily wB02d", "Australia", "CA", "New York", "2166261664", "gLch7bLvUXBHLfioSXRw", "QbtvCjGYpixfoVoZcVuh", "9/29/1997", "48985", "82031", "149330", "48564", "88813" },
        new string[] { "CLFgOvwObp@example.com", "Chris kO5yb", "Australia", "NY", "New York", "6689068265", "TfBhldG1qFrhx2jSzi0K", "5qRK6mEbs5k9KArzbNXu", "6/10/1958", "62128", "113207", "135097", "43942", "86738" },
        new string[] { "pUUL9EVd0N@example.com", "Emily FQbt6", "Australia", "TX", "Houston", "5457952956", "ArkzbJ6IcHKp2d8dZOhI", "gCm82qRCp6sR9mGRelKe", "1/10/1988", "71987", "74470", "118674", "111997", "52402" },
        new string[] { "48UKKww2bU@example.com", "Jane OZUPM", "Germany", "IL", "New York", "3553305164", "C06k7F09GrJuKLIozpzS", "OXNcxGQ7XVmJCePpJmNS", "4/15/1987", "137336", "41923", "80143", "87229", "73409" },
        new string[] { "j2jUweIYRd@example.com", "Katie HyTYR", "UK", "IL", "Chicago", "669768290", "zHBmY1RNuh4dECG1izdi", "Cq1QWX8XyMZ4ecvQrzTl", "4/6/1957", "140482", "92176", "73337", "66622", "147714" },
        new string[] { "lMwIoLRXKy@example.com", "Katie aJetY", "UK", "CA", "Los Angeles", "8141480576", "7MOzsPj6vDUq1BkbssgY", "UctLTa7nursayIcFrygd", "5/16/1951", "140968", "116895", "145380", "75615", "122402" },
        new string[] { "MQh3ipK8vk@example.com", "Jane jGX3L", "Germany", "CA", "New York", "353482959", "0P6sJj6yIaWdQ71shk3j", "rYQP8dGLWTApoOfswzUp", "11/6/1974", "75468", "58173", "133088", "146254", "94909" },
        new string[] { "dEAhspOnE9@example.com", "Chris 9Rdzx", "USA", "FL", "New York", "4041565147", "n0bl5BfoNp1R0GH4gmbL", "RfjwOa8sCIu1RUEuvkS8", "10/14/1976", "51297", "76342", "52802", "41781", "148994" },
        new string[] { "F98LTtwLvL@example.com", "Katie X3Gx5", "UK", "CA", "Phoenix", "3469563819", "4fSCVcd0yxXzBVYFXDv8", "3KBvyigH8mbUZNhpDJcE", "2/16/1972", "82928", "75816", "61833", "65611", "50962" },
        new string[] { "sRFSuwChN0@example.com", "Katie Bktxk", "Australia", "NY", "Los Angeles", "2712084976", "tpMd6sJVbsuDY1NNiCC1", "1m5LeC8uT0rSH3YkduV0", "1/20/1999", "144688", "38226", "139676", "83774", "64938" },
        new string[] { "hjSb7LElfd@example.com", "Emily LPuzu", "Germany", "NY", "Phoenix", "9893149547", "mjqWuBarPXNSxNF3m1MI", "RtVYU6yyExZk0T43ghsH", "12/27/1973", "63291", "76657", "69692", "105696", "70419" },
        new string[] { "i2cQYHnN6L@example.com", "Jane zngX4", "USA", "IL", "Houston", "273436682", "QwN4MLhgSVNqHXZwzhzv", "3DfRLGpdGsmWo61OmF4W", "8/28/1984", "133321", "114253", "111180", "141386", "71835" },
        new string[] { "8kG0oVSMaL@example.com", "Alex kXRmf", "UK", "CA", "Houston", "2148165184", "bKW3l4AvIKU82hZB2zdy", "kpTq0Od6St7paXsWi5A5", "11/17/1972", "88439", "44598", "112272", "39311", "83349" },
        new string[] { "e99xmD9Hyt@example.com", "Emily 9kjPw", "USA", "TX", "Houston", "1313221870", "4GRXfRO8FNSYHM3P4Mqv", "S6OWVbxqrtMUGnBd2k49", "1/10/1997", "137643", "67790", "88627", "124546", "44625" },
        new string[] { "OsUyCsR1US@example.com", "Emily va43C", "USA", "IL", "Chicago", "7089910029", "yPdfeXuJmtj6QYltH3MX", "eqRzVPUj2xM1yPfHsNVv", "10/28/1991", "108629", "59682", "47352", "140016", "45580" },
        new string[] { "cSfQnk9FkA@example.com", "Chris P8cHX", "Australia", "TX", "Phoenix", "8052835565", "2OfMm2JnDuxA04KtdNp1", "FPgrQQfQjVY1uJfTuftm", "3/29/1973", "69460", "138752", "95032", "119769", "66099" },
        new string[] { "ilGuaLdTsQ@example.com", "Chris TeV18", "USA", "NY", "New York", "1284070085", "f1WUEXB7kxusePIGMJni", "aLgFnVoa2oN4TAN3Lv6z", "1/9/1989", "146852", "94918", "102026", "82699", "91803" },
        new string[] { "ZLqf9iYVHx@example.com", "Katie 0LpNB", "Germany", "NY", "Los Angeles", "3148045878", "3LHoLbk8Z0lQYf3a4bqX", "f1PqHnZIMfcWKCXGcWHK", "2/19/1951", "50021", "135559", "98509", "34825", "120590" },
        new string[] { "hoo5WxVWmK@example.com", "Katie csnVg", "Canada", "IL", "New York", "3777400485", "eTBAPcShR9uMSk6yZliL", "JbTmSUBOYULVIr84F6TX", "3/3/1992", "105875", "133601", "133361", "35466", "45354" },
        new string[] { "a6sCkwzMeL@example.com", "Emily wB02d", "Australia", "CA", "New York", "2166261664", "gLch7bLvUXBHLfioSXRw", "QbtvCjGYpixfoVoZcVuh", "9/29/1997", "48985", "82031", "149330", "48564", "88813" },
        new string[] { "gNEnfzNJoi@example.com", "Alex Yl4Br", "Germany", "NY", "Phoenix", "1806258992", "06h7bdZ8TFCq9SuQYxTB", "qsoHTA7nBDTRlzjKRTpD", "3/7/1960", "136235", "41453", "109892", "123816", "142850" },
        new string[] { "y5LeWtazmo@example.com", "Katie grzZ0", "Australia", "TX", "Phoenix", "4167696425", "cNbztqDUADN9NGeTOTrk", "WygNPiF5OGFwHdUP24QU", "2/16/1981", "131808", "57780", "73009", "135169", "68996" },
        new string[] { "3e5QBdIfal@example.com", "Chris Q5ZeK", "Australia", "IL", "Houston", "5517456951", "8iZPbTHXaVOFw3WXGLF6", "gVHy3MpxS9AZiTh5wzgr", "11/4/1967", "136032", "52616", "47321", "80254", "91979" },
        new string[] { "BDhCOQUroV@example.com", "Chris Vb5SB", "UK", "FL", "Houston", "7312020807", "2jAq2DIZeCPNeG2RQbSE", "ruWZZ3qWgXOLHWBQFHe2", "11/25/1961", "113016", "141889", "49112", "75683", "46025" },
        new string[] { "9Ev4WRnALo@example.com", "Jane WZduV", "Germany", "NY", "Chicago", "1784212516", "ZK88sYOTpH2v3EuNwePy", "bQF8PU33mE9wa8Xf1OWJ", "1/6/1964", "129123", "69547", "108184", "98089", "144210" }
            };
            // {
            //     new string[] { "Email ID", "Name", "Country", "State", "City", "Telephone Number", "Address Line 1", "Address Line 2", "Date of Birth", "Gross Salary FY2019-20", "Gross Salary FY2020-21", "Gross Salary FY2021-22", "Gross Salary FY2022-23", "Gross Salary FY2023-24" },
            //     new string[] { "ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00" },
            //     new string[] { "kevinsandoval@rubio.net", "Nicole Benson", "Iraq", "New Hampshire", "Christineberg", "518.587.0703x626", "816 Jill Prairie", "Apt. 872", "1993-01-10", "73,747.00", "33,049.00", "101,446.00", "75,494.00", "45,470.00" },
            //     new string[] { "felicia57@hotmail.com", "Anita Durham", "Costa Rica", "Nevada", "Garzaborough", "868.545.7698x4073", "119 Baker Junctions Suite 423", "Suite 992", "1975-10-05", "97,402.00", "35,078.00", "134,635.00", "54,250.00", "124,625.00" },
            //     new string[] { "christopher55@yahoo.com", "Eric Mills", "Cameroon", "Utah", "Yolandaport", "001-985-457-0995x4529", "41848 Jones Keys Suite 472", "Apt. 238", "1984-06-08", "114,565.00", "47,645.00", "133,206.00", "124,991.00", "149,336.00" },
            //     new string[] { "robertseric@hotmail.com", "Sarah Taylor", "Guyana", "Massachusetts", "Reynoldsmouth", "770.567.6176x345", "686 Shelia Plaza", "Suite 205", "1987-08-22", "103,836.00", "106,379.00", "130,025.00", "66,249.00", "130,072.00" },
            //     new string[] { "jasonnavarro@kramer.com", "Alexander Mclean", "Benin", "Tennessee", "Diazchester", "298-770-2208x0376", "620 Carrie Roads Suite 983", "Apt. 465", "1995-07-21", "104,193.00", "34,391.00", "94,192.00", "66,993.00", "71,411.00" },
            //     new string[] { "urowe@gmail.com", "Diane Snyder", "Faroe Islands", "Texas", "Longton", "(110)423-2284x860", "1476 Garrett Parks", "Suite 302", "1993-03-27", "109,403.00", "44,199.00", "117,355.00", "63,013.00", "84,891.00" },
            //     new string[] { "staceykelly@hotmail.com", "Christine Hughes", "Angola", "Alabama", "Erikaburgh", "+1-638-750-4200x8976", "368 Williams Keys", "Suite 451", "1985-06-28", "131,342.00", "130,483.00", "147,171.00", "114,930.00", "146,871.00" },
            //     new string[] { "msmith@curry-hayden.org", "Heidi Thomas", "Saint Barthelemy", "Minnesota", "Stephaniebury", "+1-948-755-4141x865", "9846 Tanya Parkways", "Apt. 352", "1965-11-28", "60,366.00", "137,214.00", "32,418.00", "54,438.00", "32,527.00" },
            //     new string[] { "tonimartin@hotmail.com", "Thomas Smith", "France", "South Dakota", "South Kevinfurt", "001-113-205-0321x92559", "19109 Jeremy Oval Suite 075", "Apt. 071", "1967-12-18", "43,565.00", "35,045.00", "127,270.00", "85,023.00", "113,341.00" },
            //     new string[] { "william44@hotmail.com", "Rose Duncan", "Hong Kong", "Nebraska", "Thomasfurt", "388.809.6415x416", "6084 Vega Lodge Apt. 672", "Suite 940", "1964-02-18", "62,781.00", "135,552.00", "104,390.00", "47,053.00", "128,486.00" },
            //     new string[] { "rachel98@hotmail.com", "Cynthia Potter", "Uzbekistan", "Utah", "New Donald", "(193)703-0748", "5864 Garcia Fort Apt. 081", "Apt. 219", "1973-10-08", "53,353.00", "139,700.00", "75,305.00", "80,410.00", "133,889.00" },
            //     new string[] { "irwinlinda@curry.com", "Brittany Roberts", "Palau", "Connecticut", "Crystalview", "+1-205-749-2340x6491", "9463 Ashley Rue", "Apt. 954", "1969-02-02", "109,042.00", "82,451.00", "127,384.00", "33,828.00", "53,194.00" },
            //     new string[] { "daniel85@torres-irwin.com", "Gregory Barrett", "Bermuda", "Delaware", "East William", "035.554.5244x8237", "886 Amanda Road Apt. 326", "Apt. 441", "1970-11-21", "102,651.00", "84,740.00", "50,064.00", "85,628.00", "141,893.00" },
            //     new string[] { "jennifer94@yahoo.com", "Jeffery Hubbard DVM", "Pakistan", "Nebraska", "Livingstonton", "742.206.2238x6931", "523 Amanda Knoll Apt. 455", "Suite 292", "1967-09-05", "65,850.00", "93,589.00", "113,734.00", "128,677.00", "74,485.00" },
            //     new string[] { "melissafrye@hotmail.com", "Sean Aguirre", "Montserrat", "Washington", "Lake Antonio", "+1-041-742-8444x105", "8525 Patel Rapids", "Suite 623", "1985-03-22", "143,136.00", "137,012.00", "79,200.00", "108,092.00", "31,879.00" },
            //     new string[] { "pamela75@hotmail.com", "Amber Martinez MD", "Kenya", "Hawaii", "Jaimeton", "(953)143-7305x9661", "748 Pearson Road", "Apt. 029", "1971-10-06", "45,825.00", "32,712.00", "134,286.00", "122,301.00", "127,323.00" },
            //     new string[] { "ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00" },
            //     new string[] { "kevinsandoval@rubio.net", "Nicole Benson", "Iraq", "New Hampshire", "Christineberg", "518.587.0703x626", "816 Jill Prairie", "Apt. 872", "1993-01-10", "73,747.00", "33,049.00", "101,446.00", "75,494.00", "45,470.00" },
            //     new string[] { "felicia57@hotmail.com", "Anita Durham", "Costa Rica", "Nevada", "Garzaborough", "868.545.7698x4073", "119 Baker Junctions Suite 423", "Suite 992", "1975-10-05", "97,402.00", "35,078.00", "134,635.00", "54,250.00", "124,625.00" },
            //     new string[] { "christopher55@yahoo.com", "Eric Mills", "Cameroon", "Utah", "Yolandaport", "001-985-457-0995x4529", "41848 Jones Keys Suite 472", "Apt. 238", "1984-06-08", "114,565.00", "47,645.00", "133,206.00", "124,991.00", "149,336.00" },
            //     new string[] { "robertseric@hotmail.com", "Sarah Taylor", "Guyana", "Massachusetts", "Reynoldsmouth", "770.567.6176x345", "686 Shelia Plaza", "Suite 205", "1987-08-22", "103,836.00", "106,379.00", "130,025.00", "66,249.00", "130,072.00" },
            //     new string[] { "jasonnavarro@kramer.com", "Alexander Mclean", "Benin", "Tennessee", "Diazchester", "298-770-2208x0376", "620 Carrie Roads Suite 983", "Apt. 465", "1995-07-21", "104,193.00", "34,391.00", "94,192.00", "66,993.00", "71,411.00" },
            //     new string[] { "urowe@gmail.com", "Diane Snyder", "Faroe Islands", "Texas", "Longton", "(110)423-2284x860", "1476 Garrett Parks", "Suite 302", "1993-03-27", "109,403.00", "44,199.00", "117,355.00", "63,013.00", "84,891.00" },
            //     new string[] { "staceykelly@hotmail.com", "Christine Hughes", "Angola", "Alabama", "Erikaburgh", "+1-638-750-4200x8976", "368 Williams Keys", "Suite 451", "1985-06-28", "131,342.00", "130,483.00", "147,171.00", "114,930.00", "146,871.00" },
            //     new string[] { "msmith@curry-hayden.org", "Heidi Thomas", "Saint Barthelemy", "Minnesota", "Stephaniebury", "+1-948-755-4141x865", "9846 Tanya Parkways", "Apt. 352", "1965-11-28", "60,366.00", "137,214.00", "32,418.00", "54,438.00", "32,527.00" },
            //     new string[] { "tonimartin@hotmail.com", "Thomas Smith", "France", "South Dakota", "South Kevinfurt", "001-113-205-0321x92559", "19109 Jeremy Oval Suite 075", "Apt. 071", "1967-12-18", "43,565.00", "35,045.00", "127,270.00", "85,023.00", "113,341.00" },
            //     new string[] { "william44@hotmail.com", "Rose Duncan", "Hong Kong", "Nebraska", "Thomasfurt", "388.809.6415x416", "6084 Vega Lodge Apt. 672", "Suite 940", "1964-02-18", "62,781.00", "135,552.00", "104,390.00", "47,053.00", "128,486.00" },
            //     new string[] { "rachel98@hotmail.com", "Cynthia Potter", "Uzbekistan", "Utah", "New Donald", "(193)703-0748", "5864 Garcia Fort Apt. 081", "Apt. 219", "1973-10-08", "53,353.00", "139,700.00", "75,305.00", "80,410.00", "133,889.00" },
            //     new string[] { "irwinlinda@curry.com", "Brittany Roberts", "Palau", "Connecticut", "Crystalview", "+1-205-749-2340x6491", "9463 Ashley Rue", "Apt. 954", "1969-02-02", "109,042.00", "82,451.00", "127,384.00", "33,828.00", "53,194.00" },
            //     new string[] { "daniel85@torres-irwin.com", "Gregory Barrett", "Bermuda", "Delaware", "East William", "035.554.5244x8237", "886 Amanda Road Apt. 326", "Apt. 441", "1970-11-21", "102,651.00", "84,740.00", "50,064.00", "85,628.00", "141,893.00" },
            //     new string[] { "jennifer94@yahoo.com", "Jeffery Hubbard DVM", "Pakistan", "Nebraska", "Livingstonton", "742.206.2238x6931", "523 Amanda Knoll Apt. 455", "Suite 292", "1967-09-05", "65,850.00", "93,589.00", "113,734.00", "128,677.00", "74,485.00" },
            //     new string[] { "melissafrye@hotmail.com", "Sean Aguirre", "Montserrat", "Washington", "Lake Antonio", "+1-041-742-8444x105", "8525 Patel Rapids", "Suite 623", "1985-03-22", "143,136.00", "137,012.00", "79,200.00", "108,092.00", "31,879.00" },
            //     new string[] { "pamela75@hotmail.com", "Amber Martinez MD", "Kenya", "Hawaii", "Jaimeton", "(953)143-7305x9661", "748 Pearson Road", "Apt. 029", "1971-10-06", "45,825.00", "32,712.00", "134,286.00", "122,301.00", "127,323.00" }
            // };
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
    }
}

// record userDetail()
// record WeatherForecast(string? Summary, DateOnly Date, int TemperatureC, string? Summar)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }
