var SubContractRtnRcvDetailsManager = {
    SaveSubContractRtnRcv: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"),status = $(".status");
        if (validator.validate()) {
            if (SubContractRtnRcvDetailsHelper.ValidateIssueForm()) {
                var issueObj = SubContractRtnRcvDetailsHelper.CreateSubContractRtnRcvObject();
                var jsonParam = JSON.stringify(issueObj);
                if (issueObj.SubContractRtnRcvDetails != null && issueObj.SubContractRtnRcvDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/SubContractRtnRcv/CreateOrUpdateSubContractRtnRcv";
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
                            $("#hdnReceiveId").val(res.ReceiveId);
                            $("#txtReceiveNo").val(res.ReceiveNo);
                            $("#hdnIssueId").val(res.IssueId);
                            $("#hdnStyleId").val(res.StyleId);
                            $("#hdnStyleDetailsId").val(res.StyleDetailsId);
                            $("#grdSubContractRtnRcvItemList").data("kendoGrid").dataSource.read();
                            SubContractRtnRcvDetailsHelper.FillSubContractRtnRcvMasterForm(res);
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

var SubContractRtnRcvDetailsHelper = {
    InitSubContractRtnRcvDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        RtnRcvItemListHelper.InitRtnRcvItemList();
        SubContractRtnRcvDetailsHelper.GenerateDatePicker();
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreCombo("cmbFromStore");
        MerchantHelper.LoadStoreComboByUserId("cmbToStore", CurrentUser.USERID);

        $("#btnBackToList").click(function () {
            SubContractRtnRcvSummaryHelper.LoadPendingSubContractRtnRcvGridDataSource();
            SubContractRtnRcvSummaryHelper.LoadSubContractRtnRcvGridDataSource();
            $("#divSummary").show();
            $("#divDetails").hide();
        });
        $("#btnSave").click(function () {
            SubContractRtnRcvDetailsManager.SaveSubContractRtnRcv();
        });
        $("#divStyle *").attr("disabled", true);
    },
    GenerateDatePicker: function () {
        $("#dtReceiveDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateSubContractRtnRcvObject: function () {
        var obj = new Object();
        obj.ReceiveId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnReceiveId").val());
        obj.ReceiveDate = $("#dtReceiveDate").data("kendoDatePicker").value();
        obj.ReceiveNo = $("#txtReceiveNo").val();
        obj.IssueId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnIssueId").val());
        obj.TransTypeId = $("#cmbTransType").data("kendoComboBox").value();
        obj.StoreFromId = UtilityHelper.ZeroIfNullorEmpty($("#cmbFromStore").data("kendoComboBox").value());
        obj.StyleId = $("#hdnStyleId").val();
        obj.StyleDetailsId = $("#hdnStyleDetailsId").val();
        obj.StoreToId = UtilityHelper.ZeroIfNullorEmpty($("#cmbToStore").data("kendoComboBox").value());
        obj.Remarks = $("#txtRemarks").val();
        obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnRequisitionId").val());
        obj.CreatedBy = CurrentUser.USERID;
        obj.SubContractRtnRcvDetails = SubContractRtnRcvDetailsHelper.CreateSubContractRtnRcvDetailsObject();
        return obj;
    },
    CreateSubContractRtnRcvDetailsObject: function () {
        var list = [];
        var itemGrid = $("#grdSubContractRtnRcvItemList").data("kendoGrid");
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
                //obj.IssueQtyPrev = UtilityHelper.ZeroIfNullorEmpty(itemData.IssueQtyPrev);
                obj.ReceiveQty = UtilityHelper.ZeroIfNullorEmpty(itemData.ReceiveQty);
                obj.ItemRemarks = itemData.ItemRemarks;
                list.push(obj);
            }
        }
        return list;
    },
    FillReturnMasterForm: function (obj) {
        $("#btnSave").text(" Save");
        $("#btnSave").addClass("fas fa-save");
        $("#hdnIssueId").val(obj.IssueId);
        $("#txtReturnNo").val(obj.IssueNo);
        $("#cmbFromStore").data("kendoComboBox").value(obj.FromUnitId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#hdnRequisitionId").val(obj.RequisitionId);
        $("#txtSrcRequisition").val(obj.RequisitionNo);
        SubContractRtnRcvDetailsHelper.FillReturnDetailsGrid(obj);
    },
    FillReturnDetailsGrid: function (obj) {
        var itemGrid = $("#grdSubContractRtnRcvItemList").data("kendoGrid");
        var list = RtnRcvItemListManager.GetSubContractRtnDetailsItemByIssueId(obj.IssueId);
        var gridDataSource = new kendo.data.DataSource({
            data: list,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        ReceiveQty: { editable: false },
                        PrevRcvQty: { editable: false },
                        BalanceQty: { editable: false },
                        TotalRtnQty: { editable: false },
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
                if (e.field === "ReceiveQty") {
                    if (obj.ReceiveQty > obj.TotalRtnQty) {
                        e.items[0].ReceiveQty = obj.TotalRtnQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Receive Qty can't greater than Return Qty",
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

    FillSubContractRtnRcvMasterForm: function (obj) {
        $("#btnSave").text(" Update");
        $("#btnSave").addClass("fas fa-edit");
        $("#hdnReceiveId").val(obj.ReceiveId);
        $("#txtReceiveNo").val(obj.ReceiveNo);
        $("#dtReceiveDate").data("kendoDatePicker").value(obj.ReceiveDate);
        $("#hdnIssueId").val(obj.IssueId);
        $("#txtReturnNo").val(obj.IssueNo);
        $("#cmbTransType").data("kendoComboBox").value(obj.TransTypeId);
        $("#cmbFromStore").data("kendoComboBox").value(obj.StoreFromId);
        $("#hdnStyleId").val(obj.StyleId);
        $("#hdnStyleDetailsId").val(obj.StyleDetailsId);
        $("#txtSrcStyle").val(obj.StyleNo);
        $("#cmbToStore").data("kendoComboBox").value(obj.StoreToId);
        $("#txtRemarks").val(obj.Remarks);
        $("#hdnRequisitionId").val(obj.RequisitionId);
        $("#txtSrcRequisition").val(obj.RequisitionNo);
        SubContractRtnRcvDetailsHelper.FillSubContractRtnRcvDetailsGrid(obj);
    },
    FillSubContractRtnRcvDetailsGrid: function (obj) {
        var itemGrid = $("#grdSubContractRtnRcvItemList").data("kendoGrid");
        var detailsList = RtnRcvItemListManager.GetSubContractRtnRcvDetailsByReceiveId(obj.ReceiveId);
        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        ReceiveQty: { editable: false },
                        PrevRcvQty: { editable: false },
                        BalanceQty: { editable: false },
                        TotalRtnQty: { editable: false },
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
                if (e.field === "ReceiveQty") {
                    if (obj.ReceiveQty > obj.TotalRtnQty) {
                        e.items[0].ReceiveQty = obj.TotalRtnQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Receive Qty can't greater than Return Qty",
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
        $("#dtReceiveDate").data("kendoDatePicker").value(new Date());
        $("#hdnIssueId").val(AjaxManager.DefaultGuidId());
        $("#txtIssueNo").val("");
        $("#cmbFromStore").data("kendoComboBox").value("");
        $("#hdnStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtRemarks").val("");
    },
    ValidateIssueForm: function () {
        var res = true;
        var dates = $("#dtReceiveDate").data("kendoDatePicker");
        var returnNo = $("#txtReturnNo").val();
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
        if (dates.value() === "" || dates.value() === null) {
            AjaxManager.NotifyMsg("dtReceiveDate", "error", "right", 1500, "Required");
            res = false;
        }
        if (returnNo === "" || returnNo === null) {
            AjaxManager.NotifyMsg("txtReturnNo", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};