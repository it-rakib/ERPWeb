namespace Entities.HRM.DTO
{
    public class ShiftInfo
    {
        public long EmpID { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public int ShiftID { get; set; }
        public string ShiftName { get; set; }
        public string ShiftShort { get; set; }
        public string ShiftIn { get; set; }
        public string ShiftLate { get; set; }
        public string ShiftAbsent { get; set; }
        public string ShiftEarly { get; set; }
        public string ShiftOut { get; set; }
        public string ShiftLastPunch { get; set; }
        public string ShiftLunchFrom { get; set; }
        public string ShiftLunchTill { get; set; }
        public string ShiftIfterFrom { get; set; }
        public string ShiftIfterTill { get; set; }
        public string NightBreakFrom { get; set; }
        public string NightBreakTill { get; set; }
        public string SheriBreakFrom { get; set; }
        public string SheriBreakTill { get; set; }
        public bool IsLunch { get; set; }
        public bool IsTiffin { get; set; }
        public string TiffinTime { get; set; }
        public bool IsIfter { get; set; }
        public string IfterTime { get; set; }
        public bool IsNight { get; set; }
        public string NightTime { get; set; }
        public int ShiftType { get; set; }
        public string ShiftTypeName { get; set; }

    }
}
