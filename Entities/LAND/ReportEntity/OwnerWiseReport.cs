using System;

namespace Entities.LAND.ReportEntity
{
    public class OwnerWiseReport
    {
        public string DivisionName { get; set; }
        public string DistrictName { get; set; }
        public string UpozilaName { get; set; }
        public string MouzaName { get; set; }
        public Guid OwnerInfoid { get; set; }
        public string OwnerInfoName { get; set; }
        public int DeedQty { get; set; }
        public decimal TotalLandAcres { get; set; }
        public decimal TotalLand { get; set; }
    }
}
