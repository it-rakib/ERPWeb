using System.IO;

namespace AUtilities
{
    public class Folder
    {

        public static string CreateFolder(string path)
        {

            string physicalPath = System.Web.HttpContext.Current.Server.MapPath(path);
            if (!Directory.Exists(physicalPath))
            {
                Directory.CreateDirectory(physicalPath);
            }
            //physicalPath = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("../Import/SalarySheet/"), fileName);
            return physicalPath;
        }

    }
}
