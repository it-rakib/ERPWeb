
$(document).ready(function () {
    var user = CurrentUser;
    //$("#bodyTab").kendoTabStrip({
    //    animation: { open: { effects: "fadeIn" } },
    //    select: onSelect
    //});

    //Tab Click Event
    //function onSelect(e) {

    //    var tabId = $(e.item).attr("id");
    //    if (tabId === "tabDeedDetails") {

    //    }
    //}
    $('#js-news').ticker();

    LandInfoSummaryHelper.InitLandDocumentsSummary();
    //LandInfoDetailsHelper.InitLandInfoDetails();
    //DocumentHelper.InitDoc();
});
var LandDocumentsSummaryManger = {
    
}

var LandInfoSummaryHelper = {
    InitLandDocumentsSummary: function() {
        
    },
}