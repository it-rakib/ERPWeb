var InvRequisitionDetailsManager = {
    SaveInventoryRequisition: function () {
        var validator = $("#divRequisitionDetails").kendoValidator().data("kendoValidator"),
        status = $(".status");
        if (validator.validate()) {
            if (InvRequisitionDetailsHelper.ValidateRequisitionForm()) {                
                var requisitionObj = InvRequisitionDetailsHelper.CreateInvRequisitionObject();
                var jsonParam = JSON.stringify(requisitionObj);
                if (requisitionObj.InvRequisitionDetails != null && requisitionObj.InvRequisitionDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/InvRequisition/CreateOrUpdateInvRequisition";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                } else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Required Qty!",
                    [{
                        addClass: 'btn btn-primary', text: 'OK', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
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
                            $("#hdnRequisitionId").val(res.RequisitionId);
                            $("#txtRequisitionNo").val(res.RequisitionNo);
                            $("#hdnStyleId").val(res.StyleId);
                            $("#hdnStyleDetailsId").val(res.StyleDetailsId);
                            $("#txtSrcStyle").removeAttr("disabled");
                            $("#txtSrcStyle").val(res.StyleNo);
                            $("#grdInvRequisitionSummary").data("kendoGrid").dataSource.read();
                            InvRequisitionDetailsHelper.FillRequisitionDetailsGrid(res);
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
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    }
};

var InvRequisitionDetailsHelper = {
    InitInvRequisitionDetails: function () {
        RequisitionItemListHelper.InitRequisitionItemList();
        InvRequisitionDetailsHelper.GenerateDatePicker();
        //InvRequisitionDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadStoreComboByUserId("cmbStoreFrom", CurrentUser.USERID);
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        //$("#cmbStoreFrom").data("kendoComboBox").enable(false);
        MerchantHelper.LoadStoreCombo("cmbStoreTo");
        StyleListSearchHelper.InitStyleListSearch();

        $("#btnAddNew").click(function () {
            InvRequisitionDetailsHelper.ClearAll();
            $("#divRequisitionSummary").hide();
            $("#divRequisitionDetails").show();
            $("#btnSaveRequisition").text(" Save");
            $("#btnSaveRequisition").addClass("fa fa-save");
        });
        $("#btnBackRequisitionList").click(function () {
            $("#divRequisitionSummary").show();
            $("#divRequisitionDetails").hide();
        });
        $("#btnSaveRequisition").click(function () {
            InvRequisitionDetailsManager.SaveInventoryRequisition();
        });

        //$("#divStyle").tooltip();
        //$("#divStyle *").attr("disabled", true);
        //$("#cmbStoreFrom").change(function () {
        //    var unitId = $("#cmbStoreFrom").data("kendoComboBox").value();
        //    if (unitId != "") {
        //        $("#divStyle *").removeAttr("disabled");
        //    } else {
        //        $("#divStyle *").attr("disabled", true);
        //    }
        //});
    },
    GenerateDatePicker: function () {
        $("#dtRequisitionDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateInvRequisitionObject: function () {
        var obj = new Object();
        obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnRequisitionId").val());
        obj.RequisitionDate = $("#dtRequisitionDate").data("kendoDatePicker").value();
        obj.RequisitionNo = $("#txtRequisitionNo").val() === AjaxManager.DefaultGuidId() ? "" : $("#txtRequisitionNo").val();
        obj.TransTypeId = $("#cmbTransType").data("kendoComboBox").value();
        obj.StoreFromId = UtilityHelper.ZeroIfNullorEmpty($("#cmbStoreFrom").data("kendoComboBox").value());
        obj.StoreToId = UtilityHelper.ZeroIfNullorEmpty($("#cmbStoreTo").data("kendoComboBox").value());
        obj.StyleId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnStyleId").val());
        obj.StyleDetailsId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnStyleDetailsId").val());
        obj.Remarks = $("#txtRemarks").val();
        obj.CreatedBy = CurrentUser.USERID;
        obj.InvRequisitionDetails = InvRequisitionDetailsHelper.CreateRequisitionDetailsObject();
        return obj;
    },
    CreateRequisitionDetailsObject: function () {
        var list = [];
        var itemGrid = $("#grdRequisitionItemSummary").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        var ds = itemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            if (itemData.RequiredQty > 0) {
                obj.RequisitionDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.RequisitionDetailsId);
                obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId(itemData.RequisitionId);
                obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ItemId);
                obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ColorId);
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(itemData.UOMId);
                obj.Rate = itemData.Rate;
                obj.RequiredQty = itemData.RequiredQty;
                obj.Remarks = itemData.Remarks;
                list.push(obj);
            }
        }
        return list;
    },
    FillRequisitionMasterForm: function (obj) {
        $("#btnSaveRequisition").text(" Update");
        $("#btnSaveRequisition").addClass("fas fa-edit");
        $("#hdnRequisitionId").val(obj.RequisitionId);
        $("#dtRequisitionDate").data("kendoDatePicker").value(obj.RequisitionDate);
        $("#txtRequisitionNo").val(obj.RequisitionNo);
        $("#cmbTransType").data("kendoComboBox").value(obj.TransTypeId);
        $("#cmbStoreFrom").data("kendoComboBox").value(obj.StoreFromId);
        $("#cmbStoreTo").data("kendoComboBox").value(obj.StoreToId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").removeAttr("disabled");
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#txtRemarks").val(obj.Remarks);
        InvRequisitionDetailsHelper.FillRequisitionDetailsGrid(obj);
    },
    FillRequisitionDetailsGrid: function (obj) {
        var requisitionDetailsList = RequisitionItemListManager.GetRequisitionDetailsItemByRequisitionId(obj.RequisitionId);
        var requisitionItemGrid = $("#grdRequisitionItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: requisitionDetailsList,
            schema: {
                model: {
                    fields: {
                        Remarks: { editable: true },
                        RequiredQty: { editable: true },
                        PrevRequiredQty: { editable: false },
                        BalanceQty: { editable: false },
                        TotalRcvQty: { editable: false },
                        Rate: { editable: false },
                        UOMName: { editable: false },
                        ColorName: { editable: false },
                        SizeName: { editable: false },
                        ItemName: { editable: false }
                    }
                }
            }
        });
        requisitionItemGrid.setDataSource(gridDataSource);
        requisitionItemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "RequiredQty") {
                    if (obj.RequiredQty > obj.BalanceQty) {
                        e.items[0].RequiredQty = obj.BalanceQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Required Qty can't greater than Current Balance",
                            [{
                                addClass: 'btn btn-primary',
                                text: 'OK',
                                onClick: function ($noty) {
                                    $noty.close();
                                }
                            }]);
                        return;
                    }
                }
            }
        });
    },
    ClearAll: function () {
        $("#btnSaveRequisition").text(" Save");
        $("#btnSaveRequisition").addClass("fa fa-save");
        $("#hdnRequisitionId").val(AjaxManager.DefaultGuidId());
        $("#dtRequisitionDate").data("kendoDatePicker").value(new Date());
        $("#txtRequisitionNo").val("");
        $("#cmbStoreTo").data("kendoComboBox").value("");
        $("#hdnStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtSrcStyle").val("");
        $("#txtRemarks").val("");
        $("#grdRequisitionItemSummary").data("kendoGrid").dataSource.data([]);
    },
    ValidateRequisitionForm: function () {
        var res = true;
        var requisitionDate = $("#dtRequisitionDate").data("kendoDatePicker");
        var requisitionNo = $("#txtRequisitionNo").val();
        var storeFromCombo = $("#cmbStoreFrom").data("kendoComboBox");
        var storeToCombo = $("#cmbStoreTo").data("kendoComboBox");
        var requisitionItemList = $("#grdRequisitionItemSummary").data("kendoGrid");

        if (storeFromCombo.value() === "" || storeFromCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbStoreFrom", "error", "right", 1500, "Required");
            res = false;
        }
        if (storeToCombo.value() === "" || storeToCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbStoreTo", "error", "right", 1500, "Required");
            res = false;
        }
        if (requisitionDate.value() === "" || requisitionDate.value() === null) {
            AjaxManager.NotifyMsg("dtRequisitionDate", "error", "right", 1500, "Required");
            res = false;
        }
        //if (requisitionNo === "" || requisitionNo === null) {
        //    AjaxManager.NotifyMsg("txtRequisitionNo", "error", "right", 1500, "Required");
        //    res = false;
        //}
        return res;
    }
};