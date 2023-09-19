using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Entities.LAND.ReportEntity
{
    public class DistrictWiseReport
    {
        public string DivisionName { get; set; }
        public string DistrictName { get; set; }
        public string UpozilaName { get; set; }
        public int DeedQty { get; set; }
        public decimal TotalLandAcres { get; set; }
        public decimal TotalLand { get; set; }

    }
}