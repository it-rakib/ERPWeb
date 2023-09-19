using Microsoft.Office.Interop.Excel;
using System;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.Text.RegularExpressions;
using Image = System.Drawing.Image;

namespace AUtilities
{
    public class AzExportToExcel
    {
        DataSet ds = new DataSet();
        private Application application;
        private Workbooks workbooks;
        private Workbook workbook;
        private Sheets sheets;
        private Worksheet worksheet;
        private Range range;
        private Image myImage;

        private string strFileName = "";

        public void GenerateExcel(DataSet receiveDS, string filePath, int rowcout)
        {
            ds = receiveDS;
            strFileName = filePath;
            try
            {
                application = new Application();
                application.Visible = false;//true;
                application.DisplayAlerts = false;

                workbooks = application.Workbooks;
                workbook = (Workbook)application.Workbooks.Add(1);
                workbook.SaveAs(strFileName, XlFileFormat.xlWorkbookNormal, null, null, false, false,
                                XlSaveAsAccessMode.xlExclusive, false, false, null, null, false);

                range = ((Worksheet)workbook.ActiveSheet).get_Range("A1", "AZ1");
                range.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                //range = worksheet.Cells;
                int excelSheetRow = this.WriteDataToTheSpecifiedRange(ds.Tables[0], range, rowcout);



                range = ((Worksheet)workbook.ActiveSheet).get_Range("A1", "AZ1");
                range.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;

                //range = worksheet.Cells;
                //this.OverWriteDataToTheSpecifiedRange(ds.Tables[skuDataTableIndex], range);

                //worksheet.get_Range("A1", "AZ1").EntireColumn.AutoFit();
                //worksheet.SaveAs(strFileName, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                //                 Type.Missing, Type.Missing, Type.Missing, Type.Missing);
                Worksheet XLsheet = ((Worksheet)workbook.ActiveSheet);

                XLsheet.Columns.AutoFit();

                XLsheet.Name = ds.Tables[0].TableName;
                workbook.Save();

            }
            catch (Exception exp)
            {
                //string path = System.Web.HttpContext.Current.Server.MapPath(@"");
                //path = path.Substring(0, path.Length - 3);
                //System.IO.File.AppendAllText("LeaveYearTemp" + "/errorLog.txt", exp.Message);
                throw exp;
            }
            finally
            {
                DisposeExcelObject();
            }
        }

        public void GenerateExcelWithHeader(DataSet receiveDS, string filePath, int rowcout, string companyName, string companyAddress, int columnScape, bool istotal, DateTime salaryMonth)
        {
            ds = receiveDS;
            strFileName = filePath;
            try
            {
                application = new Application();
                application.Visible = false;//true;
                application.DisplayAlerts = false;

                workbooks = application.Workbooks;
                workbook = (Workbook)application.Workbooks.Add(1);
                workbook.SaveAs(strFileName, XlFileFormat.xlWorkbookNormal, null, null, false, false,
                                XlSaveAsAccessMode.xlExclusive, false, false, null, null, false);

                range = ((Worksheet)workbook.ActiveSheet).get_Range("A1", "AZ1");
                range.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                //range = worksheet.Cells;

                Worksheet XLsheet = ((Worksheet)workbook.ActiveSheet);
                #region Main Header

                // if (companyName != "")
                //{
                var headerRange1 = XLsheet.Range[XLsheet.Cells[1, 1], XLsheet.Cells[rowcout - 2, 6]];
                //headerRange1[1, 1] = companyName;
                headerRange1.Font.Bold = true;
                headerRange1.Font.Size = 16;
                //headerRange1.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                //headerRange1.Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                //headerRange1.Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                headerRange1.Merge(Type.Missing);
                headerRange1.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                //var picPath = "G:\\Images\\" + "report-logo.png";
                string picPath = System.Web.HttpContext.Current.Server.MapPath("../Images/report-logo.png");
                object missing = System.Reflection.Missing.Value;
                Microsoft.Office.Interop.Excel.Range picPosition = headerRange1;//GetPicturePosition(); // retrieve the range for picture insert
                Microsoft.Office.Interop.Excel.Pictures p = XLsheet.Pictures(missing) as Microsoft.Office.Interop.Excel.Pictures;
                Microsoft.Office.Interop.Excel.Picture pic = null;
                pic = p.Insert(picPath, missing);
                pic.Left = Convert.ToDouble(picPosition.Left);
                pic.Top = picPosition.Top;




                //  }
                if (companyName != "")
                {
                    var headerRange2 = XLsheet.Range[XLsheet.Cells[rowcout - 3, 7], XLsheet.Cells[rowcout - 3, 14]];
                    headerRange2[1, 1] = companyName;//companyAddress;
                    headerRange2.Font.Bold = true;
                    headerRange2.Font.Size = 12;
                    //headerRange2.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                    //headerRange2.Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                    //headerRange2.Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                    headerRange2.Merge(Type.Missing);
                    headerRange2.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                }
                // if (companyName != "")
                // {
                var headerRange3 = XLsheet.Range[XLsheet.Cells[rowcout - 1, 1], XLsheet.Cells[rowcout - 1, 6]];
                headerRange3[1, 1] = "Salary Control Register for the Month of " + salaryMonth.ToString("MMMM-yyyy");//companyAddress;
                headerRange3.Font.Bold = true;
                headerRange3.Font.Size = 12;
                headerRange3.Merge(Type.Missing);
                headerRange3.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignLeft;
                //}
                //var headerRang = XLsheet.get_Range(XLsheet.Cells[1, 1], XLsheet.Cells[1, 43]);


                #endregion


                #region Print DateTime

                //var headerRangeSystem = XLsheet.Range[XLsheet.Cells[rowcout - 1, ds.Tables[0].Columns.Count - 4], XLsheet.Cells[rowcout - 1, ds.Tables[0].Columns.Count]];
                //headerRangeSystem[1, 1] = "Print From Rapid 2.0";
                //headerRangeSystem.Font.Bold = true;
                //headerRangeSystem.Font.Size = 10;
                //headerRangeSystem.Merge(Type.Missing);
                //headerRangeSystem.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;

                //var headerRangeDateTimeVal = XLsheet.Range[XLsheet.Cells[rowcout - 2, ds.Tables[0].Columns.Count - 4], XLsheet.Cells[rowcout - 2, ds.Tables[0].Columns.Count]];
                //headerRangeDateTimeVal[1, 1] = "Print Date & Time : " + DateTime.Now.ToString("MMMM dd, yyyy") + DateTime.Now.ToString("h:mm tt");//+ DateTime.Now.ToString("d-MMM-yyyy HH.mm.ss tt", CultureInfo.InvariantCulture);//DateTime.Now.ToString("dd MMM yyyy hh:mm:ss");//companyAddress;
                //headerRangeDateTimeVal.Font.Bold = true;
                //headerRangeDateTimeVal.Font.Size = 10;
                //headerRangeDateTimeVal.Merge(Type.Missing);
                //headerRangeDateTimeVal.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;

                #endregion



                int excelSheetRow = this.WriteDataToTheSpecifiedRange(ds.Tables[0], range, rowcout);

                if (istotal)
                {

                    var colCount = ds.Tables[0].Columns.Count;
                    var dataRowCount = ds.Tables[0].Rows.Count;
                    var headerRangeTotal = XLsheet.Range[XLsheet.Cells[rowcout + dataRowCount + 1, 1], XLsheet.Cells[rowcout + dataRowCount + 1, columnScape]];
                    headerRangeTotal[1, 1] = "Total";
                    headerRangeTotal.Font.Bold = true;
                    headerRangeTotal.Font.Size = 12;
                    headerRangeTotal.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                    headerRangeTotal.Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                    headerRangeTotal.Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                    headerRangeTotal.Merge(Type.Missing);
                    headerRangeTotal.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                    //int i = columnScape - 1;

                    for (int i = 0; i < (colCount - columnScape) + 1; i++)
                    {

                        var rangeTotal = XLsheet.Range[XLsheet.Cells[rowcout + dataRowCount + 1, i + columnScape + 1], XLsheet.Cells[rowcout + dataRowCount + 1, i + columnScape + 1]];
                        string startColumnLetter = ExcelColumnLetter(i + columnScape);
                        string endColumnLetter = ExcelColumnLetter(i + columnScape);
                        rangeTotal[1, 1] = "=SUM(" + startColumnLetter + "" + (rowcout + 1) + ":" + endColumnLetter + "" + (rowcout + dataRowCount) + ")";
                        rangeTotal[1, 1].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                        rangeTotal[1, 1].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                        rangeTotal[1, 1].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);

                    }
                }


                range = ((Worksheet)workbook.ActiveSheet).get_Range("A1", "AZ1");
                range.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;

                //range = worksheet.Cells;
                //this.OverWriteDataToTheSpecifiedRange(ds.Tables[skuDataTableIndex], range);

                //worksheet.get_Range("A1", "AZ1").EntireColumn.AutoFit();
                //worksheet.SaveAs(strFileName, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing,
                //                 Type.Missing, Type.Missing, Type.Missing, Type.Missing);

                XLsheet.PageSetup.PrintTitleRows = "$1:$5";
                // XLsheet.PageSetup.RightHeader = "Page &P of &N";

                XLsheet.PageSetup.LeftFooter = "-------------------------------------\n &BPrepared By&B  \n " + "Rapid 2.0| Payroll | Print Date, Time && Page No : " + DateTime.Now.ToString("MMMM dd, yyyy") + " | " + DateTime.Now.ToString("h:mm tt") + " | " + "Page &P of &N";
                XLsheet.PageSetup.BottomMargin = application.InchesToPoints(1.5);
                XLsheet.PageSetup.CenterFooter = "-------------------------------------\n &BChecked By&B \n";
                XLsheet.PageSetup.RightFooter = "------------------\n &BApproved By&B \n";

                XLsheet.Columns.AutoFit();

                XLsheet.Name = ds.Tables[0].TableName;
                workbook.Save();

            }
            catch (Exception exp)
            {
                //string path = System.Web.HttpContext.Current.Server.MapPath(@"");
                //path = path.Substring(0, path.Length - 3);
                //System.IO.File.AppendAllText("LeaveYearTemp" + "/errorLog.txt", exp.Message);
                throw exp;
            }
            finally
            {
                DisposeExcelObject();
            }
        }

        private int WriteDataToTheSpecifiedRange(System.Data.DataTable dt, Range range, int rowount)
        {
            int iRow;
            int iCol;
            //Traverse through the DataTable columns to write the headers on the first row of the excel sheet.
            for (iCol = 0; iCol < dt.Columns.Count; iCol++)
            {
                //range = (Range)worksheet.Cells[1, (iCol + 1)];
                //range.Value2 = dt.Columns[iCol].ColumnName;
                if (iCol == 0)
                {
                    range[rowount, (iCol + 1)] = "SL";
                    range.WrapText = false;
                    range.Font.Bold = true;
                    range[rowount, (iCol + 1)].Font.Size = 10;
                    range[rowount, (iCol + 1)].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                    range[rowount, (iCol + 1)].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                    range[rowount, (iCol + 1)].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                }
                range[rowount, (iCol + 2)] = iCol < 4 ? Regex.Replace(dt.Columns[iCol].ColumnName, "([a-z])_?([A-Z])", "$1 $2") : dt.Columns[iCol].ColumnName;
                range.WrapText = false;
                range.Font.Bold = true;
                range[rowount, (iCol + 2)].Font.Size = 10;
                range[rowount, (iCol + 2)].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                range[rowount, (iCol + 2)].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                range[rowount, (iCol + 2)].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                if (iCol > 3)
                {
                    range[rowount, (iCol + 2)].Style.WrapText = true;
                    //range[rowount, (iCol + 1)].EntireRow.AutoFit();
                    //range.EntireColumn.AutoFit();
                }
                else
                {
                    range[rowount, (iCol + 2)].Style.WrapText = false;
                }
            }


            //range.AutoFit();

            //Traverse through the rows and columns of the datatable to write the data in the sheet.
            int excelSheetRow = rowount + 1;
            int sl = 1;
            for (iRow = 0; iRow < dt.Rows.Count; iRow++)
            {
                for (iCol = 0; iCol < dt.Columns.Count; iCol++)
                {
                    if (iCol == 0)
                    {
                        range[(excelSheetRow), (iCol + 1)] = sl;
                        range[(excelSheetRow), (iCol + 1)].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                        range[(excelSheetRow), (iCol + 1)].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                    }

                    range[(excelSheetRow), (iCol + 2)] = dt.Rows[iRow][iCol].ToString();
                    range[(excelSheetRow), (iCol + 2)].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                    range[(excelSheetRow), (iCol + 2)].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                    if (iCol > 3)
                    {
                        range[(excelSheetRow), (iCol + 2)].WrapText = true;
                    }
                    else
                    {
                        range[(excelSheetRow), (iCol + 2)].WrapText = false;
                    }
                    //if (dt.Columns[iCol].ColumnName == "Material")
                    //{
                    //    range[(excelSheetRow), (iCol + 1)] = "'" + dt.Rows[iRow][iCol].ToString();
                    //}
                    //else
                    //{
                    //    range[(excelSheetRow), (iCol + 1)] = dt.Rows[iRow][iCol].ToString();
                    //}

                }
                excelSheetRow++;
                sl++;
            }


            return excelSheetRow;
        }

        public void DisposeExcelObject()
        {
            try
            {



                if (workbook != null)
                    workbook.Close(true);
                if (application != null)
                {
                    if (application.Workbooks != null)
                        application.Workbooks.Close();
                    application.Quit();
                }
                if (range != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(range);
                if (workbook != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(workbook);
                if (workbooks != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(workbooks);
                if (sheets != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(sheets);
                if (sheets != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(worksheet);
                if (application != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(application);
                range = null;
                workbook = null;
                workbooks = null;
                sheets = null;
                worksheet = null;
                application = null;
                Process[] pProcess;
                pProcess = Process.GetProcessesByName("Excel");
                foreach (var process in pProcess)
                {
                    process.Kill();
                }
            }
            catch (Exception ex)
            {

            }
        }

        public string ExcelColumnLetter(int intCol)
        {
            string strColumn;
            char letter1, letter2;
            int intFirstLetter = ((intCol) / 26);
            int intSecondLetter = (intCol % 26);
            intFirstLetter = intFirstLetter + 64;
            intSecondLetter = intSecondLetter + 65;

            if (intFirstLetter > 64)
            {
                letter1 = (char)intFirstLetter;
            }
            else
                letter1 = ' ';
            letter2 = (char)intSecondLetter;
            strColumn = string.Concat(letter1, letter2);
            return strColumn.Trim();
        }

        public void GenerateExcelWithHeaderForPdf(DataSet receiveDS, string filePath, int rowcout, string companyName, string companyAddress, int columnScape, bool istotal, int itemPerPage)
        {
            ds = receiveDS;
            strFileName = filePath;
            try
            {
                application = new Application();
                application.Visible = false;//true;
                application.DisplayAlerts = false;

                workbooks = application.Workbooks;
                workbook = (Workbook)application.Workbooks.Add(1);
                workbook.SaveAs(strFileName, XlFileFormat.xlWorkbookNormal, null, null, false, false,
                                XlSaveAsAccessMode.xlExclusive, false, false, null, null, false);

                range = ((Worksheet)workbook.ActiveSheet).get_Range("A1", "AZ1");
                range.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;

                Worksheet XLsheet = ((Worksheet)workbook.ActiveSheet);


                int excelSheetRow = this.WriteDataToTheSpecifiedRangeForPdf(ds.Tables[0], range, rowcout, itemPerPage, XLsheet, rowcout, companyName, columnScape);

                //if (istotal)
                //{

                //    var colCount = ds.Tables[0].Columns.Count;
                //    var dataRowCount = ds.Tables[0].Rows.Count;
                //    var headerRangeTotal = XLsheet.Range[XLsheet.Cells[excelSheetRow + 1, 1], XLsheet.Cells[excelSheetRow + 1, columnScape]];
                //    headerRangeTotal[1, 1] = "Total";
                //    headerRangeTotal.Font.Bold = true;
                //    headerRangeTotal.Font.Size = 12;
                //    headerRangeTotal.Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                //    headerRangeTotal.Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                //    headerRangeTotal.Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                //    headerRangeTotal.Merge(Type.Missing);
                //    headerRangeTotal.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                //    //int i = columnScape - 1;

                //    for (int i = 0; i < colCount - columnScape; i++)
                //    {

                //        //var rangeTotal = XLsheet.Range[XLsheet.Cells[rowcout + dataRowCount + 1, i + columnScape + 1], XLsheet.Cells[rowcout + dataRowCount + 1, i + columnScape + 1]];
                //        var rangeTotal = XLsheet.Range[XLsheet.Cells[excelSheetRow + 1, i + columnScape + 1], XLsheet.Cells[excelSheetRow + 1, i + columnScape + 1]];
                //        string startColumnLetter = ExcelColumnLetter(i + columnScape);
                //        string endColumnLetter = ExcelColumnLetter(i + columnScape);
                //        rangeTotal[1, 1] = "=SUM(" + startColumnLetter + "" + (rowcout + 1) + ":" + endColumnLetter + "" + (rowcout + dataRowCount) + ")";
                //        rangeTotal[1, 1].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                //        rangeTotal[1, 1].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                //        rangeTotal[1, 1].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);

                //    }
                //}


                range = ((Worksheet)workbook.ActiveSheet).get_Range("A1", "AZ1");
                range.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                XLsheet.PageSetup.PrintTitleRows = "$1:$6";
                XLsheet.Columns.AutoFit();

                XLsheet.Name = ds.Tables[0].TableName;
                workbook.Save();

            }
            catch (Exception exp)
            {

                throw exp;
            }
            finally
            {
                DisposeExcelObject();
            }
        }

        private int WriteDataToTheSpecifiedRangeForPdf(System.Data.DataTable dt, Range range, int rowount, int itemPerPage, Worksheet XLsheet, int rowcout, string companyName, int columnScape)
        {
            int iRow;
            int iCol;

            rowount = 1;

            int excelSheetRow = rowount;
            int pageSize = itemPerPage;
            var totalPages = 0;
            if (dt.Rows.Count % pageSize == 0)
            {
                totalPages = dt.Rows.Count / pageSize;
            }
            else
            {
                totalPages = (dt.Rows.Count / pageSize) + 1;
            }
            for (int i = 0; i < totalPages; i++)
            {


                #region Main Header

                var headerRange1 = XLsheet.Range[XLsheet.Cells[excelSheetRow, 1], XLsheet.Cells[(excelSheetRow + 3), 6]]; //rowount + pageSize * i
                headerRange1.Font.Bold = true;
                headerRange1.Font.Size = 16;
                //headerRange1.Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                // headerRange1.Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                headerRange1.Merge(Type.Missing);
                headerRange1.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
                string picPath = System.Web.HttpContext.Current.Server.MapPath("../Images/report-logo.png");
                object missing = System.Reflection.Missing.Value;
                Microsoft.Office.Interop.Excel.Range picPosition = headerRange1;//GetPicturePosition(); // retrieve the range for picture insert
                Microsoft.Office.Interop.Excel.Pictures p = XLsheet.Pictures(missing) as Microsoft.Office.Interop.Excel.Pictures;
                Microsoft.Office.Interop.Excel.Picture pic = null;
                pic = p.Insert(picPath, missing);
                pic.Left = Convert.ToDouble(picPosition.Left);
                pic.Top = picPosition.Top;
                headerRange1.Style.Height = 84;
                #endregion


                #region Print DateTime

                var headerRangeDateTimeVal = XLsheet.Range[XLsheet.Cells[excelSheetRow + 2, ds.Tables[0].Columns.Count - 4], XLsheet.Cells[excelSheetRow + 2, ds.Tables[0].Columns.Count]];
                headerRangeDateTimeVal[1, 1] = "Print Date & Time : " + DateTime.Now.ToString("d-MMM-yyyy HH.mm.ss tt", CultureInfo.InvariantCulture);
                headerRangeDateTimeVal[2, 4] = "Page " + (i + 1) + " of " + totalPages;
                headerRangeDateTimeVal.Font.Bold = true;
                headerRangeDateTimeVal.Font.Size = 10;
                headerRangeDateTimeVal.Merge(Type.Missing);
                headerRangeDateTimeVal.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;

                #endregion



                excelSheetRow = excelSheetRow + 5;
                for (iCol = 0; iCol < dt.Columns.Count; iCol++)
                {
                    range[excelSheetRow, (iCol + 1)] = iCol < 4 ? Regex.Replace(dt.Columns[iCol].ColumnName, "([a-z])_?([A-Z])", "$1 $2") : dt.Columns[iCol].ColumnName;
                    range.WrapText = false;
                    range.Font.Bold = true;
                    range[excelSheetRow, (iCol + 1)].Font.Size = 10;
                    range[excelSheetRow, (iCol + 1)].Interior.Color = System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                    range[excelSheetRow, (iCol + 1)].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                    range[excelSheetRow, (iCol + 1)].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
                    if (iCol > 3)
                    {
                        range[excelSheetRow, (iCol + 1)].Style.WrapText = true;
                    }
                    else
                    {
                        range[excelSheetRow, (iCol + 1)].Style.WrapText = false;
                    }
                }

                bool endLoop = false;
                excelSheetRow = excelSheetRow + 1;
                for (iRow = i * pageSize; iRow < (i + 1) * pageSize; iRow++)
                {

                    for (iCol = 0; iCol < dt.Columns.Count; iCol++)
                    {
                        if (iRow > dt.Rows.Count - 1)
                        {
                            endLoop = true;
                            break;
                        }
                        range[(excelSheetRow), (iCol + 1)] = dt.Rows[iRow][iCol].ToString();
                        range[(excelSheetRow), (iCol + 1)].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                        range[(excelSheetRow), (iCol + 1)].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);

                        if (iCol > 3)
                        {
                            range[(excelSheetRow), (iCol + 1)].WrapText = true;
                        }
                        else
                        {
                            range[(excelSheetRow), (iCol + 1)].WrapText = false;
                        }

                    }
                    if (endLoop) break;
                    excelSheetRow++;
                }
                //  excelSheetRow++;
                //  rowount = rowcout+4;
            }

            WriteReportFooter(XLsheet, rowcout, columnScape, excelSheetRow);
            return excelSheetRow;
        }

        private void WriteReportFooter(Worksheet XLsheet, int rowcout, int columnScape, int excelSheetRow)
        {
            var colCount = ds.Tables[0].Columns.Count;
            var dataRowCount = ds.Tables[0].Rows.Count;
            var headerRangeTotal =
                XLsheet.Range[XLsheet.Cells[excelSheetRow + 1, 1], XLsheet.Cells[excelSheetRow + 1, columnScape]];
            headerRangeTotal[1, 1] = "Total";
            headerRangeTotal.Font.Bold = true;
            headerRangeTotal.Font.Size = 12;
            headerRangeTotal.Interior.Color =
                System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
            headerRangeTotal.Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
            headerRangeTotal.Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
            headerRangeTotal.Merge(Type.Missing);
            headerRangeTotal.HorizontalAlignment = Microsoft.Office.Interop.Excel.XlHAlign.xlHAlignCenter;
            //int i = columnScape - 1;

            for (int i = 0; i < colCount - columnScape; i++)
            {
                //var rangeTotal = XLsheet.Range[XLsheet.Cells[rowcout + dataRowCount + 1, i + columnScape + 1], XLsheet.Cells[rowcout + dataRowCount + 1, i + columnScape + 1]];
                var rangeTotal =
                    XLsheet.Range[
                        XLsheet.Cells[excelSheetRow + 1, i + columnScape + 1],
                        XLsheet.Cells[excelSheetRow + 1, i + columnScape + 1]];
                string startColumnLetter = ExcelColumnLetter(i + columnScape);
                string endColumnLetter = ExcelColumnLetter(i + columnScape);
                rangeTotal[1, 1] = "=SUM(" + startColumnLetter + "" + (rowcout + 1) + ":" + endColumnLetter + "" +
                                   (rowcout + dataRowCount) + ")";
                rangeTotal[1, 1].Interior.Color =
                    System.Drawing.ColorTranslator.ToOle(System.Drawing.ColorTranslator.FromHtml("#CC99FF"));
                rangeTotal[1, 1].Borders.LineStyle = Microsoft.Office.Interop.Excel.XlLineStyle.xlContinuous;
                rangeTotal[1, 1].Borders.Color = System.Drawing.ColorTranslator.ToOle(Color.Black);
            }
        }
    }
}
