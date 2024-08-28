using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Excel.Models;
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

            var settings = new ConnectionSettings(new Uri("https://localhost:9200/")).BasicAuthentication("elastic", "WzB*7FBu-cVHcU39MIC6")
                .PrettyJson()
                .DefaultIndex(defaultIndex);

            AddDefaultMappings(settings);

            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);

            CreateIndex(client, defaultIndex);
        }

        private static void AddDefaultMappings(ConnectionSettings settings)
        {
            settings
                .DefaultMappingFor<cellModel>(m => m
                    // .Ignore(p => p.Price)
                    // .Ignore(p => p.Measurement)
                );
        }

        private static void CreateIndex(IElasticClient client, string indexName)
        {
            var createIndexResponse = client.Indices.Create(indexName,
                index => index.Map<cellModel>(x => x.AutoMap())
            );
        }
    }
}