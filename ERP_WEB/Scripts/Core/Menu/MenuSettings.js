$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({});
    $("#tabstrip").removeClass('k-state-active a');
    menuDetailsHelper.InitMenuDetails();
    menuSummaryHelper.InitMenuSummary();
 
  
    //menuSummaryHelper.GeRowDataOfMenuGrid();
    menuDetailsManager.GetAllMenuByModuleId(0);
    MenuSortingHelper.InitMenuSorting();

    //$(".k-state-active").addClass('k-state-active');


});

var menuSettingsManager = {
    
};

var menuSettingsHelper = { };





