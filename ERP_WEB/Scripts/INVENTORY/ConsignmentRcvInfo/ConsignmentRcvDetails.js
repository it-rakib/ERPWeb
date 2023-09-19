var consignmentLCIds = [];
var ConsignmentRcvDetailsManager = {
    AccknowledgeConsignment: function () {
        debugger;
        var validator = $("#divConsignmentRcvDetails").kendoValidator().data("kendoValidator"),status = $(".status");
        var validator2 = $("#divConsignRcvDetails").kendoValidator().data("kendoValidator"), status2 = $(".status");
        if (validator != null || validator != undefined) {
            if (validator.validate()) {
                if (ConsignmentRcvDetailsHelper.ValidateConsignmentForm()) {
                    var consignmentObj = ConsignmentRcvDetailsHelper.CreateConsignmentObject();
                    var jsonParam = JSON.stringify(consignmentObj);
                    var serviceUrl = _baseUrl + "/api/Consignment/CreateOrUpdateConsignmentRcv";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                }
            }
        } else {
            if (validator2.validate()) {
                if (ConsignmentRcvDetailsHelper.ValidateConsignmentForm()) {
                    var consignmentObj2 = ConsignmentRcvDetailsHelper.CreateConsignmentObject();
                    var jsonParam2 = JSON.stringify(consignmentObj2);
                    var serviceUrl2 = _baseUrl + "/api/Consignment/CreateOrUpdateConsignmentRcv";
                    AjaxManager.PostJsonApi(serviceUrl2, jsonParam2, onSuccess2, onFailed);
                }
            }
        }
        
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            var res = jsonData.Result;
                            $("#hdnConsignmentId").val(res.ConsignmentId);
                            $("#txtConsignmentNo").val(res.ConsignmentNo);
                            $("#grdPendingConsignmentList").data("kendoGrid").dataSource.read();
                            $("#grdConsignmentRcvSummary").data("kendoGrid").dataSource.read();
                            //$("#grdConsignmentRcvDetailsGrid").data("kendoGrid").dataSource.read();
                            //ConsignmentRcvDetailsHelper.FillConsignmentMasterForm(res);
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
            }
        }
        function onSuccess2(jsonData2) {
            if (jsonData2.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData2.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            var res = jsonData2.Result;
                            $("#hdnConsignmentId").val(res.ConsignmentId);
                            $("#txtConsignmentNo").val(res.ConsignmentNo);
                            $("#grdPendingConsignment").data("kendoGrid").dataSource.read();
                            //InventoryDashboardHelper.InitInventoryDashboard();
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData2.Message,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }
    },
    GetConsignmentDetailsByConsignmentIdData: function (consignmentId) {
        var objConsignmentDetails = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/Consignment/GetConsignmentDetailsByConsignmentId/" + consignmentId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objConsignmentDetails = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objConsignmentDetails;
    },
    GetConsignmentLcByConsignmentId: function (consignmentId) {
        var objConsignmentLC = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/Consignment/GetConsignmentLcByConsignmentId/" + consignmentId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objConsignmentLC = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objConsignmentLC;
    }
};

var ConsignmentRcvDetailsHelper = {
    InitConsignmentRcvDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        ConsignmentRcvDetailsGridSummaryHelper.InitConsignmentRcvDetailsGridSummary();
        ConsignmentRcvDetailsHelper.GenerateDatePicker();
        ConsignmentRcvDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadSupplierCombo("cmbSupplier");
        MerchantHelper.LoadCountryCombo("cmbCountry");
        MerchantHelper.LoadPortCombo("cmbPortOfLoad");
        MerchantHelper.LoadPortCombo("cmbDischargePort");
        MerchantHelper.LoadLCMultiSelectCombo("cmbLC");

        $("#btnBackToList").click(function() {
            ConsignmentRcvSummaryHelper.LoadPendingConsignmentDataSource();
            ConsignmentRcvSummaryHelper.LoadConsignmentRcvDataSource();
            $("#divConsignmentRcvSummary").show();
            $("#divConsignmentRcvDetails").hide();
        });
        $("#btnReceive").click(function() {
            ConsignmentRcvDetailsManager.AccknowledgeConsignment();
        });
        $("#divMaster *").attr("disabled", true);
    },
    GenerateDatePicker: function() {
        $("#txtConsignmentDate,#txtGrnDate,#txtChallanDate,#txtGateEntryDate,#txtInvoiceDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
    GenerateNumericTextBox: function() {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },

    CreateConsignmentObject: function() {
        var obj = new Object();
        obj.ConsignmentId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnConsignmentId").val());
        obj.ConsignmentNo = $("#txtConsignmentNo").val();
        obj.ConsignmentDate = kendo.toString($("#txtConsignmentDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
        obj.SupplierId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbSupplier").data("kendoComboBox").value());
        obj.Grnno = $("#txtGrnNo").val();
        obj.Grndate = kendo.toString($("#txtGrnDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
        obj.DeliveryChallanNo = $("#txtChallanNo").val();
        obj.DeliveryChallanDate = kendo.toString($("#txtChallanDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
        obj.VehicleNo = $("#txtVehicleNo").val();
        obj.WayBillNo = $("#txtWayBillNo").val();
        obj.GateEntryNo = $("#txtGateEntryNo").val();
        obj.GateEntryDate = kendo.toString($("#txtGateEntryDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
        obj.ComInvoiceNo = $("#txtInvoiceNo").val();
        obj.ComInvoiceDate = kendo.toString($("#txtInvoiceDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
        obj.CountryId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbCountry").data("kendoComboBox").value());
        obj.PortOfLoadingId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbPortOfLoad").data("kendoComboBox").value());
        obj.PortOfDischargeId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbDischargePort").data("kendoComboBox").value());
        obj.CreatedBy = CurrentUser.USERID;
        obj.ConsignmentRcvLC = ConsignmentRcvDetailsHelper.CreateConsignmentRcvLcObject();
        obj.ConsignmentRcvDetails = ConsignmentRcvDetailsHelper.CreateConsignmentRcvDetailsObject();
        return obj;
    },
    CreateConsignmentRcvDetailsObject: function() {
        var list = [];
        var gridItemGrid = $("#grdConsignmentRcvDetailsGrid").data("kendoGrid");
        var gridData = gridItemGrid.dataSource.data();
        var ds = gridItemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            obj.ConsignmentDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ConsignmentDetailsId);
            obj.ConsignmentId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ConsignmentId);
            obj.TruckNo = itemData.TruckNo;
            obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ItemId);
            obj.PackTypeId = UtilityHelper.ZeroIfNullorEmpty(itemData.PackTypeId);
            obj.Quantity = itemData.Quantity;

            list.push(obj);
        }
        return list;
    },
    CreateConsignmentRcvLcObject: function() {
        var lcList = [];
        var lcIds = $("#cmbLC").data("kendoMultiSelect").value();
        for (var i = 0; i < lcIds.length; i++) {
            var lcid = lcIds[i];
            var consignmentLcid = consignmentLCIds[i];
            var obj = new Object();
            if (consignmentLcid != null || consignmentLcid != undefined) {
                obj.ConsignmentLcId = UtilityHelper.EmptyThenDefaultGuidId(consignmentLcid.ConsignmentLcId);
            } else {
                obj.ConsignmentLcId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnConsignmentLcId").val());
            }
            obj.ConsignmentId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnConsignmentId").val());
            obj.LCId = UtilityHelper.EmptyThenDefaultGuidId(lcid);
            lcList.push(obj);
        }
        return lcList;
    },
    FillConsignmentRcvMasterForm: function (obj) {
        $("#hdnConsignmentId").val(UtilityHelper.EmptyThenDefaultGuidId(obj.ConsignmentId));
        $("#hdnConsignmentDetailsId").val(UtilityHelper.EmptyThenDefaultGuidId(obj.ConsignmentDetailsId));
        $("#txtConsignmentNo").val(obj.ConsignmentNo);
        $("#txtConsignmentDate").data("kendoDatePicker").value(obj.ConsignmentDate);
        $("#cmbSupplier").data("kendoComboBox").value(UtilityHelper.EmptyThenDefaultGuidId(obj.SupplierId));
        $("#txtGrnNo").val(obj.Grnno);
        $("#txtGrnDate").data("kendoDatePicker").value(obj.Grndate);
        $("#txtChallanNo").val(obj.DeliveryChallanNo);
        $("#txtChallanDate").data("kendoDatePicker").value(obj.DeliveryChallanDate);
        $("#txtVehicleNo").val(obj.VehicleNo);
        $("#txtWayBillNo").val(obj.WayBillNo);
        $("#txtGateEntryNo").val(obj.GateEntryNo);
        $("#txtGateEntryDate").data("kendoDatePicker").value(obj.GateEntryDate);
        $("#txtInvoiceNo").val(obj.ComInvoiceNo);
        $("#txtInvoiceDate").data("kendoDatePicker").value(obj.ComInvoiceDate);
        $("#cmbCountry").data("kendoComboBox").value(UtilityHelper.EmptyThenDefaultGuidId(obj.CountryId));
        $("#cmbPortOfLoad").data("kendoComboBox").value(UtilityHelper.EmptyThenDefaultGuidId(obj.PortOfLoadingId));
        $("#cmbDischargePort").data("kendoComboBox").value(UtilityHelper.EmptyThenDefaultGuidId(obj.PortOfDischargeId));
        ConsignmentRcvDetailsHelper.FillConsignmentRcvDetailsGrid(obj);
        ConsignmentRcvDetailsHelper.FillConsignmentRcvLcMultiSelectCombo(obj);
    },
    FillConsignmentRcvDetailsGrid: function(obj) {
        var detailsDataSource = ConsignmentRcvDetailsManager.GetConsignmentDetailsByConsignmentIdData(obj.ConsignmentId);
        gbDetailsGridList = detailsDataSource;
        var detailsGrid = $("#grdConsignmentRcvDetailsGrid").data("kendoGrid");
        detailsGrid.setDataSource(detailsDataSource);
    },
    FillConsignmentRcvLcMultiSelectCombo: function(obj) {
        var lcDataSource = ConsignmentRcvDetailsManager.GetConsignmentLcByConsignmentId(obj.ConsignmentId);
        var consignmentLCId = lcDataSource.map(function(val) {
            return val.ConsignmentLcId;
        });
        consignmentLCIds = lcDataSource;
        var result = lcDataSource.map(function(val) {
            return val.Scid;
        });
        var lcCombo = $("#cmbLC").data("kendoMultiSelect");
        lcCombo.value(result);
    },
    ClearConsignmentMasterForm: function() {
        $("#hdnConsignmentId").val(AjaxManager.DefaultGuidId());
        $("#hdnConsignmentDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtConsignmentNo").val("");
        $("#txtConsignmentDate").data("kendoDatePicker").value(new Date());
        $("#txtGrnNo").val("");
        $("#txtGrnDate").data("kendoDatePicker").value(new Date());
        $("#cmbSupplier").data("kendoComboBox").value("");
        $("#txtChallanNo").val("");
        $("#txtChallanDate").data("kendoDatePicker").value(new Date());
        $("#txtVehicleNo").val("");
        $("#txtGateEntryNo").val("");
        $("#txtGateEntryDate").data("kendoDatePicker").value(new Date());
        $("#txtWayBillNo").val("");
        $("#txtInvoiceNo").val("");
        $("#txtInvoiceDate").data("kendoDatePicker").value(new Date());
        $("#cmbCountry").data("kendoComboBox").value("");
        $("#cmbPortOfLoad").data("kendoComboBox").value("");
        $("#cmbDischargePort").data("kendoComboBox").value("");
        $("#cmbLC").data("kendoMultiSelect").value("");
        //$("#grdConsignmentDetailsGridSummary").data("kendoGrid").dataSource.data([]);
    },
    ValidateConsignmentForm: function() {
        var res = true;
        var consignmentNo = $("#txtConsignmentNo").val();
        var suppCombo = $("#cmbSupplier").data("kendoComboBox");
        var lcMultiSelectCombo = $("#cmbLC").data("kendoMultiSelect");
        var consDate = $("#txtConsignmentDate").data("kendoDatePicker");
        var grnDate = $("#txtGrnDate").data("kendoDatePicker");
        var chDate = $("#txtChallanDate").data("kendoDatePicker");
        var gtEntryDate = $("#txtGateEntryDate").data("kendoDatePicker");
        var invDate = $("#txtInvoiceDate").data("kendoDatePicker");

        if (consignmentNo === "") {
            AjaxManager.NotifyMsg("txtConsignmentNo", "error", "right", 1500, "Required");
            res = false;
        }
        if (suppCombo.value() === "" || suppCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbSupplier", "error", "right", 1500, "Required");
            res = false;
        }
        if (lcMultiSelectCombo.value() === "" || lcMultiSelectCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbLC", "error", "right", 1500, "Required");
            res = false;
        }
        if (consDate.value() === "" || consDate.value() === null) {
            AjaxManager.NotifyMsg("txtConsignmentDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (grnDate.value() === "" || grnDate.value() === null) {
            AjaxManager.NotifyMsg("txtGrnDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (chDate.value() === "" || chDate.value() === null) {
            AjaxManager.NotifyMsg("txtChallanDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (gtEntryDate.value() === "" || gtEntryDate.value() === null) {
            AjaxManager.NotifyMsg("txtGateEntryDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (invDate.value() === "" || invDate.value() === null) {
            AjaxManager.NotifyMsg("txtInvoiceDate", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};