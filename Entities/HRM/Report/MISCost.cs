using System;

namespace Entities.HRM.Report
{
    public class MISCost
    {
        public int UnitId { get; set; } = 0;
        public int Month { get; set; } = 0;
        public int Year { get; set; } = 0;
        public int PowerUtilities { get; set; } = 0;
        public int RepairMtnSpares { get; set; } = 0;
        public int CarriageTransFreights { get; set; } = 0;
        public int IndirectMaterialServices { get; set; } = 0;
        public int ConveyEntertainStationeryOthers { get; set; } = 0;
        public int TotalRents { get; set; } = 0;
        public int LocalCommissionTradePromotion { get; set; } = 0;
        public int FactoryOHincludingZonalExp { get; set; } = 0;
        public int HeadOfficeOverhead { get; set; } = 0;
        public int DepreciationFactory { get; set; } = 0;

        public int DaysInMonth => this.GetDaysInMonth();

        public decimal PowerUtilitiesPerDay => this.GetPerDayCost(this.PowerUtilities);
        public decimal RepairMtnSparesPerDay => this.GetPerDayCost(this.RepairMtnSpares);
        public decimal CarriageTransFreightsPerDay => this.GetPerDayCost(this.CarriageTransFreights);
        public decimal IndirectMaterialServicesPerDay => this.GetPerDayCost(this.IndirectMaterialServices);
        public decimal ConveyEntertainStationeryOthersPerDay => this.GetPerDayCost(this.ConveyEntertainStationeryOthers);
        public decimal TotalRentsPerDay => this.GetPerDayCost(this.TotalRents);
        public decimal LocalCommissionTradePromotionPerDay => this.GetPerDayCost(this.LocalCommissionTradePromotion);
        public decimal FactoryOHincludingZonalExpPerDay => this.GetPerDayCost(this.FactoryOHincludingZonalExp);
        public decimal HeadOfficeOverheadPerDay => this.GetPerDayCost(this.HeadOfficeOverhead);
        public decimal DepreciationFactoryPerDay => this.GetPerDayCost(this.DepreciationFactory);

        private decimal GetPerDayCost(int costValue)
        {
            return this.DaysInMonth != 0 ? costValue / this.DaysInMonth : 0;
        }
        private int GetDaysInMonth()
        {
            if (this.Year == 0 || this.Month == 0) return 0;
            return DateTime.DaysInMonth(this.Year, this.Month);
        }
    }
}
