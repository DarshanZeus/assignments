using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Excel.Models;
using Elasticsearch.Net;
using Nest;

namespace Backend_Excel.extensions
{
    public static class ElasticSearchExtensions
    {
        public static void AddElasticsearch(
            this IServiceCollection services, 
            IConfiguration configuration
        )
        {
            var url = configuration["ELKConfiguration:url"];
            var defaultIndex = configuration["ELKConfiguration:index"];

            var settings = new ConnectionSettings(new Uri("https://172.29.209.92:9200/"))
                .ServerCertificateValidationCallback(CertificateValidations.AllowAll)
                .BasicAuthentication("elastic", "_LgtSp8k4HPR3gj3DfEn")
                .PrettyJson() // This will prettify JSON format of response
                .DisablePing()
                .DisableDirectStreaming() // This will capture the request and response for logging
                .EnableApiVersioningHeader()
                .DefaultIndex("static_row_model");

            AddDefaultMappings(settings);

            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);

            if(defaultIndex != null) CreateIndex(client, defaultIndex);
        }

        private static void AddDefaultMappings(ConnectionSettings settings)
        {
            settings
                .DefaultMappingFor<RowModel>(m => m);
        }

        private static void CreateIndex(IElasticClient client, string indexName = "static_row_model")
        {
            var indexExistsResponse = client.Indices.Exists(indexName);
    
            if (indexExistsResponse.Exists)
            {
                // Console.WriteLine("Index already exists.");
                return;
            }

            var createIndexResponse = client.Indices.Create(indexName, index => index
                .Settings(s => s
                    .NumberOfShards(1)
                    .NumberOfReplicas(0)
                )
                .Map<RowModel>(m => m.AutoMap())
            );

            if (createIndexResponse.IsValid)
            {
                Console.WriteLine("Index created successfully.");
            }
            else
            {
                Console.WriteLine("Index creation failed.");
                Console.WriteLine(createIndexResponse.DebugInformation);
            }

        }
    }
}