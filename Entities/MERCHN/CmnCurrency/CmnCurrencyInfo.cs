using System;

namespace Entities.MERCHN.CmnCurrency
{
    public class CmnCurrencyInfo
    {
        public Guid CurrencyId { get; set; }
        public string CurrencyName { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrenceySymbol { get; set; }
        public int OrderSl { get; set; }
    }
}
