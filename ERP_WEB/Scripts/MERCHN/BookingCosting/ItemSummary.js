
var selectedIndex = null;
var fabricItemIndex = null;

var ItemSummaryManager = {
    GetItemGridData: function (styleDetailId) {
        debugger
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
    }
};

var ItemSummaryHelper = {
    InitItemSummary: function () {        
        ItemSummaryHelper.GenerateItemGrid();
        $('#expand').click(function (e) {
            debugger;
            var grid = $("#grdItemSummary").data("kendoGrid");
            $(".k-master-row").each(function(index) {
                grid.expandRow(this);
            });
        });

        $('#collapse').click(function (e) {
            debugger;
            var grid = $("#grdItemSummary").data("kendoGrid");
            $(".k-master-row").each(function(index) {
                grid.collapseRow(this);
            });
        });
    },
    GenerateItemGrid: function () {
        $("#grdItemSummary").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            edit: function (e) {
                if (e.model.BOMItemStatusId1 === 'f08d8d7f-7e56-4aeb-bf2d-52ff1055b9d6') {
                    this.closeCell();
                }
            },
            detailTemplate: 'Item Size Breakdown: <div class="gridColorSize"></div>',
            detailInit: ColorSizeBreakDownSummaryHelper.detailInit,
            columns: [
                { field: "BuyerCostingFabTrimsId", hidden: true, width: 12 },
                { field: "StyleDetailId", hidden: true, width: 12 },
                { field: "ItemId", hidden: true, width: 12 },
               // { field: "StyleNo", title: "Style No", width: 12 },
                { field: "ItemName", title: "Item Name", width: 12 },
                { field: "ItemRef", title: "Item Ref.", width: 16 },
                { field: "ItemDesc", title: "Item Desc", width: 16 },
                { field: "FabricCompositionId", hidden: true },
                { field: "CompositionName", title: "Composition Name", width: 16 },
                { field: "UOMId", hidden: true, width: 10 },
                { field: "UOMName", title: "Unit", width: 12 },
                { field: "Consumption1", title: "Consumption1", width: 12, hidden: true },
                { field: "ExcessPercent1", title: "ExcessPercent1", width: 10, hidden: true },
                { field: "Rate1", title: "Rate1", width: 12, hidden: true },
                { field: "Consumption", title: "Consumption", width: 10, editor: ItemSummaryHelper.ConsumptionNumericTextBoxEditor },
                { field: "ExcessPercent", title: "Excess (%)", width: 10, editor: ItemSummaryHelper.ConsumptionNumericTextBoxEditor },
                { field: "Rate", title: "Avg. Rate", width: 8, editor: ItemSummaryHelper.RateNumericTextBoxEditor },
                { field: "RequiredQty", title: "Req. Qty", width: 8, editor: ItemSummaryHelper.RequiredQtyTextBoxEditor },
                { field: "TotalValue", title: "Total Value", width: 10, editor: ItemSummaryHelper.TotalValueTextBoxEditor },
                { field: "Year", title: "Year", width: 8 },
                { field: "SeasonName", title: "Season", width: 10 },
                { field: "CurrencyCode", title: "Currency", width: 10 },
                { field: "Supplier", title: "Supplier", width: 24, editor: ItemSummaryHelper.SupplierDropDownEditor, template: $("#supplierTemplate").html() },
                { field: "MaterialSource", title: "MaterialSource", width: 14, editor: ItemSummaryHelper.MaterialSourceDropDownEditor, template: "#=MaterialSource.MaterialSourceName#" },
                { field: "BOMItemStatus", title: "Status", width: 15, editor: ItemSummaryHelper.BomItemStatusDropDownEditor, template: "#=BOMItemStatus.StatusName#" }
            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                // this.expandRow(this.tbody.find("tr.k-master-row")[0]);
                //    //if (selectedIndex != null) {
                //    //    this.expandRow(this.tbody.find("tr.k-master-row")[selectedIndex]);
                //    //}

                var rows = e.sender.content.find('tr');
                var consumptionIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Consumption" + "]").index();
                var excessPercentIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ExcessPercent" + "]").index();
                var rateIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Rate" + "]").index();
                var requiredQty = e.sender.wrapper.find(".k-grid-header [data-field=" + "RequiredQty" + "]").index();
                var totalValue = e.sender.wrapper.find(".k-grid-header [data-field=" + "TotalValue" + "]").index();
                var statusIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "BOMItemStatus" + "]").index();
                var supplierIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "Supplier" + "]").index();
                var materialSourceIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "MaterialSource" + "]").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdItemSummary thead tr");
                    if (!dataItem.name) {

                        tableHeadRow.find('th:eq(' + excessPercentIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + consumptionIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + rateIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + requiredQty + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + totalValue + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + statusIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + supplierIndex + ')').addClass('editable');
                        tableHeadRow.find('th:eq(' + materialSourceIndex + ')').addClass('editable');

                        $(row).children('td:eq(' + excessPercentIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + consumptionIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + rateIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + requiredQty + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + totalValue + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + statusIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + supplierIndex + ')').addClass('editable-cell');
                        $(row).children('td:eq(' + materialSourceIndex + ')').addClass('editable-cell');

                    } else {
                        //$(row).children('td:eq(' + bookingPercentIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + excessPercentIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + consumptionIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + rateIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + requiredQty + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + totalValue + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + statusIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + supplierIndex + ')').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + materialSourceIndex + ')').addClass('non-editable');
                    }
                });
            },
            change: function () {
                var row = this.select();
                //if (row.length && row.find('[aria-expanded="true"]').length) {
                //    this.collapseRow(row);
                //}
                //else {
                //    this.expandRow(row);
                //}
                this.expandRow(row);
            }
        });
    },
    ConsumptionNumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0
         });
    },
    ExcessPercentTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0
         });
    },
    RequiredQtyTextBoxEditor: function (container, options) {
        $('<input id="txtReqQTy" name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0,
             spinners: false
         });
        var numerictextbox = $("#txtReqQTy").data("kendoNumericTextBox");
        numerictextbox.readonly();
    },
    TotalValueTextBoxEditor: function (container, options) {
        $('<input id="txtTotalVal" name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0,
             spinners: false
         });
        var numerictextbox = $("#txtTotalVal").data("kendoNumericTextBox");
        numerictextbox.readonly();
    },
    RateTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
         .appendTo(container)
         .kendoNumericTextBox({
             format: "n4",
             decimals: 4,
             min: 0
         });
    },
    LoadItemGrid: function (styleDetailId) {
        var itemGrid = $("#grdItemSummary").data("kendoGrid");
        var itemGridData = ItemSummaryManager.GetItemGridData(styleDetailId);
        if (itemGridData != null) {
            itemGridData.map(x=> x.MaterialSource = {
                MaterialSourceId: x.MaterialSource.MaterialSourceId == null ? AjaxManager.DefaultGuidId() : x.MaterialSource.MaterialSourceId,
                MaterialSourceName: x.MaterialSource.MaterialSourceName == null ? "--Select--" : x.MaterialSource.MaterialSourceName
            });
            itemGridData.map(x=> x.BOMItemStatus = {
                StatusId: x.BOMItemStatus.StatusId == null ? "D56A8357-AF68-4CEB-AB20-9665A79BFA1E" : x.BOMItemStatus.StatusId,
                StatusName: x.BOMItemStatus.StatusName == null ? "Initial" : x.BOMItemStatus.StatusName
            });
        }
        //itemGridData.map(x=> { x["Consumption1"] = x.Consumption; });
        //itemGridData.map(x=> { x["ExcessPercent1"] = x.ExcessPercent; });
        //itemGridData.map(x=> { x["Rate1"] = x.Rate; });

        var gridDataSource = new kendo.data.DataSource({
            data: itemGridData,
            schema: {
                model: {
                    fields: {
                        StyleNo: { editable: false },
                        ItemName: { editable: false },
                        ItemRef: { editable: false },
                        ItemDesc: { editable: false },
                        CompositionName: { editable: false },
                        UOMName: { editable: false },
                        //RequiredQty: { editable: false },
                        Year: { editable: false },
                        CurrencyCode: { editable: false },
                        SeasonName: { editable: false },
                        // TotalValue: { editable: false },
                        Edit: { editable: false },
                        Consumption: { editable: true, type: "number" },
                        Rate: { editable: true, type: "number" },
                        ExcessPercent: { editable: true, type: "number" },
                        MaterialSource: {
                            defaultValue: { MaterialSourceId: AjaxManager.DefaultGuidId(), MaterialSourceName: "---Select---" }
                        },
                        Supplier: {
                            defaultValue: { SupplierId: AjaxManager.DefaultGuidId(), SupplierName: "---Select---" }
                        },
                        BOMItemStatus: {
                            defaultValue: { StatusId: AjaxManager.DefaultGuidId(), StatusName: "---Select---" }
                        }
                    }
                }
            }
        });
        itemGrid.setDataSource(gridDataSource);
        // Parent Grid Cell Value Change
        itemGrid.dataSource.bind("change", function (e) {
            ItemSummaryHelper.ParentGridChangeEvent(e);
        });

        //$(".k-master-row").each(function (index) {
        //    itemGrid.expandRow(this);
        //});

    },
    ParentGridChangeEvent: function (e) {
        e.preventDefault();
        if (e.action === "itemchange") {
            var obj = e.items[0];
            if (e.field === "Consumption" || e.field === "ExcessPercent" || e.field === "Rate") {
                if (obj.Consumption > obj.Consumption1) {
                    e.items[0].Consumption = obj.Consumption1;
                    return;
                }
                if (obj.ExcessPercent > obj.ExcessPercent1) {
                    e.items[0].ExcessPercent = obj.ExcessPercent1;
                    return;
                }
                if (obj.Rate > obj.Rate1) {
                    e.items[0].Rate = obj.Rate1;
                    return;
                }

                var itemGrid = $("#grdItemSummary").data("kendoGrid");

                e.items[0].RequiredQty = (kendo.parseFloat(obj.Consumption) + (kendo.parseFloat(obj.Consumption) * kendo.parseFloat(obj.ExcessPercent) / 100)).toFixed(4);
                e.items[0].TotalValue = (kendo.parseFloat(obj.RequiredQty) * kendo.parseFloat(obj.Rate)).toFixed(4);

                var requiredQty = (kendo.parseFloat(obj.Consumption) + (kendo.parseFloat(obj.Consumption) * kendo.parseFloat(obj.ExcessPercent) / 100)).toFixed(4);
                var totalValue = (kendo.parseFloat(requiredQty) * kendo.parseFloat(obj.Rate)).toFixed(4);

                var reqQty = kendo.parseFloat(requiredQty);
                var tval = kendo.parseFloat(totalValue);

                var selectedItem = itemGrid.dataItem(itemGrid.select());
                selectedIndex = itemGrid.dataSource.indexOf(selectedItem);

                selectedItem.set('RequiredQty', reqQty);
                selectedItem.set('TotalValue', tval);

                ItemSummaryHelper.CalculateChildGridData(itemGrid, obj);

                // itemGrid.refresh();
                // itemGrid.expandRow(itemGrid.tbody.find("tr.k-master-row")[selectedIndex]);
            }
        }
    },
    CalculateChildGridData: function (itemGrid, obj) {
        var szBrkDwndata = ColorSizeBreakDownSummaryManager.GetItemSizeBreakDownGridData(obj.BuyerCostingFabTrimsId, obj.Consumption, obj.Rate, obj.ExcessPercent);
        var detailRows = $("#grdItemSummary").data("kendoGrid").element.find(".k-detail-row");
        for (var j = 0; j < detailRows.length; j++) {
            var detailGrid = $(detailRows[j]).find(".k-grid").data("kendoGrid");
            var sizeBrkDwn = detailGrid.dataSource.view();
            if (sizeBrkDwn.length > 0 && sizeBrkDwn[0].BuyerCostingFabTrimsId === obj.BuyerCostingFabTrimsId) {//check child data length
                var newList = [];
                for (var k = 0; k < sizeBrkDwn.length; k++) {
                    var szBrkDwnObj = szBrkDwndata[k];
                    var szBrkDwnFromDb = szBrkDwndata.find(x=>x.GmtColorId === szBrkDwnObj.GmtColorId && x.GmtSizeId === szBrkDwnObj.GmtSizeId);
                    if (szBrkDwnFromDb != null && typeof szBrkDwnFromDb !== "undefined") {
                        szBrkDwnObj.ExcessPercent = szBrkDwnFromDb.ExcessPercent;
                        szBrkDwnObj.Consumption = szBrkDwnFromDb.Consumption;
                        szBrkDwnObj.ItemQty = szBrkDwnFromDb.ItemQty;
                        szBrkDwnObj.Rate = szBrkDwnFromDb.Rate;
                        szBrkDwnObj.Value = szBrkDwnFromDb.Value;
                        newList.push(szBrkDwnObj);
                    }
                }
                var subGridData = ColorSizeBreakDownSummaryHelper.GenerateSubGridDataSource(newList);
                detailGrid.setDataSource(subGridData);
                detailGrid.refresh();
            }
        }
    },
    SupplierDropDownEditor: function (container, options) {
        var itemId = options.model.ItemId;
        var data = MerchantManager.GetSupplierByItemId(itemId);
        $('<input data-text-field="SupplierName" data-value-field="SupplierId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoMultiSelect({
                // autoBind: false,
                dataTextField: "SupplierName",
                dataValueField: "SupplierId",
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    },
    MaterialSourceDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllMaterialSource();
        $('<input data-text-field="MaterialSourceName" data-value-field="MaterialSourceId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    },
    BomItemStatusDropDownEditor: function (container, options) {
        var data = MerchantManager.GetStatuses(3);
        $('<input id="cmbBomStatus" data-text-field="StatusName" data-value-field="StatusId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                placeholder: "--Select--",
                index: 0
            });
    },
};