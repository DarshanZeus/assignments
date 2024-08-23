using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySql.Data.MySqlClient;

internal class Program
{
    private static async global::System.Threading.Tasks.Task Main(string[] args)
    {
        var factory = new ConnectionFactory { HostName = "localhost" };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();
        int cnt = 0;

        //////////// DB connection Set up
        // var configuration = sp.GetRequiredService<IConfiguration>();
        
        //////////////////////////////////////////////////////////////////////




        channel.QueueDeclare(queue: "Insert To DB",
                             durable: false,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);

        Console.WriteLine(" [*] Waiting for messages.");

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            var connectionString = "User ID=root;Password=PASSWORD;Host=localhost;Port=3306;Database=excel_clone;Protocol=TCP;Compress=false;Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;";
            var dbConnection = new MySqlConnection(connectionString);

            
            await dbConnection.OpenAsync();
            
            
            string query = $"INSERT INTO excel_clone.excel_data (MatrixName, RowNo, ColNo, CellValue) VALUES {message} ON DUPLICATE KEY UPDATE MatrixName = VALUES(MatrixName), RowNo = VALUES(RowNo), ColNo = VALUES(ColNo), CellValue = VALUES(CellValue);";
            MySqlCommand command = new MySqlCommand(query, dbConnection);
            
            var rowsAffected = command.ExecuteNonQuery();
            cnt++;
            Console.WriteLine($" [x] Row Inserted {rowsAffected} : Inserted [x] Chunk Count {cnt}");
            // Console.WriteLine($" ");
            await dbConnection.CloseAsync();

        //////////////////////////////////////////////////////////////////////////////
        ///
            connectionString = "User ID=root;Password=PASSWORD;Host=localhost;Port=3306;Database=excel_clone;Protocol=TCP;Compress=false;Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;";
            dbConnection = new MySqlConnection(connectionString);

            
            await dbConnection.OpenAsync();
            
            
            query = $"UPDATE excel_clone.loadeddata SET completedChunks = completedChunks + 1;";
            command = new MySqlCommand(query, dbConnection);
            
            rowsAffected = command.ExecuteNonQuery();

            await dbConnection.CloseAsync();



        };
        channel.BasicConsume(queue: "Insert To DB",
                             autoAck: true,
                             consumer: consumer);


        var x = Console.ReadLine();
        Console.WriteLine(x);
        
        while (true);
    }
}