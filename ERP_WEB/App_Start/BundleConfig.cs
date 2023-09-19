using System.Web.Optimization;

namespace ERP_WEB
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include(
                 "~/Content/bootstrap.css",
                 "~/Content/docs.min.css",
                  "~/UIFramework/MessageBox/css/buttons1.css",
                 "~/Content/site.css"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                   "~/Scripts/modernizr-*"));
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        //  "~/Scripts/jquery-{version}.js",
                        "~/Scripts/Common/common.js",
                       "~/UIFramework/kendoUI2021/kendo/kendo.web.min.js",
                        "~/Scripts/json2.js",
                        "~/UIFramework/MessageBox/js/noty/jquery.noty.js",
                        "~/UIFramework/MessageBox/js/noty/layouts/center.js",
                        "~/Scripts/Common/SMSCommon.js",
                        "~/Scripts/Common/SystemCommon.js",
                        "~/Scripts/jquery.maskedinput.min.js",
                        "~/Scripts/HRM/Notification/NotificationInfo.js",
                        "~/UIFramework/MessageBox/js/noty/themes/default.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));



            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.



            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));


            BundleTable.EnableOptimizations = true;
        }
    }
}
