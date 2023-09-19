
var BookingCostingManager = {
    SaveBookingCosting: function () {
        var costingObj = "";
        if (BookingCostingHelper.ValidateForm()) {
            costingObj = BookingCostingHelper.CreateBookingCostingObject();
            var jsonParam = JSON.stringify(costingObj);
            var serviceUrl = _baseUrl + "/api/BOM/CreateOrUpdateBom";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            var msg = "";
            if (costingObj.Bomid === AjaxManager.DefaultGuidId()) {
                msg = jsonData.Message;
            } else {
                msg = jsonData.Message;
            }
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdBookingCostingSummary").data("kendoGrid").dataSource.read();
                            $("#divBookingCostingDetails").hide();
                            $("#divBookingCostingSummary").show();
                            BookingCostingHelper.ClearFullForms();
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
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
    },
    GetBuyerCostingFabTrimsData: function (styleDetailId) {
        var objFabTrims = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetBuyerCostingEmbellishmentByDetailId/" + $.trim(styleDetailId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFabTrims = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFabTrims;
    },
    GetBuyerCostingCMData: function (styleDetailId) {
        debugger;
        var objCm = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetBuyerCostingCm/" + $.trim(styleDetailId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCm = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCm;
    },
    GetBuyerCostingWashData: function (styleDetailId) {
        var objWash = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetStyleWashesByStyleDetailId/" + $.trim(styleDetailId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objWash = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objWash;
    },
    GetBOMMasterData: function (styleDetailId) {
        var objWash = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BOM/GetAllBOMByStyleDetailId/" + $.trim(styleDetailId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objWash = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objWash;
    },
}
var BookingCostingHelper = {
    InitBookingCosting() {
        $("#pnlBookingCosting").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyle");
        MerchantHelper.LoadStatusCombo("cmbStatus", 3);
        MerchantHelper.GenerateCurrencyCombo("cmbCurrency");
        BookingCostingHelper.GenerateNumericTextBox();

        $("#btnAddNew").click(function () {
            BookingCostingHelper.ClearFullForms();
            $("#divBookingCostingDetails").show();
            $("#divBookingCostingSummary").hide();            
        });
        $("#btnClose").click(function () {
            $("#divBookingCostingDetails").hide();
            $("#divBookingCostingSummary").show();
            BookingCostingHelper.ClearFullForms();
        });

        //Style
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                BookingCostingHelper.LoadStyleCombo();
            }
        });
        $("#btnSearchStyle").click(function () {
            BookingCostingHelper.LoadStyleCombo();
        });

        $("#btnSaveBookingCost").click(function () {
            BookingCostingManager.SaveBookingCosting();
        });

        $("#cboStyle").change(function () {
            BookingCostingHelper.StyleChangeEventFillForm();
        });
    },

    LoadStyleCombo: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = MerchantManager.GetAllStyle(searchKey);
            data.unshift(UtilityUnShift.GetUnshiftForStyleSearch());
            var cboStyle = $("#cboStyle").data("kendoMultiColumnComboBox");
            cboStyle.value("");
            cboStyle.setDataSource(data);
            cboStyle.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search style!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },

    LoadItemCombo: function () {
        var searchKey = $("#txtSearchItmKey").val();
        searchKey = searchKey === "" ? " " : searchKey;
        var data = MerchantManager.GetAllItem(searchKey);
        var obj = new Object();
        obj.ItemId = AjaxManager.DefaultGuidId();
        obj.ItemName = "---Select Item---";
        obj.ItemGroupName = "";
        obj.ItemCategoryName = "";
        data.unshift(obj);
        var cboItem = $("#cmbItem").data("kendoMultiColumnComboBox");
        cboItem.value("");
        cboItem.setDataSource(data);
        cboItem.select(0);
    },
    GenerateNumericTextBox: function () {
        //$("#txtPrintingRate").kendoNumericTextBox({
        //    format: "n4",
        //    min: 0,
        //    decimals: 4,
        //    change: function () {
        //        BookingCostingHelper.CalculateTotalFOB();
        //    }
        //});
    },
    CreateBookingCostingObject: function () {
        var obj = new Object();
        obj.Bomid = $("#hdnBomId").val();
        obj.Bomno = $("#txtBomNo").val();
        obj.StatusId = $("#cmbStatus").data("kendoComboBox").value();
        obj.CurrencyId = $("#cmbCurrency").data("kendoComboBox").value();
        obj.StyleDetailId = $("#cboStyle").data("kendoMultiColumnComboBox").value();
        obj.UserId = CurrentUser.USERID;
        obj.CreatedPcIp = "";
        obj.BomfabTrims = BookingCostingHelper.CreateBookingCostingFabTrimsObject();
        return obj;
    },
    CreateBookingCostingFabTrimsObject: function () {
        var fabTrimsList = [];
        var itemGrid = $("#grdItemSummary").data("kendoGrid");
        var gridData = itemGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var fabTrimsData = gridData[i];
            var detailRows = $("#grdItemSummary").data("kendoGrid").element.find(".k-detail-row");
            for (var j = 0; j < detailRows.length; j++) {
                var detailGrid = $(detailRows[j]).find(".k-grid").data("kendoGrid");
                var sizeBrkDwn = detailGrid.dataSource.view();
                if (sizeBrkDwn.length > 0 && sizeBrkDwn[0].BuyerCostingFabTrimsId === fabTrimsData.BuyerCostingFabTrimsId) {//check child data length
                    var consumption = 0, fabRate = 0;
                    for (var k = 0; k < sizeBrkDwn.length; k++) {
                        consumption += sizeBrkDwn[k].Consumption;
                        fabRate += sizeBrkDwn[k].Rate;
                    }
                    consumption = parseFloat((consumption / sizeBrkDwn.length).toFixed(4));
                    fabRate = parseFloat((fabRate / sizeBrkDwn.length).toFixed(4));

                    var obj = new Object();
                    obj.BomFabTrimsId = fabTrimsData.BomFabTrimsId;
                    obj.Bomid = $("#hdnBomId").val();
                    obj.ItemId = fabTrimsData.ItemId;
                    obj.FabricCompositionId = fabTrimsData.FabricCompositionId;
                    obj.ItemDesc = fabTrimsData.ItemDesc;
                    obj.Uomid = fabTrimsData.UOMId;
                    obj.Consumption = consumption;
                    obj.FabricRate = fabRate;
                    obj.MaterialSourceId = fabTrimsData.MaterialSource.MaterialSourceId;
                    obj.BomitemStatusId = fabTrimsData.BOMItemStatus.StatusId;
                    obj.BomnominatedSuppliers = BookingCostingHelper.CreateBomSupplierObject(fabTrimsData);
                    obj.BomitemSizeColorBreakDowns = BookingCostingHelper.CreateBomitemSizeColorBreakDownsObj2(sizeBrkDwn, fabTrimsData.BomFabTrimsId);
                    fabTrimsList.push(obj);
                }
            }
        }
        return fabTrimsList;
    },
    CreateBomSupplierObject:function(bomSuppliers) {
        var bomSupList = [];
        for (var i = 0; i < bomSuppliers.Supplier.length; i++) {
            var supp = bomSuppliers.Supplier[i];
            var obj = new Object();
            obj.NominatedSupplierId = supp.NominatedSupplierId == null ? AjaxManager.DefaultGuidId() : supp.NominatedSupplierId;
            obj.BomFabTrimsId = bomSuppliers.BomFabTrimsId;
            obj.SupplierId = supp.SupplierId;
            bomSupList.push(obj);
        }
        return bomSupList;
    },

    CreateBomitemSizeColorBreakDownsObj2: function (sizeBrkDwn, bomFabTrimsId) {
        var sizeBrkDwnList = [];
        for (var j = 0; j < sizeBrkDwn.length; j++) {
            var szBrkDwnData = sizeBrkDwn[j];
            var obj = new Object();
            obj.BomItemScbid = szBrkDwnData.BomItemScbid;
            obj.BomFabTrimsId = bomFabTrimsId;
            obj.ItemColorId = szBrkDwnData.ItemColor === null ? AjaxManager.DefaultGuidId() : szBrkDwnData.ItemColor.ColorId === null ? AjaxManager.DefaultGuidId(): szBrkDwnData.ItemColor.ColorId ;
            obj.ItemSizeId = szBrkDwnData.ItemSize === null ? AjaxManager.DefaultGuidId() : szBrkDwnData.ItemSize.SizeId === null ? AjaxManager.DefaultGuidId() : szBrkDwnData.ItemSize.SizeId;
            obj.GmtColorId = szBrkDwnData.GmtColorId;
            obj.GmtSizeId = szBrkDwnData.GmtSizeId;
            obj.GmtQty = szBrkDwnData.GmtQty;
            obj.ExcessPercent = szBrkDwnData.ExcessPercent;
            obj.ItemQty = szBrkDwnData.ItemQty;
            obj.CostingRate = szBrkDwnData.Rate;
            obj.Value = szBrkDwnData.Value;
            sizeBrkDwnList.push(obj);
        }
        return sizeBrkDwnList;
    },
    ClearFullForms: function () {
        $("#hdnBomId").val(AjaxManager.DefaultGuidId());
        $("#txtBomNo").val("");
        $("#grdItemSummary").data("kendoGrid").dataSource.data([]);
        $("#cmbStatus").data("kendoComboBox").value("");
        $("#cboStyle").data("kendoMultiColumnComboBox").value("");
        $("#btnSaveBookingCost").text(" Save");
        $("#btnSaveBookingCost").addClass("fa fa-save");
        //$("#cmbCurrency").data("kendoComboBox").value("");
        //var detailRows = $("#grdItemSummary").data("kendoGrid").element.find(".k-detail-row");
        //for (var i = 0; i < detailRows.length; i++) {
        //    $(detailRows[i]).find(".k-grid").data("kendoGrid").dataSource.data([]);
        //}
    },
    StyleChangeEventFillForm: function () {
        var styleDetailId = $("#cboStyle").data("kendoMultiColumnComboBox").value();
        var bomMaster = BookingCostingManager.GetBOMMasterData(styleDetailId);

        var bomData = bomMaster.GetAllBOMByStyleDetailIdVm;
        BookingCostingHelper.FillForm(bomData, styleDetailId);
    },
    FillBookingCostingDetailsForm: function (obj) {
        //debugger;
        BookingCostingHelper.FillForm(obj, obj.StyleDetailId);
    },
    FillForm: function (bomData, styleDetailId) {
        //debugger;
        if (bomData != null) {
            $("#hdnBomId").val(bomData.BOMId);
            $("#txtBomNo").val(bomData.BOMNo);
            $("#cmbStatus").data("kendoComboBox").value(bomData.StatusId);
            $("#cmbCurrency").data("kendoComboBox").value(bomData.CurrencyId);
            var styleData = MerchantManager.GetAllStyle(bomData.StyleDetailId);
            var cboStyle = $("#cboStyle").data("kendoMultiColumnComboBox");
            cboStyle.value("");
            cboStyle.setDataSource(styleData);
            cboStyle.value(bomData.StyleDetailId);
        }
        //BookingCostingHelper.ClearFullForms();
        ItemSummaryHelper.LoadItemGrid(styleDetailId);
    },
    ValidateForm: function () {
        var res = true;
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var statusCombo = $("#cmbStatus").data("kendoComboBox");
        var currencyCombo = $("#cmbCurrency").data("kendoComboBox");

        if (statusCombo.value() === "" || statusCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbStatus", "error", "right", 1500, "Required");
            res = false;
        }
        if (styleDCombo.value() === "" || styleDCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboStyle", "error", "right", 1500, "Required");
            res = false;
        }
        if (currencyCombo.value() === "" || currencyCombo.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbCurrency", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    },
}