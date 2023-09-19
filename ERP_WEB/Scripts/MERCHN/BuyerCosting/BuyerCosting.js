//var gbWashList = [];
var BuyerCostingManager = {
    SaveBuyerCosting: function () {        
        var msg = "";
        var validator = $("#divBuyerCostingDetails").kendoValidator().data("kendoValidator");
        var costingObj = BuyerCostingHelper.CreateBuyerCostingObject();
        var jsonParam = JSON.stringify(costingObj);
        var serviceUrl = _baseUrl + "/api/BuyerCosting";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        //if (validator.validate()) {
        //    if (BuyerCostingHelper.ValidateBuyerCostingForm()) {
        //        var costingObj = BuyerCostingHelper.CreateBuyerCostingObject();
        //        var jsonParam = JSON.stringify(costingObj);
        //        var serviceUrl = _baseUrl + "/api/BuyerCosting";
        //        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        //    }
        //}        
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                $("#hdnBuyerCostingId").val(jsonData.Result.BuyerCostingId);
                BuyerCostingHelper.LoadFormAfterSave(jsonData.Result);
                $("#grdBuyerCostingSummary").data("kendoGrid").dataSource.read();
                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
                $("#divBuyerCostingDetails").hide();
                $("#divBuyerCostingSummary").show();
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'BuyerCosting Failed To Add!', jsonData,
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
    GetBuyerCostingEmbellishmentData: function (styleDetailId) {
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
    GetBuyerCostingByStyleDetailId: function (styleDetailId) {
        var objBCost = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetBuyerCostingByStyleDetailId/" + $.trim(styleDetailId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objBCost = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objBCost;
    },
}
var BuyerCostingHelper = {
    InitBuyerCosting() {
        $(".divChkBox").attr("CostingEmbId", AjaxManager.DefaultGuidId());
        $("#pnlBuyerCosting").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });

        BuyerCostingHelper.InitFields();
        MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyle");
        MerchantHelper.GenerateItemMultiColumnComboBox("cmbItem");
        BuyerCostingHelper.LoadItemCombo();
        MerchantHelper.LoadUoMCombo("cmbUoM");
        //BuyerCostingHelper.GenerateNumericTextBox();
        MerchantHelper.LoadFabricCompositionCombo("cmbFabComposition");
        MerchantHelper.GenerateColorCombo("cmbColor");
        MerchantHelper.LoadStatusCombo("cmbStatus", 3);
        MerchantHelper.GenerateCurrencyCombo("cmbCurrency");


        MerchantHelper.GenerateExccessCombo("cmbExcessPercent");

        FabricEmbellishmentSummaryHelper.InitFabricEmbellishment();

        $("#btnSaveBuyerCost").show();
        $("#divBuyerCostingDetails").hide();
        $("#divBuyerCostingSummary").show();
        $("#grdItemSummary1").show();
        $("#btnAddNew").click(function () {
            $("#lblMessage").html("");
            $("#btnSaveBuyerCost").show();
            $("#divBuyerCostingDetails").show();
            $("#divBuyerCostingSummary").hide();
            $("#grdItemSummary").hide();
            $("#grdItemSummary1").show();
            ItemSummaryHelper.GenerateItemGrid1();
            $("#btnSaveBuyerCost").text(" Save");
            $("#btnSaveBuyerCost").addClass("fa fa-save");
            BuyerCostingHelper.ClearFullForms();
        });
        $("#btnClose").click(function () {
            $("#divBuyerCostingDetails").hide();
            $("#divBuyerCostingSummary").show();
        });

        //Style
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                BuyerCostingHelper.LoadStyleCombo();
            }
        });
        $("#btnSearchStyle").click(function () {
            BuyerCostingHelper.LoadStyleCombo();
        });

        //Item
        $("#txtSearchItmKey").keypress(function (event) {
            if (event.keyCode === 13) {
                BuyerCostingHelper.LoadItemCombo();
            }
        });
        $("#btnSearchItem").click(function () {
            BuyerCostingHelper.LoadItemCombo();
        });

        $("#btnSaveBuyerCost").click(function () {
            BuyerCostingManager.SaveBuyerCosting();
        });

        $("#cmbItem").change(function () {            
            BuyerCostingHelper.ChangeEventItemCombo();
        });

        $("#cmbExcessPercent").change(function () {
            BuyerCostingHelper.CalculateTotalValue();
        });

        $("#cboStyle").change(function () {
            var styleDetailId = $("#cboStyle").data("kendoMultiColumnComboBox").value();
            BuyerCostingHelper.FillBuyerCostingByStyleChange(styleDetailId);
        });
        BuyerCostingHelper.GenerateNumericTextBox();


    },
    InitFields() {
        $('#chkWashing').change(function () {
            if (this.checked) {
                $("#txtWashingRate").data("kendoNumericTextBox").enable(true);
                $("#WashTypes").addClass("in");
            }
            else {
                $("#txtWashingRate").data("kendoNumericTextBox").value("");
                $("#txtWashingRate").data("kendoNumericTextBox").enable(false);
                // $("#WashTypes").removeClass("in");
                // $('.chkWashType').prop('checked', false);
                BuyerCostingHelper.CalculateTotalFOB();
            }
        });

        // $("#WashTypes div").remove();
        var washTypes = MerchantManager.GetWashTypes();
        var id = AjaxManager.DefaultGuidId();
        $.map(washTypes, function (washType) {
            $("#WashTypes").append('<div class="col-md-3">'
                                        + '<input style="margin-right:5px;" class ="chkWashType" sw-id=' + id + ' w-id= ' + washType.WashTypeId + ' type="checkbox" />'
                                        + '<label class ="lblChkLabel" > ' + washType.WashTypeName + ' </label> '
                                    + '</div>');
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
        $("#txtConsumption").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4,
            change: function () {
                BuyerCostingHelper.CalculateTotalValue();
            }
        });

        $("#txtRate").kendoNumericTextBox({
            format: "n4",
            decimals: 4,
            min: 0,
            change: function () {
                BuyerCostingHelper.CalculateTotalValue();
            }
        });
        $("#txtCPM").kendoNumericTextBox({
            format: "n4",
            decimals: 4,
            min: 0
        });
        $("#txtSMV").kendoNumericTextBox({
            format: "n4",
            decimals: 4,
            min: 0
        });
        $("#txtCM").kendoNumericTextBox({
            format: "n4",
            min: 0,
            decimals: 4,
            change: function () {
                BuyerCostingHelper.CalculateTotalFOB();
            }
        });

        $("#txtWashingRate").kendoNumericTextBox({
            format: "n4",
            min: 0,
            decimals: 4,
            change: function () {
                BuyerCostingHelper.CalculateTotalFOB();
            }
        });

        $("#txtEmbroideryRate").kendoNumericTextBox({
            format: "n4",
            min: 0,
            decimals: 4,
            change: function () {
                BuyerCostingHelper.CalculateTotalFOB();
            }
        });

        $("#txtPrintingRate").kendoNumericTextBox({
            format: "n4",
            min: 0,
            decimals: 4,
            change: function () {
                BuyerCostingHelper.CalculateTotalFOB();
            }
        });
        $("#txtTotalRequiredQty").kendoNumericTextBox({
            format: "n4",
            min: 0,
            decimals: 4,
            //  spinners: false
        });

        UtilityHelper.KendoNumericTextBox("txtFOB", true, false);
        UtilityHelper.KendoNumericTextBox("txtFOBperDozon", true, false);
        UtilityHelper.KendoNumericTextBox("txtTotalValue", true, false);
    },
    CalculateTotalValue: function () {
        var consumption = IkrHelper.EmptyThenZero($("#txtConsumption").data("kendoNumericTextBox").value());
        var exessPercent = IkrHelper.EmptyThenZero($("#cmbExcessPercent").data("kendoComboBox").value());
        var totalReqQty = consumption + (consumption * exessPercent) / 100;
        var rate = IkrHelper.EmptyThenZero($("#txtRate").data("kendoNumericTextBox").value());
        var totalValue = totalReqQty * rate;
        $("#txtTotalRequiredQty").data("kendoNumericTextBox").value(totalReqQty);
        $("#txtTotalValue").data("kendoNumericTextBox").value(totalValue);
    },
    CreateBuyerCostingObject: function () {
        var obj = new Object();
        obj.BuyerCostingId = $("#hdnBuyerCostingId").val();
        obj.StyleDetailId = $("#cboStyle").data("kendoMultiColumnComboBox").value();
        obj.StatusId = $("#cmbStatus").data("kendoComboBox").value();
        obj.CurrencyId = $("#cmbCurrency").data("kendoComboBox").value();
        obj.UserId = CurrentUser.USERID;
        obj.BuyerCostingCms = BuyerCostingHelper.CreateBuyerCostingCmObject();
        obj.BuyerCostingEmbellishments = BuyerCostingHelper.CreateBuyerCostingEmbellishmentObject();
        obj.BuyerCostingFabTrims = BuyerCostingHelper.CreateBuyerCostingFabTrimsObject();
        obj.BuyerCostingStyleWashes = BuyerCostingHelper.CreateStyleWashesObject();
        return obj;
    },
    CreateBuyerCostingCmObject: function () {
        var obj = new Object();
        obj.BuyerCostingCmid = $("#hdnCostingEmbId").val();
        obj.BuyerCostingId = $("#hdnBuyerCostingId").val();
        obj.Cm = IkrHelper.EmptyThenZero($("#txtCM").data("kendoNumericTextBox").value());
        obj.Cpm = IkrHelper.EmptyThenZero($("#txtCPM").data("kendoNumericTextBox").value());
        obj.Smv = IkrHelper.EmptyThenZero($("#txtSMV").data("kendoNumericTextBox").value());
        obj.Fob = IkrHelper.EmptyThenZero($("#txtFOB").data("kendoNumericTextBox").value());
        return obj;
    },
    CreateBuyerCostingEmbellishmentObject: function () {
        var list = [];
        var fabEmbGrid = $("#grdFabricEmbSummary").data("kendoGrid");
        var gridData = fabEmbGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var fabEmbData = gridData[i];
            var obj = new Object();
            obj.CostingEmbId = fabEmbData.CostingEmbId;
            obj.EmbellishmentId = fabEmbData.EmbellishmentId;
            obj.BuyerCostingId = fabEmbData.BuyerCostingId;
            obj.Rate = fabEmbData.Rate;
            list.push(obj);
        }
        return list;
    },
    CreateBuyerCostingFabTrimsObject: function () {        
        var fabTrimsList = [];
        var itemGrid = $("#grdItemSummary1").data("kendoGrid");
        var gridData = itemGrid.dataSource.view()//.dataSource.data();
        for (var i = 0; i < gbGriditemList.length; i++) {
            
            var fabTrimsData = gbGriditemList[i];
            //console.log(fabTrimsData);
           
            //var reqQty = 0;
            //if (fabTrimsData.ExcessPercent === "--Select--") {
            //    reqQty = parseFloat(fabTrimsData.Consumption) + (0 * parseFloat(fabTrimsData.Consumption)) / 100.00;
            //}
            //else {
            //    reqQty = parseFloat(fabTrimsData.Consumption) + (parseFloat(fabTrimsData.ExcessPercent) * parseFloat(fabTrimsData.Consumption)) / 100.00;
            //}
            //var totalPrice = reqQty * parseFloat(fabTrimsData.Rate);
            var obj = new Object();
            obj.BuyerCostingFabTrimsId = fabTrimsData.BuyerCostingFabTrimsId;
            obj.BuyerCostingId = fabTrimsData.BuyerCostingId;
            obj.ItemId = fabTrimsData.ItemId;
            obj.ColorId = fabTrimsData.CmnColors.ColorId;
            obj.FabricCompositionId = fabTrimsData.MerchFabricCompositions.FabricCompositionId;
            obj.ItemRef = fabTrimsData.ItemRef;
            obj.ItemDesc = fabTrimsData.ItemDesc;
            obj.Uomid = fabTrimsData.CmnUoms.UOMId;
            obj.Consumption = fabTrimsData.Consumption;
            obj.ExcessPercent = fabTrimsData.ExcessPercent != "--Select--" ? fabTrimsData.ExcessPercent:0;
            obj.RequiredQty = fabTrimsData.RequiredQty;
            obj.Rate = fabTrimsData.Rate;
            obj.TotalValue = fabTrimsData.TotalValue;
            fabTrimsList.push(obj);
        }
        return fabTrimsList;
    },
    CreateStyleWashesObject: function () {
        var list = [];
        var fabEmbGrid = $("#grdFabricEmbSummary").data("kendoGrid");
        var gridData = fabEmbGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var fabEmbData = gridData[i];
            if (fabEmbData.EmbellishmentId === "c584c17b-b5ae-46c8-9cd3-c2b1dec27bca" && fabEmbData.Rate > 0) {
                $("#WashTypes input[type='checkbox']:checked").each(function () {
                    list.push({
                        WashId: $(this).attr("w-id"),
                        StyleDetailId: $("#cboStyle").data("kendoMultiColumnComboBox").value(),
                        StyleWashId: $(this).attr("sw-id"),
                        BuyerCostingId: $("#hdnBuyerCostingId").val()
                    });
                });
            }
        }
        return list;
    },
    CalculateTotalFOB: function () {
        var empRate = parseFloat($("#spnTotalRate").html());
        var embRateTotal = IkrHelper.EmptyThenZero(empRate);
        var cm = IkrHelper.EmptyThenZero($("#txtCM").data("kendoNumericTextBox").value());

        var fob = embRateTotal + cm + gbTotalValue;
        $("#txtFOB").data("kendoNumericTextBox").value(fob);
        $("#txtFOBperDozon").data("kendoNumericTextBox").value(fob*12);
        $("#spnTotalValue").html(gbTotalValue.toFixed(4));
    },
    ChangeEventItemCombo: function () {        
        var item = $("#cmbItem").data("kendoMultiColumnComboBox").dataItem();
        if (kendo.toString(item.ItemGroupId).toUpperCase() == "138A3B7B-519E-4D58-8D5E-095B72CDA03A") {
            $("#cmbFabComposition").data("kendoComboBox").enable(true);
            $("#cmbColor").data("kendoComboBox").enable(true);
            // $("#txtItemRef").removeAttr("disabled");
        } else {
            $("#cmbFabComposition").data("kendoComboBox").value("");
            $("#cmbFabComposition").data("kendoComboBox").enable(false);
            $("#cmbColor").data("kendoComboBox").value("");
            $("#cmbColor").data("kendoComboBox").enable(false);
            // $("#txtItemRef").val("");
            // $("#txtItemRef").attr("disabled", "disabled");

        }
    },
    ClearFullForms: function () {
        gbItemList = [];
        gbTotalValue = 0;
        //gbSelectiveEmbArray = [];
        $("#txtSearchKey").val("");
        $("#cboStyle").data("kendoMultiColumnComboBox").value("");
        $("#hdnBuyerCostingId").val(AjaxManager.DefaultGuidId());
        $("#cmbStatus").data("kendoComboBox").value("");
       // $("#cmbCurrency").data("kendoComboBox").value("");

        $("#btnAddItem").text("Add");
        $("#btnAddItem").addClass("fas fa-arrow-down");
        $("#grdItemSummary").data("kendoGrid").dataSource.data([]);

        $("#cboStyle").data("kendoMultiColumnComboBox").value("");
        $("#txtSearchItmKey").val("");
        $("#cmbItem").data("kendoMultiColumnComboBox").value("");
        $("#cmbFabComposition").data("kendoComboBox").value("");
        $("#cmbFabComposition").data("kendoComboBox").value("");
        $("#txtItemRef").val("");
        $("#txtItemDesc").val("");
        $("#cmbUoM").data("kendoComboBox").value("");
        $("#cmbExcessPercent").data("kendoComboBox").value("");
        $("#txtConsumption").data("kendoNumericTextBox").value("");
        $("#txtRate").data("kendoNumericTextBox").value("");
        $("#txtTotalValue").data("kendoNumericTextBox").value("");
        $("#txtTotalRequiredQty").data("kendoNumericTextBox").value("");

        // BuyerCostingCm
        $("#hdnCostingEmbId").val(AjaxManager.DefaultGuidId());
        $("#txtCM").data("kendoNumericTextBox").value("");
        $("#txtCPM").data("kendoNumericTextBox").value("");
        $("#txtSMV").data("kendoNumericTextBox").value("");
        $("#txtFOB").data("kendoNumericTextBox").value("");
        $("#txtFOBperDozon").data("kendoNumericTextBox").value("");

        $("#grdFabricEmbSummary").data("kendoGrid").dataSource.data([]);
        $("#WashTypes").find("input[type='checkbox']").prop('checked', false);

    },
    FillBuyerCostingByStyleChange: function (styleDetailId) {
        var bCostObj = BuyerCostingManager.GetBuyerCostingByStyleDetailId(styleDetailId);
        if (bCostObj.Result != null) {
            var obj = bCostObj.Result[0];
            $("#hdnBuyerCostingId").val(obj.BuyerCostingId);
            $("#cmbStatus").data("kendoComboBox").value(obj.StatusId);
            $("#cmbCurrency").data("kendoComboBox").value(obj.CurrencyId);
            $("#cboStyle").data("kendoMultiColumnComboBox").value(obj.StyleDetailId);

            // BuyerCostingCm
            BuyerCostingHelper.LoadBuyerCostingCMData(styleDetailId);
        }
        //Load BuyerCosting Fabric Trims
        BuyerCostingHelper.LoadBuyerCostingEmbellishment(styleDetailId);     
        //LoadWash Data
        BuyerCostingHelper.LoadBuyerCostingWashData(styleDetailId);
        BuyerCostingHelper.CalculateTotalFOB();
    },
    FillBuyerCostingDetailsForm: function (obj) {
        
        $("#hdnBuyerCostingId").val(obj.BuyerCostingId);
        $("#cmbStatus").data("kendoComboBox").value(obj.StatusId);
        $("#cmbCurrency").data("kendoComboBox").value(obj.CurrencyId);
        var styleData = MerchantManager.GetAllStyle(obj.StyleDetailId);
        var cboStyle = $("#cboStyle").data("kendoMultiColumnComboBox");
        cboStyle.value("");
        cboStyle.setDataSource(styleData);
        $("#cboStyle").data("kendoMultiColumnComboBox").value(obj.StyleDetailId);

        //Load BuyerCosting Fabric Trims
        BuyerCostingHelper.LoadBuyerCostingEmbellishment(obj.StyleDetailId);
        // BuyerCostingCm
        BuyerCostingHelper.LoadBuyerCostingCMData(obj.StyleDetailId);
        //LoadWash Data
        BuyerCostingHelper.LoadBuyerCostingWashData(obj.StyleDetailId);

        BuyerCostingHelper.CalculateTotalFOB();
    },
    LoadBuyerCostingEmbellishment: function (styleDetailId) {            
        ///GetBuyerCostingFabTrims
        //var itemGrid = $("#grdItemSummary").data("kendoGrid");
        var itemGrid1 = $("#grdItemSummary1").data("kendoGrid");
        
        var itemGridData = ItemSummaryManager.GetItemGridData(styleDetailId);   
        
            //$.each(itemGridData, function (i, item) {
            //                    
            //    if (kendo.toString(itemGridData[i].ItemGroupId).toUpperCase() == "138A3B7B-519E-4D58-8D5E-095B72CDA03A") {
            //        $("#fabCompositionCmb").data("kendoComboBox").enable(true);
            //        $("#colorCmb").data("kendoComboBox").enable(true);
            //    }
            //});
            if (itemGridData != null) {
                itemGridData.map(x => x.CmnColors = {
                    ColorId: x.CmnColors.ColorId === "" ? AjaxManager.DefaultGuidId() : x.CmnColors.ColorId,
                    ColorName: x.CmnColors.ColorName === "" ? "--Select--" : x.CmnColors.ColorName
                });
                itemGridData.map(x => x.MerchFabricCompositions = {
                    FabricCompositionId: x.MerchFabricCompositions.FabricCompositionId === "" ? AjaxManager.DefaultGuidId() : x.MerchFabricCompositions.FabricCompositionId,
                    CompositionName: x.MerchFabricCompositions.CompositionName === "" ? "--Select--" : x.MerchFabricCompositions.CompositionName
                });
                itemGridData.map(x => x.CmnUoms = {
                    UOMId: x.CmnUoms.UOMId === "" ? AjaxManager.DefaultGuidId() : x.CmnUoms.UOMId,
                    UOMName: x.CmnUoms.UOMName === "" ? "--Select--" : x.CmnUoms.UOMName
                });
                itemGridData.map(x =>
                    x.ExcessPercent = x.ExcessPercent == null ? "--Select--" : x.ExcessPercent
                );
                itemGridData.map(x =>
                    gbTotalValue += x.TotalValue
                );
                var tableBody = $("#grdItemSummary1 tbody");
                tableBody.find("#spnTotalValue").html(gbTotalValue.toFixed(3));
            }
        gbGriditemList = itemGridData;
            var gridDataSource = new kendo.data.DataSource({
                data: gbGriditemList,
                schema: {
                    model: {
                       
                        fields: {
                            StyleDetailId: { editable: false },
                            ItemId: { editable: false },
                            ItemName: { editable: false },
                            ColorId: { editable: false },
                            UomId: { editable: false },
                            FabricCompositionId: { editable: false },
                            CmnColors: { editable: true, template: "#=CmnColors.ColorName#" },
                            CmnUoms: { editable: true, template: "#=CmnUoms.UOMName#" },
                            MerchFabricCompositions: { editable: true, template: "#=MerchFabricCompositions.CompositionName#" },
                            ItemRef: { editable: true },
                            ItemDesc: { editable: true },
                            Consumption: { editable: true, type: "number", validation: { min: 0.00 } },
                            ExcessPercent: { editable: true, template: "#=ExcessPercent#" },
                            RequiredQty: { editable: false, type: "number", validation: { min: 0.00 } },
                            Rate: { editable: true, type: "number", validation: { min: 0.00 } },
                            TotalValue: { editable: false, type: "number", validation: { min: 0.00 } },
                            ItemGroupId: { editable: true } 
                        }
                    },
                   
                },
                change: function (e) {                    
                    
                    var tableBody = $("#grdItemSummary1 tbody");
                    var reqQty = 0;
                    var totalPrice = 0;
                    e.preventDefault();
                    if (e.action === "itemchange") {

                        var obj = e.items[0];

                        if (obj.ExcessPercent === "--Select--") {
                            reqQty = obj.Consumption + (0 * obj.Consumption) / 100.00;
                            totalPrice = reqQty * obj.Rate;
                        }
                        else {
                            reqQty = obj.Consumption + (obj.ExcessPercent * obj.Consumption) / 100.00;
                            totalPrice = reqQty * obj.Rate;
                        }
                        tableBody.find("tr[data-uid='" + obj.uid + "'] td:eq(15)").text(reqQty.toFixed(2));

                        tableBody.find("tr[data-uid='" + obj.uid + "'] td:eq(16)").text(totalPrice.toFixed(2));
                        
                        
                        gbTotalValue += totalPrice;

                        tableBody.find("#spnTotalValue").text(gbTotalValue.toFixed(3));
                        for (var i = 0; i < gbGriditemList.length; i++) {
                            if (gbGriditemList[i].ItemId == obj.ItemId) {
                                gbGriditemList[i].CmnColors = obj.CmnColors;
                                gbGriditemList[i].MerchFabricCompositions = obj.MerchFabricCompositions;
                                gbGriditemList[i].ItemRef = obj.ItemRef;
                                gbGriditemList[i].ItemDesc = obj.ItemDesc;
                                gbGriditemList[i].CmnUoms = obj.CmnUoms;
                                gbGriditemList[i].Consumption = obj.Consumption;
                                gbGriditemList[i].ExcessPercent = obj.ExcessPercent;
                                gbGriditemList[i].Rate = obj.Rate;
                                gbGriditemList[i].RequiredQty = reqQty.toFixed(2);
                                gbGriditemList[i].TotalValue = totalPrice.toFixed(2);
                                
                            }
                        }
                    }                    
                }
            });
            itemGrid1.setDataSource(gridDataSource);

            gbItemList.map(x => {
                gbTotalValue += parseFloat(x.TotalValue);
            });
            
        $("#grdItemSummary1").find("#spnTotalValue").html(gbTotalValue.toFixed(3));
        var fabEmbGrid = $("#grdFabricEmbSummary").data("kendoGrid");
        var fabEmbData = BuyerCostingManager.GetBuyerCostingEmbellishmentData(styleDetailId);
        gbSelectiveEmbArray = fabEmbData;
        fabEmbGrid.setDataSource(fabEmbData);
        FabricEmbellishmentSummaryHelper.CalculateTotalEmbRate(fabEmbData);
    },
    LoadBuyerCostingCMData: function (styleDetailId) {
        var cmObj = BuyerCostingManager.GetBuyerCostingCMData(styleDetailId);
        cmObj = cmObj[0];
        $("#hdnCostingEmbId").val(cmObj.BuyerCostingCmid);
        $("#txtCM").data("kendoNumericTextBox").value(cmObj.Cm);
        $("#txtCPM").data("kendoNumericTextBox").value(cmObj.Cpm);
        $("#txtSMV").data("kendoNumericTextBox").value(cmObj.Smv);
        $("#txtFOB").data("kendoNumericTextBox").value(cmObj.Fob + "/PC");
        $("#txtFOBperDozon").data("kendoNumericTextBox").value(cmObj.Fob * 12 + "/Dozon");
    },
    LoadBuyerCostingWashData: function (styleDetailId) {
        $("#WashTypes").find("input[type='checkbox']").prop('checked', false);
        // BuyerCostingCm
        var washObjs = BuyerCostingManager.GetBuyerCostingWashData(styleDetailId);
        washObjs.map(washObj => {
            $("#WashTypes").find("input[type='checkbox'][w-id='" + washObj.WashId + "']").prop('checked', true);
            $("#WashTypes").find("input[type='checkbox'][w-id='" + washObj.WashId + "']").attr("sw-id", washObj.StyleWashId);
        });
    },
    LoadFormAfterSave: function (obj) {
        ///GetBuyerCostingFabTrims
        var itemGrid = $("#grdItemSummary").data("kendoGrid");
        var itemGridData = ItemSummaryManager.GetItemGridData(obj.StyleDetailId);
        gbItemList = itemGridData;
        itemGrid.setDataSource(itemGridData);

        gbItemList.map(x => {
            gbTotalValue += parseFloat(x.TotalValue);
        });

        var fabEmbGrid = $("#grdFabricEmbSummary").data("kendoGrid");
        var fabEmbData = BuyerCostingManager.GetBuyerCostingEmbellishmentData(obj.StyleDetailId);
        gbSelectiveEmbArray = fabEmbData;
        fabEmbGrid.setDataSource(fabEmbData);
        FabricEmbellishmentSummaryHelper.CalculateTotalEmbRate(fabEmbData);
    },
    ValidateBuyerCostingForm: function () {
        
        res = true;
        
        var style = $("#cboStyle").data("kendoMultiColumnComboBox");
        if (style.value() === "" || style.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cboStyle", "error", "right", 1500, "Select Style");
            res = false;
        }

        var status = $("#cmbStatus").data("kendoComboBox");
        if (status.value() === "" || status.value() === AjaxManager.DefaultGuidId()) {
            AjaxManager.NotifyMsg("cmbStatus", "error", "right", 1500, "Select Status");
            res = false;
        }
        return res;
    }
}