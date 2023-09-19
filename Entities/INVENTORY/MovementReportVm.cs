using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.INVENTORY
{
    public class MovementReportVm
    {
        public Guid Id { get; set; }
        public Guid? Poid { get; set; }
        public int StoreId { get; set; }
        public string StoreName { get; set; } = "";
        public Guid StyleDetailsId { get; set; }
        public string StyleNo { get; set; } = "";
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = "";
        public Guid SizeId { get; set; }
        public string SizeName { get; set; } = "";
        public Guid ColorId { get; set; }
        public string ColorName { get; set; } = "";
        public Guid Uomid { get; set; }
        public string UOMName { get; set; } = "";
        public int? ShadeId { get; set; }
        public string ShadeName { get; set; } = "";
        public Guid BuyerId { get; set; }
        public string BuyerName { get; set; } = "";
        public decimal OpeningQty { get; set; }
        public decimal OpeningRate { get; set; }
        public decimal OpeningValue { get; set; }
        public decimal Mrrqty { get; set; }
        public decimal Mrrrate { get; set; }
        public decimal Mrrvalue { get; set; }
        public decimal IssueQty { get; set; }
        public decimal IssueRate { get; set; }
        public decimal IssueValue { get; set; }
        public decimal ReceiveQty { get; set; }
        public decimal ReceiveRate { get; set; }
        public decimal ReceiveValue { get; set; }
        public decimal SubCissueQty { get; set; }
        public decimal SubCissueRate { get; set; }
        public decimal SubCissueValue { get; set; }
        public decimal SubCreceiveQty { get; set; }
        public decimal SubCreceiveRate { get; set; }
        public decimal SubCreceiveValue { get; set; }
        public decimal? RetrunfrmSubCqty { get; set; }
        public decimal? RetrunfrmSubCrate { get; set; }
        public decimal? RetrunfrmSubCvalue { get; set; }
        public decimal LoanIssueQty { get; set; }
        public decimal LoanIssueRate { get; set; }
        public decimal LoanIssueValue { get; set; }
        public decimal LoanReceiveQty { get; set; }
        public decimal LoanReceiveRate { get; set; }
        public decimal LoanReceiveValue { get; set; }
        public decimal LoanReturnQty { get; set; }
        public decimal LoanReturnRate { get; set; }
        public decimal LoanReturnValue { get; set; }
        public decimal ReturnToStoreQty { get; set; }
        public decimal ReturnToStoreRate { get; set; }
        public decimal ReturnToStoreValue { get; set; }
        public decimal TransferInQty { get; set; }
        public decimal TransferInRate { get; set; }
        public decimal TransferInValue { get; set; }
        public decimal TransferOutQty { get; set; }
        public decimal TransferOutRate { get; set; }
        public decimal TransferOutValue { get; set; }
        public decimal? SampleIssueQty { get; set; }
        public decimal? SampleIssueRate { get; set; }
        public decimal? SampleIssueValue { get; set; }
        public decimal? SampleReturnQty { get; set; }
        public decimal? SampleReturnRate { get; set; }
        public decimal? SampleReturnValue { get; set; }
        public decimal? LeftOverIssueQty { get; set; }
        public decimal? LeftOverIssueRate { get; set; }
        public decimal? LeftOverIssueValue { get; set; }
        public decimal? LeftOverReceiveQty { get; set; }
        public decimal? LeftOverReceiveRate { get; set; }
        public decimal? LeftOverReceiveValue { get; set; }
        public decimal? RetrunfrmFlrQty { get; set; }
        public decimal? RetrunfrmFlrRate { get; set; }
        public decimal? RetrunfrmFlrValue { get; set; }
        public decimal? RetrunToSplQty { get; set; }
        public decimal? RetrunToSplRate { get; set; }
        public decimal? RetrunToSplValue { get; set; }
        public decimal TotalBalanceQty { get; set; }
        public decimal TotalBalanceRate { get; set; }
        public decimal TotalBalanceValue { get; set; }
        public Guid? Status { get; set; }
        public string MonthNumber { get; set; }
        public long? CreateBy { get; set; }
        public DateTime? CreateAt { get; set; }
        public long? UpdateBy { get; set; }
        public DateTime? UpdateAt { get; set; }
        public string DateFrom { get; set; } = "";
        public string DateTo { get; set; } = "";
        public long UserId { get; set; } = 0;
    }
}
