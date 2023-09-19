var PIProductInfoManager = {

    GetItemGridData: function (styleDetailId) {
        var objItemList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetFabTrimInfoByStyleDetailId/" + styleDetailId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objItemList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objItemList;
    },
    StyleInfoDropDownEditor: function (container, options) {

        var data = MerchantManager.GetAllStyleDropdown();
        var obj = new Object();
        obj.StyleNo = "--Select Style--";
        obj.StyleId = AjaxManager.DefaultGuidId();
        data.unshift(obj);
        $('<input id="styleDropDown"  data-text-field="StyleNo" data-value-field="StyleId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                index: 0,
            });
        var dropdownlist = $("#styleDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
    SizeInfoDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllSize();
        var obj = new Object();
        obj.SizeName = "--Select Size--";
        obj.SizeId = AjaxManager.DefaultGuidId();
        data.unshift(obj);
        $('<input id="SizeDropDown"  data-text-field="SizeName" data-value-field="SizeId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                index: 0,
            });
        var dropdownlist = $("#SizeDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
    ColorInfoDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllColor();
        var obj = new Object();
        obj.ColorName = "--Select Color--";
        obj.ColorId = AjaxManager.DefaultGuidId();
        data.unshift(obj);
        $('<input id="colorDropDown"  data-text-field="ColorName" data-value-field="ColorId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                index: 0,
            });
        var dropdownlist = $("#colorDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
    ItemInfoDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllMerchItem();
        var obj = new Object();
        obj.ItemName = "--Select Item--";
        obj.ItemId = AjaxManager.DefaultGuidId();
        data.unshift(obj);
        $('<input id="itemDropDown" data-text-field="ItemName" data-value-field="ItemId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                index: 0
            });
        var dropdownlist = $("#itemDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
    UnitInfoDropDownEditor: function (container, options) {
        var data = MerchantManager.GetUoM();
        var obj = new Object();
        obj.UOMName = "--Select Unit--";
        obj.UOMId = AjaxManager.DefaultGuidId();
        data.unshift(obj);
        $('<input id="uOMDropDown"  data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: data,
                dataValueField: "UOMId",
                dataTextField: "UOMName",
                index: 0
            });
        var dropdownlist = $("#uOMDropDown").data("kendoDropDownList");
        dropdownlist.list.width("auto");
    },
};

var PIProductInfoHelper = {
    InitPIProductInfoSummary: function () {
        PIProductInfoHelper.GenerateBookingDeatilsGrid();
       // PIProductInfoHelper.CalculationTotalInvoiceValue();
        
        //$('#expand').click(function (e) {
        //    var grid = $("#grdItemSummary").data("kendoGrid");
        //    $(".k-master-row").each(function (index) {
        //        grid.expandRow(this);
        //    });
        //});

        //$('#collapse').click(function (e) {
        //    var grid = $("#grdItemSummary").data("kendoGrid");
        //    $(".k-master-row").each(function (index) {
        //        grid.collapseRow(this);
        //    });
        //});
    },
    
    

    GenerateBookingDeatilsGrid: function () {
        $("#grdBookingDetailsSummary").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: PIDetailsHelper.SetBookingDetailsSummarySchema([]),
            filterable: false,
            sortable: false,
            editable: {
                createAt: "bottom"
            },
            navigatable: true,
            //toolbar: ["create"],
           
            columns: [
                { field: "PIProductDetailsId", hidden: true, width: 12 },
                { field: "PIId", hidden: true, width: 12 },
                { field: "BookingDetailId", hidden: true, width: 12 },
                { field: "StyleDetailsId", hidden: true, width: 12 },
                { field: "BookingId", hidden: true, width: 12 },
                { field: "StyleInfo", title: "Style Name", editable: isEditable, width: 8, editor: PIProductInfoManager.StyleInfoDropDownEditor, template: "#=StyleInfo.StyleNo#" },
                { field: "ItemInfo", title: "Item Name", editable: isEditable, width: 8, editor: PIProductInfoManager.ItemInfoDropDownEditor, template: "#=ItemInfo.ItemName#" },
                { field: "ColorInfo", title: "Color Name", editable: isEditable, width: 8, editor: PIProductInfoManager.ColorInfoDropDownEditor, template: "#=ColorInfo.ColorName#" },
                { field: "SizeInfo", title: "Size Name", editable: isEditable, width: 8, editor: PIProductInfoManager.SizeInfoDropDownEditor, template: "#=SizeInfo.SizeName#" },
                { field: "Consumtion", title: "Consumtion / Discription", width: 16 },
                { field: "HSCode", title: "HSCode", width: 8},
                { field: "OrderQty", title: "Booking /PO Qty", editable: isEditable,  width: 8, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor  },
                { field: "ItemQty", title: "ItemQty", hidden: true, width: 12, width: 8, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor },
                { field: "UnitInfo", title: "Unit", width: 8, editable: isEditable, editor: PIProductInfoManager.UnitInfoDropDownEditor, template: "#=UnitInfo.UOMName#" },
                { field: "BookingValue", hidden: true },
                { field: "UnitPrice", title: "Unit Price", editable: isEditable, width: 8, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor, },
                { field: "ItemAmount", title: "ItemAmount", width: 8, editable: isEditable, format: "{0:n0}", decimals: 3, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor },
                //{ field: "ServiceChargeRate", title: "Service Charge Rate", width: 8, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor },
                { field: "Weight", title: "Weight", width: 8, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor  },
                { field: "Length", title: "Length", width: 8, editor: PIProductInfoHelper.ConsumptionNumericTextBoxEditor  },
                { field: "Shade", title: "Shade", width: 8 },
                { field: "Count", title: "Count", width: 8 },
                { field: "CuttableWidth", title: "Cuttable Width", width: 8 },
                { field: "Tex", title: "Tex", width: 8 },
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                
                //debugger;
                //console.log("e", e);
                //if (gbBookingList.length > 0) {
                //    this.element.find(".k-grid-add").hide();
                //}
            },
        });
        function isEditable(e) {
            //debugger;
            var dataSource = $("#grdBookingDetailsSummary").data("kendoGrid").dataSource;
            var defaultValue = "00000000-0000-0000-0000-000000000000";
            //If the id(ProductID) is null, then it is editable.
            //if (e.ColorInfo.ColorId == defaultValue )
            //    return e.ColorInfo.ColorId;
            //if (e.ItemInfo.ItemId === defaultValue)
            //    return e.ItemInfo.ItemId;
            //if (e.UnitInfo.UOMId === defaultValue)
            //    return e.UnitInfo.UOMId;
            
            if (e.BookingDetailId === defaultValue)
                return e.BookingDetailId;

        }
    },
    CalculationTotalInvoiceValue: function () {
        var totalInvoiceValue = 0;
        var totalInvoiceQuantity = 0;
        var gridData = $("#grdBookingDetailsSummary").data("kendoGrid").dataSource.data();
        //debugger;
        if(gridData.length > 0)
        {
            for (var i = 0; i < gridData.length; i++) {
                totalInvoiceValue += gridData[i].ItemQty * gridData[i].UnitPrice;
                gridData[i].set("ItemAmount", gridData[i].ItemQty * gridData[i].UnitPrice);

                totalInvoiceQuantity += gridData[i].ItemQty;
            }
        }
        $("#txtInvoiceQuantity").data("kendoNumericTextBox").value(totalInvoiceQuantity);
        $("#txtInvoiceValue").data("kendoNumericTextBox").value(totalInvoiceValue);
        $('#txtTotalAmount').data('kendoNumericTextBox').value(totalInvoiceValue);

        PIProductInfoHelper.CalulateTotalAmount();
        
    },
    CalulateTotalAmount: function () {
       // debugger;
        var invoicevalue = parseFloat($('#txtInvoiceValue').data('kendoNumericTextBox').value());
        var additionalCharge = parseFloat($('#txtAdditionalCharges').data('kendoNumericTextBox').value());
        var deduction = parseFloat($('#txtDeduction').data('kendoNumericTextBox').value());
        var discount = parseFloat($('#txtDiscount').data('kendoNumericTextBox').value());

        var totalValue = (UtilityHelper.IsNaN(invoicevalue) + UtilityHelper.IsNaN(additionalCharge)) - UtilityHelper.IsNaN(deduction);
        var discount = (UtilityHelper.IsNaN(discount) * UtilityHelper.IsNaN(totalValue)) / 100;
        var totalAmount = (UtilityHelper.IsNaN(invoicevalue) + UtilityHelper.IsNaN(additionalCharge)) - (UtilityHelper.IsNaN(deduction) + UtilityHelper.IsNaN(discount));

        $('#txtTotalAmount').data('kendoNumericTextBox').value(totalAmount);
    },

    ConsumptionNumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                format: "n4",
                decimals: 2,
               // min: 0
            });


    },
};
