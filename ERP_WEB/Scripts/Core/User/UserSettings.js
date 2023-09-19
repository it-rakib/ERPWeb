$(document).ready(function() {
    smsCommonHelper.GenerateProjectCombo("cmbProjectName");
 
    UserSummaryHelper.InitUserSummary();
  
    UserDetailsHelper.InitUserDetails();
   

    menuPermissionSummaryHelper.InitMenuPermissionSummary();

    reportPermissionSummaryHelper.InitReportPermissionSummary();
})