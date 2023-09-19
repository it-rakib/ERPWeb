var POWiseStyleBreakDownManager = {
    GetPOByBuyerId: function (buyerId) {
        var po = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetPOByBuyerId/" + buyerId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            po = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return po;
    },
    GetStyleByPOId: function (poId) {
        var style = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/PurchaseOrders/GetPOColorSizeBreakDown/" + poId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            style = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return style;
    },
    POInfoDropDownEditor: function (container, options) {
        var buyerId = $("#cmbBuyer").data("kendoComboBox").value();
        if (buyerId != "") {
            var data = POWiseStyleBreakDownManager.GetPOByBuyerId(buyerId);
            $('<input id="poDropDown"  data-text-field="Pono" data-value-field="PodetailId" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoComboBox({
                    autoBind: false,
                    dataSource: data,
                    index: 0,
                    placeholder: "--Select PO--"
                });
            //var dropdownlist = $("#poDropDown").data("kendoComboBox");
            //dropdownlist.list.width("auto");
        }
    },
    StyleInfoDropDownEditor: function (container, options) {
        //debugger;
        var poId = options.model.POInfo.Poid;
        if (poId != "") {
            var data = POWiseStyleBreakDownManager.GetStyleByPOId(poId);
            var distinct = data.filter((v, i, a) => a.indexOf(v) === i);

            $('<input id="styleDropDown"  data-text-field="StyleNo" data-value-field="StyleDetailId" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                //.kendoDropDownList({
                .kendoComboBox({
                    autoBind: false,
                    dataSource: distinct,
                    index: 0,
                    placeholder: "--Select Style--"
                });
            
        }
    },
    CountryDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllCountry();
        $('<input id="countryDropDown" required data-text-field="CountryName" data-value-field="CountryId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                autoBind: false,
                dataSource: data,
                index: 0,
                placeholder: "--Select Destination--"
            });
        var dropdownlist = $("#countryDropDown").data("kendoComboBox");
        dropdownlist.list.width("auto");
    },
};

var POWiseStyleBreakDownHelper = {
    InitPOWiseStyleBreakDown: function () {
        POWiseStyleBreakDownHelper.GeneratePOWiseStyleBreakDownGrid();
    },
    GeneratePOWiseStyleBreakDownGrid: function () {
        $("#grdExportPOStyleBreakDown").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: POWiseStyleBreakDownHelper.SetPoWiseStyleBreakDownData([]),
            filterable: false,
            sortable: false,
            editable: {
                createAt: "bottom"
            },
            //aggregate: [
            //    { field: "ItemQty", aggregate: "sum" }
            //],
            navigatable: true,
            toolbar: "<button class='k-button' onclick='POWiseStyleBreakDownHelper.AddRowInPOStyle()'><i class='glyphicon glyphicon-plus'></i> Add New</button>",
            columns: [
                //{ field: "PIProductDetailsId", hidden: true, width: 12 },
                //{ field: "PIId", hidden: true, width: 12 },
                { field: "ExportInvoiceDetailsId", hidden: true, width: 12 },
                { field: "POInfo", title: "PO Number", width: 12, editor: POWiseStyleBreakDownManager.POInfoDropDownEditor, template: "#=POInfo.Pono#"},
                { field: "StyleInfo", title: "Style", width: 12, editor: POWiseStyleBreakDownManager.StyleInfoDropDownEditor, template: "#=StyleInfo.StyleNo#" },
               // { field: "ItemQty", title: "Item Qty", sortable: true, width: 12, footerTemplate: "Total Quantity : <span id='TotalQty'>#: sum # </span>" },
                { field: "ItemQty", title: "Item Qty", sortable: true, width: 12, footerTemplate: "Total Quantity : <span id='TotalQty'></span>" },
                { field: "DestinationInfo", title: "Destination", width: 12, editor: POWiseStyleBreakDownManager.CountryDropDownEditor, template: "#=DestinationInfo.CountryName#"},
                { field: "Address", title: "Address", width: 12, },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", /*click: POWiseStyleBreakDownHelper.ClickEventForEditButton*/
                //    }], width: 20, title: "&nbsp;"
                //}
            ],
            editable: true,
            selectable: "row",
           
            //dataBound: function (e) {
            //    //debugger;
            //    //console.log("e", e);
            //    //if (gbBookingList.length > 0) {
            //    //    this.element.find(".k-grid-add").hide();
            //    //}
            //},

        });
        
    },
    AddRowInPOStyle: function () {
        //debugger;
        var grid = $("#grdExportPOStyleBreakDown").data("kendoGrid");
        grid.addRow();
    },
    SetPoWiseStyleBreakDownData: function (data) {
        var gridData = new kendo.data.DataSource({
            data: data,
            aggregate: [{ field: "ItemQty", aggregate: "sum" }],
            schema: {
                model: {
                    fields: {
                        ExportInvoiceDetailsId: {
                            defaultValue: AjaxManager.DefaultGuidId()
                        },
                        StyleInfo: {
                            defaultValue: { StyleDetailId: AjaxManager.DefaultGuidId(), StyleNo: "" },
                        },
                        POInfo: {
                            defaultValue: { PodetailId: AjaxManager.DefaultGuidId(), Pono: "" },
                        },
                        DestinationInfo: {
                            defaultValue: { CountryId: AjaxManager.DefaultGuidId(), CountryName: "" },
                            validation: { required: true}
                        },
                        ItemQty: {
                            defaultValue: 0, type: "number"
                        },
                    }
                }
            },
            change: function (e) {
                if (e.field === "ItemQty") {
                   // debugger;
                    var gridData = $("#grdExportPOStyleBreakDown").data("kendoGrid").dataSource.data();
                    var total = 0;

                    for (var i = 0; i < gridData.length; i++) {
                        total += gridData[i].ItemQty
                    }
                    $('#txtInvoiceQuantity').data('kendoNumericTextBox').value(total);
                    $('#TotalQty').text(total);
                }

            },
        });
        return gridData;
    },
    //ClickEventForEditButton: function (e) {
    //    e.preventDefault();
    //    var grid = $("#grdExportPOStyleBreakDown").data("kendoGrid");
    //    var tr = $(e.currentTarget).closest("tr");
    //    var selectedItem = this.dataItem(tr);
    //    grid.select(tr);
    //    if (selectedItem != null) {
    //        //$("#divExportInvoiceDetails").show();
    //        //$("#divExportInvoiceSummary").hide();
    //        //PIDetailsHelper.FillPIDetailsForm(selectedItem);
    //    }
    //},

};