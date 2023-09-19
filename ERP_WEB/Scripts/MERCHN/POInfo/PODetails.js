﻿var PODetailsManager = {
    GetAllPOType: function () {
        var objPoType = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/CmnStatuses/GetStatusForPO";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objPoType = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objPoType;
    },
    SavePOInfo: function () {
        if (PODetailsHelper.ValidateForm()) {
            debugger;
            var command = PODetailsHelper.CreatePOInfoObject();
            debugger;
            var jsonParam = JSON.stringify( command );
            var serviceUrl = _baseUrl + "/api/PurchaseOrders/CreateOrUpdatePurchaseOrder";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
              
            var msg = jsonData.Message;
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#hdnPOId").val(jsonData.createPurchaseOrderDto.Poid);
                            $("#txtPONo").val(jsonData.createPurchaseOrderDto.Pono);
                            $("#grdPOSummary").data("kendoGrid").dataSource.read();
                            POHistorySummaryHelper.LoadPOHistoryGrid(gbStyleList);
                            PODetailsHelper.ClearPODetailsForm();
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
    },
    GetAllShipmentMode: function () {
        var objShipmentMode = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/CmnShipmentMode/all";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objShipmentMode = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objShipmentMode;
    },
    GetColorSizeBreakDownData: function (poId) {
        var objColSzBrkDwn = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetPOColorSizeBreakDown/" + poId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objColSzBrkDwn = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objColSzBrkDwn;
    },
    GetPurchaseOrderDetails: function (poId) {
        var objPoD = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetPurchaseOrderDetails/" + poId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objPoD = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objPoD;
    },
};

var PODetailsHelper = {
    InitPODetails: function () {
        $("#pnlPOInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });
        //new
        $("#pnlColorSizeBreak").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });

        PODetailsHelper.GenerateDatePicker();
        PODetailsHelper.GenerateNumericTextBox();
       // MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyle");
        MerchantHelper.LoadStatusCombo("cmbPOType", 2);
        PODetailsHelper.GenerateShipmentModeCombo("cmbShipmentMode");
        PODetailsHelper.GenerateParentPOCombo("cmbParentPO");
        MerchantHelper.GenerateColorCombo("cmbColor");
        MerchantHelper.GenerateSizeCombo("cmbSize");
        MerchantHelper.GenerateLeadTimeCombo("cmbLeadTime");
        MerchantHelper.LoadCountryCombo("cmbCountry");
       // StyleSummaryHelper.InitStyleSummary();
        POHistorySummaryHelper.InitPOHistorySummary();
        MerchantHelper.LoadSaleContractCombo("cmbContactOrLC");

        //Style
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                PODetailsHelper.LoadStyleCombo();
            }
        });
        $("#btnSearchStyle").click(function () {
            PODetailsHelper.LoadStyleCombo();
        });

        $("#btnAddNewPO").click(function () {
            // PODetailsHelper.ClearPODetailsForm();
            $("#divPODetails").show();
            $("#divPOSummary").hide();
        });
        $("#btnClose").click(function () {
            location.reload();
            //$("#divPODetails").hide();
            //$("#divPOSummary").show();
        });

        $("#cmbPOType").change(function () {
            PODetailsHelper.ChangeEventForPOTypeCombo();
        });

        $("#btnSavePOInfo").click(function () {
            // PODetailsManager.SavePOInfo();
            ColorSizeTemplateSummaryManager.NewSavePOInfo();
        });
    },

    LoadStyleCombo: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = MerchantManager.GetAllStyle(searchKey);
            var cboStyle = $("#cboStyle").data("kendoMultiColumnComboBox");
            cboStyle.value("");

            var obj = new Object();
            obj.StyleNo = "---Select---";
            obj.StyleDetailId = AjaxManager.DefaultGuidId();
            obj.BuyerName = "";
            obj.BrandName = "";
            obj.DepartmentName = "";
            obj.SeasonName = "";
            obj.Year = "";
            obj.StatusName = "";

            data.unshift(obj);


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

    GeneratePOTypeCombo: function (identity) {
        var objPoType = PODetailsManager.GetAllPOType();
        var obj = new Object();
        obj.StatusName = "---Select---";
        obj.StatusId = "0";
        objPoType.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "---Select---",
            dataTextField: "StatusName",
            dataValueField: "StatusId",
            dataSource: objPoType,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {
                AjaxManager.isValidItem(identity, true);
            }
        });
    },
    GenerateShipmentModeCombo: function (identity) {
        var objShipmentMode = PODetailsManager.GetAllShipmentMode();
        var obj = new Object();
        obj.ModeName = "---Select---";
        obj.CmnShipmentModeId = "";
        objShipmentMode.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "Select",
            dataTextField: "ModeName",
            dataValueField: "CmnShipmentModeId",
            dataSource: objShipmentMode,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {
                AjaxManager.isValidItem(identity, true);
            }
        });
    },
    GenerateParentPOCombo: function (identity) {
        var objPoType = [];
        var obj = new Object();
        obj.Pono = "---Select---";
        obj.Poid = AjaxManager.DefaultGuidId();
        objPoType.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "Select",
            dataTextField: "Pono",
            dataValueField: "Poid",
            dataSource: objPoType,
            index: 0,
            suggest: true,
            filter: "contains",
            change: function () {
                AjaxManager.isValidItem(identity, true);
            }
        });
    },

    GenerateNumericTextBox: function () {
        $("#txtOrderQty").kendoNumericTextBox({ format: "#", min: 0 });
        $("#txtQuantity").kendoNumericTextBox({ format: "#", min: 0 });
        $("#txtOrderValue").kendoNumericTextBox({ format: "#.####", min: 0 });
        $("#txtRate").kendoNumericTextBox({ format: "#.####", min: 0 });
    },
    GenerateDatePicker: function () {
        $("#txtReceiveDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtShipmentDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtCuttoffDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    ChangeEventForPOTypeCombo: function () {
        $("#divParentPO").hide();
        $("#cmbParentPO").data("kendoComboBox").value("");
        $("#cmbParentPO").data("kendoComboBox").text("");
        var statusId = $("#cmbPOType").data("kendoComboBox").value();
        if (statusId === "3fa85f64-5717-4562-b3fc-2c963f66afa6" || statusId === "53f78b22-ba53-4add-bed4-9768ebbcfb6b") {
            $("#txtPONo").removeAttr("disabled");
        }
        else {
            $("#txtPONo").val("");
            $("#txtPONo").attr("disabled", "disabled");
        }

        if (statusId.toUpperCase() === "53F78B22-BA53-4ADD-BED4-9768EBBCFB6B") {
            $("#divParentPO").show();
        } else {
            $("#divParentPO").hide();
        }
    },

    CreatePOInfoObject: function () {
        var obj = new Object();
        obj.Poid = $("#hdnPOId").val();
        obj.Pono = $("#txtPONo").val().trim();
        var parentPoId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbParentPO").data("kendoComboBox").value());
        obj.ParentPoid = parentPoId;
        obj.StatusId = $("#cmbPOType").data("kendoComboBox").value();
        obj.ReceivedDate = $("#txtReceiveDate").data("kendoDatePicker").value();
        obj.CmnShipmentModeId = $("#cmbShipmentMode").data("kendoComboBox").value();
        obj.ShipmentDate = $("#txtShipmentDate").data("kendoDatePicker").value();
        obj.CutOffDate = $("#txtCuttoffDate").data("kendoDatePicker").value();
        obj.OrderQty = IkrHelper.EmptyThenZero($("#txtOrderQty").data("kendoNumericTextBox").value());
        obj.LeadTimeId = $("#cmbLeadTime").data("kendoComboBox").value();
        obj.CountryId = $("#cmbCountry").data("kendoComboBox").value();
        obj.Scid = $("#cmbContactOrLC").data("kendoComboBox").value() == "" ? "00000000-0000-0000-0000-000000000000" : $("#cmbContactOrLC").data("kendoComboBox").value();
        obj.UserId = CurrentUser.USERID;
        obj.PurchaseOrderDetails = PODetailsHelper.CreatePODetailsObject();
        obj.PosizeColorBreakdowns = PODetailsHelper.CreateColorSizeBreakdownObject();
        return obj;
    },
    CreatePODetailsObject: function () {
        var poDetailsList = [];
        var colorSizeGrid = $("#grdColorSizeSummary").data("kendoGrid");
        var gridData = colorSizeGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.Poid = detailsData.Poid;
            obj.StyleDetailId = detailsData.StyleDetailId;
            poDetailsList.push(obj);
        }
        return poDetailsList;
    },
    CreateColorSizeBreakdownObject: function () {
        var colorSizeList = [];
        var colorSizeGrid = $("#grdColorSizeSummary").data("kendoGrid");
        var gridData = colorSizeGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.Poid = detailsData.Poid;
            obj.un = detailsData.StyleDetailId;
            obj.UnitPrice = detailsData.UnitPrice;
            obj.ColorId = detailsData.ColorId;
            obj.SizeId = detailsData.SizeId;
            obj.Quantity = detailsData.Quantity;
            obj.StyleDetailId = detailsData.StyleDetailId;
            colorSizeList.push(obj);
        }
        return colorSizeList;
    },
    LoadLeadTimeCombo: function () {
        var styleInfo = $("#cboStyle").data("kendoMultiColumnComboBox").dataItem();
        var buyerId = styleInfo.BuyerId;
        var brandId = styleInfo.BrandId;
        var deptId = styleInfo.DepartmmentId;
        var data = MerchantManager.GetAllLeadTime(buyerId, brandId, deptId);
        var leadTimeCombo = $("#cmbLeadTime").data("kendoComboBox");
        var leadTimeComboData = leadTimeCombo.dataSource.data();
        data.map(y => {
            var leadTime = leadTimeComboData.find(x => x.LeadTimeId === y.LeadTimeId);
            if (leadTime == null || typeof leadTime === "undefined") leadTimeComboData.push(y);
        });
        leadTimeCombo.setDataSource(leadTimeComboData);
    },
    FillPODetailsForm: function (obj) {
        $("#hdnPOId").val(obj.Poid);
        $("#txtPONo").val(obj.Pono);
        $("#cmbPOType").data("kendoComboBox").value(obj.StatusId);
        PODetailsHelper.ChangeEventForPOTypeCombo();

        if (obj.ParentPoid != null || obj.ParentPoid != undefined) {
            $("#cmbParentPO").data("kendoComboBox").value(obj.ParentPoid);
        }
        $("#txtReceiveDate").data("kendoDatePicker").value(obj.ReceivedDate);
        $("#cmbShipmentMode").data("kendoComboBox").value(obj.CmnShipmentModeId);
        $("#txtShipmentDate").data("kendoDatePicker").value(obj.ShipmentDate);
        $("#txtCuttoffDate").data("kendoDatePicker").value(obj.CutOffDate);
        $("#txtOrderQty").data("kendoNumericTextBox").value(obj.OrderQty);
        gbTotalQuantity = obj.OrderQty;
        $("#cmbCountry").data("kendoComboBox").value(obj.CountryId);
        $("#cmbContactOrLC").data("kendoComboBox").value(obj.Scid);

        var colSzData = PODetailsManager.GetColorSizeBreakDownData(obj.Poid);
        var colSzGrid = $("#grdColorSizeSummary").data("kendoGrid");
        colSzGrid.setDataSource(colSzData);
        gbColorSizeList = colSzData;

        PODetailsHelper.FillStyleGrid(obj);
    },

    FillStyleGrid: function (obj) {
        var styleGrid = $("#grdStyleSummary").data("kendoGrid");
        var poDetailsData = PODetailsManager.GetPurchaseOrderDetails(obj.Poid);
        gbStyleList = poDetailsData.Result;
        var gridDataSource = new kendo.data.DataSource({
            data: gbStyleList,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            }
        });
        //styleGrid.setDataSource(gridDataSource);
        POHistorySummaryHelper.LoadPOHistoryGrid(gbStyleList);
        PODetailsHelper.FillLeadTimeCombo(gbStyleList);

        $("#cmbLeadTime").data("kendoComboBox").value(obj.LeadTimeId);
    },
    FillLeadTimeCombo: function (poDetailsData) {
        for (var i = 0; i < poDetailsData.length; i++) {
            var obj = poDetailsData[i];
            var data = MerchantManager.GetAllLeadTime(obj.BuyerId, obj.BrandId, obj.DepartmentId);
            var leadTimeCombo = $("#cmbLeadTime").data("kendoComboBox");
            var leadTimeComboData = leadTimeCombo.dataSource.data();
            data.map(y => {
                var leadTime = leadTimeComboData.find(x => x.LeadTimeId === y.LeadTimeId);
                if (leadTime == null || typeof leadTime === "undefined") leadTimeComboData.push(y);
            });
            leadTimeCombo.setDataSource(leadTimeComboData);
        }
    },

    ClearPODetailsForm: function () {
        gbColorSizeList = [];
        gbTotalQuantity = 0;
        gbStyleList = [];
        $("#hdnPOId").val(AjaxManager.DefaultGuidId());
        $("#txtPONo").val("");
        $("#cmbPOType").data("kendoComboBox").value("");
        $("#cmbParentPO").data("kendoComboBox").value("");
        $("#txtReceiveDate").data("kendoDatePicker").value("");
        $("#cmbShipmentMode").data("kendoComboBox").value("");
        $("#txtShipmentDate").data("kendoDatePicker").value("");
        $("#txtCuttoffDate").data("kendoDatePicker").value("");
        $("#txtOrderQty").data("kendoNumericTextBox").value("");
        $("#cmbCountry").data("kendoComboBox").value("");
        $("#cmbLeadTime").data("kendoComboBox").value("");
        //$("#grdStyleSummary").data("kendoGrid").dataSource.data([]);
      //  $("#grdColorSizeSummary").data("kendoGrid").dataSource.data([]);
        $("#grdPOHistorySummary").data("kendoGrid").dataSource.data([]);

    },
    ValidateForm: function () {
        var res = true;
        var poType = $("#cmbPOType").data("kendoComboBox");
        if (poType.value() === "" || poType.value() === undefined) {
            AjaxManager.NotifyMsg("cmbPOType", "error", "right", 1500, "Required");
            res = false;
        }
        var country = $("#cmbCountry").data("kendoComboBox");
        if (country.value() === "" || country.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCountry", "error", "right", 1500, "Required");
            res = false;
        }
        var leadTime = $("#cmbLeadTime").data("kendoComboBox");
        if (leadTime.value() === "" || leadTime.value() === undefined || leadTime.value() === "00000000-0000-0000-0000-000000000000") {
            AjaxManager.NotifyMsg("cmbLeadTime", "error", "right", 1500, "Required");
            res = false;
        }
        debugger;
        var shipMode = $("#cmbShipmentMode").data("kendoComboBox");
        if (shipMode.value() === "" || shipMode.value() === undefined) {
            AjaxManager.NotifyMsg("cmbShipmentMode", "error", "right", 1500, "Required");
            res = false;
        }

        var rcvDate = $("#txtReceiveDate").data("kendoDatePicker");
        if (rcvDate.value() === "" || rcvDate.value() === undefined || rcvDate.value() === null) {
            AjaxManager.NotifyMsg("txtReceiveDate", "error", "top", 1500, "Required");
            res = false;
        }

        var shipDate = $("#txtShipmentDate").data("kendoDatePicker");
        if (shipDate.value() === "" || shipDate.value() === undefined || shipDate.value() === null) {
            AjaxManager.NotifyMsg("txtShipmentDate", "error", "top", 1500, "Required");
            res = false;
        }
        var cuttOffDate = $("#txtCuttoffDate").data("kendoDatePicker");
        if (cuttOffDate.value() === "" || cuttOffDate.value() === undefined || cuttOffDate.value() === null) {
            AjaxManager.NotifyMsg("txtCuttoffDate", "error", "top", 1500, "Required");
            res = false;
        }

        var orderQty = $("#txtOrderQty").data("kendoNumericTextBox");
        if (orderQty.value() === "" || orderQty.value() === undefined || orderQty.value() === null) {
            AjaxManager.NotifyMsg("txtOrderQty", "error", "right", 1500, "Required");
            res = false;
        }

        var statusId = $("#cmbPOType").data("kendoComboBox").value();
        if (statusId === "3fa85f64-5717-4562-b3fc-2c963f66afa6" || statusId === "53f78b22-ba53-4add-bed4-9768ebbcfb6b") {
              
            var poNo = $("#txtPONo").val();
            if (poNo === "" || poNo === undefined || poNo === null) {
                AjaxManager.NotifyMsg("txtPONo", "error", "top", 1500, "Required");
                res = false;
            }
        }

        return res;
    }
};