using System.Web.Mvc;

namespace ERP_WEB.Controllers.MERCHN
{
    public class WashTypeController : Controller
    {
        // GET: WashType
        readonly string prefixed = "../MERCHN/WashType";
        public ActionResult Index()
        {
            if (Session["CurrentUser"] == null) return RedirectToAction("Logoff", "Home");
            return View(prefixed + "/Index");
        }
    }
}
//public async Task<JsonResult> GetWashTypeGrid(GridOptions options)
//{
//    var resuList = new List<WashTypeInfo>();
//    HttpClient client = new HttpClient();
//    client.BaseAddress = new Uri("https://localhost:44351/api/WashTypes/all");
//    var response = await client.GetStringAsync("");
//    var WashTypeList = JsonConvert.DeserializeObject<List<WashTypeInfo>>(response).ToList();
//    var obj = new
//    {
//        Items = WashTypeList,
//        TotalCount = WashTypeList.Count
//    };
//    return Json(obj, JsonRequestBehavior.AllowGet);
//}
//public void TEst()
//{
//    int x = 10;

//    x = x * 2;
//}