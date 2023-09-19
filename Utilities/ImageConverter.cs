using System;
using System.IO;

namespace AUtilities
{
    public class ImageConverter
    {
        public byte[] GetByteImage(string singName)
        {
            FileStream fs = null;
            BinaryReader br;
            var systemPath = AppDomain.CurrentDomain.BaseDirectory;
            var fullPath = systemPath + "Images/Logo/" + singName;
            if (File.Exists(fullPath))
            {
                fs = new FileStream(fullPath, FileMode.Open);
            }
            br = new BinaryReader(fs);
            byte[] imgbyte = br.ReadBytes(Convert.ToInt32((fs.Length)));
            br.Close();
            fs.Close();
            return imgbyte;
        }
    }
}
