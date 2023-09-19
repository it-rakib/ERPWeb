var StyleTransferDetailsManager = {
    SaveStyleTransfer: function () {
        var validator = $("#divDetails").kendoValidator().data("kendoValidator"), status = $(".status");
        if (validator.validate()) {
            if (StyleTransferDetailsHelper.ValidateForm()) {
                var objSTO = StyleTransferDetailsHelper.CreateStyleTransferObject();
                var jsonParam = JSON.stringify(objSTO);
                if (objSTO.StyleTransferDetails != null && objSTO.StyleTransferDetails.length > 0) {
                    var serviceUrl = _baseUrl + "/api/StyleTransfer/CreateOrUpdateStyleTransfer";
                    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
                } else {
                    AjaxManager.MsgBox('warning', 'center', 'Required', "Please Input Transfer Qty!",
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
                            $("#hdnSTOutId").val(res.STOutId);
                            $("#txtTransferNo").val(res.STOutNo);
                            $("#hdnFromStyleId").val(res.FromStyleId);
                            $("#hdnFromStyleDetailsId").val(res.FromStyleDetailsId);
                            $("#hdnToStyleId").val(res.ToStyleId);
                            $("#hdnToStyleDetailsId").val(res.ToStyleDetailsId);
                            $("#grdStyleTransferItemList").data("kendoGrid").dataSource.read();
                            StyleTransferDetailsHelper.FillStyleTransferDetailsGrid(res);
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

var StyleTransferDetailsHelper = {
    InitStyleTransferDetails: function () {
        $("#pnlMasterInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        StyleTransferItemListHelper.InitStyleTransferItemList();
        StyleTransferDetailsHelper.GenerateDatePicker();
        //StyleTransferDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadTransactionTypeCombo("cmbTransType");
        MerchantHelper.LoadStoreComboByUserId("cmbFromStore", CurrentUser.USERID);
        MerchantHelper.LoadStoreComboByUserId("cmbToStore", CurrentUser.USERID);
        StyleGridFromHelper.InitStyleGridFrom();
        StyleGridToHelper.InitStyleGridTo();

        $("#btnAddNew").click(function () {
            StyleTransferDetailsHelper.ClearAll();
            $("#divSummary").hide();
            $("#divDetails").show();
            $("#btnSave").text(" Save");
            $("#btnSave").addClass("fa fa-save");
            $("#hdnRequisitionId").val(AjaxManager.DefaultGuidId());
            $("#grdStyleTransferItemList").data("kendoGrid").dataSource.data([]);
        });
        $("#btnBackToList").click(function () {
            StyleTransferSummaryHelper.LoadStyleTransferGridData();
            $("#divSummary").show();
            $("#divDetails").hide();
        });
        $("#btnSave").click(function () {
            StyleTransferDetailsManager.SaveStyleTransfer();
        });
        //$("#divStyleFrom *").attr("disabled", true);
        $("#btnSearchStyleFrom").click(function () {
            var storeId = $("#cmbFromStore").data("kendoComboBox").value();
            var fromStyleDetailsId = $("#hdnFromStyleDetailsId").val();
            if (storeId === "" || storeId === 0 || storeId === undefined) {
                $("#divStyleFrom *").attr("disabled", true);
            } else {
                //$("#divStyleFrom *").removeAttr("disabled");
                var styleGrid = $("#grdStylePopUpFrom").data("kendoGrid");
                var transTypeId = 6; // Store Receive
                var sdata = StyleGridFromManager.gridDataSource(transTypeId,storeId);
                styleGrid.setDataSource(sdata);
                if (sdata._data.length === 0) {
                    $("#txtFromStyleNo").val("");
                }

                var grid = $("#grdStyleTransferItemList").data("kendoGrid");
                var data = StyleTransferItemListManager.GetStoreRcvDetailsByStyleAndStoreAndTransId(fromStyleDetailsId, storeId, transTypeId);
                grid.setDataSource(data);
            }
        });
        //$("#divStyleTo *").attr("disabled", true);
        $("#btnSearchStyleTo").click(function () {
            var storeId = $("#cmbFromStore").data("kendoComboBox").value();
            var toStyleDetailsId = $("#hdnToStyleDetailsId").val();
            if (storeId === "" || storeId === 0 || storeId === undefined) {
                $("#divStyleTo *").attr("disabled", true);
            } else {
                //$("#divStyleTo *").removeAttr("disabled");
                var styleToGrid = $("#grdStylePopUpTo").data("kendoGrid");
                var transTypeId = 7; // Style Transfer In (Receive)
                var sdata2 = StyleGridToManager.gridDataSource();
                styleToGrid.setDataSource(sdata2);
                if (sdata2._data.length === 0) {
                    $("#txtToStyleNo").val("");
                }
            }
        });
    },
    GenerateDatePicker: function () {
        $("#dtTransferDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateStyleTransferObject: function () {
        var obj = new Object();
        obj.STOutId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnSTOutId").val());
        obj.STOutDate = $("#dtTransferDate").data("kendoDatePicker").value();
        obj.STOutNo = $("#txtTransferNo").val();
        obj.TransTypeId = $("#cmbTransType").data("kendoComboBox").value();
        obj.FromStoreId = UtilityHelper.ZeroIfNullorEmpty($("#cmbFromStore").data("kendoComboBox").value());
        obj.ToStoreId = UtilityHelper.ZeroIfNullorEmpty($("#cmbToStore").data("kendoComboBox").value());
        obj.RequisitionId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnRequisitionId").val());
        obj.FromStyleId = $("#hdnFromStyleId").val();
        obj.FromStyleDetailsId = $("#hdnFromStyleDetailsId").val();
        obj.ToStyleId = $("#hdnToStyleId").val();
        obj.ToStyleDetailsId = $("#hdnToStyleDetailsId").val();
        obj.Remarks = $("#txtRemarks").val();
        obj.CreatedBy = CurrentUser.USERID;
        obj.StyleTransferDetails = StyleTransferDetailsHelper.CreateStyleTransferDetailsObject();
        return obj;
    },
    CreateStyleTransferDetailsObject: function () {
        var list = [];
        var itemGrid = $("#grdStyleTransferItemList").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            if (itemData.STOutQty > 0) {
                obj.STOutDetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.STOutDetailsId);
                obj.STOutId = UtilityHelper.EmptyThenDefaultGuidId(itemData.STOutId);
                obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ItemId);
                obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(itemData.ColorId);
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(itemData.UOMId);
                obj.Rate = UtilityHelper.ZeroIfNullorEmpty(itemData.Rate);
                obj.STOutQtyPrev = UtilityHelper.ZeroIfNullorEmpty(itemData.STOutQtyPrev);
                obj.STOutQty = UtilityHelper.ZeroIfNullorEmpty(itemData.STOutQty);
                obj.ItemRemarks = itemData.ItemRemarks;
                list.push(obj);
            }
        }
        return list;
    },

    FillStyleTransferMasterForm: function (obj) {
        $("#btnSave").text(" Update");
        $("#btnSave").addClass("fas fa-edit");
        $("#hdnSTOutId").val(obj.STOutId);
        $("#dtTransferDate").data("kendoDatePicker").value(obj.STOutDate);
        $("#txtTransferNo").val(obj.STOutNo);
        $("#cmbTransType").data("kendoComboBox").value(obj.TransTypeId);
        $("#cmbFromStore").data("kendoComboBox").value(obj.FromStoreId);
        $("#cmbToStore").data("kendoComboBox").value(obj.ToStoreId);
        $("#hdnFromStyleId").val(obj.FromStyleId);
        $("#hdnFromStyleDetailsId").val(obj.FromStyleDetailsId);
        $("#txtFromStyleNo").val(obj.FromStyleNo);
        $("#hdnToStyleId").val(obj.ToStyleId);
        $("#hdnToStyleDetailsId").val(obj.ToStyleDetailsId);
        $("#txtToStyleNo").val(obj.ToStyleNo);
        $("#txtRemarks").val(obj.Remarks);
        $("#hdnRequisitionId").val(obj.RequisitionId);
        StyleTransferDetailsHelper.FillStyleTransferDetailsGrid(obj);
    },
    FillStyleTransferDetailsGrid: function (obj) {
        var detailsList = StyleTransferItemListManager.GetStyleTransferOutDetailsBySTOutId(obj.STOutId);
        var itemGrid = $("#grdStyleTransferItemList").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
            schema: {
                model: {
                    fields: {
                        ItemRemarks: { editable: true },
                        STOutQty: { editable: true },
                        PrevSTOutQty: { editable: false },
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
        itemGrid.setDataSource(gridDataSource);
        itemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "STOutQty") {
                    if (obj.STOutQty > obj.BalanceQty) {
                        e.items[0].STOutQty = obj.BalanceQty;
                        AjaxManager.MsgBox('warning', 'center', 'Please Carefull', "Trasnfer Qty can't greater than Current Balance",
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
        $("#hdnSTOutId").val(AjaxManager.DefaultGuidId());
        $("#dtTransferDate").data("kendoDatePicker").value(new Date());
        $("#hdnFromStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnFromStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtFromStyleNo").val("");
        $("#hdnToStyleId").val(AjaxManager.DefaultGuidId());
        $("#hdnToStyleDetailsId").val(AjaxManager.DefaultGuidId());
        $("#txtToStyleNo").val("");
        $("#txtRemarks").val("");
    },
    ValidateForm: function () {
        var res = true;
        var dates = $("#dtTransferDate").data("kendoDatePicker");
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
            AjaxManager.NotifyMsg("dtTransferDate", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};