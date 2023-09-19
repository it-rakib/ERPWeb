$(document).ready(function () {
    MovementReportHelper.Init();
});

var MovementReportManager = {

};

var MovementReportHelper = {
    Init: function () {
        MerchantHelper.LoadBuyerCombo("cmbBuyer");
        MerchantHelper.LoadStoreCombo("cmbStore");
        StyleListSearchHelper.InitStyleSearch();

        $("#btnLoadReport").click(function () {
            MovementReportHelper.LoadMovementReport();
        });
    },
    LoadMovementReport: function () {
        var rptParam = MovementReportHelper.CreateParamObject();
        var paramObj = JSON.stringify(rptParam);
        var jsonParam = "objCommonParams:" + paramObj;
        var serviceUrl = "../InvReport/GetMovementReport";
        AjaxManager.GetRdlcReportCommon(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Error Found: " + error);
        }
    },
    CreateParamObject: function () {
        var obj = new Object({
            BuyerId: UtilityHelper.EmptyThenDefaultGuidId($("#cmbBuyer").data("kendoComboBox").value()),
            StoreId: UtilityHelper.ZeroIfNullorEmpty($("#cmbStore").data("kendoComboBox").value()),
            StyleDetailsId: UtilityHelper.EmptyThenDefaultGuidId($("#hdnStyleDetailsId").val())
            //DateFrom: kendo.toString($("#txtDateFrom").data("kendoDatePicker").value(), "dd-MMM-yyyy"),
            //DateTo: kendo.toString($("#txtDateTo").data("kendoDatePicker").value(), "dd-MMM-yyyy")
        });
        return obj;
    }
};