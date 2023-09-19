using System;
using System.IO;

namespace AUtilities
{
    public class LogWriter
    {
        private string m_exePath = string.Empty;

        public LogWriter(string logMessage)
        {
            LogWrite(logMessage);
        }

        public void LogWrite(string logMessage)
        {
            m_exePath = AppDomain.CurrentDomain.BaseDirectory + "Log";

            try
            {
                if (!Directory.Exists(m_exePath))
                {
                    DirectoryInfo di = Directory.CreateDirectory(m_exePath);
                }
                else
                {
                    ClearLog();
                }


                using (StreamWriter w = File.AppendText(m_exePath + "\\" + "log.txt"))
                {
                    Log(logMessage, w);
                }



            }
            catch (Exception ex)
            {
            }
        }

        private void ClearLog()
        {
            string[] files = Directory.GetFiles(m_exePath);

            foreach (string file in files)
            {
                FileInfo fi = new FileInfo(file);
                //if (fi.LastAccessTime < DateTime.Now.AddDays(-1))  //clear 1 day old file
                //    fi.Delete();
                if (fi.LastAccessTime < DateTime.Now.AddMonths(-1))  //clear 1 month old files
                    fi.Delete();
            }

            //Clear Log
            //StreamWriter strm = File.CreateText(m_exePath + "\\" + "log.txt");
            //strm.Flush();
            //strm.Close();
        }

        public void Log(string logMessage, TextWriter txtWriter)
        {
            try
            {
                txtWriter.Write("\r\nLog Entry : ");
                txtWriter.WriteLine("{0} {1}", DateTime.Now.ToLongTimeString(),
                    DateTime.Now.ToLongDateString());
                txtWriter.WriteLine("  :");
                txtWriter.WriteLine("  :{0}", logMessage);
                txtWriter.WriteLine("-----------------------------------------------------");
            }
            catch (Exception ex)
            {
            }
        }
    }
}
