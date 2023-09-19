$(document).ready(function() {
    smsCommonHelper.GenerateProjectCombo("cmbProjectName");
 
    UserWiseItemSummaryHelper.InitUserWiseItemSummary();
  
    UserWiseItemDetailsHelper.InitUserWiseItemDetails();
   

    UserItemPermissionSummaryHelper.InitUserItemPermissionSummary();

   // reportPermissionSummaryHelper.InitReportPermissionSummary();
})