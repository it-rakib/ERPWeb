var SampleIssueDetailsManager = {
    SaveSampleIssue: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"),
        status = $(".status");
        if (validator.validate()) {
            if (SampleIssueDetailsHelper.ValidateIssueForm()) {
                var issueObj = SampleIssueDetailsHelper.CreateSampleIssueObject();
                var jsonParam = JSON.stringify(issueObj);
                if (issueObj.SampleIssueDetails != null && issueObj.SampleIssueDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/SampleIssue/CreateOrUpdateSampleIssue";
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
                            $("#grdSampleIssueItemList").data("kendoGrid").dataSource.read();
                            SampleIssueDetailsHelper.FillIssueDetailsGrid(res);
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

var SampleIssueDetailsHelper = {
    InitSampleIssueDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        IssueItemListHelper.InitIssueItemList();
        SampleIssueDetailsHelper.GenerateDatePicker();
        //SampleIssueDetailsHelper.GenerateNumericTextBox();
        //$("#cmbTransType").kendoComboBox({
        //    placeholder: "--Select  Transaction Type--",
        //    dataValueField: "TransTypeId",
        //    dataTextField: "TransTypeName",
        //    dataSource: MerchantManager.GetTransactionType(),
        //    index: 2,
        //    suggest: true,
        //    filter: "contains"
        //});
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreComboByUserId("cmbFromStore", CurrentUser.USERID);
        MerchantHelper.LoadStoreCombo("cmbToStore");
        StyleSearchHelper.InitStyleList();
        RequisitionListSearchHelper.InitRequisitionList();

        $("#btnAddNew").click(function () {
            SampleIssueDetailsHelper.ClearAll();
            $("#divSummary").hide();
            $("#divDetails").show();
            $("#btnSave").text(" Save");
            $("#btnSave").addClass("fa fa-save");
            $("#hdnRequisitionId").val(AjaxManager.DefaultGuidId());
            $("#txtSrcRequisition").val("");
        });
        $("#btnBackToList").click(function () {
            SampleIssueSummaryHelper.LoadRequisitionDataSource();
            SampleIssueSummaryHelper.LoadIssueGridData();
            $("#divSummary").show();
            $("#divDetails").hide();
        });
        $("#btnSave").click(function () {
            SampleIssueDetailsManager.SaveSampleIssue();
        });
        $("#divStyle *").attr("disabled", true);
    },
    GenerateDatePicker: function () {
        $("#dtIssueDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    FillIssueMasterFormByRequisition: function (requsition) {
        $("#btnSave").text(" Save");
        $("#btnSave").addClass("fas fa-save");
        $("#cmbTransType").data("kendoComboBox").value(requsition.TransTypeId);
        $("#hdnStyleId").val(requsition.StyleId);
        $("#hdnStyleDetailsId").val(requsition.StyleDetailsId);
        $("#txtSrcStyle").val(requsition.StyleNo);
        $("#cmbToStore").data("kendoComboBox").value(requsition.StoreFromId);
        $("#hdnRequisitionId").val(requsition.RequisitionId);
        $("#txtSrcRequisition").val(requsition.RequisitionNo);
        SampleIssueDetailsHelper.FillIssueDetailsGridByRequisition(requsition);
    },
    FillIssueDetailsGridByRequisition: function (requsitionD) {
        var itemGrid = $("#grdSampleIssueItemList").data("kendoGrid");
        var detailsList = IssueItemListManager.GetSampleRequetionByRequisitionId(requsitionD.RequisitionId);
        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
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
        itemGrid.setDataSource(gridDataSource);
        itemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "IssueQty") {
                    if (obj.IssueQty > obj.BalanceQty) {
                        e.items[0].IssueQty = obj.BalanceQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Issue Qty can't greater than Current Balance",
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

    CreateSampleIssueObject: function () {
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
        obj.SampleIssueDetails = SampleIssueDetailsHelper.CreateSampleIssueDetailsObject();
        return obj;
    },
    CreateSampleIssueDetailsObject: function () {
        var list = [];
        var itemGrid = $("#grdSampleIssueItemList").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        var ds = itemGrid.dataSource.view();
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
    FillSampleIssueMasterForm: function (obj) {
        $("#btnSaveIssue").text(" Update");
        $("#btnSaveIssue").addClass("fas fa-edit");
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
        SampleIssueDetailsHelper.FillSampleIssueDetailsGrid(obj);
    },
    FillSampleIssueDetailsGrid: function (obj) {
        var detailsList = IssueItemListManager.GetSampleIssueDetailsByIssueId(obj.IssueId);
        var itemGrid = $("#grdSampleIssueItemList").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
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
        itemGrid.setDataSource(gridDataSource);
        itemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "IssueQty") {
                    if (obj.IssueQty > obj.BalanceQty) {
                        e.items[0].IssueQty = obj.BalanceQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Issue Qty can't greater than Current Balance",
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
        $("#hdnStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtRemarks").val("");
        $("#grdSampleIssueItemList").data("kendoGrid").dataSource.data([]);
    },
    ValidateIssueForm: function () {
        var res = true;
        var issueDate = $("#dtIssueDate").data("kendoDatePicker");
        var storeFromCombo = $("#cmbFromStore").data("kendoComboBox");
        var storeToCombo = $("#cmbToStore").data("kendoComboBox");
        var issueItemList = $("#grdSampleIssueItemList").data("kendoGrid");

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