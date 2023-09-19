var InvReceiveDetailsManager = {
    SaveInventoryRecieve: function () {
        var validator = $("#divRcvDetails").kendoValidator().data("kendoValidator"), status = $(".status");
        if (validator.validate()) {
            if (InvReceiveDetailsHelper.ValidateMRRForm()) {
                var costingObj = InvReceiveDetailsHelper.CreateInvReceiveObject();
                var jsonParam = JSON.stringify(costingObj);
                var serviceUrl = _baseUrl + "/api/InvMRR/CreateOrUpdateMRR";
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
                            $("#hdnMrrId").val(res.Mrrid);
                            $("#txtMRRNo").val(res.Mrrno);
                            $("#hdnPIId").val(res.Piid);
                            $("#grdInvReceiveSummary").data("kendoGrid").dataSource.read();
                            var mrrmObj = new Object();
                            mrrmObj.MRRId = res.Mrrid;
                            //mrrmObj.ConsignmentId = res.ConsignmentId;
                            InvReceiveDetailsHelper.FillMRRDetailsGrid(mrrmObj);
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', jsonData,
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

var InvReceiveDetailsHelper = {
    InitInvReceiveDetails:function() {
        ReceivedItemListHelper.InitReceivedItemList();
        InvReceiveDetailsHelper.GenerateDatePicker();
        InvReceiveDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadSupplierCombo("cmbSupplier");
        //MerchantHelper.GenerateCurrencyCombo("cmbCurrency");
        MerchantHelper.LoadStoreComboByUserId("cmbLocation", CurrentUser.USERID);
        PIListSearchHelper.InitPIListSearch();
        ConsignmentSummaryHelper.InitConsignmentSummary();

        $("#btnAddNew").click(function () {
            InvReceiveDetailsHelper.ClearMRRMasterForm();
            $("#divRcvSummary").hide();
            $("#divRcvDetails").show();
            $("#btnSaveMrr").text(" Save");
            $("#btnSaveMrr").addClass("fa fa-save");
            $("#btnSaveMrr").show();
            $("#lblMessage").html("");
        });
        $("#btnBackMrr").click(function () {
            $("#divRcvSummary").show();
            $("#divRcvDetails").hide();
        });

        $("#btnSaveMrr").click(function() {
            InvReceiveDetailsManager.SaveInventoryRecieve();
        });

    },
    GenerateDatePicker:function() {
        $("#txtReceivedDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtGrnDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtChallanDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtGateEntryDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtInvoiceDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox:function() {
        $("#txtConversionFactor").kendoNumericTextBox({ format: "#", min: 0 });
    },
    CreateInvReceiveObject: function () {
        var obj = new Object();
        obj.Mrrid = $("#hdnMrrId").val();
        obj.Mrrno = $("#txtMRRNo").val();
        obj.Mrrdate = kendo.toString($("#txtReceivedDate").data("kendoDatePicker").value(),"yyyy-MM-dd");
        obj.LocationId = UtilityHelper.ZeroIfNullorEmpty($("#cmbLocation").data("kendoComboBox").value());
        obj.Piid = $("#hdnPIId").val();
        obj.ConsignmentId = $("#hdnConsignmentId").val();
        obj.UserId = CurrentUser.USERID;
        obj.InvMrrdetails = InvReceiveDetailsHelper.CreateInventoryDetailsObject();
        return obj;
    },
    CreateInventoryDetailsObject: function () {
        var list = [];
        var rcvItemGrid = $("#grdReceivedItemSummary").data("kendoGrid");
        var gridData = rcvItemGrid.dataSource.data();
        var ds = rcvItemGrid.dataSource.view();
        for (var i = 0; i < gridData.length; i++) {
            var itemData = gridData[i];
            if (itemData.ReceivedQty > 0 || (itemData.MRRDetailsId !== null && itemData.MRRDetailsId !== undefined && itemData.MRRDetailsId !== AjaxManager.DefaultGuidId())) {
                var obj = new Object();
                obj.MrrdetailsId = UtilityHelper.EmptyThenDefaultGuidId(itemData.MRRDetailsId);
                obj.Mrrid = UtilityHelper.EmptyThenDefaultGuidId(itemData.MRRId);
                obj.BookingDeatilsId = itemData.BookingDetailId;
                obj.BookingId = itemData.BookingId;
                obj.StyleDetailId = itemData.StyleDetailId;
                obj.ItemId = itemData.ItemId;
                obj.ColorId = itemData.ColorId;
                obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(itemData.SizeId);
                obj.Uomid = itemData.UOMId;
                obj.RequiredQty = itemData.RequiredQty;
                obj.BookQty = itemData.BookQty;
                obj.ReceivedQty = itemData.ReceivedQty;
                obj.UnitPrice = itemData.UnitPrice;
                obj.BinId = itemData.Bin.BinId;
                obj.ShelveId = itemData.Shelve.ShelveId;
                var row = rcvItemGrid.table.find("tr[data-uid='" + ds[i].uid + "']");
                var checkbox = $(row).find(".check_row");
                if (checkbox.is(":checked")) {
                    obj.IsReceiveComplete = true;
                } else {
                    obj.IsReceiveComplete = false;
                }
                list.push(obj);
            }
        }
        return list;
    },
    FillMRRMasterForm: function (obj) {
        $("#btnSaveMrr").text(" Update");
        $("#btnSaveMrr").addClass("fas fa-edit");
        $("#hdnMrrId").val(obj.MRRId);
        $("#txtMRRNo").val(obj.MRRNo);
        $("#txtPINo").val(obj.PINo);
        $("#hdnConsignmentId").val(obj.ConsignmentId);
        $("#txtConsignmentNo").val(obj.ConsignmentNo);
        $("#txtReceivedDate").data("kendoDatePicker").value(obj.MRRDate);
        $("#cmbLocation").data("kendoComboBox").value(obj.LocationId);
        $("#txtGrnNo").val(obj.GRNNo);
        $("#txtGrnDate").data("kendoDatePicker").value(obj.GRNdDate);
        $("#cmbSupplier").data("kendoComboBox").value(obj.SupplierId);
        $("#hdnPIId").val(obj.PIId);
        $("#txtChallanNo").val(obj.DeliveryChallanNo);
        $("#txtChallanDate").data("kendoDatePicker").value(obj.DeliveryChallanDate);
        $("#txtVehicleNo").val(obj.VehicleNo);
        $("#txtGateEntryNo").val(obj.GateEntryNo);
        $("#txtGateEntryDate").data("kendoDatePicker").value(obj.GateEntryDate);
        $("#txtWayBillNo").val(obj.WayBillNo);
        $("#txtInvoiceNo").val(obj.ComInvoiceNo);
        $("#txtInvoiceDate").data("kendoDatePicker").value(obj.ComInvoiceDate);
        $("#txtDemandNo").val(obj.DemandNo);
        InvReceiveDetailsHelper.FillMRRDetailsGrid(obj);
    },
    FillMRRDetailsGrid: function (obj) {
        var mrrDetailsList = ReceivedItemListManager.GetMRRDetailsItemByMrrId(obj.MRRId);
        var rcvItemGrid = $("#grdReceivedItemSummary").data("kendoGrid");
        if (mrrDetailsList != null) {
            mrrDetailsList.map(x=> x.Bin = {
                BinId: x.Bin.BinId == null ? 0 : x.Bin.BinId,
                BinNumber: x.Bin.BinNumber == null ? "--Select Bin--" : x.Bin.BinNumber
            });
            mrrDetailsList.map(x=> x.Shelve = {
                ShelveId: x.Shelve.ShelveId == null ? 0 : x.Shelve.ShelveId,
                ShelveNo: x.Shelve.ShelveNo == null ? "-Select Shelve-" : x.Shelve.ShelveNo
            });
        }
        var gridDataSource = new kendo.data.DataSource({
            data: mrrDetailsList,
            schema: {
                model: {
                    fields: {
                        IsReceiveComplete: {editable: false},
                        ReceivedQty: { editable: true },
                        StyleNo: { editable: false },
                        ItemName: { editable: false },
                        ColorName: { editable: false },
                        SizeName: { editable: false },
                        UomName: { editable: false },
                        RequiredQty: { editable: false },
                        BookQty: { editable: false },
                        PIQty: { editable: false },
                        PrevReceiveQty: { editable: false },
                        UOMName: { editable: false },
                        Bin: {
                            defaultValue: { BinId: 0, BinNumber: "--Select Bin--" }
                        },
                        Shelve: {
                            defaultValue: { ShelveId: 0, ShelveNo: "-Select Shelve-" }
                        },
                    }
                }
            }
        });
        rcvItemGrid.setDataSource(gridDataSource);
        rcvItemGrid.dataSource.bind("change", function (e) {
            if (e.action === "itemchange") {
                var obj = e.items[0];
                if (e.field === "ReceivedQty") {
                    var prevRcvQty = UtilityHelper.ZeroIfNullorEmpty(obj.PrevReceivedQty);
                    var rcvQty = prevRcvQty + obj.ReceivedQty;
                    if (rcvQty > obj.PIQty) {
                        e.items[0].ReceivedQty = obj.PIQty - prevRcvQty;
                        return;
                    }
                }
            }
        });
    },
    ValidateMRRForm:function() {
        var res = true;
        var locationCombo = $("#cmbLocation").data("kendoComboBox");
        var suppCombo = $("#cmbSupplier").data("kendoComboBox");
        var rcvDate = $("#txtReceivedDate").data("kendoDatePicker");
        var grnDate = $("#txtGrnDate").data("kendoDatePicker");
        var chDate = $("#txtChallanDate").data("kendoDatePicker");
        var gtEntryDate = $("#txtGateEntryDate").data("kendoDatePicker");
        var invDate = $("#txtInvoiceDate").data("kendoDatePicker");

        if (locationCombo.value() === "" || locationCombo.value() === 0) {
            AjaxManager.NotifyMsg("cmbLocation", "error", "right", 1500, "Required");
            res = false;
        }
        if (suppCombo.value() === "" || suppCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbSupplier", "error", "right", 1500, "Required");
            res = false;
        }
        if (rcvDate.value() === "" || rcvDate.value() === null) {
            AjaxManager.NotifyMsg("txtReceivedDate", "error", "right", 1500, "Required");
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
    },
    ClearMRRMasterForm: function () {
        $("#btnSaveMrr").text(" Save");
        $("#btnSaveMrr").addClass("fa fa-save");
        $("#hdnMrrId").val(AjaxManager.DefaultGuidId());
        $("#txtMRRNo").val("");
        $("#txtPINo").val("");
        $("#hdnConsignmentId").val("");
        $("#txtConsignmentNo").val("");
        $("#txtReceivedDate").data("kendoDatePicker").value(new Date());
       // $("#cmbLocation").data("kendoComboBox").value("");
        $("#txtGrnNo").val("");
        $("#txtGrnDate").data("kendoDatePicker").value("");
        $("#cmbSupplier").data("kendoComboBox").value("");
        $("#hdnPIId").val("");
        $("#txtChallanNo").val("");
        $("#txtChallanDate").data("kendoDatePicker").value("");
        $("#txtVehicleNo").val("");
        $("#txtGateEntryNo").val("");
        $("#txtGateEntryDate").data("kendoDatePicker").value("");
        $("#txtWayBillNo").val("");
        $("#txtInvoiceNo").val("");
        $("#txtInvoiceDate").data("kendoDatePicker").value("");
        $("#txtDemandNo").val("");
        $("#grdReceivedItemSummary").data("kendoGrid").dataSource.data([]);
    }
};