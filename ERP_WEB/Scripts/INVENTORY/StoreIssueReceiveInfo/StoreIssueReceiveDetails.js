var StoreIssueReceiveDetailsManager = {
    SaveStoreIssueReceive: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"),status = $(".status");
        if (validator.validate()) {
            if (StoreIssueReceiveDetailsHelper.ValidateIssueForm()) {
                var issueObj = StoreIssueReceiveDetailsHelper.CreateStoreIssueReceiveObject();
                var jsonParam = JSON.stringify(issueObj);
                if (issueObj.IssueReceiveDetails != null && issueObj.IssueReceiveDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/StoreIssueReceive/CreateOrUpdateStoreIssueReceive";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                } else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Receive Qty!",
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
                            $("#hdnStoreIssueReceiveId").val(res.ReceiveId);
                            $("#txtIssueReceiveNo").val(res.ReceiveNo);
                            $("#hdnIssueId").val(res.IssueId);
                            $("#hdnStyleId").val(res.StyleId);
                            $("#hdnStyleDetailsId").val(res.StyleDetailsId);
                            $("#grdStoreIssueReceiveItemSummary").data("kendoGrid").dataSource.read();
                            StoreIssueReceiveDetailsHelper.FillStoreIssueReceiveMasterForm(res);
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Data Error', jsonData.Message,
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

var StoreIssueReceiveDetailsHelper = {
    InitStoreIssueReceiveDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        IssueReceiveItemListHelper.InitIssueReceiveItemList();
        StoreIssueReceiveDetailsHelper.GenerateDatePicker();
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreCombo("cmbFromStore");
        MerchantHelper.LoadStoreComboByUserId("cmbToStore", CurrentUser.USERID);

        $("#btnBackToList").click(function () {
            $("#divSummary").show();
            $("#divDetails").hide();
            StoreIssueReceiveSummaryHelper.LoadPendingIssueReceiveGridDataSource();
            StoreIssueReceiveSummaryHelper.LoadIssueReceiveGridDataSource();
        });
        $("#btnSave").click(function () {
            StoreIssueReceiveDetailsManager.SaveStoreIssueReceive();
        });
        $("#divStyle *").attr("disabled", true);
    },
    GenerateDatePicker: function () {
        $("#dtIssueReceiveDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateStoreIssueReceiveObject: function () {
        var obj = new Object();
        obj.ReceiveId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnReceiveId").val());
        obj.ReceiveDate = $("#dtIssueReceiveDate").data("kendoDatePicker").value();
        obj.ReceiveNo = $("#txtIssueReceiveNo").val();
        obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnIssueId").val());
        obj.TransTypeId = $("#cmbTransType").data("kendoComboBox").value();
        obj.StoreFromId = UtilityHelper.ZeroIfNullorEmpty($("#cmbFromStore").data("kendoComboBox").value());
        obj.StyleId = $("#hdnStyleId").val();
        obj.StyleDetailsId = $("#hdnStyleDetailsId").val();
        obj.StoreToId = UtilityHelper.ZeroIfNullorEmpty($("#cmbToStore").data("kendoComboBox").value());
        obj.Remarks = $("#txtRemarks").val();
        obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnRequisitionId").val());
        obj.CreatedBy = CurrentUser.USERID;
        obj.IssueReceiveDetails = StoreIssueReceiveDetailsHelper.CreateStoreIssueReceiveDetailsObject();
        return obj;
    },
    CreateStoreIssueReceiveDetailsObject: function () {
        var list = [];
        var itemGrid = $("#grdStoreIssueReceiveItemSummary").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        var ds = itemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            if (itemData.ReceiveQty > 0) {
                obj.ReceiveDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ReceiveDetailsId);
                obj.ReceiveId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ReceiveId);
                obj.IssueDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.IssueDetailsId);
                obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId(itemData.IssueId);
                obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ItemId);
                obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ColorId);
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(itemData.UOMId);
                obj.UnitPrice = UtilityHelper.ZeroIfNullorEmpty(itemData.Rate);
                obj.IssueQtyPrev = UtilityHelper.ZeroIfNullorEmpty(itemData.IssueQtyPrev);
                obj.ReceiveQty = UtilityHelper.ZeroIfNullorEmpty(itemData.ReceiveQty);
                obj.ItemRemarks = itemData.ItemRemarks;
                list.push(obj);
            }
        }
        return list;
    },
    FillIssueMasterForm: function (obj) {
        $("#btnSave").text(" Save");
        $("#btnSave").addClass("fas fa-save");
        $("#hdnIssueId").val(obj.IssueId);
        $("#txtIssueNo").val(obj.IssueNo);
        $("#cmbFromStore").data("kendoComboBox").value(obj.FromUnitId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#hdnRequisitionId").val(obj.RequisitionId);
        $("#txtSrcRequisition").val(obj.RequisitionNo);
        StoreIssueReceiveDetailsHelper.FillIssueDetailsGrid(obj);
    },
    FillIssueDetailsGrid: function (obj) {
        var issueDetailsList = IssueReceiveItemListManager.GetIssueDetailsItemByIssueId(obj.IssueId);
        var itemGrid = $("#grdStoreIssueReceiveItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: issueDetailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        ReceiveQty: { editable: false },
                        IssueQty: { editable: false },
                        PrevIssueQty: { editable: false },
                        RequiredQty: { editable: false },
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
        itemGrid.setDataSource(gridDataSource);
        itemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "IssueReceiveQty") {
                    if (obj.IssueReceiveQty > obj.IssueQty) {
                        e.items[0].IssueReceiveQty = obj.IssueQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Receive Qty can't greater than Issue Qty",
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

    FillStoreIssueReceiveMasterForm: function (obj) {
        $("#btnSave").text(" Update");
        $("#btnSave").addClass("fas fa-edit");
        $("#hdnReceiveId").val(obj.ReceiveId);
        $("#txtIssueReceiveNo").val(obj.ReceiveNo);
        $("#dtIssueReceiveDate").data("kendoDatePicker").value(obj.ReceiveDate);
        $("#hdnIssueId").val(obj.IssueId);
        $("#txtIssueNo").val(obj.IssueNo);
        $("#cmbTransType").data("kendoComboBox").value(obj.TransTypeId);
        $("#cmbFromStore").data("kendoComboBox").value(obj.StoreFromId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#cmbToStore").data("kendoComboBox").value(obj.StoreToId);
        $("#txtRemarks").val(obj.Remarks);
        $("#hdnRequisitionId").val(obj.RequisitionId);
        $("#txtSrcRequisition").val(obj.RequisitionNo);
        StoreIssueReceiveDetailsHelper.FillStoreIssueReceiveDetailsGrid(obj);
    },
    FillStoreIssueReceiveDetailsGrid: function (obj) {
        var issueReceiveDetailsList = IssueReceiveItemListManager.GetIssueReceiveDetailsByReceiveId(obj.ReceiveId);
        var itemGrid = $("#grdStoreIssueReceiveItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: issueReceiveDetailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        ReceiveQty: { editable: false },
                        IssueQty: { editable: false },
                        PrevIssueQty: { editable: false },
                        RequiredQty: { editable: false },
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
        itemGrid.setDataSource(gridDataSource);
        itemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "IssueReceiveQty") {
                    if (obj.IssueReceiveQty > obj.IssueQty) {
                        e.items[0].IssueReceiveQty = obj.IssueQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Receive Qty can't greater than Issue Qty",
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
        $("#hdnReceiveId").val(AjaxManager.DefaultGuidId());
        $("#dtIssueReceiveDate").data("kendoDatePicker").value(new Date());
        $("#hdnIssueId").val(AjaxManager.DefaultGuidId());
        $("#txtIssueNo").val("");
        $("#cmbFromStore").data("kendoComboBox").value("");
        $("#hdnStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtRemarks").val("");
        $("#grdStoreIssueReceiveItemSummary").data("kendoGrid").dataSource.data([]);
    },
    ValidateIssueForm: function () {
        var res = true;
        var issueDate = $("#dtIssueReceiveDate").data("kendoDatePicker");
        var issueNo = $("#txtIssueNo").val();
        var storeFromCombo = $("#cmbFromStore").data("kendoComboBox");
        var storeToCombo = $("#cmbToStore").data("kendoComboBox");

        if (storeFromCombo.value() === "" || storeFromCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbFromStore", "error", "right", 1500, "Required");
            res = false;
        }
        if (storeToCombo.value() === "" || storeToCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbToStore", "error", "right", 1500, "Required");
            res = false;
        }
        if (issueDate.value() === "" || issueDate.value() === null) {
            AjaxManager.NotifyMsg("dtIssueReceiveDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (issueNo === "" || issueNo === null) {
            AjaxManager.NotifyMsg("txtIssueNo", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};