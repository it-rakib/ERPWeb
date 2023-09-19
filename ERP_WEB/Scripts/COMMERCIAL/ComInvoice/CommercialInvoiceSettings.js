$(document).ready(function () {
    var user = CurrentUser;
    $("#bodyTab").kendoTabStrip({
        animation: { open: { effects: "fadeIn" } },
        select: onSelect
    });
    //Tab Click Event
    function onSelect(e) {
        var tabId = $(e.item).attr("id");
        if (tabId === "tabInvoice") {

        }
        //else if (tabId === "tabAC") {

        //}
    }
    $('#js-news').ticker();

    CommercialInvoiceInfoHelper.Init();
    CommercialInvoiceSummaryHelper.InitCommercialInvoiceSummary();

});