using System.Web.Mvc;
using System.Web.Routing;

namespace ERP_WEB
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{*allaspx}", new { allaspx = @".*(CrystalImageHandler).*" });
            routes.MapRoute(
              "Default.iis",                                              // Route name
              "{controller}/{action}/{id}",                           // URL with parameters
              new { controller = "Home", action = "LogOff", id = "" }  // Parameter defaults

          );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "LogOff", id = UrlParameter.Optional }
            );


        }
    }
}
