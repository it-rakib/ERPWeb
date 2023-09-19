//var gbBookingId = [];
var gbBookingList = [];
var gdProductDeatils = [];

var PIDetailsManager = {
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
    GetPendingPIBookingList: function () {
        var pendingPIBooking = "";
        var jsonParam = "";
        debugger;
        var serviceUrl = _baseUrl + "/api/MerchBookings/GetAllPendingPIBookingList";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            pendingPIBooking = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }        
        return pendingPIBooking;
    },

    GetBookingByBookingId: function (bookingId) {
        var booking = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/MerchBookings/GetBookingByBookingId/" + bookingId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            booking = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return booking;
    },

    GetSelectedBookingDetails: function (bookingId) {
        var selectedBookingDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/MerchBookings/GetBookingDetailsListByBookingId/" + bookingId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            selectedBookingDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return selectedBookingDetail;
    },
    SavePIInfo: function () {
       debugger;
        if (PIDetailsHelper.ValidateForm()) {
            var createPICommands = PIDetailsHelper.CreatePIInfoObject();
            var jsonParam = JSON.stringify(createPICommands);
            var serviceUrl = _baseUrl + "/api/ProformaInvoice/CreatePI";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            var msg = jsonData.Message;
            if (jsonData.Success) {
                $("#divPIDetails").hide();
                $("#divPISummary").show();

                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#hdnPIId").val(jsonData.createPIDto.Piid);
                            $("#txtPINo").val(jsonData.createPIDto.Pino);
                            $("#grdPISummary").data("kendoGrid").dataSource.read();
                        }
                    }]);

            }

            else {
                
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            debugger;
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
    GetPIproductDeatils: function (piId) {
        var piProductDetail = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/ProformaInvoice/GetPIProductListByPIId/" + piId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            piProductDetail = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return piProductDetail;
    },
    DeleteProductDetails: function (piProductDetailsId) {
        deletePIProductDetails = new Object();
        deletePIProductDetails.PiproductDetailsId = piProductDetailsId;
        deletePIProductDetails.DeleteBy = CurrentUser.USERID;
        var jsonParam = JSON.stringify(deletePIProductDetails);
        var serviceUrl = _baseUrl + "/api/ProformaInvoice/DeletePIProductDetails";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            var msg = jsonData.Message;
            if (jsonData.Success) {
                console.log(msg);
            }

            else {
                console.log(msg);
            }
        }
        function onFailed(error) {
            console.log(error);
        }
    }
};

var PIDetailsHelper = {
    InitPIDetails: function () {
        $("#piInfo").kendoPanelBar({
            expandMode: "multiple",
            expanded: true
        });

        PIDetailsHelper.GenerateGrid();
        PIDetailsHelper.GenerateDatePicker();
        PIDetailsHelper.GenerateNumericTextBox();
        PIDetailsHelper.GenerateMultiColumnComboBox("cboPendingBooking");

        MerchantHelper.LoadTenuresCombo("cmbTenure");
        MerchantHelper.LoadSupplierCombo("cmbSupplier");
        MerchantHelper.LoadBuyerCombo("cmbBuyer");
        MerchantHelper.LoadBankCombo("cmbBank");
        MerchantHelper.GenerateCurrencyCombo("cmbCurrency");
        MerchantHelper.LoadConsigneeCombo("cmbConsignee");
        MerchantHelper.LoadPaymentTermCombo("cmbPaymentTerm");
        MerchantHelper.LoadCountryCombo("cmbOriginCountry");
        MerchantHelper.LoadCountryCombo("cmbDestinationCountry");
        MerchantHelper.LoadPortCombo("cmbOriginPort");
        MerchantHelper.LoadPortCombo("cmbDestinationPort");

        MerchantHelper.LoadUoMCombo("cmbUOM");
        MerchantHelper.LoadShipmentTermsCombo("cmbShipmentTerm");

        MerchantHelper.GenerateStyleMultiColumnComboBox("cboStyle");
        PIDetailsHelper.GenerateShipmentModeCombo("cmbShipmentMode");
        MerchantHelper.GenerateColorCombo("cmbColor");
        MerchantHelper.GenerateSizeCombo("cmbSize");

        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode === 13) {
                PIDetailsHelper.LoadPendignPIGrid();
            }
        });
        $("#btnSearchPendingBooking").click(function () {
            PIDetailsHelper.LoadPendignPIGrid();

        });
        $("#btnAddBooking").click(function () {
            PIDetailsHelper.AddToList();
            PIDetailsHelper.BookingChangeEventFillForm();
            PIProductInfoHelper.CalculationTotalInvoiceValue();
        });
        $("#btnAddNewPI").click(function () {
            PIDetailsHelper.ResetForm();
            $("#divPIDetails").show();
            $("#divPISummary").hide();
        });
        $("#btnBack").click(function () {
            $("#divPIDetails").hide();
            $("#divPISummary").show();
        });
        $("#btnSavePIInfo").click(function () {
            PIDetailsManager.SavePIInfo();
        });

        $("#cmbPaymentTerm").change(function () {
            var currentValue = $("#cmbPaymentTerm").data("kendoComboBox").value();
            if (currentValue === "5bb21d9c-0869-45d7-999e-ae8231799cf5") {
                $("#cmbTenure").data("kendoComboBox").select(0);
                $("#cmbTenure").data("kendoComboBox").enable(false);
            }
            else {
                $("#cmbTenure").data("kendoComboBox").enable(true);
            }
        });
    },


    GenerateGrid() {
        $("#grdPendingBookingSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            //noRecords: {
            //    template: "<label>NO DATA FOUND</label>"
            //},
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "BookingId", hidden: true },
                { field: "BookingNo", title: "Booking No", width: 40, sortable: true },
                { field: "ItemName", title: "Item", width: 40, sortable: true },
                { field: "StyleNo", title: "Style No", width: 40, sortable: true },
                {
                    field: "Action", title: "Action", filterable: false, width: 60, command: [{
                        name: "delete", text: "Remove", iconClass: "k-icon k-i-delete", className: "k-danger", click: PIDetailsHelper.ClickEventForDeleteButton
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: false
        });

    },
    GenerateMultiColumnComboBox: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "BookingNo",
            dataValueField: "BookingId",
            columns: [
                { field: "BookingNo", title: "Booking No", width: 200, sortable: true },
                { field: "StyleNo", title: "Style No", width: 200, sortable: true },
                //{ field: "ItemName", title: "Item", width: 200, sortable: true },
            ],
            filter: "startswith",
            filterFields: ["BookingNo","StyleNo","ItemName"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "---Select Pending Booking ---",
            height: 400

        });
    },
    LoadPendignPIGrid: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = PIDetailsManager.GetPendingPIBookingList();
            data.unshift(UtilityUnShift.GetUnshiftPendingbookingSearch());
            var cboPendingBooking = $("#cboPendingBooking").data("kendoMultiColumnComboBox");
            cboPendingBooking.value("");
            cboPendingBooking.setDataSource(data);
            cboPendingBooking.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search style!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },

    BookingChangeEventFillForm: function () {
        debugger;
        var bookingData = $("#cboPendingBooking").data("kendoMultiColumnComboBox").dataItem();
        if (bookingData == "" || bookingData == null) {
            AjaxManager.NotifyMsg("cboPendingBooking", "error", "right", 1500, "Select Booking")
        }

        //gbBookingId.push(bookingData.BookingId);

        var bookingDeatils = PIDetailsManager.GetSelectedBookingDetails(bookingData.BookingId);
        $("#cmbSupplier").data("kendoComboBox").value(bookingData.SupplierId);
        $("#cmbBuyer").data("kendoComboBox").value(bookingData.BuyerId);
        $("#cmbOriginCountry").data("kendoComboBox").value(bookingData.OriginCountryId);

        PIDetailsHelper.CreateObjProductListData(bookingDeatils);

        var gridData = PIDetailsHelper.SetBookingDetailsSummarySchema(gdProductDeatils);
        var grid = $("#grdBookingDetailsSummary").data("kendoGrid");
        grid.setDataSource(gridData);

    },
    CreateObjProductListData: function (bookingDeatils) {
        for (var i = 0; i < bookingDeatils.length; i++) {
            var obj = new Object();
            obj.BookingDetailId = bookingDeatils[i].BookingDetailId;
            obj.BookingId = bookingDeatils[i].BookingId;
            obj.StyleDetailsId = bookingDeatils[i].StyleDetailsId;
            obj.BookingValue = bookingDeatils[i].BookingValue;
            obj.OrderQty = bookingDeatils[i].OrderQty;
            obj.SizeInfo = { SizeId: bookingDeatils[i].SizeInfo.SizeId, SizeName: bookingDeatils[i].SizeInfo.SizeName };
            obj.ColorInfo = { ColorId: bookingDeatils[i].ColorInfo.ColorId, ColorName: bookingDeatils[i].ColorInfo.ColorName };
            obj.ItemInfo = { ItemId: bookingDeatils[i].ItemInfo.ItemId, ItemName: bookingDeatils[i].ItemInfo.ItemName };
            obj.StyleInfo = { StyleId: bookingDeatils[i].StyleInfo.StyleId, StyleNo: bookingDeatils[i].StyleInfo.StyleNo };
            obj.UnitInfo = { UOMId: bookingDeatils[i].UnitInfo.UOMId, UOMName: bookingDeatils[i].UnitInfo.UOMName };
            obj.UnitPrice = bookingDeatils[i].BookingValue;
            obj.ItemQty = bookingDeatils[i].OrderQty;
            obj.ItemAmount = bookingDeatils[i].OrderQty * bookingDeatils[i].BookingValue;
            obj.PIId = AjaxManager.DefaultGuidId();
            obj.PIProductDetailsId = AjaxManager.DefaultGuidId();
            gdProductDeatils.push(obj);
        }
    },
    SetBookingDetailsSummarySchema: function (data) {
        var gridData = new kendo.data.DataSource({
            data: data,
            schema: {
                model: {
                    fields: {
                        BookingDetailId: {
                            defaultValue: AjaxManager.DefaultGuidId()
                        },
                        PIProductDetailsId: {
                            defaultValue: AjaxManager.DefaultGuidId()
                        },
                        ColorInfo: {
                            defaultValue: { ColorId: AjaxManager.DefaultGuidId(), ColorName: "--Select Color--" }
                        },
                        StyleInfo: {
                            defaultValue: { StyleId: AjaxManager.DefaultGuidId(), StyleNo: "--Select Style--" }
                        },
                        SizeInfo: {
                            defaultValue: { SizeId: AjaxManager.DefaultGuidId(), SizeName: "--Select Size--" }
                        },
                        ItemInfo: {
                            defaultValue: { ItemId: AjaxManager.DefaultGuidId(), ItemName: "--Select Item--" }
                        },
                        UnitInfo: {
                            defaultValue: { UOMId: AjaxManager.DefaultGuidId(), UOMName: "--Select Unit--" }
                        },
                        ItemQty: {
                            defaultValue: 0
                        },
                        UnitPrice: {
                            defaultValue: 0
                        },
                        ItemAmount: {
                            defaultValue: 0
                        },
                        OrderQty: {
                            defaultValue: 0
                        },
                        Weight: {
                            defaultValue: 0
                        },
                        Length: {
                            defaultValue: 0
                        },
                    }
                }
            },
            change: function (e) {
                e.preventDefault();
                if (e.action === "itemchange") {
                    var obj = e.items[0];

                    if (e.field === "UnitPrice" || e.field === "ItemQty") {
                        PIProductInfoHelper.CalculationTotalInvoiceValue();

                        //item ItemQty undefine 
                        //e.items[0].UnitPrice = kendo.parseFloat(obj.UnitPrice);
                        //e.items[0].ItemQty = kendo.parseFloat(obj.ItemQty);
                        //e.items[0].ItemAmount = kendo.parseFloat(e.items[0].UnitPrice * e.items[0].ItemQty);
                    }
                }
            }
        });
        return gridData;
    },
    FillPIDetailsForm: function (obj) {
        $("#hdnPIId").val(obj.PIId);
        $("#txtPINo").val(obj.PINo);
        $("#hdnBookingId").val(obj.BookingId);
        $("#txtReferenceNo").val(obj.ReferenceNo);
        $("#txtProductCode").val(obj.ProductCode);
        $("#txtShipmentMethod").val(obj.ShipmentMethod);
        $("#txtPacking").val(obj.Packing);
        $("#txtTermsCondition").val(obj.TermsAndConditions);
        $("#txtRemarks").val(obj.Remarks);

        $("#txtPIDate").data("kendoDatePicker").value(obj.PIDate);
        $("#txtShipmentDate").data("kendoDatePicker").value(obj.ShipmentDate);
        $("#txtPIValidDate").data("kendoDatePicker").value(obj.PIValidityDate);
        $("#txtDeliveryDate").data("kendoDatePicker").value(obj.ETD);
        $("#txtETA").data("kendoDatePicker").value(obj.ETA);

        $("#txtExchangeRate").data("kendoNumericTextBox").value(obj.ExchangeRate);
        $("#txtInvoiceValue").data("kendoNumericTextBox").value(obj.PIValue);
       // $("#txtInvoiceQuantity").data("kendoNumericTextBox").value(obj.PIValue);
        $("#txtAdditionalCharges").data("kendoNumericTextBox").value(obj.AdditionalCharges);
        $("#txtDeduction").data("kendoNumericTextBox").value(obj.Deduction);
        $("#txtDiscount").data("kendoNumericTextBox").value(obj.DiscountAmount);
        $("#txtTotalAmount").data("kendoNumericTextBox").value(obj.TotalAmount);
        $("#txtNettWeight").data("kendoNumericTextBox").value(obj.NettWeight);
        $("#txtGrossWeight").data("kendoNumericTextBox").value(obj.GrossWeight);
        $("#txtTolerance").data("kendoNumericTextBox").value(obj.Tolerance);

        $("#cmbSupplier").data("kendoComboBox").value(obj.SupplierId);
        $("#cmbConsignee").data("kendoComboBox").value(obj.ConsigneeId);
        $("#cmbPaymentTerm").data("kendoComboBox").value(obj.PaymentTermId);
        $("#cmbTenure").data("kendoComboBox").value(obj.TenureId);
        $("#cmbOriginCountry").data("kendoComboBox").value(obj.OriginCountryId);
        $("#cmbOriginPort").data("kendoComboBox").value(obj.POLId);
        $("#cmbDestinationCountry").data("kendoComboBox").value(obj.DestinationCountryId);
        $("#cmbDestinationPort").data("kendoComboBox").value(obj.DestinationPortId);
        $("#cmbCurrency").data("kendoComboBox").value(obj.CurrencyId);
        $("#cmbShipmentMode").data("kendoComboBox").value(obj.ShipmentModeId);
        $("#cmbShipmentTerm").data("kendoComboBox").value(obj.ShipmentTermId);
        $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);
        $("#cmbBank").data("kendoComboBox").value(obj.BankId);

        var piProductDetails = PIDetailsManager.GetPIproductDeatils(obj.PIId);
        PIDetailsHelper.CreateObjProductListWithPIData(piProductDetails);

        var piProductGrid = $("#grdBookingDetailsSummary").data("kendoGrid");

        var dataSource = PIDetailsHelper.SetBookingDetailsSummarySchema(gdProductDeatils);
        piProductGrid.setDataSource(dataSource);

        var distinctBookingId = gdProductDeatils.map(item => item.BookingId)
            .filter((value, index, self) => self.indexOf(value) === index);

        //var dataList = [];
        for (var i = 0; i < distinctBookingId.length; i++) {
            if (distinctBookingId[i] != "00000000-0000-0000-0000-000000000000") {
                var data = PIDetailsManager.GetBookingByBookingId(distinctBookingId[i]);
                //dataList.push(data);
                gbBookingList.push(data);
            }
        }


        var grid = $("#grdPendingBookingSummary").data("kendoGrid");
        //var gridData = PIDetailsHelper.SetBookingDetailsSummarySchema(dataList);
        var gridData = PIDetailsHelper.SetBookingDetailsSummarySchema(gbBookingList);
        grid.setDataSource(gridData);
       // PIDetailsHelper.CreateObjProductListData(piProductDetails);
        PIProductInfoHelper.CalculationTotalInvoiceValue();

    },
    CreateObjProductListWithPIData: function (piDetails) {
        for (var i = 0; i < piDetails.length; i++) {
            var obj = new Object();
            obj.PIId = piDetails[i].PIId;
            obj.PIProductDetailsId = piDetails[i].PIProductDetailsId;
            obj.BookingDetailId = piDetails[i].BookingDetailId;
            obj.StyleDetailsId = piDetails[i].StyleDetailsId;
            obj.BookingId = piDetails[i].BookingId;
            obj.BookingValue = piDetails[i].BookingValue;
            obj.OrderQty = piDetails[i].OrderQty;
            obj.SizeInfo = { SizeId: piDetails[i].SizeInfo.SizeId, SizeName: piDetails[i].SizeInfo.SizeName };
            obj.ColorInfo = { ColorId: piDetails[i].ColorInfo.ColorId, ColorName: piDetails[i].ColorInfo.ColorName };
            obj.ItemInfo = { ItemId: piDetails[i].ItemInfo.ItemId, ItemName: piDetails[i].ItemInfo.ItemName };
            obj.StyleInfo = { StyleId: piDetails[i].StyleInfo.StyleId, StyleNo: piDetails[i].StyleInfo.StyleNo };
            obj.UnitInfo = { UOMId: piDetails[i].UnitInfo.UOMId, UOMName: piDetails[i].UnitInfo.UOMName };
            obj.UnitPrice = piDetails[i].UnitPrice;
            obj.ItemQty = piDetails[i].OrderQty;
            //obj.ItemAmount = piDetails[i].OrderQty * piDetails[i].UnitPrice;
            obj.Consumtion = piDetails[i].Consumtion,
            obj.HSCode = piDetails[i].HSCode,
            ////obj.OrderQty = piDetails[i].BookingQuantity,
            obj.ItemQty = piDetails[i].ItemQty,
           // obj.UnitPrice = piDetails[i].UnitPrice,
            obj.ItemAmount = piDetails[i].ItemAmount,
            obj.Weight = piDetails[i].Weight,
            obj.Length = piDetails[i].Length,
            obj.Shade = piDetails[i].Shade,
            obj.Count = piDetails[i].Count,
            obj.CuttableWidth = piDetails[i].CuttableWidth,
            obj.Tex = piDetails[i].Tex,
            gdProductDeatils.push(obj);
        }
    },
    ResetForm() {
        $("#hdnPIId").val(AjaxManager.DefaultGuidId());

        $("#hdnBookingId").val(AjaxManager.DefaultGuidId());
        $("#txtPINo").val("");
        $("#txtReferenceNo").val("");
        $("#txtProductCode").val("");
        $("#txtShipmentMethod").val("");
        $("#txtPacking").val("");
        $("#txtTermsCondition").val("");
        $("#txtRemarks").val("");
        $("#txtSearchKey").val("");

        //$("#txtETA").data("kendoDatePicker").value("");

        $("#txtPIDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtDeliveryDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtShipmentDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtPIValidDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtETA").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });

        $("#txtExchangeRate").data("kendoNumericTextBox").value("");
        $("#txtInvoiceValue").data("kendoNumericTextBox").value("");
        $("#txtInvoiceQuantity").data("kendoNumericTextBox").value("");
        $("#txtAdditionalCharges").data("kendoNumericTextBox").value("");
        $("#txtDeduction").data("kendoNumericTextBox").value("");
        $("#txtDiscount").data("kendoNumericTextBox").value("");
        $("#txtTotalAmount").data("kendoNumericTextBox").value("");
        $("#txtNettWeight").data("kendoNumericTextBox").value("");
        $("#txtGrossWeight").data("kendoNumericTextBox").value("");
        $("#txtTolerance").data("kendoNumericTextBox").value("");


        $("#cmbSupplier").data("kendoComboBox").value("");
        $("#cmbConsignee").data("kendoComboBox").value("");
        $("#cmbPaymentTerm").data("kendoComboBox").value("");
        $("#cmbTenure").data("kendoComboBox").value("");
        $("#cmbOriginCountry").data("kendoComboBox").value("");
        $("#cmbOriginPort").data("kendoComboBox").value("");
        $("#cmbDestinationCountry").data("kendoComboBox").value("");
        $("#cmbDestinationPort").data("kendoComboBox").value("");
        //$("#cmbCurrency").data("kendoComboBox").value("");
        $("#cmbShipmentMode").data("kendoComboBox").value("");
        $("#cmbShipmentTerm").data("kendoComboBox").value("");
        $("#cmbBuyer").data("kendoComboBox").value("");
        $("#cmbBank").data("kendoComboBox").value("");

        $("#grdBookingDetailsSummary").data("kendoGrid").dataSource.data([]);
        $("#cboPendingBooking").data("kendoMultiColumnComboBox").value("");
        $("#grdPendingBookingSummary").data("kendoGrid").dataSource.data([]);
        gbBookingList = [];
        gdProductDeatils = [];
        $("#btnSavePIInfo").text(" Save");
        $("#btnSavePIInfo").addClass("fa fa-save");

       // gbBookingId = [];
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdPendingBookingSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            for (var i = 0; i < gdProductDeatils.length; i++) {

                if (gdProductDeatils[i].BookingId == selectedItem.BookingId) {
                    if (gdProductDeatils[i].PIId != AjaxManager.DefaultGuidId()) {

                        PIDetailsManager.DeleteProductDetails(gdProductDeatils[i].PIProductDetailsId);
                    }
                    gdProductDeatils.splice(i, 1);
                    i--;
                }
            }

        }
        $('#grdBookingDetailsSummary').data('kendoGrid').setDataSource(gdProductDeatils);

        //PIDetailsHelper.SetBookingDetailsSummarySchema(gdProductDeatils);
        //$('#grdBookingDetailsSummary').data('kendoGrid').setDataSource(gdProductDeatils);
        ////PIProductInfoHelper.CalculationTotalInvoiceValue();

        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbBookingList.length; i++) {
                if (gbBookingList[i].BookingId == selectedItem.BookingId) {
                    gbBookingList.splice(i, 1);
                    $('#grdPendingBookingSummary').data('kendoGrid').setDataSource(gbBookingList);

                    break;
                }
            }
        }
        PIProductInfoHelper.CalculationTotalInvoiceValue();

        if (gbBookingList.length === 0) {
            $("#cmbSupplier").data("kendoComboBox").value("");
            $("#cmbBuyer").data("kendoComboBox").value("");
            $("#cmbOriginCountry").data("kendoComboBox").value("");
            PIDetailsHelper.ResetForm();
        }
    },

    GenerateDatePicker: function () {
        $("#txtPIDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtDeliveryDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtShipmentDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtPIValidDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        $("#txtETA").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
        //    $("#txtCuttoffDate").kendoDatePicker({ format: "dd-MMM-yyyy", value: new Date() });
    },
    GenerateNumericTextBox: function () {
        $("#txtOrderQty").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2,
            change: function () {

            }
        });
        $("#txtUnitPrice").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2 });
        $("#txtAmount").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2});
        $("#txtExchangeRate").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, default:0});
        $("#txtTotalAmount").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, default:0});
        $("#txtDiscount").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2,default:0,
            change: function () {
                PIProductInfoHelper.CalulateTotalAmount();
            }
        });
        $("#txtDeduction").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2,default:0,
            change: function () {
                PIProductInfoHelper.CalulateTotalAmount();
            }
        });
        $("#txtAdditionalCharges").kendoNumericTextBox({
            format: "n2", min: 0, decimals: 2,default:0,
            change: function () {
                PIProductInfoHelper.CalulateTotalAmount();
            }
        });
        $("#txtInvoiceValue").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, });
        $("#txtInvoiceQuantity").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, });
        $("#txtTolerance").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, });
        $("#txtNettWeight").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, });
        $("#txtGrossWeight").kendoNumericTextBox({ format: "n2", min: 0, decimals: 2, });
    },

    AddToList: function () {
        debugger;
        var pendingBookingCombo = $("#cboPendingBooking").data("kendoMultiColumnComboBox");
        var pendingBookingGrid = $("#grdPendingBookingSummary").data("kendoGrid");
        if (pendingBookingCombo.value() != "") {

            var pendingBookingComboData = pendingBookingCombo.dataItem();
            var pendingBookingGridData = pendingBookingGrid.dataSource.data();
            //console.log("pendingBookingComboData", pendingBookingComboData);
            //console.log("pendingBookingGridData", pendingBookingGridData);
            for (var i = 0; i < pendingBookingGridData.length; i++) {
                var booking = pendingBookingGridData[i];
                var bookingId = pendingBookingCombo.value();
                //must needed
                if (booking.SupplierId !== pendingBookingComboData.SupplierId) {
                    AjaxManager.NotifyMsg("cboPendingBooking", "error", "top", 2000, "Please Select Same Buyer,Supplier");
                    return;
                }
                if (booking.BookingId === bookingId) {
                    AjaxManager.NotifyMsg("cboPendingBooking", "error", "top", 1500, "This Booking Already Added");
                    return;
                }
            }
            var obj = new Object();
            obj.BookingId = pendingBookingCombo.value();
            obj.BookingNo = pendingBookingComboData.BookingNo;
            obj.ItemName = pendingBookingComboData.ItemName;
            obj.StyleNo = pendingBookingComboData.StyleNo;
            obj.SupplierId = pendingBookingComboData.SupplierId;
            obj.SupplierName = pendingBookingComboData.SupplierName;

            gbBookingList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: gbBookingList,
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
            pendingBookingGrid.setDataSource(gridDataSource);

        }
        else {
            if (pendingBookingCombo === "" || pendingBookingCombo === null) {
                AjaxManager.NotifyMsg("cboPendingBooking", "error", "bottom", 1500, "Required");
            }
        }
    },
    GenerateSupplierCombo: function (identity) {
        var objPoType = PIDetailsManager.GetAllSupplier();
        var obj = new Object();
        obj.StatusName = "---Select---";
        obj.StatusId = "0";
        objPoType.unshift(obj);
        $("#" + identity).kendoComboBox({
            placeholder: "---Select---",
            dataTextField: "SupplierName",
            dataValueField: "SupplierId",
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
        var objShipmentMode = PIDetailsManager.GetAllShipmentMode();
        var obj = new Object();
        obj.ModeName = "---Select---";
        obj.CmnShipmentModeId = "0";
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

    CreatePIInfoObject: function () {
        var obj = new Object();
        obj.PIId = $("#hdnPIId").val();
        /*obj.BookingId = $("#hdnBookingId").val();*/
        obj.PINo = $("#txtPINo").val();
        obj.PIDate = $("#txtPIDate").data("kendoDatePicker").value();
        obj.SupplierId = $("#cmbSupplier").data("kendoComboBox").value();
        obj.ConsigneeId = $("#cmbConsignee").data("kendoComboBox").value();
        obj.PaymentTermId = $("#cmbPaymentTerm").data("kendoComboBox").value();
        obj.TenureId = $("#cmbTenure").data("kendoComboBox").value();
        obj.ShipmentDate = $("#txtShipmentDate").data("kendoDatePicker").value();
        obj.OriginCountryId = $("#cmbOriginCountry").data("kendoComboBox").value();
        obj.POLId = $("#cmbOriginPort").data("kendoComboBox").value();
        obj.DestinationCountryId = $("#cmbDestinationCountry").data("kendoComboBox").value();
        obj.DestinationPortId = $("#cmbDestinationPort").data("kendoComboBox").value();
        obj.CurrencyId = $("#cmbCurrency").data("kendoComboBox").value();
        obj.ExchangeRate = IkrHelper.EmptyThenZero($("#txtExchangeRate").data("kendoNumericTextBox").value());
        obj.ShipmentModeId = $("#cmbShipmentMode").data("kendoComboBox").value();
        obj.ShipmentTermId = $("#cmbShipmentTerm").data("kendoComboBox").value();
        obj.PIValidityDate = $("#txtPIValidDate").data("kendoDatePicker").value();
        obj.ETD = $("#txtDeliveryDate").data("kendoDatePicker").value();
        obj.ReferenceNo = $("#txtReferenceNo").val();
        obj.ETA = $("#txtETA").data("kendoDatePicker").value();
        obj.Remarks = $("#txtRemarks").val();
        obj.TermsAndConditions = $("#txtTermsCondition").val();
        obj.PIValue = IkrHelper.EmptyThenZero($("#txtInvoiceValue").data("kendoNumericTextBox").value());
        //quantity obj.PIValue = IkrHelper.EmptyThenZero($("#txtInvoiceQuantity").data("kendoNumericTextBox").value());
        obj.AdditionalCharges = IkrHelper.EmptyThenZero($("#txtAdditionalCharges").data("kendoNumericTextBox").value());
        obj.Deduction = IkrHelper.EmptyThenZero($("#txtDeduction").data("kendoNumericTextBox").value());
        obj.DiscountAmount = IkrHelper.EmptyThenZero($("#txtDiscount").data("kendoNumericTextBox").value());
        obj.TotalAmount = IkrHelper.EmptyThenZero($("#txtTotalAmount").data("kendoNumericTextBox").value());
        obj.NettWeight = IkrHelper.EmptyThenZero($("#txtNettWeight").data("kendoNumericTextBox").value());
        obj.GrossWeight = IkrHelper.EmptyThenZero($("#txtGrossWeight").data("kendoNumericTextBox").value());
        obj.Tolerance = IkrHelper.EmptyThenZero($("#txtTolerance").data("kendoNumericTextBox").value());


        obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();
        obj.BankId = $("#cmbBank").data("kendoComboBox").value();
        obj.ProductCode = $("#txtProductCode").val();
        obj.Packing = $("#txtPacking").val();
        //obj.ShipmentMethod = $("#txtShipmentMethod").val();
        obj.CreatedBy = CurrentUser.USERID;


        //obj.UserId = CurrentUser.USERID;
        obj.PIProductDetails = PIDetailsHelper.CreatePIProductDetailsObject();
        return obj;
    },
    CreatePIProductDetailsObject: function () {
        var pIProductDetailsList = [];
        var pIProductGrid = $("#grdBookingDetailsSummary").data("kendoGrid");
        var gridData = pIProductGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.PIProductDetailsId = detailsData.PIProductDetailsId;//AjaxManager.DefaultGuidId();
            obj.PIId = $("#hdnPIId").val();
            obj.BookingId = detailsData.BookingId;
            //obj.BookingId =$("#hdnBookingId").val();
            //if (obj.BookingId === "") {
            //    obj.BookingId = AjaxManager.DefaultGuidId();
            //}
            obj.BookingDetailId = detailsData.BookingDetailId;
            obj.StyleDetailsId = detailsData.StyleDetailsId;
            //obj.StyleId = detailsData.StyleInfo.StyleId;
            obj.ItemId = detailsData.ItemInfo.ItemId;
            obj.ColorId = detailsData.ColorInfo.ColorId;
            obj.SizeId = detailsData.SizeInfo.SizeId == AjaxManager.DefaultGuidId() ? null : detailsData.SizeInfo.SizeId;
            obj.ProductDescription = detailsData.Consumtion;
            obj.HSCode = detailsData.HSCode;
            obj.BookingQuantity = detailsData.OrderQty;
            obj.ItemQuantity = detailsData.ItemQty;
            obj.UOMId = detailsData.UnitInfo.UOMId;
            obj.UnitPrice = detailsData.UnitPrice;
            obj.Amount = detailsData.ItemAmount;
            // obj.ServiceChargeRate = detailsData.ServiceChargeRate;
            obj.Weight = detailsData.Weight === undefined ? "0" : detailsData.Weight.toString();
            obj.Length = detailsData.Length === undefined ? "0" : detailsData.Length.toString();
            obj.Shade = detailsData.Shade;
            obj.Count = detailsData.Count;
            obj.CuttableWidth = detailsData.CuttableWidth;
            obj.Tex = detailsData.Tex;
            pIProductDetailsList.push(obj);
        }
        return pIProductDetailsList;
    },

    FillStyleGrid: function (obj) {
        var styleGrid = $("#grdStyleSummary").data("kendoGrid");
        var poDetailsData = PIDetailsManager.GetPurchaseOrderDetails(obj.Poid);
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
        styleGrid.setDataSource(gridDataSource);
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

    ClearPIDetailsForm: function () {
        gbColorSizeList = [];
        gbTotalQuantity = 0;
        gbStyleList = [];
        $("#hdnPOId").val(AjaxManager.DefaultGuidId());
        $("#txtPINo").val("");
        $("#txtFRTAllocation").val("");
        $("#txtDropofLocation").val("");
        $("#cmbParentPO").data("kendoComboBox").value("");
        $("#txtExMillDate").data("kendoDatePicker").value("");
        $("#cmbShipmentMode").data("kendoComboBox").value("");
        $("#txtPIDate").data("kendoDatePicker").value("");
        //$("#txtCuttoffDate").data("kendoDatePicker").value("");
        $("#txtOrderQty").data("kendoNumericTextBox").value("");
        $("#txtUnitPrice").data("kendoNumericTextBox").value("");
        $("#txtTotalValue").data("kendoNumericTextBox").value("");
        $("#cmbCountry").data("kendoComboBox").value("");
        $("#cmbLeadTime").data("kendoComboBox").value("");
        $("#grdStyleSummary").data("kendoGrid").dataSource.data([]);
        $("#grdColorSizeSummary").data("kendoGrid").dataSource.data([]);
        $("#grdPOHistorySummary").data("kendoGrid").dataSource.data([]);

    },
    ValidateForm: function () {
        debugger;
        var res = true;
        var piNO = $("#txtPINo").val();
        if (piNO === "" || piNO === null) {
            AjaxManager.NotifyMsg("txtPINo", "error", "right",1500, "Required")
        }
        var ConsigneeId = $("#cmbConsignee").data("kendoComboBox");
        if (ConsigneeId.value() === "" || ConsigneeId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbConsignee", "error", "right", 1500, "Required");
            res = false;
        }
        var PaymentTermId = $("#cmbPaymentTerm").data("kendoComboBox");
        if (PaymentTermId.value() === "" || PaymentTermId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbPaymentTerm", "error", "right", 1500, "Required");
            res = false;
        }
        var TenureId = $("#cmbTenure").data("kendoComboBox");
        if (PaymentTermId.value() !== "5bb21d9c-0869-45d7-999e-ae8231799cf5") {
            if (TenureId.value() === "" || TenureId.value() === undefined || TenureId.value() === AjaxManager.DefaultGuidId()) {
                AjaxManager.NotifyMsg("cmbTenure", "error", "right", 1500, "Required");
                res = false;
            }
        }
        var POLId = $("#cmbOriginPort").data("kendoComboBox");
        if (POLId.value() === "" || POLId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbOriginPort", "error", "right", 1500, "Required");
            res = false;
        }
        var DestinationCountryId = $("#cmbDestinationCountry").data("kendoComboBox");
        if (DestinationCountryId.value() === "" || DestinationCountryId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbDestinationCountry", "error", "right", 1500, "Required");
            res = false;
        }
        var DestinationPortId = $("#cmbDestinationPort").data("kendoComboBox");
        if (DestinationPortId.value() === "" || DestinationPortId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbDestinationPort", "error", "right", 1500, "Required");
            res = false;
        }

        var CurrencyId = $("#cmbCurrency").data("kendoComboBox");
        if (CurrencyId.value() === "" || CurrencyId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCurrency", "error", "right", 1500, "Required");
            res = false;
        }
        var BankId = $("#cmbBank").data("kendoComboBox");
        if (BankId.value() === "" || BankId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbBank", "error", "right", 1500, "Required");
            res = false;
        }
        var ShipmentTermId = $("#cmbShipmentTerm").data("kendoComboBox");
        if (ShipmentTermId.value() === "" || ShipmentTermId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbShipmentTerm", "error", "right", 1500, "Required");
            res = false;
        }
        var ShipmentModeId = $("#cmbShipmentMode").data("kendoComboBox");
        if (ShipmentModeId.value() === "" || ShipmentModeId.value() === undefined) {
            AjaxManager.NotifyMsg("cmbShipmentMode", "error", "right", 1500, "Required");
            res = false;
        }

        return res;
    }
};