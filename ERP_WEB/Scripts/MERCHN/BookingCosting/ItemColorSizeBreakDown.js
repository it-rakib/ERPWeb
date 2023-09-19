
var ColorSizeBreakDownSummaryManager = {
    GetItemSizeBreakDownGridData: function (fabTrimsId, consumption, rate, excessPercent) {
        var objSizeBrkDwn = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BOM/GetItemWisePOSizeColorBreakdown/" + fabTrimsId + "/" + consumption + "/" + rate + "/" + excessPercent;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objSizeBrkDwn = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objSizeBrkDwn;
    }
};

var ColorSizeBreakDownSummaryHelper = {
    InitColorSizeBreakDown: function () {
    },
    detailInit: function (e) {
        $("<div id='gridSizeBrkDown'/>").appendTo(e.detailCell).kendoGrid({
            dataSource: ColorSizeBreakDownSummaryHelper.LoadSizeBreakDownData(e.data),
            scrollable: false,
            sortable: false,
            pageable: false,
            noRecords: true,
            editable: true,
            edit: function (e) {
                if (e.model.BomItemStatusId === 'f08d8d7f-7e56-4aeb-bf2d-52ff1055b9d6') {
                    this.closeCell();
                }
            },
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "GmtColorName", title: "Gmt Color", width: 20 },
                { field: "GmtSizeName", title: "Gmt Size", width: 20 },
                { field: "ItemColor", title: "Item Color", width: 20, editor: ColorSizeBreakDownSummaryHelper.ItemColorDropDownEditor, template: "#=ItemColor.ColorName#" },
                { field: "ItemSize", title: "Item Size", width: 20, editor: ColorSizeBreakDownSummaryHelper.ItemSizeDropDownEditor, template: "#=ItemSize.SizeName#" },
               // { field: "Consumption", title: "Consumption", width: 20 },
                { field: "GmtQty", title: "Gmt. Qty", width: 20, aggregates: ["sum"], footerTemplate: "Total : #=kendo.toString(sum, '0.0000')#" },
               // { field: "ExcessPercent", title: "Excess (%)", width: 20 },
                { field: "ItemQty", title: "Item Qty", width: 20, aggregates: ["sum"], footerTemplate: "Total : #=kendo.toString(sum, '0')#" },
                { field: "Rate", title: "Rate", width: 20, editor: ColorSizeBreakDownSummaryHelper.RateNumericTextBoxEditor, aggregates: ["average"], footerTemplate: "Avg. Rate : #=kendo.toString(average, '0.0000')#" },
                { field: "Value", title: "Value", width: 20, aggregates: ["sum"], footerTemplate: "Total : #=kendo.toString(sum, '0.0000')#" }
            ],
            dataBound: function (e) {
                var gridId = e.sender.element[0].id;
                var masterGrid = $("#grdItemSummary").data("kendoGrid");
                var detailRows = masterGrid.element.find(".k-detail-row");

                for (var i = 0; i < detailRows.length; i++) {
                    var detailGrid = $(detailRows[i]).find(".k-grid").data("kendoGrid");
                    var data=detailGrid.dataSource.view();
                }
                //var rows = e.sender.content.find('tr');
                //var itemColorIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ItemColor" + "]").index();
                //var itemSizeIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ItemSize" + "]").index();
                //var rateIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Rate" + "]").index();
             
                //rows.each(function (index, row) {
                //    var dataItem = e.sender.dataItem(row);
                //    var tableHeadRow = $("#gridSizeBrkDown thead tr");
                //    if (!dataItem.name) {
                //        tableHeadRow.find('th:eq(' + itemColorIndex + ')').addClass('editable');
                //        tableHeadRow.find('th:eq(' + itemSizeIndex + ')').addClass('editable');
                //        tableHeadRow.find('th:eq(' + rateIndex + ')').addClass('editable');
                    
                //        $(row).children('td:eq(' + itemColorIndex + ')').addClass('editable-cell');
                //        $(row).children('td:eq(' + itemSizeIndex + ')').addClass('editable-cell');
                //        $(row).children('td:eq(' + rateIndex + ')').addClass('editable-cell');

                //    } else {
                //        tableHeadRow.find('th:eq(' + itemColorIndex + ')').addClass('non-editable');
                //        tableHeadRow.find('th:eq(' + itemSizeIndex + ')').addClass('non-editable');
                //        tableHeadRow.find('th:eq(' + rateIndex + ')').addClass('non-editable');
                //    }
                //});
            },

        });
    },
    RateNumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0
         });
    },
    LoadSizeBreakDownData: function (obj) {
        var szBrkDwndata = ColorSizeBreakDownSummaryManager.GetItemSizeBreakDownGridData(obj.BuyerCostingFabTrimsId, obj.Consumption, obj.Rate, obj.ExcessPercent);
        var itemObj = szBrkDwndata[0];
        if (itemObj == null || typeof itemObj === "undefined") {
            $("#lblMessage").html("There is No PO For those Item...").attr("style", "line-height: 20px; color: red; font-weight: bold; font-size: 18px !important;");
        }
        else {
            szBrkDwndata.map(x => x.ItemColor = {
                ColorId: x.ItemColor.ColorId === "" ? AjaxManager.DefaultGuidId() : x.ItemColor.ColorId,
                ColorName: x.ItemColor.ColorName === "" ? "--Select--" : x.ItemColor.ColorName
            });
            szBrkDwndata.map(x => x.ItemSize = {
                SizeId: x.ItemSize.SizeId === "" ? AjaxManager.DefaultGuidId() : x.ItemSize.SizeId,
                SizeName: x.ItemSize.SizeName === "" ? "--Select--" : x.ItemSize.SizeName
            });
        }
        var dataSource = ColorSizeBreakDownSummaryHelper.GenerateSubGridDataSource(szBrkDwndata);
        return dataSource;
    },
    GenerateSubGridDataSource: function (szBrkDwndata) {
        var gridDataSource = new kendo.data.DataSource({
            data: szBrkDwndata,
            change: ColorSizeBreakDownSummaryHelper.ChangeItemColorBrkDown,
            aggregate: [{ field: "Rate", aggregate: "average" }, { field: "ItemQty", aggregate: "sum" }, { field: "Value", aggregate: "sum" }, { field: "GmtQty", aggregate: "sum" }],
            schema: {
                model: {
                    BuyerCostingFabTrimsId: "BuyerCostingFabTrimsId",
                    fields: {
                        GmtColorName: { editable: false },
                        GmtSizeName: { editable: false },
                        ItemColorName: { editable: false },
                        ItemSizeName: { editable: false },
                        GmtQty: { editable: false },
                        Consumption: { editable: false, type: "number" },
                        ExcessPercent: { editable: true, type: "number" },
                        ItemQty: { editable: false, type: "number" },
                        Rate: { editable: true, type: "number" },
                        Value: { editable: false },
                        ItemColor: {
                            defaultValue: { ColorId: AjaxManager.DefaultGuidId(), ColorName: "---Select---" }
                        },
                        ItemSize: {
                            defaultValue: { SizeId: AjaxManager.DefaultGuidId(), SizeName: "---Select---" }
                        }
                    }
                }
            }
        });
        return gridDataSource;
    },
    ChangeItemColorBrkDown: function (e) {
        var detailRows = $("#grdItemSummary").data("kendoGrid").element.find(".k-detail-row");
        if (e.action === "itemchange") {
            if (e.field === "Consumption" || e.field === "ExcessPercent" || e.field === "Rate") {
                e.items[0].ItemQty = (kendo.parseFloat(e.items[0].Consumption) + (kendo.parseFloat(e.items[0].Consumption) * kendo.parseFloat(e.items[0].ExcessPercent)) / 100) * kendo.parseFloat(e.items[0].GmtQty);
                e.items[0].Value = (e.items[0].ItemQty * kendo.parseFloat(e.items[0].Rate)).toFixed(4);
                for (var i = 0; i < detailRows.length; i++) {
                    $(detailRows[i]).find(".k-grid").data("kendoGrid").refresh();
                }
            }
        }
    },
    ItemColorDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllColor();
        var obj = new Object();
        obj.ColorName = "---Select---";
        obj.ColorId = AjaxManager.DefaultGuidId();
        data.unshift(obj);
        $('<input data-text-field="ColorName" data-value-field="ColorId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    },
    ItemSizeDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllSize();
        $('<input data-text-field="SizeName" data-value-field="SizeId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                // placeholder: "--Select--",
                index: 0
            });
    },


};