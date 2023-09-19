var InvQCDetailsManager = {
    SaveInventoryQC: function () {
        var validator = $("#divQCDetails").kendoValidator().data("kendoValidator"),
        status = $(".status");
        if (validator.validate()) {
            if (InvQCDetailsHelper.ValidateQCForm()) {
                var costingObj = InvQCDetailsHelper.CreateInvQCObject();
                var jsonParam = JSON.stringify(costingObj);
                var serviceUrl = _baseUrl + "/api/InvQC/CreateOrUpdateInventoryQC";
                AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            }
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            var res = jsonData.Result;
                            $("#hdnQCId").val(res.QCId);
                            $("#txtQCNo").val(res.QCNo);
                            $("#grdInvQCSummary").data("kendoGrid").dataSource.read();
                            //InvQCDetailsHelper.FillQCMasterForm(res);
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
            AjaxManager.MsgBox('error', 'center', 'Failed', error.statusText,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }
    },
};

var InvQCDetailsHelper = {
    InitInvQCDetails: function () {
        QCItemListHelper.InitQCItemList();
        InvQCDetailsHelper.GenerateDatePicker();
        InvQCDetailsHelper.GenerateNumericTextBox();
        PIListSearchHelper.InitPIListSearch();
        ConsignmentListHelper.InitConsignmentSummary();
        RejectOrReturnCauseHelper.InitRejectOrReturnCause();

        $("#btnAddNew").click(function () {
            InvQCDetailsHelper.ClearQCMasterForm();
            $("#divQCSummary").hide();
            $("#divQCDetails").show();
            $("#btnSaveQC").text(" Save");
            $("#btnSaveQC").addClass("fa fa-save");
            $("#btnSaveQC").show();
            $("#lblMessage").html("");
        });
        $("#btnBackQCList").click(function () {
            InvQCSummaryHelper.LoadQCGrid();
            $("#divQCSummary").show();
            $("#divQCDetails").hide();
        });

        $("#btnSaveQC").click(function () {
            InvQCDetailsManager.SaveInventoryQC();
        });

    },
    GenerateDatePicker: function () {
        $("#dtQCDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        //$("#").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateInvQCObject: function () {
        var obj = new Object();
        obj.Qcid = UtilityHelper.EmptyThenDefaultGuidId($("#hdnQCId").val());
        obj.Qcno = $("#txtQCNo").val();
        obj.Qcdate = kendo.toString($("#dtQCDate").data("kendoDatePicker").value(), "yyyy-MM-dd");
        obj.Piid = UtilityHelper.EmptyThenDefaultGuidId($("#hdnPIId").val());
        obj.ConsignmentId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnConsignmentId").val());
        obj.CreatedBy = CurrentUser.USERID;
        obj.InvQcdetails = InvQCDetailsHelper.CreateInvQCDetailsObject();
        return obj;
    },
    CreateInvQCDetailsObject: function () {
        var list = [];
        var rcvItemGrid = $("#grdReceivedItemSummary").data("kendoGrid");
        var gridData = rcvItemGrid.dataSource.data();
        var ds = rcvItemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            var obj = new Object();
            if (itemData.QCPassQty > 0) { //|| (itemData.QCDetailsId !== null && itemData.QCDetailsId !== undefined && itemData.QCDetailsId !== AjaxManager.DefaultGuidId())
                obj.QcdetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.QCDetailsId);
                obj.Qcid = UtilityHelper.EmptyThenDefaultGuidId(itemData.QCId);
                obj.BuyerId = itemData.BuyerId;
                obj.StyleDetailsId = itemData.StyleDetailsId;
                obj.BookingDetailsId = itemData.BookingDetailsId;
                obj.BookingId = itemData.BookingId;
                obj.ItemId = itemData.ItemId;
                obj.ColorId = itemData.ColorId;
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.Uomid = itemData.UOMId;
                obj.UnitPrice = itemData.UnitPrice;
                obj.Piqty = itemData.PIQty;
                obj.PrevRcvQty = UtilityHelper.ZeroIfNullorEmpty(itemData.PrevRcvQty);
                obj.ReceivedQty = UtilityHelper.ZeroIfNullorEmpty(itemData.ReceivedQty);
                obj.QcpassQty = UtilityHelper.ZeroIfNullorEmpty(itemData.QCPassQty);
                obj.QcpassPercent = UtilityHelper.ZeroIfNullorEmpty(itemData.QCPassPercent);
                obj.QcrejectQty = UtilityHelper.ZeroIfNullorEmpty(itemData.QCRejectQty);
                obj.QcrejectPercent = UtilityHelper.ZeroIfNullorEmpty(itemData.QCRejectPercent);
                obj.ItemRemarks = itemData.ItemRemarks;
                var row = rcvItemGrid.table.find("tr[data-uid='" + ds[i].uid + "']");
                var chkboxQCP = $(row).find(".IsQCPass");
                if (chkboxQCP.is(":checked")) {
                    obj.IsQcpass = true;
                } else {
                    obj.IsQcpass = false;
                };
                var chkboxR = $(row).find(".IsReturn");
                if (chkboxR.is(":checked")) {
                    obj.IsReturn = true;
                } else {
                    obj.IsReturn = false;
                }
                obj.InvQcreturnCauses = InvQCDetailsHelper.CreateInvQCReturnCauseObject(itemData);
                list.push(obj);
            }
        }
        return list;
    },
    CreateInvQCReturnCauseObject: function (qcDetailsItem) {
        var causelist = [];
        for (var i = 0; i < gbCauseList.length; i++) {
            var returnCauseData = gbCauseList[i];
            var obj = new Object();
            if (returnCauseData.ItemId === qcDetailsItem.ItemId && returnCauseData.ColorId === qcDetailsItem.ColorId && returnCauseData.SizeId === qcDetailsItem.SizeId && returnCauseData.UOMId === qcDetailsItem.UOMId) {
                obj.CauseId = UtilityHelper.EmptyThenDefaultGuidId(returnCauseData.CauseId);
                obj.QcdetailsId = UtilityHelper.EmptyThenDefaultGuidId(qcDetailsItem.QCDetailsId);
                obj.ItemId = returnCauseData.ItemId;
                obj.ColorId = returnCauseData.ColorId;
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(returnCauseData.SizeId);
                obj.UOMId = returnCauseData.UOMId;
                obj.Cause = returnCauseData.Cause;
                causelist.push(obj);
            }
        }
        return causelist;
    },
    FillQCMasterForm: function (obj) {
        $("#btnSaveQC").text(" Update");
        $("#btnSaveQC").addClass("fas fa-edit");
        $("#hdnQCId").val(obj.Qcid);
        $("#txtQCNo").val(obj.Qcno);
        $("#hdnPIId").val(obj.Piid);
        $("#txtPINo").val(obj.PINo);
        $("#txtConsignmentNo").val(obj.ConsignmentNo);
        $("#hdnConsignmentId").val(obj.ConsignmentId);
        $("#dtQCDate").data("kendoDatePicker").value(obj.Qcdate);
        InvQCDetailsHelper.FillQCDetailsGrid(obj);
    },
    FillQCDetailsGrid: function (obj) {
        var qcDetailsList = QCItemListManager.GetQCDetailsItemByQCId(obj.Qcid);
        var qcItemGrid = $("#grdReceivedItemSummary").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: qcDetailsList,
            schema: {
                model: {
                    fields: {
                        IsReturn: { editable: false },
                        IsQCPass: { editable: false },
                        ItemRemarks: { editable: true },
                        QCRejectPercent: { editable: false },
                        QCRejectQty: { editable: true },
                        QCPassPercent: { editable: false },
                        QCPassQty: { editable: true },
                        PrevQCPQty: { editable: false },
                        ReceivedQty: { editable: false },
                        PIQty: { editable: false },
                        BuyerName: { editable: false },
                        StyleNo: { editable: false },
                        BookingNo: { editable: false },
                        ItemName: { editable: false },
                        ColorName: { editable: false },
                        SizeName: { editable: false },
                        UOMName: { editable: false }
                    }
                }
            }
        });
        qcItemGrid.setDataSource(gridDataSource);
        qcItemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "QCPassQty") {
                    var prevQCPQty = UtilityHelper.ZeroIfNullorEmpty(obj.PrevQCPQty);
                    var qcQty = prevQCPQty + obj.QCPassQty;
                    if (qcQty > obj.ReceivedQty) {
                        e.items[0].QCPassQty = obj.ReceivedQty - prevQCPQty;
                    }
                    e.items[0].QCPassPercent = (((obj.QCPassQty / obj.ReceivedQty) * 100)).toFixed(2);
                    $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(22)").text(e.items[0].QCPassPercent);
                }
                else if (e.field === "QCPassPercent") {
                    e.items[0].QCPassQty = ((obj.ReceivedQty * obj.QCPassPercent / 100)).toFixed(2);
                    $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(21)").text(e.items[0].QCPassQty);
                }
                else if (e.field === "QCRejectQty") {
                    e.items[0].QCRejectPercent = (((obj.QCRejectQty / obj.ReceivedQty) * 100)).toFixed(2);
                    $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(24)").text(e.items[0].QCRejectPercent);
                }
                else if (e.field === "QCRejectPercent") {
                    e.items[0].QCRejectQty = ((obj.ReceivedQty * obj.QCRejectPercent / 100)).toFixed(2);
                    $("#grdReceivedItemSummary tbody").find("tr[data-uid='" + e.items[0].uid + "'] td:eq(23)").text(e.items[0].QCRejectQty);
                }
                //qcItemGrid.refresh();
            }
        });

        var causeGridData = InvQCSummaryManager.GetQCReturnCauseByQCId(obj.Qcid);
        gbCauseList = causeGridData;
    },
    ValidateQCForm: function () {
        var res = true;
        //var suppCombo = $("#cmbSupplier").data("kendoComboBox");
        //if (suppCombo.value() === "" || suppCombo.value() === AjaxManager.DefaultGuidId()) {
        //    AjaxManager.NotifyMsg("cmbSupplier", "error", "right", 1500, "Required");
        //    res = false;
        //}
        return res;
    },
    ClearQCMasterForm: function () {
        $("#hdnQCId").val(AjaxManager.DefaultGuidId());
        $("#txtQCNo").val("");
        $("#hdnPIId").val(AjaxManager.DefaultGuidId());
        $("#txtPINo").val("");
        $("#hdnConsignmentId").val(AjaxManager.DefaultGuidId());
        $("#txtConsignmentNo").val("");
        //$("#txtRemarks").val("");
        $("#dtQCDate").data("kendoDatePicker").value(new Date());
        $("#grdReceivedItemSummary").data("kendoGrid").dataSource.data([]);
    }
};