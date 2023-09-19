$(document).ready(function () {
    var user = CurrentUser;
    $("#bodyTab").kendoTabStrip({
        animation: { open: { effects: "fadeIn" } },
        select: onSelect
    });
    //Tab Click Event
    function onSelect(e) {
       
        var tabId = $(e.item).attr("id");
        if (tabId === "tabContact") {

        }
        //else if (tabId === "tabDoc") {

        //}
    }
    $('#js-news').ticker();

    BackToBackInfoHelper.Init();
    BBLCAmendmentHelper.InitBBLCAmendment();
    PIInfoSummaryBBHelper.InitPIInfoSummaryBB();
    BBLCSummaryHelper.InitBBLCSummary();
    DocumentHelper.InitDoc();

});