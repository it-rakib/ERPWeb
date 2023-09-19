using System;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;

namespace AUtilities
{
    public static class Utility
    {
        public static T Clone<T>(T source)
        {
            if (!typeof(T).IsSerializable)
            {
                throw new ArgumentException("The type must be serializable.", "source");
            }

            // Don't serialize a null object, simply return the default for that object
            if (ReferenceEquals(source, null))
            {
                return default(T);
            }

            IFormatter formatter = new BinaryFormatter();
            Stream stream = new MemoryStream();
            using (stream)
            {
                formatter.Serialize(stream, source);
                stream.Seek(0, SeekOrigin.Begin);
                return (T)formatter.Deserialize(stream);
            }
        }
        public static object LoadType(string typeName, string assembly, string path)
        {
            if (path == "." || string.IsNullOrEmpty(path))
                return LoadType(typeName, assembly);
            if (path[path.Length - 1] != '\\') path += '\\';
            if (!File.Exists(path + assembly)) return null;

            var asm = Assembly.LoadFrom(path + assembly);

            return (from type in asm.GetTypes() where type.FullName.Equals(typeName) select Activator.CreateInstance(type)).FirstOrDefault();
        }
        public static object LoadType(string typeName, string assembly)
        {
            if (!File.Exists(assembly))
            {
                var appRootPath = AppDomain.CurrentDomain.SetupInformation.PrivateBinPath ?? AppDomain.CurrentDomain.BaseDirectory;
                assembly = appRootPath + @"\" + assembly;
                if (!File.Exists(assembly)) return null;
            }
            var asm = Assembly.LoadFrom(assembly);
            return (from type in asm.GetTypes() where type.FullName.Equals(typeName) select Activator.CreateInstance(type)).FirstOrDefault();
        }
        public static object LoadType(string fullQualifidName)
        {
            string path = (AppDomain.CurrentDomain.SetupInformation.PrivateBinPath ??
                           AppDomain.CurrentDomain.BaseDirectory) + @"\";
            var type_assem = fullQualifidName.Split(',');
            if (!File.Exists(path + type_assem[1])) throw new Exception("Cant find " + fullQualifidName + " in " + path + type_assem[1]);
            var asm = Assembly.LoadFrom(path + type_assem[1]);
            return (from type in asm.GetTypes() where type.FullName.Equals(type_assem[0]) select Activator.CreateInstance(type)).FirstOrDefault();
        }
        public static string MapToAppPath(string path)
        {
            var appRootPath = AppDomain.CurrentDomain.SetupInformation.PrivateBinPath ?? AppDomain.CurrentDomain.BaseDirectory;
            return Path.Combine(appRootPath, path);
        }

        public static string GetSysDate()
        {
            string dateTime = DateTime.Now.Date.ToString("dd-MMM-yyyy");
            return dateTime;
        }
        private static string GetSQLConnectionString()
        {
            // stored in web.config
            return ConfigurationManager.ConnectionStrings["MSSQLConnectionString"].ToString();
        }

        public static string GetGoogleMapKey()
        { // stored in web.config
            return ConfigurationManager.AppSettings["GoogleMapKey"];
        }

        private static string ByteArrayToString(byte[] ba)
        {
            StringBuilder hex = new StringBuilder(ba.Length * 2);
            foreach (byte b in ba)
                hex.AppendFormat("{0:x2}", b);

            return hex.ToString();
        }
        public static byte[] StringToByteArray(String hex)
        {
            int NumberChars = hex.Length;
            byte[] bytes = new byte[NumberChars / 2];
            for (int i = 0; i < NumberChars; i += 2)
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            return bytes;
        }



        public static void ClearFolder(string FolderName)
        {
            DirectoryInfo dir = new DirectoryInfo(FolderName);

            foreach (FileInfo fi in dir.GetFiles())
            {
                fi.Delete();
            }

            foreach (DirectoryInfo di in dir.GetDirectories())
            {
                ClearFolder(di.FullName);
                di.Delete();

            }
        }
        public static void DeleteFile(string fileName, string filePath)
        {
            string fileNameWithPath = filePath + @"\" + fileName;
            FileInfo fi = new FileInfo(fileNameWithPath);
            fi.Delete();
        }

        public static String GetUploadPath(String folderName)
        {
            //String uploadLocation = HttpContext.Current.Server.MapPath(@"Uploads\Logo\" + folderName + @"\Send");
            String uploadLocation = HttpContext.Current.Server.MapPath(folderName);

            if (!Directory.Exists(uploadLocation))
                Directory.CreateDirectory(uploadLocation);

            return uploadLocation;
        }

    }

    public static class JsonHelper
    {
        public static string GetJson(object obj)
        {
            if (null == obj) return string.Empty;

            var serializer = new JavaScriptSerializer();

            return serializer.Serialize(obj);
        }


    }

    public static class MailSender
    {
        public static String SendMail(string mailFrom, string mailTo, string subject, string body, bool useSSL)
        {
            String errorMessage = String.Empty;
            var mailClient = new SmtpClient();
            String sender = mailFrom;
            var message = new MailMessage(sender, mailTo, subject, body);
            message.IsBodyHtml = true;
            mailClient.EnableSsl = useSSL;

            try
            {
                mailClient.Send(message);
            }
            catch (Exception ex)
            {
                errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
            }

            //Microsoft.Practices.EnterpriseLibrary.Caching.Cryptography.SymmetricStorageEncryptionProvider v = new Microsoft.Practices.EnterpriseLibrary.Caching.Cryptography.SymmetricStorageEncryptionProvider.                                    

            return errorMessage;
        }
    }

    public static class ImageHelper
    {
        public static byte[] ConvertToByteArray(Stream stream)
        {
            if (stream == null || stream.Length == 0) return null;

            var bitmap = new Bitmap(stream);
            byte[] imageData = null;

            using (var ms = new MemoryStream())
            {
                bitmap.Save(ms, bitmap.RawFormat);
                imageData = ms.ToArray();
            }

            return imageData;
        }

        public static Image ConvertToImage(byte[] imageData)
        {
            if (imageData == null || imageData.Length == 0) return null;

            using (var ms = new MemoryStream(imageData, false))
            {
                return Image.FromStream(ms, true, true);
            }
        }
    }

    public static class JavaScriptHelper
    {
        public static String GetScript(String methodName)
        {
            var jv = new StringBuilder();
            jv.AppendFormat("<script type='text/javascript'>{0};</script>", methodName);
            return jv.ToString();
        }

        public static void ExecuteScript(String methodName, Page page, String key)
        {
            String script = GetScript(methodName);
            page.ClientScript.RegisterClientScriptBlock(page.GetType(), key, script);
        }

    }
}
