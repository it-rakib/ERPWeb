$(document).ready(function () {
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

    UDInfoHelper.Init();
    UDSummaryHelper.InitUDSummary();
    UDBBLCHelper.InitUDBBLC();
    DocumentHelper.InitDoc();
    //BBLCSummaryHelper.InitBBLCSummary();
    //PIInfoSummaryBBHelper.InitPIInfoSummaryBB();
    //BBLCSummaryHelper.InitBBLCSummary();

});