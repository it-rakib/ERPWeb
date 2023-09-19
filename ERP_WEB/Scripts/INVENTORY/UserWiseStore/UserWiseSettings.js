$(document).ready(function() {
    smsCommonHelper.GenerateProjectCombo("cmbProjectName");
 
    UserWiseStoreSummaryHelper.InitUserWiseStoreSummary();
  
    UserWiseStoreDetailsHelper.InitUserWiseStoreDetails();
   

    UserStorePermissionSummaryHelper.InitUserStorePermissionSummary();

})