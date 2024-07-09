namespace backendAPI.Models
{
    public class userDetail
    {
        public int Id { get; set; }
        public string email_id { get; set; }
        public string name { get; set; }
        public string country { get; set; }
        public string state { get; set; }
        public string city { get; set; }
        public int telephone { get; set; }
        public string address_line_1 { get; set; }
        public string address_line_2 { get; set; }
        public DateOnly date_of_birth { get; set; }
        public int gross_salary_FY2019_20 { get; set; }
        public int gross_salary_FY2020_21 { get; set; }
        public int gross_salary_FY2021_22 { get; set; }
        public int gross_salary_FY2022_23 { get; set; }
        public int gross_salary_FY2023_24 { get; set; }
        // public int Price { get; set; }

        // Constructor with 15 arguments (14 + Price)
        public userDetail(int id, string email_id, string name, string country, string state, string city, 
                          int telephone, string address_line_1, string address_line_2, DateOnly date_of_birth, 
                          int gross_salary_FY2019_20, int gross_salary_FY2020_21, int gross_salary_FY2021_22, 
                          int gross_salary_FY2022_23, int gross_salary_FY2023_24)
        {
            Id = id;
            this.email_id = email_id;
            this.name = name;
            this.country = country;
            this.state = state;
            this.city = city;
            this.telephone = telephone;
            this.address_line_1 = address_line_1;
            this.address_line_2 = address_line_2;
            this.date_of_birth = date_of_birth;
            this.gross_salary_FY2019_20 = gross_salary_FY2019_20;
            this.gross_salary_FY2020_21 = gross_salary_FY2020_21;
            this.gross_salary_FY2021_22 = gross_salary_FY2021_22;
            this.gross_salary_FY2022_23 = gross_salary_FY2022_23;
            this.gross_salary_FY2023_24 = gross_salary_FY2023_24;
            // this.Price = price;
        }
    }
}
