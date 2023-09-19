using System;
using System.Globalization;
using System.Threading;

namespace AUtilities
{
    public class MySystemCulture
    {
        public static void ChangeDatePattern(string formate)
        {
            var culture = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            culture.DateTimeFormat.ShortDatePattern = formate;
            culture.DateTimeFormat.LongTimePattern = "HH:mm:ss";
            Thread.CurrentThread.CurrentCulture = culture;


        }

        public static void ChangeCulture()
        {
            try
            {
                //var datePattern = ConfigurationManager.AppSettings["DatePattern"];
                //ChangeDatePattern(datePattern);
                ChangeDatePattern("MM/dd/yyyy");

            }
            catch (Exception)
            {

            }

        }
    }
}
