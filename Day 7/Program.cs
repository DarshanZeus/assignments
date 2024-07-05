namespace daY_7;
using System.IO;
class Program
{
    static void Main(string[] args)
    {
        
        using(var reader = new StreamReader("./sample_user_records.csv"))
        {
            bool k=true;
            while(!reader.EndOfStream){
                var line = reader.ReadLine();
                var values = line.Split(',');
                // string json = new 
                // System.Web.Script.Serialization.JavaScriptSerializer().Serialize(values);
                // Console.WriteLine(json);
                if(k==true){
                        k=false;
                        foreach(var i in values) Console.WriteLine(i);
                    }
                // foreach(var i in values)
                    
                // k=true;
            }
            // csv.Add(line.Split(',')); // or, populate YourClass          
            // string json = new 
            //     System.Web.Script.Serialization.JavaScriptSerializer().Serialize(csv);
            
            // List<string> listA = new List<string>();
            // List<string> listB = new List<string>();
            // while (!reader.EndOfStream)
            // {
            //     
            //     var values = line.Split(';');

            //     listA.Add(values[0]);
            //     listB.Add(values[1]);
            // }
        }
    }
}
