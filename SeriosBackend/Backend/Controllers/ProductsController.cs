using Microsoft.AspNetCore.Mvc;
using MyMvcApp.Models;
using System.Collections.Generic;

namespace MyMvcApp.Controllers
{
    public class ProductsController : Controller
    {
        private static readonly List<Product> Products = new List<Product>
        {
            new Product { Id = 1, Name = "Product1", Price = 10.0M },
            new Product { Id = 2, Name = "Product2", Price = 20.0M }
        };

        public IActionResult Index()
        {
            return View(Products);
        }

        public IActionResult Details(int id)
        {
            var product = Products.Find(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return View(product);
        }
    }
}
