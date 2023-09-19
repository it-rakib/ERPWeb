$(document).ready(function () {
    var user = CurrentUser;
    $("#bodyTab").kendoTabStrip({
        animation: { open: { effects: "fadeIn" } },
        select: onSelect
    });

    //Tab Click Event
    function onSelect(e) {

        var tabId = $(e.item).attr("id");
        if (tabId === "tabFileDetails") {

        }
    }
    $('#js-news').ticker();    
    
    CaseFileSummaryHelper.InitCaseFileSummary();
    CaseFileDetailsHelper.InitCaseFileDetails();
    DocumentHelper.InitDoc();
    UpdateDiaryDetailsHelper.InitUpdateDiaryDetails();
    
});