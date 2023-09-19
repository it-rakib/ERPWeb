using DBManager;
using Entities.MERCHN.CmnCurrency;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class CurrencyController : Controller
    {
        // GET: CmnCurrency
        public ActionResult Index()
        {
            TEst();
            return View("../MERCHN/CmnCurrency/Index");
        }
        public async Task<JsonResult> GetCurrencyGrid(GridOptions options)
        {

            var resuList = new List<CmnCurrencyInfo>();
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://localhost:44351/api/CmnCurrency/all");
            var response = await client.GetStringAsync("");
            var currencyList = JsonConvert.DeserializeObject<List<CmnCurrencyInfo>>(response).ToList();
            var obj = new
            {
                Items = currencyList,
                TotalCount = currencyList.Count
            };
            return Json(obj, JsonRequestBehavior.AllowGet);
        }
        public void TEst()
        {
            int x = 10;

            x = x * 2;
        }
    }
}