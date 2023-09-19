using Microsoft.Office.Interop.Excel;
using System;
using System.Linq;

namespace AUtilities
{
    public class AzExportExcelToPdf
    {

        public string ConvertToPdf(string xlFilePath)
        {

            string physicalPath = System.Web.HttpContext.Current.Server.MapPath(xlFilePath);
            Application app = new Application();
            Workbook wkb = app.Workbooks.Open(physicalPath);
            try
            {

                foreach (Worksheet ws in wkb.Worksheets.OfType<Worksheet>())
                {
                    ws.PageSetup.Orientation = XlPageOrientation.xlLandscape;
                    ws.PageSetup.Zoom = false;
                    ws.PageSetup.FitToPagesWide = 1;
                    ws.PageSetup.FitToPagesTall = false;
                }

                string pdfFilePthe = xlFilePath.Contains(".xls")
                    ? xlFilePath.Replace(".xls", ".pdf")
                    : xlFilePath.Replace(".xlsx", ".pdf");
                string physicalPDfPath = System.Web.HttpContext.Current.Server.MapPath(pdfFilePthe);
                wkb.ExportAsFixedFormat(XlFixedFormatType.xlTypePDF, physicalPDfPath);

                return pdfFilePthe;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {

            }
        }

        public string ConvertToPdf(string xlFilePath, XlPaperSize paperSize)
        {

            string physicalPath = System.Web.HttpContext.Current.Server.MapPath(xlFilePath);
            Application app = new Application();
            Workbook wkb = app.Workbooks.Open(physicalPath);
            try
            {
                string path;
                if (GeneratePdf(xlFilePath, paperSize, wkb, out path)) return path;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {

            }
            return "";
        }

        private static bool GeneratePdf(string xlFilePath, XlPaperSize paperSize, Workbook wkb, out string path)
        {
            foreach (Worksheet ws in wkb.Worksheets.OfType<Worksheet>())
            {
                ws.PageSetup.Orientation = XlPageOrientation.xlLandscape;
                if (!paperSize.Equals(null))
                {
                    ws.PageSetup.PaperSize = paperSize;
                }

                ws.PageSetup.Zoom = false;
                ws.PageSetup.FitToPagesWide = 1;
                ws.PageSetup.FitToPagesTall = false;

            }

            string pdfFilePthe = xlFilePath.Contains(".xls")
                ? xlFilePath.Replace(".xls", ".pdf")
                : xlFilePath.Replace(".xlsx", ".pdf");
            string physicalPDfPath = System.Web.HttpContext.Current.Server.MapPath(pdfFilePthe);
            wkb.ExportAsFixedFormat(XlFixedFormatType.xlTypePDF, physicalPDfPath);

            path = pdfFilePthe;
            return true;
            //return false;
        }
    }
}
