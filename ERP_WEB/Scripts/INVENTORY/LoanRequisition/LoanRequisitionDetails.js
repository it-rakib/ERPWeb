var LoanRequisitionDetailsManager = {
    SaveLoanRequisition: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"),status = $(".status");
        if (validator.validate()) {
            if (LoanRequisitionDetailsHelper.ValidateRequisitionForm()) {
                var requisitionObj = LoanRequisitionDetailsHelper.CreateLoanRequisitionObject();
                var jsonParam = JSON.stringify(requisitionObj);
                if (requisitionObj.LoanRequisitionDetails != null && requisitionObj.LoanRequisitionDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/LoanRequisition/CreateOrUpdateLoanRequisition";
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
                            $("#grdLoanRequisitionSummary").data("kendoGrid").dataSource.read();
                            LoanRequisitionDetailsHelper.FillLoanRequisitionDetailsGrid(res);
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

var LoanRequisitionDetailsHelper = {
    InitLoanRequisitionDetails: function () {
        LoanRequisitionItemListHelper.InitRequisitionItemList();
        LoanRequisitionDetailsHelper.GenerateDatePicker();
        //LoanRequisitionDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadStoreComboByUserId("cmbStoreFrom", CurrentUser.USERID);
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreCombo("cmbStoreTo");
        StyleListPopUpHelper.InitStylePopUpGrid();

        $("#btnAddNew").click(function () {
            LoanRequisitionDetailsHelper.ClearAll();
            $("#divSummary").hide();
            $("#divDetails").show();
            $("#btnSave").text(" Save");
            $("#btnSave").addClass("fa fa-save");
        });
        $("#btnBackToList").click(function () {
            LoanRequisitionSummaryHelper.LoadGridData();
            $("#divSummary").show();
            $("#divDetails").hide();
        });
        $("#btnSave").click(function () {
            LoanRequisitionDetailsManager.SaveLoanRequisition();
        });
        $("#divStyle *").attr("disabled", true);
        $("#cmbStoreTo").change(function () {
            var storeId = $("#cmbStoreTo").data("kendoComboBox").value();
            var styleDetailsId = $("#hdnStyleDetailsId").val();
            //$("#txtSrcStyle").val(obj.StyleNo);
            if (storeId === "" || storeId === 0 || storeId === undefined) {
                $("#divStyle *").attr("disabled", true);
            } else {
                $("#divStyle *").removeAttr("disabled");
                var styleGrid = $("#grdStyleSummary").data("kendoGrid");
                var sdata = StyleListPopUpManager.gridDataSource(storeId);
                styleGrid.setDataSource(sdata);
                if (sdata._data.length === 0) {
                    $("#txtSrcStyle").val("");
                }

                var grid = $("#grdRequisitionItemSummary").data("kendoGrid");
                var data = LoanRequisitionItemListManager.GetItemListForLoanReqByStyleDetailsAndStoreId(styleDetailsId, storeId);
                grid.setDataSource(data);
            }
        });
    },
    GenerateDatePicker: function () {
        $("#dtRequisitionDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateLoanRequisitionObject: function () {
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
        obj.LoanRequisitionDetails = LoanRequisitionDetailsHelper.CreateLoanRequisitionDetailsObject();
        return obj;
    },
    CreateLoanRequisitionDetailsObject: function () {
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
                obj.StoreRcvQty = itemData.StoreRcvQty;
                obj.RequiredQty = itemData.RequiredQty;
                obj.Remarks = itemData.Remarks;
                list.push(obj);
            }
        }
        return list;
    },
    FillLoanRequisitionMasterForm: function (obj) {
        $("#btnSave").text(" Update");
        $("#btnSave").addClass("fas fa-edit");
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
        LoanRequisitionDetailsHelper.FillLoanRequisitionDetailsGrid(obj);
    },
    FillLoanRequisitionDetailsGrid: function (obj) {
        var detailsList = LoanRequisitionItemListManager.GetLoanReqDetailsByReqId(obj.RequisitionId);
        var itemGrid = $("#grdRequisitionItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
            schema: {
                model: {
                    fields: {
                        Remarks: { editable: true },
                        RequiredQty: { editable: true },
                        PrevRequiredQty: { editable: false },
                        BalanceQty: { editable: false },
                        TotalRcvQty: { editable: false },
                        StoreRcvQty: { editable: false },
                        Rate: { editable: false },
                        UOMName: { editable: false },
                        ColorName: { editable: false },
                        SizeName: { editable: false },
                        ItemName: { editable: false }
                    }
                }
            }
        });
        itemGrid.setDataSource(gridDataSource);
        itemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "RequiredQty") {
                    if (obj.RequiredQty > obj.BalanceQty) {
                        e.items[0].RequiredQty = obj.BalanceQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Requisition Qty can't greater than Balance Qty",
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
        $("#btnSave").text(" Save");
        $("#btnSave").addClass("fa fa-save");
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
        var storeFromCombo = $("#cmbStoreFrom").data("kendoComboBox");
        var storeToCombo = $("#cmbStoreTo").data("kendoComboBox");
        var itemList = $("#grdRequisitionItemSummary").data("kendoGrid");

        if (requisitionDate.value() === "" || requisitionDate.value() === null) {
            AjaxManager.NotifyMsg("dtRequisitionDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (storeFromCombo.value() === "" || storeFromCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbStoreFrom", "error", "right", 1500, "Required");
            res = false;
        }
        if (storeToCombo.value() === "" || storeToCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbStoreTo", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};