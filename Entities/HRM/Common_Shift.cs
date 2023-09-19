using System;

namespace Entities.HRM
{
    public class Common_Shift
    {
        public long EmpID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int ShiftID { get; set; }
        public string ShiftName { get; set; }
        public string ShiftShort { get; set; }
        public DateTime ShiftIn { get; set; }
        public DateTime ShiftLate { get; set; }
        public DateTime ShiftAbsent { get; set; }
        public DateTime ShiftEarly { get; set; }
        public DateTime ShiftOut { get; set; }
        public DateTime ShiftLastPunch { get; set; }
        public DateTime ShiftLunchFrom { get; set; }
        public DateTime ShiftLunchTill { get; set; }
        public DateTime ShiftIfterFrom { get; set; }
        public DateTime ShiftIfterTill { get; set; }
        public DateTime NightBreakFrom { get; set; }
        public DateTime NightBreakTill { get; set; }
        public DateTime SheriBreakFrom { get; set; }
        public DateTime SheriBreakTill { get; set; }
        public bool IsLunch { get; set; }
        public bool IsTiffin { get; set; }
        public DateTime TiffinTime { get; set; }
        public bool IsIfter { get; set; }
        public DateTime IfterTime { get; set; }
        public bool IsNight { get; set; }
        public DateTime NightTime { get; set; }
        public int ShiftType { get; set; }
        public string ShiftTypeName { get; set; }

        public DateTime MinDateChange(DateTime dateTime)
        {
            var date = new DateTime(1900, 01, 01, dateTime.Hour, dateTime.Minute, dateTime.Second, dateTime.Millisecond);
            return date;
        }
    }
}
