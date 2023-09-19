var LoanIssueDetailsManager = {
    SaveLoanIssue: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"),status = $(".status");
        if (validator.validate()) {
            if (LoanIssueDetailsHelper.ValidateIssueForm()) {
                var issueObj = LoanIssueDetailsHelper.CreateLoanIssueObject();
                var jsonParam = JSON.stringify(issueObj);
                if (issueObj.LoanIssueDetails != null && issueObj.LoanIssueDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/LoanIssue/CreateOrUpdateLoanIssue";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                } else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Issue Qty!",
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
                            $("#hdnIssueId").val(res.IssueId);
                            $("#txtIssueNo").val(res.IssueNo);
                            $("#hdnStyleId").val(res.StyleId);
                            $("#hdnStyleDetailsId").val(res.StyleDetailsId);
                            $("#txtSrcStyle").removeAttr("disabled");
                            $("#txtSrcStyle").val(res.StyleNo);
                            $("#grdLoanIssueSummary").data("kendoGrid").dataSource.read();
                            LoanIssueDetailsHelper.FillLoanIssueDetailsGrid(res);
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'DataError', jsonData.Message,
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

var LoanIssueDetailsHelper = {
    InitLoanIssueDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        IssueItemListHelper.InitIssueItemList();
        LoanIssueDetailsHelper.GenerateDatePicker();
        //LoanIssueDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreComboByUserId("cmbFromStore", CurrentUser.USERID);
        MerchantHelper.LoadStoreCombo("cmbToStore");
        RequisitionListSearchHelper.InitRequisitionListSearch();

        $("#btnAddNew").click(function () {
            LoanIssueDetailsHelper.ClearAll();
            $("#divSummary").hide();
            $("#divDetails").show();
            $("#btnSave").text(" Save");
            $("#btnSave").addClass("fa fa-save");
            $("#hdnRequisitionId").val(AjaxManager.DefaultGuidId());
            $("#txtSrcRequisition").val("");
        });
        $("#btnBackToList").click(function () {
            LoanIssueSummaryHelper.LoadRequisitionDataSource();
            LoanIssueSummaryHelper.LoadGridData();
            $("#divSummary").show();
            $("#divDetails").hide();
        });
        $("#btnSave").click(function () {
            LoanIssueDetailsManager.SaveLoanIssue();
        });
        $("#divStyle *").attr("disabled", true);
    },
    GenerateDatePicker: function () {
        $("#dtIssueDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    FillLoanIssueMasterFormByRequisition: function (requisition) {
        $("#btnSaveIssue").text(" Save");
        $("#btnSaveIssue").addClass("fas fa-save");
        $("#cmbTransType").data("kendoComboBox").value(requisition.TransTypeId);
        $("#hdnStyleId").val(requisition.StyleId);
        $("#hdnStyleDetailsId").val(requisition.StyleDetailsId);
        $("#txtSrcStyle").val(requisition.StyleNo);
        $("#cmbToStore").data("kendoComboBox").value(requisition.StoreFromId);
        $("#hdnRequisitionId").val(requisition.RequisitionId);
        $("#txtSrcRequisition").val(requisition.RequisitionNo);
        LoanIssueDetailsHelper.FillLoanIssueDetailsGridByRequisition(requisition);
    },
    FillLoanIssueDetailsGridByRequisition: function (requisitionD) {
        var issueDetailsList = IssueItemListManager.GetLoanRequisitionInfoByRequisitionId(requisitionD.RequisitionId);
        var issueItemGrid = $("#grdIssueItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: issueDetailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        IssueQty: { editable: true },
                        PrevIssueQty: { editable: false },
                        BalanceQty: { editable: false },
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
        issueItemGrid.setDataSource(gridDataSource);
        issueItemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "IssueQty") {
                    if (obj.IssueQty > obj.RequiredQty) {
                        e.items[0].IssueQty = obj.RequiredQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Issue Qty can't greater than Requisition Qty",
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

    CreateLoanIssueObject: function () {
        var obj = new Object();
        obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnIssueId").val());
        obj.IssueDate = $("#dtIssueDate").data("kendoDatePicker").value();
        obj.IssueNo = $("#txtIssueNo").val();
        obj.TransTypeId = $("#cmbTransType").data("kendoComboBox").value();
        obj.FromUnitId = UtilityHelper.ZeroIfNullorEmpty($("#cmbFromStore").data("kendoComboBox").value());
        obj.StyleId = $("#hdnStyleId").val();
        obj.StyleDetailsId = $("#hdnStyleDetailsId").val();
        obj.ToUnitId = UtilityHelper.ZeroIfNullorEmpty($("#cmbToStore").data("kendoComboBox").value());
        obj.Remarks = $("#txtRemarks").val();
        obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnRequisitionId").val());
        obj.CreatedBy = CurrentUser.USERID;
        obj.LoanIssueDetails = LoanIssueDetailsHelper.CreateLoanIssueDetailsObject();
        return obj;
    },
    CreateLoanIssueDetailsObject: function () {
        var list = [];
        var issueItemGrid = $("#grdIssueItemSummary").data("kendoGrid");
        var gridData = issueItemGrid.dataSource.data();
        var ds = issueItemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            if (itemData.IssueQty > 0) {
                obj.IssueDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.IssueDetailsId);
                obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId(itemData.IssueId);
                obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ItemId);
                obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ColorId);
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(itemData.UOMId);
                obj.Rate = UtilityHelper.ZeroIfNullorEmpty(itemData.Rate);
                obj.IssueQtyPrev = UtilityHelper.ZeroIfNullorEmpty(itemData.IssueQtyPrev);
                obj.IssueQty = UtilityHelper.ZeroIfNullorEmpty(itemData.IssueQty);
                obj.ItemRemarks = itemData.ItemRemarks;
                list.push(obj);
            }
        }
        return list;
    },
    FillLoanIssueMasterForm: function (obj) {
        $("#btnSave").text(" Update");
        $("#btnSave").addClass("fas fa-edit");
        $("#hdnIssueId").val(obj.IssueId);
        $("#dtIssueDate").data("kendoDatePicker").value(obj.IssueDate);
        $("#txtIssueNo").val(obj.IssueNo);
        $("#cmbTransType").data("kendoComboBox").value(obj.TransTypeId);
        $("#cmbFromStore").data("kendoComboBox").value(obj.FromUnitId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").removeAttr("disabled");
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#cmbToStore").data("kendoComboBox").value(obj.ToUnitId);
        $("#txtRemarks").val(obj.Remarks);
        $("#hdnRequisitionId").val(obj.RequisitionId);
        $("#txtSrcRequisition").val(obj.RequisitionNo);
        LoanIssueDetailsHelper.FillLoanIssueDetailsGrid(obj);
    },
    FillLoanIssueDetailsGrid: function (obj) {
        var issueDetailsList = IssueItemListManager.GetLoanIssueDetailsByIssueId(obj.IssueId);
        var issueItemGrid = $("#grdIssueItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: issueDetailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        IssueQty: { editable: true },
                        PrevIssueQty: { editable: false },
                        BalanceQty: { editable: false },
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
        issueItemGrid.setDataSource(gridDataSource);
        issueItemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "IssueQty") {
                    if (obj.IssueQty > obj.RequiredQty) {
                        e.items[0].IssueQty = obj.RequiredQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Issue Qty can't greater than Requisition Qty",
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
        $("#hdnIssueId").val(AjaxManager.DefaultGuidId());
        $("#dtIssueDate").data("kendoDatePicker").value(new Date());
        $("#txtIssueNo").val("");
        $("#hdnStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#cmbToStore").data("kendoComboBox").value("");
        $("#txtRemarks").val("");
        $("#grdIssueItemSummary").data("kendoGrid").dataSource.data([]);
    },
    ValidateIssueForm: function () {
        var res = true;
        var issueDate = $("#dtIssueDate").data("kendoDatePicker");
        var storeFromCombo = $("#cmbFromStore").data("kendoComboBox");
        var storeToCombo = $("#cmbToStore").data("kendoComboBox");
        var issueItemList = $("#grdIssueItemSummary").data("kendoGrid");

        if (storeFromCombo.value() === "" || storeFromCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbFromStore", "error", "right", 1500, "Required");
            res = false;
        }
        if (storeToCombo.value() === "" || storeToCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbToStore", "error", "right", 1500, "Required");
            res = false;
        }
        if (issueDate.value() === "" || issueDate.value() === null) {
            AjaxManager.NotifyMsg("dtIssueDate", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};