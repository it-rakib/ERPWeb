var SubContractReturnDetailsManager = {
    SaveSubContractReturn: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"), status = $(".status");
        if (validator.validate()) {
            if (SubContractReturnDetailsHelper.ValidateIssueForm()) {
                var issueObj = SubContractReturnDetailsHelper.CreateSubContractReturnObject();
                var jsonParam = JSON.stringify(issueObj);
                if (issueObj.SubContractReturnDetails != null && issueObj.SubContractReturnDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/SubContractReturn/CreateOrUpdateSubContractReturn";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                } else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Return Qty!",
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
                AjaxManager.MsgBox('success', 'center', 'Success', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            var res = jsonData.Result;
                            $("#hdnIssueId").val(res.IssueId);
                            $("#txtIssueNo").val(res.IssueNo);
                            $("#hdnStyleId").val(res.StyleId);
                            $("#hdnStyleDetailsId").val(res.StyleDetailsId);
                            $("#grdSubContractReturnItemList").data("kendoGrid").dataSource.read();
                            SubContractReturnDetailsHelper.FillSubContractReturnMasterForm(res);
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
            AjaxManager.MsgBox('error', 'center', 'Failed', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    }
};

var SubContractReturnDetailsHelper = {
    InitSubContractReturnDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        SubContractReturnItemListHelper.InitSubContractReturnItemList();
        StyleListSearchHelper.InitStyleListGrid();
        SubContractReturnDetailsHelper.GenerateDatePicker();
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreComboByUserId("cmbFromStore", CurrentUser.USERID);
        MerchantHelper.LoadStoreCombo("cmbToStore");

        $("#btnAddNew").click(function () {
            $("#btnSave").text(" Save");
            $("#btnSave").addClass("fa fa-save");
            $("#divSummary").hide();
            $("#divDetails").show();
            SubContractReturnDetailsHelper.ClearAll();
        });
        $("#btnBackToList").click(function () {
            SubContractReturnSummaryHelper.LoadSubContractReturnGridDataSource();
            $("#divSummary").show();
            $("#divDetails").hide();
        });
        $("#btnSave").click(function () {
            SubContractReturnDetailsManager.SaveSubContractReturn();
        });
        $("#divStyle *").attr("disabled", true);
        $("#cmbToStore").change(function () {
            var storeId = $("#cmbFromStore").data("kendoComboBox").value();
            var styleDetailsId = $("#hdnStyleDetailsId").val();
            if (storeId === "" || storeId === 0 || storeId === undefined) {
                $("#divStyle *").attr("disabled", true);
            } else {
                $("#divStyle *").removeAttr("disabled");
                var styleGrid = $("#grdStyleSummary").data("kendoGrid");
                var transTypeId = 23; // SubContract Receive
                var sdata = StyleListSearchManager.GetStyleByTransTypeAndStoreIdDataSource(transTypeId, storeId);
                styleGrid.setDataSource(sdata);
                if (sdata._data.length === 0) {
                    $("#txtSrcStyle").val("");
                }

                var grid = $("#grdSubContractReturnItemList").data("kendoGrid");
                var data = SubContractReturnItemListManager.GetSubContractRcvInfoByStyleAndStoreId(styleDetailsId, storeId);
                grid.setDataSource(data);
            }
        });
    },
    GenerateDatePicker: function () {
        $("#dtReturnDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateSubContractReturnObject: function () {
        var obj = new Object();
        obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnIssueId").val());
        obj.IssueDate = $("#dtReturnDate").data("kendoDatePicker").value();
        obj.IssueNo = $("#txtReturnNo").val();
        obj.TransTypeId = $("#cmbTransType").data("kendoComboBox").value();
        obj.FromUnitId = UtilityHelper.ZeroIfNullorEmpty($("#cmbFromStore").data("kendoComboBox").value());
        obj.StyleId = $("#hdnStyleId").val();
        obj.StyleDetailsId = $("#hdnStyleDetailsId").val();
        obj.ToUnitId = UtilityHelper.ZeroIfNullorEmpty($("#cmbToStore").data("kendoComboBox").value());
        obj.Remarks = $("#txtRemarks").val();
        obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnRequisitionId").val());
        obj.CreatedBy = CurrentUser.USERID;
        obj.SubContractReturnDetails = SubContractReturnDetailsHelper.CreateSubContractReturnDetailsObject();
        return obj;
    },
    CreateSubContractReturnDetailsObject: function () {
        var list = [];
        var itemGrid = $("#grdSubContractReturnItemList").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        var ds = itemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            if (itemData.ReturnQty > 0) {
                obj.IssueDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.IssueDetailsId);
                obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId(itemData.IssueId);
                obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ItemId);
                obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ColorId);
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(itemData.UOMId);
                obj.Rate = UtilityHelper.ZeroIfNullorEmpty(itemData.Rate);
                obj.PrevReturnQty = UtilityHelper.ZeroIfNullorEmpty(itemData.PrevReturnQty);
                obj.ReturnQty = UtilityHelper.ZeroIfNullorEmpty(itemData.ReturnQty);
                obj.ItemRemarks = itemData.ItemRemarks;
                list.push(obj);
            }
        }
        return list;
    },
    FillSubContractReturnMasterForm: function (obj) {
        $("#btnSave").text(" Update");
        $("#btnSave").addClass("fas fa-edit");
        $("#hdnIssueId").val(obj.IssueId);
        $("#dtReturnDate").data("kendoDatePicker").value(obj.IssueDate);
        $("#txtReturnNo").val(obj.IssueNo);
        $("#cmbTransType").data("kendoComboBox").value(obj.TransTypeId);
        $("#cmbFromStore").data("kendoComboBox").value(obj.FromUnitId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").removeAttr("disabled");
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#cmbToStore").data("kendoComboBox").value(obj.ToUnitId);
        $("#txtRemarks").val(obj.Remarks);
        SubContractReturnDetailsHelper.FillSubContractReturnDetailsGrid(obj);
    },
    FillSubContractReturnDetailsGrid: function (obj) {
        var issueDetailsList = SubContractReturnItemListManager.GetSubContractReturnDetailsItemByIssueId(obj.IssueId);
        var itemGrid = $("#grdSubContractReturnItemList").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: issueDetailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        ReturnQty: { editable: true },
                        PrevReturnQty: { editable: false },
                        BalanceQty: { editable: false },
                        SubContractRcvQty: { editable: false },
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
                if (e.field === "ReturnQty") {
                    if (obj.ReturnQty > obj.SubContractRcvQty) {
                        e.items[0].ReturnQty = obj.SubContractRcvQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Return Qty can't greater than Receive Qty",
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
        $("#dtReturnDate").data("kendoDatePicker").value(new Date());
        $("#txtReturnNo").val("");
        $("#hdnStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtSrcStyle").val("");
        $("#cmbToStore").data("kendoComboBox").value("");
        $("#txtRemarks").val("");
        $("#grdSubContractReturnItemList").data("kendoGrid").dataSource.data([]);
    },
    ValidateIssueForm: function () {
        var res = true;
        var returnDate = $("#dtReturnDate").data("kendoDatePicker");
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
        if (returnDate.value() === "" || returnDate.value() === null) {
            AjaxManager.NotifyMsg("dtReturnDate", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};