using System;

namespace AUtilities
{
    public static class DateFormatter
    {
        public static dynamic DateForQuery(DateTime date)
        {
            return "'" + date.ToString("MM/dd/yyyy") + "'";

        }

        public static dynamic DateTimeForQuery(DateTime date)
        {
            var d = "'" + date.ToString("MM/dd/yyyy  HH:mm:ss") + "'";
            return d;

        }
        public static dynamic MonthYearForQuery(DateTime date)
        {
            var d = "'" + date.ToString("MM/yyyy") + "'";
            return d;

        }

        public static dynamic MonthForQuery(DateTime date)
        {
            var month = new DateTime(date.Year, date.Month, 1);
            var d = "'" + month.ToString("MM/dd/yyyy") + "'";
            return d;

        }

        public static dynamic BetweenMonthYear(DateTime fromDate, DateTime toDate, string columnName)
        {
            string strRv = "";
            strRv = string.Format(" RIGHT(CONVERT(VARCHAR(10), {0}, 103), 7)  between '{1}' and '{2}' ", columnName, fromDate.ToString("MM/yyyy"), toDate.ToString("MM/yyyy"));

            return strRv;

        }
    }
}
