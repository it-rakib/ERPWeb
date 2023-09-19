var gbBookingList = [];
var gdProductDeatils = [];

var ExportInvoiceDetailsManager = {
    GetContactDeatilsByContactId: function (id) {
        var contact = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/ComSalesContract/" + id;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            contact = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return contact;
    },
    GetExportLcDeatilsByExportLcId: function (id) {
        var lc = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/ComExportLc/" + id;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            lc = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return lc;
    },
    SaveExportInvoiceInfo: function () {
        //debugger;
        if (ExportInvoiceDetailsHelper.ValidateForm()) {
        var createComExportInvoiceCommands = ExportInvoiceDetailsHelper.CreateExportInvoiceInfoObject();
        var jsonParam = JSON.stringify(createComExportInvoiceCommands);
        var serviceUrl = _baseUrl + "/api/ComExportInvoice/CreateUpdateComExportInvoice";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            var msg = jsonData.Message;
            if (jsonData.Success) {
                //var summary = ExportInvoiceSummaryManager.gridDataSource();
                //var grid = $("#grdExportInvoiceSummary").data("kendoGrid");
                //grid.setDataSource(summary);
                $("#divPIDetails").hide();
                $("#divPISummary").show();

                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#hdnExInvoiceId").val(jsonData.createComExportInvoiceDto.ExportInvoiceId);
                            $("#txtInvoiceNo").val(jsonData.createComExportInvoiceDto.InvoiceNo);
                            $("#grdExportInvoiceSummary").data("kendoGrid").dataSource.read();
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
            debugger;

            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    //GetPIproductDeatils: function (piId) {
    //    var piProductDetail = "";
    //    var jsonParam = "";
    //    var serviceUrl = _baseUrl + "/api/ProformaInvoice/GetPIProductListByPIId/" + piId;
    //    AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
    //    function onSuccess(jsonData) {
    //        piProductDetail = jsonData;
    //    }
    //    function onFailed(error) {
    //        window.alert(error.statusText);
    //    }
    //    return piProductDetail;
    //},
    //DeleteProductDetails: function (piProductDetailsId) {
    //    deletePIProductDetails = new Object();
    //    deletePIProductDetails.PiproductDetailsId = piProductDetailsId;
    //    deletePIProductDetails.DeleteBy = CurrentUser.USERID;
    //    var jsonParam = JSON.stringify(deletePIProductDetails);
    //    var serviceUrl = _baseUrl + "/api/ProformaInvoice/DeletePIProductDetails";
    //    AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);

    //    function onSuccess(jsonData) {
    //        var msg = jsonData.Message;
    //        if (jsonData.Success) {
    //            console.log(msg);
    //        }

    //        else {
    //            console.log(msg);
    //        }
    //    }
    //    function onFailed(error) {
    //        console.log(error);
    //    }
    //}
};

var ExportInvoiceDetailsHelper = {
    InitExportInvoiceDetails: function () {
        $("#tabstrip").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            }
        });

        $("#btnAddNewExportInvoice").click(function () {
            ExportInvoiceDetailsHelper.ResetForm();
            $("#divExportInvoiceDetails").show();
            $("#divExportInvoiceSummary").hide();
        });
        $("#btnBack").click(function () {
            $("#divExportInvoiceDetails").hide();
            $("#divExportInvoiceSummary").show();
        });

        $("#btnSaveInvoiceInfo").click(function () {
            ExportInvoiceDetailsManager.SaveExportInvoiceInfo();
           // PIDetailsHelper.ResetForm();
        });

        //$("#btnAddPoWiseStyleBreakDown").click(function () {
        //    debugger;
        //    var grid = $("#grdExportPOStyleBreakDown").data("kendoGrid");
        //    grid.addRow();
        //});

        //$("#cmbContractType").change(function () {
        //    debugger;
        //    var contractType = $("#cmbContractType").data("kendoComboBox").value();
        //    if (contractType != "" || contractType != null || contractType != undefined) {
        //        ExportInvoiceDetailsHelper.ResetSCLCInfo();
        //        $("#divPoWiseStyleGrid").hide();
        //    //    ExportInvoiceDetailsHelper.LoadSClcCombo(contractType);
        //    }
        //});
        $("#cmbSCLC").change(function () {
            var id = $("#cmbSCLC").data("kendoComboBox").value();
            if (id != "") {
                //debugger;
                //var contractType = $("#cmbContractType").data("kendoComboBox").value();
                //if (contractType === "Sale Contract") {
                var contact = ExportInvoiceDetailsManager.GetContactDeatilsByContactId(id);
                $("#txtSCLCDate").data("kendoDatePicker").value(contact.Scdate);
                $("#txtSCLCValue").data("kendoNumericTextBox").value(contact.Scvalue);
                $("#cmbCurrency").data("kendoComboBox").value(contact.CurrencyId);
                $("#cmbBank").data("kendoComboBox").value(contact.LienBankId);
                $("#cmbBuyer").data("kendoComboBox").value(contact.BuyerId);
                $("#cmbPaymentTerm").data("kendoComboBox").value(contact.PayTermsId);
                $("#cmbCompany").data("kendoComboBox").value(contact.Beneficiary);
                // }
                //if (contractType === "Export Lc") {
                //    var exportLc = ExportInvoiceDetailsManager.GetExportLcDeatilsByExportLcId(id);
                //    $("#txtSCLCDate").data("kendoDatePicker").value(exportLc.Lcdate);

                //    $("#txtSCLCValue").data("kendoNumericTextBox").value(exportLc.Lcvalue);

                //    $("#cmbCurrency").data("kendoComboBox").value(exportLc.CurrencyId);
                //    $("#cmbBank").data("kendoComboBox").value(exportLc.LienBankId);
                //    $("#cmbBuyer").data("kendoComboBox").value(exportLc.BuyerId);
                //    $("#cmbPaymentTerm").data("kendoComboBox").value(exportLc.PayTermsId);
                //}
                $("#divPoWiseStyleGrid").show();
            }
            else {
                ExportInvoiceDetailsHelper.ResetSCLCInfo();
            }
        });

        ExportInvoiceDetailsHelper.GenerateDatePicker();
        ExportInvoiceDetailsHelper.GenerateNumericTextBox();
        MerchantHelper.LoadSCCombo("cmbSCLC");
        MerchantHelper.LoadCompanyCombo("cmbCompany");
        MerchantHelper.LoadBankCombo("cmbBank");
        MerchantHelper.LoadBuyerCombo("cmbBuyer");
        MerchantHelper.LoadPaymentTermCombo("cmbPaymentTerm");
        MerchantHelper.GenerateCurrencyCombo("cmbCurrency");
        MerchantHelper.LoadUoMCombo("cmbUnit");
        MerchantHelper.LoadShipmentTermsCombo("cmbShipmentTerm");
        MerchantHelper.LoadShipmentModeCombo("cmbModeOfShipment");
        MerchantHelper.LoadPortCombo("cmbPort");
        //$("#cmbSCLC").kendoComboBox({
        //    dataSource: [],
        //    dataTextField: "SCLCNo",
        //    dataValueField: "SCLCId",
        //    placeholder: "--Select--"
        //});
        $("#cmbFreight").kendoComboBox({
            dataSource: [
                { Type: "Collect", Name: "Collect" },
                { Type: "Prepaid", Name: "Prepaid" }
            ],
            dataTextField: "Name",
            dataValueField: "Type",
            placeholder: "--Select Freight--",
            filter: "contains",
        });

        //$("#cmbContractType").kendoComboBox({
        //    dataSource: [
        //        {Type: "Sale Contract", Name: "Sale Contract"},
        //        { Type: "Export Lc", Name: "Export Lc" }
        //    ],
        //    dataTextField: "Name",
        //    dataValueField: "Type",
        //    placeholder: "--Select Contract Type--",
        //    filter: "contains",
        //});

        //$("#txtSearchKey").keypress(function (event) {
        //    if (event.keyCode === 13) {
        //        PIDetailsHelper.LoadPendignPIGrid();
        //    }
        //});
        //$("#btnSearchPendingBooking").click(function () {
        //    PIDetailsHelper.LoadPendignPIGrid();

        //});
        //$("#btnAddBooking").click(function () {
        //    PIDetailsHelper.AddToList();
        //    PIDetailsHelper.BookingChangeEventFillForm();
        //    PIProductInfoHelper.CalculationTotalInvoiceValue();
        //});
       
        
        //$("#btnSavePIInfo").click(function () {
        //    PIDetailsManager.SavePIInfo();
        //    PIDetailsHelper.ResetForm();
        //});
    },
    //LoadSClcCombo(contractType) {
    //    var combobox = $("#cmbSCLC").data("kendoComboBox");
    //    var cmbData = [];
    //    if (contractType === "Sale Contract") {
    //        var data = MerchantManager.GetSC();
    //        debugger;
    //        for (var i = 0; i < data.length; i++) {
    //            var obj = new Object();
    //            obj.SCLCId = data[i].Scid;
    //            obj.SCLCNo = data[i].Scno;
    //            cmbData.push(obj);
    //        }
    //    }
    //    if (contractType === "Export Lc") {
    //        var data = MerchantManager.GetAllExportLc();
    //        debugger;
    //        for (var i = 0; i < data.length; i++) {
    //            var obj = new Object();
    //            obj.SCLCId = data[i].Lcid;
    //            obj.SCLCNo = data[i].Lcno;
    //            cmbData.push(obj);
    //        }
    //    }
    //    combobox.setDataSource(cmbData);
    //},
    ResetSCLCInfo: function () {
        $("#txtSCLCValue").data("kendoNumericTextBox").value("");
        $("#txtSCLCDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#cmbCurrency").data("kendoComboBox").value("");
        $("#cmbBank").data("kendoComboBox").value("");
        $("#cmbBuyer").data("kendoComboBox").value("");
        $("#cmbPaymentTerm").data("kendoComboBox").value("");
    },
    ResetForm: function () {
        ExportInvoiceDetailsHelper.ResetSCLCInfo();
        $("#cmbSCLC").data("kendoComboBox").value("");
        $("#cmbCompany").data("kendoComboBox").value("");
    },
    //GenerateGrid() {
    //    $("#grdPendingBookingSummary").kendoGrid({
    //        dataSource: [],
    //        filterable: false,
    //        sortable: false,
    //        //noRecords: {
    //        //    template: "<label>NO DATA FOUND</label>"
    //        //},
    //        noRecords: true,
    //        messages: {
    //            noRecords: "NO DATA FOUND"
    //        },
    //        columns: [
    //            { field: "BookingId", hidden: true },
    //            { field: "BookingNo", title: "Booking No", width: 40, sortable: true },
    //            { field: "ItemName", title: "Item", width: 40, sortable: true },
    //            { field: "StyleNo", title: "Style No", width: 40, sortable: true },
    //            {
    //                field: "Action", title: "Action", filterable: false, width: 60, command: [{
    //                    name: "delete", text: "Remove", iconClass: "k-icon k-i-delete", className: "k-danger", click: PIDetailsHelper.ClickEventForDeleteButton
    //                }]
    //            }
    //        ],
    //        editable: false,
    //        selectable: "row",
    //        navigatable: true,
    //        scrollable: false
    //    });

    //},
    //GenerateMultiColumnComboBox: function (ctrlId) {
    //    $("#" + ctrlId).kendoMultiColumnComboBox({
    //        dataSource: [],
    //        dataTextField: "BookingNo",
    //        dataValueField: "BookingId",
    //        columns: [
    //            { field: "BookingNo", title: "Booking No", width: 200, sortable: true },
    //            { field: "ItemName", title: "Item", width: 200, sortable: true },
    //            { field: "StyleNo", title: "Style No", width: 200, sortable: true },
    //        ],
    //        filter: "startswith",
    //        filterFields: ["BookingNo"],
    //        footerTemplate: 'Total #: instance.dataSource.total() # items found',
    //        index: 0,
    //        placeholder: "---Select Pending Booking ---",
    //        height: 400

    //    });
    //},
    //LoadPendignPIGrid: function () {
    //    var searchKey = $("#txtSearchKey").val();
    //    if (searchKey !== "") {
    //        var data = PIDetailsManager.GetPendingPIBookingList();
    //        data.unshift(UtilityUnShift.GetUnshiftPendingbookingSearch());
    //        var cboPendingBooking = $("#cboPendingBooking").data("kendoMultiColumnComboBox");
    //        cboPendingBooking.value("");
    //        cboPendingBooking.setDataSource(data);
    //        cboPendingBooking.select(0);
    //    } else {
    //        AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search style!",
    //            [{
    //                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
    //                    $noty.close();
    //                }
    //            }]);
    //    }
    //},

    //BookingChangeEventFillForm: function () {
    //    var bookingData = $("#cboPendingBooking").data("kendoMultiColumnComboBox").dataItem();

    //    //gbBookingId.push(bookingData.BookingId);

    //    var bookingDeatils = PIDetailsManager.GetSelectedBookingDetails(bookingData.BookingId);
    //    $("#cmbSupplier").data("kendoComboBox").value(bookingData.SupplierId);
    //    $("#cmbBuyer").data("kendoComboBox").value(bookingData.BuyerId);
    //    $("#cmbOriginCountry").data("kendoComboBox").value(bookingData.OriginCountryId);

    //    PIDetailsHelper.CreateObjProductListData(bookingDeatils);

    //    var gridData = PIDetailsHelper.SetBookingDetailsSummarySchema(gdProductDeatils);
    //    var grid = $("#grdBookingDetailsSummary").data("kendoGrid");
    //    grid.setDataSource(gridData);

    //},
    //CreateObjProductListData: function (bookingDeatils) {
    //    debugger;
    //    for (var i = 0; i < bookingDeatils.length; i++) {
    //        var obj = new Object();
    //        obj.BookingDetailId = bookingDeatils[i].BookingDetailId;
    //        obj.BookingId = bookingDeatils[i].BookingId;
    //        obj.StyleDetailsId = bookingDeatils[i].StyleDetailsId;
    //        obj.BookingValue = bookingDeatils[i].BookingValue;
    //        obj.OrderQty = bookingDeatils[i].OrderQty;
    //        obj.SizeInfo = { SizeId: bookingDeatils[i].SizeInfo.SizeId, SizeName: bookingDeatils[i].SizeInfo.SizeName };
    //        obj.ColorInfo = { ColorId: bookingDeatils[i].ColorInfo.ColorId, ColorName: bookingDeatils[i].ColorInfo.ColorName };
    //        obj.ItemInfo = { ItemId: bookingDeatils[i].ItemInfo.ItemId, ItemName: bookingDeatils[i].ItemInfo.ItemName };
    //        obj.StyleInfo = { StyleId: bookingDeatils[i].StyleInfo.StyleId, StyleNo: bookingDeatils[i].StyleInfo.StyleNo };
    //        obj.UnitInfo = { UOMId: bookingDeatils[i].UnitInfo.UOMId, UOMName: bookingDeatils[i].UnitInfo.UOMName };
    //        obj.UnitPrice = bookingDeatils[i].BookingValue;
    //        obj.ItemQty = bookingDeatils[i].OrderQty;
    //        obj.ItemAmount = bookingDeatils[i].OrderQty * bookingDeatils[i].BookingValue;
    //        obj.PIId = AjaxManager.DefaultGuidId();
    //        obj.PIProductDetailsId = AjaxManager.DefaultGuidId();
    //        gdProductDeatils.push(obj);
    //    }
    //},
    //SetBookingDetailsSummarySchema: function (data) {
    //    var gridData = new kendo.data.DataSource({
    //        data: data,
    //        schema: {
    //            model: {
    //                fields: {
    //                    BookingDetailId: {
    //                        defaultValue: AjaxManager.DefaultGuidId()
    //                    },
    //                    PIProductDetailsId: {
    //                        defaultValue: AjaxManager.DefaultGuidId()
    //                    },
    //                    ColorInfo: {
    //                        defaultValue: { ColorId: AjaxManager.DefaultGuidId(), ColorName: "--Select Color--" }
    //                    },
    //                    StyleInfo: {
    //                        defaultValue: { StyleId: AjaxManager.DefaultGuidId(), StyleNo: "--Select Style--" }
    //                    },
    //                    SizeInfo: {
    //                        defaultValue: { SizeId: AjaxManager.DefaultGuidId(), SizeName: "--Select Size--" }
    //                    },
    //                    ItemInfo: {
    //                        defaultValue: { ItemId: AjaxManager.DefaultGuidId(), ItemName: "--Select Item--" }
    //                    },
    //                    UnitInfo: {
    //                        defaultValue: { UOMId: AjaxManager.DefaultGuidId(), UOMName: "--Select Unit--" }
    //                    },
    //                    ItemQty: {
    //                        defaultValue: 0
    //                    },
    //                    UnitPrice: {
    //                        defaultValue: 0
    //                    },
    //                    ItemAmount: {
    //                        defaultValue: 0
    //                    },
    //                    OrderQty: {
    //                        defaultValue: 0
    //                    },
    //                    Weight: {
    //                        defaultValue: 0
    //                    },
    //                    Length: {
    //                        defaultValue: 0
    //                    },
    //                }
    //            }
    //        },
    //        change: function (e) {
    //            e.preventDefault();
    //            if (e.action === "itemchange") {
    //                var obj = e.items[0];

    //                debugger;
    //                if (e.field === "UnitPrice" || e.field === "ItemQty") {
    //                    PIProductInfoHelper.CalculationTotalInvoiceValue();

    //                    //item ItemQty undefine 
    //                    //e.items[0].UnitPrice = kendo.parseFloat(obj.UnitPrice);
    //                    //e.items[0].ItemQty = kendo.parseFloat(obj.ItemQty);
    //                    //e.items[0].ItemAmount = kendo.parseFloat(e.items[0].UnitPrice * e.items[0].ItemQty);
    //                }
    //            }
    //        }
    //    });
    //    return gridData;
    //},
    //FillPIDetailsForm: function (obj) {
    //    $("#hdnPIId").val(obj.PIId);
    //    $("#txtPINo").val(obj.PINo);
    //    $("#hdnBookingId").val(obj.BookingId);
    //    $("#txtReferenceNo").val(obj.ReferenceNo);
    //    $("#txtProductCode").val(obj.ProductCode);
    //    $("#txtShipmentMethod").val(obj.ShipmentMethod);
    //    $("#txtPacking").val(obj.Packing);
    //    $("#txtTermsCondition").val(obj.TermsAndConditions);
    //    $("#txtRemarks").val(obj.Remarks);

    //    $("#txtPIDate").data("kendoDatePicker").value(obj.PIDate);
    //    $("#txtShipmentDate").data("kendoDatePicker").value(obj.ShipmentDate);
    //    $("#txtPIValidDate").data("kendoDatePicker").value(obj.PIValidityDate);
    //    $("#txtDeliveryDate").data("kendoDatePicker").value(obj.ETD);
    //    $("#txtETA").data("kendoDatePicker").value(obj.ETA);

    //    $("#txtExchangeRate").data("kendoNumericTextBox").value(obj.ExchangeRate);
    //    $("#txtInvoiceValue").data("kendoNumericTextBox").value(obj.PIValue);
    //    // $("#txtInvoiceQuantity").data("kendoNumericTextBox").value(obj.PIValue);
    //    $("#txtAdditionalCharges").data("kendoNumericTextBox").value(obj.AdditionalCharges);
    //    $("#txtDeduction").data("kendoNumericTextBox").value(obj.Deduction);
    //    $("#txtDiscount").data("kendoNumericTextBox").value(obj.DiscountAmount);
    //    $("#txtTotalAmount").data("kendoNumericTextBox").value(obj.TotalAmount);

    //    $("#cmbSupplier").data("kendoComboBox").value(obj.SupplierId);
    //    $("#cmbConsignee").data("kendoComboBox").value(obj.ConsigneeId);
    //    $("#cmbPaymentTerm").data("kendoComboBox").value(obj.PaymentTermId);
    //    $("#cmbTenure").data("kendoComboBox").value(obj.TenureId);
    //    $("#cmbOriginCountry").data("kendoComboBox").value(obj.OriginCountryId);
    //    $("#cmbOriginPort").data("kendoComboBox").value(obj.POLId);
    //    $("#cmbDestinationCountry").data("kendoComboBox").value(obj.DestinationCountryId);
    //    $("#cmbDestinationPort").data("kendoComboBox").value(obj.DestinationPortId);
    //    $("#cmbCurrency").data("kendoComboBox").value(obj.CurrencyId);
    //    $("#cmbShipmentMode").data("kendoComboBox").value(obj.ShipmentModeId);
    //    $("#cmbShipmentTerm").data("kendoComboBox").value(obj.ShipmentTermId);
    //    $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);
    //    $("#cmbBank").data("kendoComboBox").value(obj.BankId);

    //    var piProductDetails = PIDetailsManager.GetPIproductDeatils(obj.PIId);
    //    PIDetailsHelper.CreateObjProductListWithPIData(piProductDetails);

    //    var piProductGrid = $("#grdBookingDetailsSummary").data("kendoGrid");

    //    var dataSource = PIDetailsHelper.SetBookingDetailsSummarySchema(gdProductDeatils);
    //    piProductGrid.setDataSource(dataSource);

    //    var distinctBookingId = gdProductDeatils.map(item => item.BookingId)
    //        .filter((value, index, self) => self.indexOf(value) === index);

    //    //var dataList = [];
    //    debugger;
    //    for (var i = 0; i < distinctBookingId.length; i++) {
    //        if (distinctBookingId[i] != "00000000-0000-0000-0000-000000000000") {
    //            var data = PIDetailsManager.GetBookingByBookingId(distinctBookingId[i]);
    //            //dataList.push(data);
    //            gbBookingList.push(data);
    //        }
    //    }


    //    var grid = $("#grdPendingBookingSummary").data("kendoGrid");
    //    //var gridData = PIDetailsHelper.SetBookingDetailsSummarySchema(dataList);
    //    var gridData = PIDetailsHelper.SetBookingDetailsSummarySchema(gbBookingList);
    //    grid.setDataSource(gridData);
    //    // PIDetailsHelper.CreateObjProductListData(piProductDetails);
    //    PIProductInfoHelper.CalculationTotalInvoiceValue();

    //},
    //CreateObjProductListWithPIData: function (piDetails) {
    //    debugger;
    //    for (var i = 0; i < piDetails.length; i++) {
    //        var obj = new Object();
    //        obj.PIId = piDetails[i].PIId;
    //        obj.PIProductDetailsId = piDetails[i].PIProductDetailsId;
    //        obj.BookingDetailId = piDetails[i].BookingDetailId;
    //        obj.StyleDetailsId = piDetails[i].StyleDetailsId;
    //        obj.BookingId = piDetails[i].BookingId;
    //        obj.BookingValue = piDetails[i].BookingValue;
    //        obj.OrderQty = piDetails[i].OrderQty;
    //        obj.SizeInfo = { SizeId: piDetails[i].SizeInfo.SizeId, SizeName: piDetails[i].SizeInfo.SizeName };
    //        obj.ColorInfo = { ColorId: piDetails[i].ColorInfo.ColorId, ColorName: piDetails[i].ColorInfo.ColorName };
    //        obj.ItemInfo = { ItemId: piDetails[i].ItemInfo.ItemId, ItemName: piDetails[i].ItemInfo.ItemName };
    //        obj.StyleInfo = { StyleId: piDetails[i].StyleInfo.StyleId, StyleNo: piDetails[i].StyleInfo.StyleNo };
    //        obj.UnitInfo = { UOMId: piDetails[i].UnitInfo.UOMId, UOMName: piDetails[i].UnitInfo.UOMName };
    //        obj.UnitPrice = piDetails[i].UnitPrice;
    //        obj.ItemQty = piDetails[i].OrderQty;
    //        //obj.ItemAmount = piDetails[i].OrderQty * piDetails[i].UnitPrice;
    //        obj.Consumtion = piDetails[i].Consumtion,
    //            obj.HSCode = piDetails[i].HSCode,
    //            ////obj.OrderQty = piDetails[i].BookingQuantity,
    //            obj.ItemQty = piDetails[i].ItemQty,
    //            // obj.UnitPrice = piDetails[i].UnitPrice,
    //            obj.ItemAmount = piDetails[i].ItemAmount,
    //            obj.Weight = piDetails[i].Weight,
    //            obj.Length = piDetails[i].Length,
    //            obj.Shade = piDetails[i].Shade,
    //            obj.Count = piDetails[i].Count,
    //            obj.CuttableWidth = piDetails[i].CuttableWidth,
    //            obj.Tex = piDetails[i].Tex,
    //            gdProductDeatils.push(obj);
    //    }
    //},
    //ResetForm() {
    //    $("#hdnPIId").val(AjaxManager.DefaultGuidId());

    //    $("#hdnBookingId").val(AjaxManager.DefaultGuidId());
    //    $("#txtPINo").val("");
    //    $("#txtReferenceNo").val("");
    //    $("#txtProductCode").val("");
    //    $("#txtShipmentMethod").val("");
    //    $("#txtPacking").val("");
    //    $("#txtTermsCondition").val("");
    //    $("#txtRemarks").val("");
    //    $("#txtSearchKey").val("");

    //    //$("#txtETA").data("kendoDatePicker").value("");

    //    $("#txtPIDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    //    $("#txtDeliveryDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    //    $("#txtShipmentDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    //    $("#txtPIValidDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    //    $("#txtETA").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });

    //    $("#txtExchangeRate").data("kendoNumericTextBox").value("");
    //    $("#txtInvoiceValue").data("kendoNumericTextBox").value("");
    //    $("#txtInvoiceQuantity").data("kendoNumericTextBox").value("");
    //    $("#txtAdditionalCharges").data("kendoNumericTextBox").value("");
    //    $("#txtDeduction").data("kendoNumericTextBox").value("");
    //    $("#txtDiscount").data("kendoNumericTextBox").value("");
    //    $("#txtTotalAmount").data("kendoNumericTextBox").value("");


    //    $("#cmbSupplier").data("kendoComboBox").value("");
    //    $("#cmbConsignee").data("kendoComboBox").value("");
    //    $("#cmbPaymentTerm").data("kendoComboBox").value("");
    //    $("#cmbTenure").data("kendoComboBox").value("");
    //    $("#cmbOriginCountry").data("kendoComboBox").value("");
    //    $("#cmbOriginPort").data("kendoComboBox").value("");
    //    $("#cmbDestinationCountry").data("kendoComboBox").value("");
    //    $("#cmbDestinationPort").data("kendoComboBox").value("");
    //    $("#cmbCurrency").data("kendoComboBox").value("");
    //    $("#cmbShipmentMode").data("kendoComboBox").value("");
    //    $("#cmbShipmentTerm").data("kendoComboBox").value("");
    //    $("#cmbBuyer").data("kendoComboBox").value("");
    //    $("#cmbBank").data("kendoComboBox").value("");

    //    $("#grdBookingDetailsSummary").data("kendoGrid").dataSource.data([]);
    //    $("#cboPendingBooking").data("kendoMultiColumnComboBox").value("");
    //    $("#grdPendingBookingSummary").data("kendoGrid").dataSource.data([]);
    //    gbBookingList = [];
    //    gdProductDeatils = [];
    //    // gbBookingId = [];
    //},
    //ClickEventForDeleteButton: function (e) {
    //    e.preventDefault();
    //    var grid = $("#grdPendingBookingSummary").data("kendoGrid");
    //    var tr = $(e.currentTarget).closest("tr");
    //    var selectedItem = this.dataItem(tr);
    //    grid.select(tr);

    //    //debugger;
    //    if (selectedItem != null) {
    //        for (var i = 0; i < gdProductDeatils.length; i++) {

    //            if (gdProductDeatils[i].BookingId == selectedItem.BookingId) {
    //                if (gdProductDeatils[i].PIId != AjaxManager.DefaultGuidId()) {

    //                    PIDetailsManager.DeleteProductDetails(gdProductDeatils[i].PIProductDetailsId);
    //                }
    //                gdProductDeatils.splice(i, 1);
    //                i--;
    //            }
    //        }

    //    }
    //    $('#grdBookingDetailsSummary').data('kendoGrid').setDataSource(gdProductDeatils);

    //    //PIDetailsHelper.SetBookingDetailsSummarySchema(gdProductDeatils);
    //    //$('#grdBookingDetailsSummary').data('kendoGrid').setDataSource(gdProductDeatils);
    //    ////PIProductInfoHelper.CalculationTotalInvoiceValue();

    //    if (selectedItem != null) {
    //        grid.dataSource.remove(selectedItem);
    //        for (var i = 0; i < gbBookingList.length; i++) {
    //            if (gbBookingList[i].BookingId == selectedItem.BookingId) {
    //                gbBookingList.splice(i, 1);
    //                $('#grdPendingBookingSummary').data('kendoGrid').setDataSource(gbBookingList);

    //                break;
    //            }
    //        }
    //    }
    //    PIProductInfoHelper.CalculationTotalInvoiceValue();

    //    if (gbBookingList.length === 0) {
    //        $("#cmbSupplier").data("kendoComboBox").value("");
    //        $("#cmbBuyer").data("kendoComboBox").value("");
    //        $("#cmbOriginCountry").data("kendoComboBox").value("");
    //        PIDetailsHelper.ResetForm();
    //    }
    //},

    GenerateDatePicker: function () {
        $("#txtSCLCDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtInvoiceDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtExFactorDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtOnBoardDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtAcceptanceDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtMaturityDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        $("#txtSCLCValue").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2,
            change: function () {

            }
        });

        $("#txtGoodsValue").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2, default: 0,
            change: function () {
                ExportInvoiceDetailsHelper.CalculateAmountInvoiceValue();
            }
        });
        $("#txtCommission").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2, default: 0,
            change: function () {
                ExportInvoiceDetailsHelper.CalculateAmountInvoiceValue();
            }
        });
        $("#txtAdjustmentAmount").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2, default: 0,
            change: function () {
                ExportInvoiceDetailsHelper.CalculateAmountInvoiceValue();
            }
        });
       
        $("#txtExchangeRate").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2, default: 0,
            change: function () {
                ExportInvoiceDetailsHelper.CalculateAmountInvoiceValue();
            }
        });


        $("#txtInvoiceQuantity").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2 });
        $("#txtInvoiceValue").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2 });
        $("#txtInvoiceValueBDT").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2 });
        
    },

    CalculateAmountInvoiceValue: function () {
        //debugger;
        var goodsValue = parseFloat($('#txtGoodsValue').data('kendoNumericTextBox').value());
        var commission = parseFloat($('#txtCommission').data('kendoNumericTextBox').value());
        var adjustmentAmount = parseFloat($('#txtAdjustmentAmount').data('kendoNumericTextBox').value());
        var exchangeRate = parseFloat($('#txtExchangeRate').data('kendoNumericTextBox').value());

        var invoiceValue = UtilityHelper.IsNaN(goodsValue) - (UtilityHelper.IsNaN(commission) + UtilityHelper.IsNaN(adjustmentAmount));
        var valueInBdt = UtilityHelper.IsNaN(invoiceValue) * UtilityHelper.IsNaN(exchangeRate);

        $('#txtInvoiceValue').data('kendoNumericTextBox').value(invoiceValue);
        $('#txtInvoiceValueBDT').data('kendoNumericTextBox').value(valueInBdt);
    },
    //AddToList: function () {
    //    //debugger;
    //    var pendingBookingCombo = $("#cboPendingBooking").data("kendoMultiColumnComboBox");
    //    var pendingBookingGrid = $("#grdPendingBookingSummary").data("kendoGrid");
    //    if (pendingBookingCombo.value() != "") {

    //        var pendingBookingComboData = pendingBookingCombo.dataItem();
    //        var pendingBookingGridData = pendingBookingGrid.dataSource.data();
    //        //console.log("pendingBookingComboData", pendingBookingComboData);
    //        //console.log("pendingBookingGridData", pendingBookingGridData);
    //        for (var i = 0; i < pendingBookingGridData.length; i++) {
    //            var booking = pendingBookingGridData[i];
    //            var bookingId = pendingBookingCombo.value();
    //            //must needed
    //            // debugger;
    //            if (booking.SupplierId !== pendingBookingComboData.SupplierId) {
    //                AjaxManager.NotifyMsg("cboPendingBooking", "error", "top", 2000, "Please Select Same Buyer,Supplier");
    //                return;
    //            }
    //            if (booking.BookingId === bookingId) {
    //                AjaxManager.NotifyMsg("cboPendingBooking", "error", "top", 1500, "This Booking Already Added");
    //                return;
    //            }
    //        }
    //        var obj = new Object();
    //        obj.BookingId = pendingBookingCombo.value();
    //        obj.BookingNo = pendingBookingComboData.BookingNo;
    //        obj.ItemName = pendingBookingComboData.ItemName;
    //        obj.StyleNo = pendingBookingComboData.StyleNo;
    //        obj.SupplierId = pendingBookingComboData.SupplierId;
    //        obj.SupplierName = pendingBookingComboData.SupplierName;

    //        gbBookingList.push(obj);
    //        var gridDataSource = new kendo.data.DataSource({
    //            data: gbBookingList,
    //            schema: {
    //                model: {
    //                    fields: {
    //                        Edit: {
    //                            editable: false
    //                        }
    //                    }
    //                }
    //            }
    //        });
    //        pendingBookingGrid.setDataSource(gridDataSource);

    //    }
    //},
    //GenerateSupplierCombo: function (identity) {
    //    var objPoType = PIDetailsManager.GetAllSupplier();
    //    var obj = new Object();
    //    obj.StatusName = "---Select---";
    //    obj.StatusId = "0";
    //    objPoType.unshift(obj);
    //    $("#" + identity).kendoComboBox({
    //        placeholder: "---Select---",
    //        dataTextField: "SupplierName",
    //        dataValueField: "SupplierId",
    //        dataSource: objPoType,
    //        index: 0,
    //        suggest: true,
    //        filter: "contains",
    //        change: function () {
    //            AjaxManager.isValidItem(identity, true);
    //        }
    //    });
    //},
    //GenerateShipmentModeCombo: function (identity) {
    //    var objShipmentMode = PIDetailsManager.GetAllShipmentMode();
    //    var obj = new Object();
    //    obj.ModeName = "---Select---";
    //    obj.CmnShipmentModeId = "0";
    //    objShipmentMode.unshift(obj);
    //    $("#" + identity).kendoComboBox({
    //        placeholder: "Select",
    //        dataTextField: "ModeName",
    //        dataValueField: "CmnShipmentModeId",
    //        dataSource: objShipmentMode,
    //        index: 0,
    //        suggest: true,
    //        filter: "contains",
    //        change: function () {
    //            AjaxManager.isValidItem(identity, true);
    //        }
    //    });
    //},
    //GenerateParentPOCombo: function (identity) {
    //    var objPoType = [];
    //    var obj = new Object();
    //    obj.Pono = "---Select---";
    //    obj.Poid = AjaxManager.DefaultGuidId();
    //    objPoType.unshift(obj);
    //    $("#" + identity).kendoComboBox({
    //        placeholder: "Select",
    //        dataTextField: "Pono",
    //        dataValueField: "Poid",
    //        dataSource: objPoType,
    //        index: 0,
    //        suggest: true,
    //        filter: "contains",
    //        change: function () {
    //            AjaxManager.isValidItem(identity, true);
    //        }
    //    });
    //},



    //ChangeEventForPOTypeCombo: function () {
    //    $("#divParentPO").hide();
    //    $("#cmbParentPO").data("kendoComboBox").value("");
    //    $("#cmbParentPO").data("kendoComboBox").text("");
    //    var statusId = $("#cmbPOType").data("kendoComboBox").value();
    //    if (statusId === "3fa85f64-5717-4562-b3fc-2c963f66afa6" || statusId === "53f78b22-ba53-4add-bed4-9768ebbcfb6b") {
    //        $("#txtPONo").removeAttr("disabled");
    //    }
    //    else {
    //        $("#txtPONo").val("");
    //        $("#txtPONo").attr("disabled", "disabled");

    //    }

    //    if (statusId.toUpperCase() === "53F78B22-BA53-4ADD-BED4-9768EBBCFB6B") {
    //        $("#divParentPO").show();
    //    } else {
    //        $("#divParentPO").hide();
    //    }
    //},

    CreateExportInvoiceInfoObject: function () {
        //debugger;
        var obj = new Object();
        obj.ExportInvoiceId = $("#hdnExInvoiceId").val();
        obj.CompanyId = $("#cmbCompany").data("kendoComboBox").value();
        obj.SCId = $("#cmbSCLC").data("kendoComboBox").value();
        obj.InvoiceNo = $("#txtInvoiceNo").val();
        obj.InvoiceDate = $("#txtInvoiceDate").data("kendoDatePicker").value();
        obj.GoodsValue = IkrHelper.EmptyThenZero($("#txtGoodsValue").data("kendoNumericTextBox").value());
        obj.Commission = IkrHelper.EmptyThenZero($("#txtCommission").data("kendoNumericTextBox").value());
        obj.AdjustmentAmount = IkrHelper.EmptyThenZero($("#txtAdjustmentAmount").data("kendoNumericTextBox").value());
        obj.InvoiceValue = IkrHelper.EmptyThenZero($("#txtInvoiceValue").data("kendoNumericTextBox").value());
        obj.ExchangeRate = IkrHelper.EmptyThenZero($("#txtExchangeRate").data("kendoNumericTextBox").value());
        obj.InvoiceValueInBDT = IkrHelper.EmptyThenZero($("#txtInvoiceValueBDT").data("kendoNumericTextBox").value());
        obj.InvoiceQuantity = IkrHelper.EmptyThenZero($("#txtInvoiceQuantity").data("kendoNumericTextBox").value());
        obj.UOMId = $("#cmbUnit").data("kendoComboBox").value();
        obj.Freight = $("#cmbFreight").data("kendoComboBox").value();
        obj.ShipmentModeId = $("#cmbModeOfShipment").data("kendoComboBox").value();
        obj.ShipmentTermId = $("#cmbShipmentTerm").data("kendoComboBox").value();
        obj.POLId = $("#cmbPort").data("kendoComboBox").value();
        obj.ExFactorDate = $("#txtExFactorDate").data("kendoDatePicker").value();
        obj.OnBoardDate = $("#txtOnBoardDate").data("kendoDatePicker").value();
        obj.AcceptanceDate = $("#txtAcceptanceDate").data("kendoDatePicker").value();
        obj.MaturityDate = $("#txtMaturityDate").data("kendoDatePicker").value();
        obj.Remarks = $("#txtRemarks").val();
        //obj.PIValue = IkrHelper.EmptyThenZero($("#txtInvoiceValue").data("kendoNumericTextBox").value());
        ////quantity obj.PIValue = IkrHelper.EmptyThenZero($("#txtInvoiceQuantity").data("kendoNumericTextBox").value());
        //obj.AdditionalCharges = IkrHelper.EmptyThenZero($("#txtAdditionalCharges").data("kendoNumericTextBox").value());
        //obj.Deduction = IkrHelper.EmptyThenZero($("#txtDeduction").data("kendoNumericTextBox").value());
        //obj.DiscountAmount = IkrHelper.EmptyThenZero($("#txtDiscount").data("kendoNumericTextBox").value());
        //obj.TotalAmount = IkrHelper.EmptyThenZero($("#txtTotalAmount").data("kendoNumericTextBox").value());


        //obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();
        //obj.BankId = $("#cmbBank").data("kendoComboBox").value();
        //obj.ProductCode = $("#txtProductCode").val();
        //obj.Packing = $("#txtPacking").val();
        //obj.ShipmentMethod = $("#txtShipmentMethod").val();
        obj.CreatedBy = CurrentUser.USERID;


        obj.ComExportInvoiceDetails = ExportInvoiceDetailsHelper.CreatePoWiseStyleBreakDownObject();
        return obj;
    },
    CreatePoWiseStyleBreakDownObject: function () {
        var styleBreakDownList = [];
        var grid = $("#grdExportPOStyleBreakDown").data("kendoGrid");
        var gridData = grid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.ExportInvoiceDetailsId = detailsData.ExportInvoiceDetailsId;//AjaxManager.DefaultGuidId();
            obj.ExportInvoiceId = $("#hdnExInvoiceId").val();
            obj.PODetailsId = detailsData.POInfo.PodetailId;
            obj.StyleDeatilsId = detailsData.StyleInfo.StyleDetailId;
            obj.CountryId = detailsData.DestinationInfo.CountryId;
            obj.ItemQuantity = detailsData.ItemQty;
            obj.Address = detailsData.Address;
            obj.CreatedBy = CurrentUser.USERID;
            //create validation Function and check
            styleBreakDownList.push(obj);
        }
        return styleBreakDownList;
    },

    //FillStyleGrid: function (obj) {
    //    var styleGrid = $("#grdStyleSummary").data("kendoGrid");
    //    var poDetailsData = PIDetailsManager.GetPurchaseOrderDetails(obj.Poid);
    //    gbStyleList = poDetailsData.Result;
    //    var gridDataSource = new kendo.data.DataSource({
    //        data: gbStyleList,
    //        schema: {
    //            model: {
    //                fields: {
    //                    Edit: {
    //                        editable: false
    //                    }
    //                }
    //            }
    //        }
    //    });
    //    styleGrid.setDataSource(gridDataSource);
    //    POHistorySummaryHelper.LoadPOHistoryGrid(gbStyleList);
    //    PODetailsHelper.FillLeadTimeCombo(gbStyleList);

    //    $("#cmbLeadTime").data("kendoComboBox").value(obj.LeadTimeId);
    //},
    //FillLeadTimeCombo: function (poDetailsData) {
    //    for (var i = 0; i < poDetailsData.length; i++) {
    //        var obj = poDetailsData[i];
    //        var data = MerchantManager.GetAllLeadTime(obj.BuyerId, obj.BrandId, obj.DepartmentId);
    //        var leadTimeCombo = $("#cmbLeadTime").data("kendoComboBox");
    //        var leadTimeComboData = leadTimeCombo.dataSource.data();
    //        data.map(y => {
    //            var leadTime = leadTimeComboData.find(x => x.LeadTimeId === y.LeadTimeId);
    //            if (leadTime == null || typeof leadTime === "undefined") leadTimeComboData.push(y);
    //        });
    //        leadTimeCombo.setDataSource(leadTimeComboData);
    //    }
    //},

    //ClearPIDetailsForm: function () {
    //    gbColorSizeList = [];
    //    gbTotalQuantity = 0;
    //    gbStyleList = [];
    //    $("#hdnPOId").val(AjaxManager.DefaultGuidId());
    //    $("#txtPINo").val("");
    //    $("#txtFRTAllocation").val("");
    //    $("#txtDropofLocation").val("");
    //    $("#cmbParentPO").data("kendoComboBox").value("");
    //    $("#txtExMillDate").data("kendoDatePicker").value("");
    //    $("#cmbShipmentMode").data("kendoComboBox").value("");
    //    $("#txtPIDate").data("kendoDatePicker").value("");
    //    //$("#txtCuttoffDate").data("kendoDatePicker").value("");
    //    $("#txtOrderQty").data("kendoNumericTextBox").value("");
    //    $("#txtUnitPrice").data("kendoNumericTextBox").value("");
    //    $("#txtTotalValue").data("kendoNumericTextBox").value("");
    //    $("#cmbCountry").data("kendoComboBox").value("");
    //    $("#cmbLeadTime").data("kendoComboBox").value("");
    //    $("#grdStyleSummary").data("kendoGrid").dataSource.data([]);
    //    $("#grdColorSizeSummary").data("kendoGrid").dataSource.data([]);
    //    $("#grdPOHistorySummary").data("kendoGrid").dataSource.data([]);

    //},
    ValidateForm: function () {
        var res = true;
        var scLcId = $("#cmbSCLC").data("kendoComboBox");
        if (scLcId.value() === "" || scLcId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbSCLC", "error", "right", 1500, "Required");
            res = false;
        }
        var invoiceNo = $("#txtInvoiceNo").val();
        if (invoiceNo === "" || invoiceNo === undefined) {
            AjaxManager.NotifyMsg("txtInvoiceNo", "error", "right", 1500, "Required");
            res = false;
        }
        var goodvalue = $("#txtGoodsValue").data("kendoNumericTextBox").value();
        if (goodvalue === "" || goodvalue === undefined || goodvalue === null) {
            AjaxManager.NotifyMsg("txtGoodsValue", "error", "right", 1500, "Required");
            res = false;
        }
        var unit = $("#cmbUnit").data("kendoComboBox");
        if (unit.value() === "" || unit.value() === undefined) {
            AjaxManager.NotifyMsg("cmbUnit", "error", "right", 1500, "Required");
            res = false;
        }
        var modeOfShipment = $("#cmbModeOfShipment").data("kendoComboBox");
        if (modeOfShipment.value() === "" || modeOfShipment.value() === undefined) {
            AjaxManager.NotifyMsg("cmbModeOfShipment", "error", "right", 1500, "Required");
            res = false;
        }
        var shipmentTerm = $("#cmbShipmentTerm").data("kendoComboBox");
        if (shipmentTerm.value() === "" || shipmentTerm.value() === undefined) {
            AjaxManager.NotifyMsg("cmbShipmentTerm", "error", "right", 1500, "Required");
            res = false;
        }
        var port = $("#cmbPort").data("kendoComboBox");
        if (port.value() === "" || port.value() === undefined) {
            AjaxManager.NotifyMsg("cmbPort", "error", "right", 1500, "Required");
            res = false;
        }
        var freight = $("#cmbFreight").data("kendoComboBox");
        if (freight.value() === "" || freight.value() === undefined) {
            AjaxManager.NotifyMsg("cmbFreight", "error", "right", 1500, "Required");
            res = false;
        }

        var exchangeRate = $("#txtExchangeRate").val();
        if (exchangeRate === "" || exchangeRate === undefined || exchangeRate === null) {
            AjaxManager.NotifyMsg("txtExchangeRate", "error", "right", 1500, "Required");
            res = false;
        }

        //var CurrencyId = $("#cmbCurrency").data("kendoComboBox");
        //if (CurrencyId.value() === "" || CurrencyId.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbCurrency", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //var BankId = $("#cmbBank").data("kendoComboBox");
        //if (BankId.value() === "" || BankId.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbBank", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //var BuyerId = $("#cmbBuyer").data("kendoComboBox");
        //if (BuyerId.value() === "" || BuyerId.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbBuyer", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //var ShipmentTermId = $("#cmbShipmentTerm").data("kendoComboBox");
        //if (ShipmentTermId.value() === "" || ShipmentTermId.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbShipmentTerm", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //var ShipmentModeId = $("#cmbShipmentMode").data("kendoComboBox");
        //if (ShipmentModeId.value() === "" || ShipmentModeId.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbShipmentMode", "error", "right", 1500, "Required");
        //    res = false;
        //}

        //var exMillDate = $("#txtExMillDate").data("kendoDatePicker");
        //if (exMillDate.value() === "" || exMillDate.value() === undefined || exMillDate.value() === null) {
        //    AjaxManager.NotifyMsg("txtExMillDate", "error", "top", 1500, "Required");
        //    res = false;
        //}

        //var piDate = $("#txtPIDate").data("kendoDatePicker");
        //if (piDate.value() === "" || piDate.value() === undefined || piDate.value() === null) {
        //    AjaxManager.NotifyMsg("txtPIDate", "error", "top", 1500, "Required");
        //    res = false;
        //}
        ////var cuttOffDate = $("#txtCuttoffDate").data("kendoDatePicker");
        ////if (cuttOffDate.value() === "" || cuttOffDate.value() === undefined || cuttOffDate.value() === null) {
        ////    AjaxManager.NotifyMsg("txtCuttoffDate", "error", "top", 1500, "Required");
        ////    res = false;
        ////}

        //var statusId = $("#cmbPOType").data("kendoComboBox").value();
        //if (statusId === "3fa85f64-5717-4562-b3fc-2c963f66afa6" || statusId === "53f78b22-ba53-4add-bed4-9768ebbcfb6b") {
        //    var poNo = $("#txtPONo").val();
        //    if (poNo === "" || poNo === undefined || poNo === null) {
        //        AjaxManager.NotifyMsg("txtPONo", "error", "top", 1500, "Required");
        //        res = false;
        //    }
        //}

        return res;
    }
};