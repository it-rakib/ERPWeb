$(document).ready(function () {
    //var user = CurrentUser;
    //$("#bodyTab").kendoTabStrip({
    //    animation: { open: { effects: "fadeIn" } },
    //    select: onSelect
    //});
    ////Tab Click Event
    //function onSelect(e) {
    //    var tabId = $(e.item).attr("id");
    //    if (tabId === "tabContact") {

    //    }
    //    else if (tabId === "tabDoc") {

    //    }
    //}
    //$('#js-news').ticker();
    var user = CurrentUser;
    $( "#bodyTab" ).kendoTabStrip( {
        animation: { open: { effects: "fadeIn" } },
        select: onSelect
    } );
    //Tab Click Event
    function onSelect( e )
    {

        var tabId = $( e.item ).attr( "id" );
        if ( tabId === "tabContact" )
        {

        }
        //else if (tabId === "tabDoc") {

        //}
    }
    $( '#js-news' ).ticker();
    ContractInfoHelper.Init();
    ContractAmendmentHelper.InitContractAmendment();
    ContractSummaryHelper.InitContractSummary();
    ContractLCSummaryHelper.InitContractLCSummary();
     DocumentHelper.InitDoc();
});


