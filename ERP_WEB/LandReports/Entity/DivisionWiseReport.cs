namespace ERP_WEB.LandReports.Entity
{
    public class DivisionWiseReport
    {
        public string DivisionName { get; set; }
        public string DistrictName { get; set; }
        public int DeedQty { get; set; }
        public decimal TotalLandAcres { get; set; }
        //public decimal? TotalLandAmount { get; set; }
        public decimal OwnerMutatedLandAmount { get; set; }
    }
}