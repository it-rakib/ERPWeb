
$(document).ready(function () {

    var user = CurrentUser;
    $("#bodyTab").kendoTabStrip({
        animation: { open: { effects: "fadeIn" } },
        select: onSelect
    });

    //Tab Click Event
    function onSelect(e) {

        var tabId = $(e.item).attr("id");
        if (tabId === "tabDeedDetails") {

        }
    }
    $('#js-news').ticker();

    LandDevTaxInfoSummaryHelper.InitLandDevTaxInfoSummary();
    LandDevTaxInfoDetailsHelper.InitLandDevTaxInfoDetails();
    DocumentHelper.InitDoc();
});