var gbItemList = [];
var gbTotalValue = 0;

var ItemSummaryManager = {
    gridDataSource: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
            allowUnsort: false,
            // pageSize: 10,
            transport: {
                read: {
                    //url: _baseUrl + '',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json;",
                    cache: false,
                    async: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "styleId",
                    fields: {
                        styleId: { editable: false },
                        styleNo: { type: "string", validation: { required: true } },
                        ItemName: { editable: false },
                        ColorName: { editable: false },
                        CompositionName: { editable: false },
                        ItemRef: { editable: false },
                        ItemDesc: { editable: false },
                        UomName: { editable: false },
                        Consumption: { editable: true, type: "number", validation: { min: 0 } },
                        ExcessPercent: { editable: true ,type: "number", validation: { min: 0 } },
                        RequiredQty: { editable: true ,type: "number", validation: { min: 0 }},
                        Rate: { editable: true ,type: "number", validation: { min: 0 }},
                        TotalValue: { editable: false },
                    }
                },
                data: "items", total: "totalCount"
            }
        });

        return gridDataSource;
    },
    GetItemGridData: function (styleDetailId) {
        var objItemList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetBuyerCostingFabTrims/" + styleDetailId;
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
        $("#btnAddItem").click(function () {
            if ($("#btnAddItem").text() === "Add") {
                if (ItemSummaryHelper.ValidationItemForm()) {
                    ItemSummaryHelper.AddToList();
                }

            } else {
                if (ItemSummaryHelper.ValidationItemForm()) {
                    ItemSummaryHelper.UpdateList();
                }
            }
        });

        $("#btnClearItem").click(function () {
            ItemSummaryHelper.ClearItemForm();
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
            columns: [
                { field: "StyleDetailId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ItemName", title: "Item"},
                { field: "ColorId", hidden: true },
                { field: "ColorName", title: "Color"},
                { field: "FabricCompositionId", hidden: true},
                { field: "CompositionName", title: "Composition"},
                { field: "ItemRef", title: "Ref."},
                { field: "ItemDesc", title: "Desc."},
                { field: "UomId", hidden: true },
                { field: "UomName", title: "Unit"},
                { field: "Consumption", title: "Consumption"},
                { field: "ExcessPercent", title: "Excess (%)"},
                { field: "RequiredQty", title: "Req Qty"},
                { field: "Rate", title: "Rate"},
                { field: "TotalValue", title: "Total Value",footerTemplate: "Total : <span id='spnTotalValue'></span>" },
               

            ],
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {
                var rows = e.sender.content.find('tr');
                var dqIndex = e.sender.wrapper.find(".k-grid-header [data-field='Consumption']").index();
                var dpIndex = e.sender.wrapper.find(".k-grid-header [data-field='ExcessPercent']").index();
                var uIndex = e.sender.wrapper.find(".k-grid-header [data-field='RequiredQty']").index();
                var ujIndex = e.sender.wrapper.find(".k-grid-header [data-field='Rate']").index();
                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdItemSummary thead tr");

                    $(row).children('td:eq(' + dqIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + dpIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + uIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + ujIndex + ')').addClass('editable-cell');

                    if (!dataItem.ItemName) {
                        tableHeadRow.find('th:eq(' + dqIndex + ')').removeClass('non-editable').addClass('editable');
                        tableHeadRow.find('th:eq(' + dpIndex + ')').removeClass('non-editable').addClass('editable');
                        tableHeadRow.find('th:eq(' + uIndex + ')').removeClass('non-editable').addClass('editable');
                        tableHeadRow.find('th:eq(' + ujIndex + ')').removeClass('non-editable').addClass('editable');
                    } else {
                        tableHeadRow.find('th:eq(' + dqIndex + ')').removeClass('editable').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + dpIndex + ')').removeClass('editable').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + uIndex + ')').removeClass('editable').addClass('non-editable');
                        tableHeadRow.find('th:eq(' + ujIndex + ')').removeClass('editable').addClass('non-editable');
                    }
                });
            },
            dataBinding: function (e) {

            }

        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdItemSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            ItemSummaryHelper.FillItemInfoForEidt(selectedItem);
            BuyerCostingHelper.ChangeEventItemCombo();
        }


    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdItemSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbItemList.length; i++) {
                if (gbItemList[i].ItemId == selectedItem.ItemId) {
                    gbTotalValue = gbTotalValue - selectedItem.TotalValue;
                    gbItemList.splice(i, 1);
                    break;
                }
            }
        }
        BuyerCostingHelper.CalculateTotalFOB();
    },

    FillItemInfoForEidt: function (obj) {
        $("#btnAddItem").text("Update");
        $("#btnAddItem").addClass("fa fa-edit");

        //Item
        var itemData = MerchantManager.GetAllItem(obj.ItemId);
        var cboItem = $("#cmbItem").data("kendoMultiColumnComboBox");
        cboItem.value("");
        cboItem.setDataSource(itemData);
        $("#cmbItem").data("kendoMultiColumnComboBox").value(obj.ItemId);
        $("#txtItemDesc").val(obj.ItemDesc);
        $("#txtConsumption").data("kendoNumericTextBox").value(obj.Consumption);
        $("#cmbExcessPercent").data("kendoComboBox").value(obj.ExcessPercent);
        $("#txtTotalRequiredQty").data("kendoNumericTextBox").value(obj.RequiredQty);
        $("#txtRate").data("kendoNumericTextBox").value(obj.Rate);
        $("#txtTotalValue").data("kendoNumericTextBox").value(obj.TotalValue);
        $("#cmbUoM").data("kendoComboBox").value(obj.Uomid);
        $("#txtItemRef").val(obj.ItemRef);
        if (obj.ColorId !== AjaxManager.DefaultGuidId()) {
            $("#cmbColor").data("kendoComboBox").value(obj.ColorId);
        }
        if (obj.FabricCompositionId !== AjaxManager.DefaultGuidId()) {
            $("#cmbFabComposition").data("kendoComboBox").value(obj.FabricCompositionId);
        }

    },

    AddToList: function () {
        var costingId = AjaxManager.DefaultGuidId();
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var itemCombo = $("#cmbItem").data("kendoMultiColumnComboBox");
        var fabCompCombo = $("#cmbFabComposition").data("kendoComboBox");
        var fabCode = $("#txtItemRef").val();
        var itemDesc = $("#txtItemDesc").val();
        var uomCombo = $("#cmbUoM").data("kendoComboBox");
        var colorCombo = $("#cmbColor").data("kendoComboBox");
        var consumption = $("#txtConsumption").data("kendoNumericTextBox").value();
        var excessPercent = $("#cmbExcessPercent").data("kendoComboBox").value();
        var totalReqQty = IkrHelper.EmptyThenZero($("#txtTotalRequiredQty").data("kendoNumericTextBox").value());
        var rate = IkrHelper.EmptyThenZero($("#txtRate").data("kendoNumericTextBox").value());
        var totalValue = $("#txtTotalValue").data("kendoNumericTextBox").value();
        gbTotalValue += totalValue;

        var itemGrid = $("#grdItemSummary").data("kendoGrid");

        if (styleDCombo.value() !== "" && itemCombo.value() !== "" && totalValue > 0) {
            var gridData = itemGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var itemId = itemCombo.value();
                var fabCompId = UtilityHelper.EmptyThenDefaultGuidId(fabCompCombo.value());
                if (itm.ItemId === itemId && itm.FabricCompositionId === fabCompId && itemDesc === itm.ItemDesc && itm.Uomid === uomCombo.value()) {
                    AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "This Item Already Added");
                    return;
                }
            }
            var obj = new Object();
            obj.BuyerCostingFabTrimsId = costingId;
            obj.BuyerCostingId = UtilityHelper.EmptyThenDefaultGuidId($("#hdnBuyerCostingId").val());
            obj.ItemId = itemCombo.value();
            obj.ItemName = itemCombo.text();
            obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(colorCombo.value());
            obj.ColorName = colorCombo.text();
            obj.FabricCompositionId = UtilityHelper.EmptyThenDefaultGuidId(fabCompCombo.value());;
            obj.CompositionName = fabCompCombo.text();
            obj.ItemRef = fabCode;
            obj.ItemDesc = itemDesc;
            obj.Uomid = uomCombo.value();
            obj.UomName = uomCombo.text();
            obj.Consumption = consumption;
            obj.ExcessPercent = excessPercent;
            obj.RequiredQty = totalReqQty;
            obj.Rate = rate;
            obj.TotalValue = totalValue;

            gbItemList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: gbItemList,
                schema: {
                    model: {
                        fields: {
                            Consumption: {
                                type: "number",
                                editable: false
                            },

                            Edit: {
                                editable: false
                            }
                        }
                    }
                }
            });
            itemGrid.setDataSource(gridDataSource);
            BuyerCostingHelper.CalculateTotalFOB();


            //Item Grid Cell Change Event
            itemGrid.dataSource.bind("change", function (e) {
                debugger;
                if (e.action === "itemchange") {
                    var obj = e.items[0];
                    if (e.field === "Consumption") {
                        obj.RequiredQty = ((obj.Consumption + (obj.Consumption * obj.ExcessPercent) / 100)).toFixed(4);
                        obj.TotalValue = (obj.RequiredQty * obj.Rate).toFixed(2);
                    }
                    itemGrid.refresh();
                    BuyerCostingHelper.CalculateTotalValue();
                }
            });



        }
        else {
            if (itemCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "Required");
            }
            if (styleDCombo.value() === "") {
                AjaxManager.NotifyMsg("cboStyle", "error", "right", 1500, "Required");
            }

        }
    },

    UpdateList: function () {

        $("#btnAddItem").text("Add");
        $("#btnAddItem").addClass("fas fa-arrow-down");

        var grid = $("#grdItemSummary").data("kendoGrid");
        var selectedItem = grid.dataItem(grid.select());

        var costingId = AjaxManager.DefaultGuidId();
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var itemCombo = $("#cmbItem").data("kendoMultiColumnComboBox");
        var fabCompCombo = $("#cmbFabComposition").data("kendoComboBox");
        var colorCombo = $("#cmbColor").data("kendoComboBox");
        var fabCode = $("#txtItemRef").val();
        var itemDesc = $("#txtItemDesc").val();
        var uomCombo = $("#cmbUoM").data("kendoComboBox");
        var consumption = $("#txtConsumption").data("kendoNumericTextBox").value();
        var excessPercent = $("#cmbExcessPercent").data("kendoComboBox").value();
        var totalReqQty = $("#txtTotalRequiredQty").data("kendoNumericTextBox").value();
        var rate = $("#txtRate").data("kendoNumericTextBox").value();
        var totalValue = $("#txtTotalValue").data("kendoNumericTextBox").value();

        var itemGrid = $("#grdItemSummary").data("kendoGrid");
        if (styleDCombo.value() !== "" && itemCombo.value() !== "" && totalValue > 0) {
            var gridData = itemGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var itm = gridData[i];
                var itemId = itemCombo.value();
                if (parseInt(itm.ItemId) === parseInt(itemId) && itm.ItemId !== selectedItem.ItemId) {
                    AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "This Item Already Added");
                    return;
                }
            }
            var obj = new Object();
            obj.BuyerCostingFabTrimsId = costingId;
            obj.BuyerCostingId = $("#hdnBuyerCostingId").val();
            obj.ItemId = itemCombo.value();
            obj.ItemName = itemCombo.text();
            obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(colorCombo.value());
            obj.ColorName = colorCombo.text();
            obj.FabricCompositionId = UtilityHelper.EmptyThenDefaultGuidId(fabCompCombo.value());
            obj.ItemRef = fabCode;
            obj.CompositionName = fabCompCombo.text();
            obj.ItemDesc = itemDesc;
            obj.Uomid = uomCombo.value();
            obj.UomName = uomCombo.text();
            obj.Consumption = consumption;
            obj.ExcessPercent = excessPercent;
            obj.RequiredQty = totalReqQty;
            obj.Rate = rate;
            obj.TotalValue = totalValue;

            for (var i = 0; i < gbItemList.length; i++) {
                if (gbItemList[i].ItemId === selectedItem.ItemId) {
                    gbTotalValue = gbTotalValue - selectedItem.TotalValue;
                    gbItemList.splice(i, 1);
                    break;
                }
            }

            gbTotalValue += totalValue;

            gbItemList.push(obj);
            selectedItem.set('ItemId', obj.ItemId);
            selectedItem.set('ItemName', obj.ItemName);
            selectedItem.set('ColorId', obj.ColorId);
            selectedItem.set('ColorName', obj.ColorName);
            selectedItem.set('FabricCompositionId', obj.FabricCompositionId);
            selectedItem.set('CompositionName', obj.CompositionName);
            selectedItem.set('ItemRef', obj.ItemRef);
            selectedItem.set('ItemDesc', obj.ItemDesc);
            selectedItem.set('Uomid', obj.Uomid);
            selectedItem.set('UomName', obj.UomName);
            selectedItem.set('Consumption', obj.Consumption);
            selectedItem.set('ExcessPercent', obj.ExcessPercent);
            selectedItem.set('RequiredQty', obj.RequiredQty);
            selectedItem.set('Rate', obj.Rate);
            selectedItem.set('TotalValue', obj.TotalValue);

            BuyerCostingHelper.CalculateTotalFOB();
        }
        else {
            if (itemCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "Required");
            }
        }
    },

    ValidationItemForm: function () {
        var res = true;
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var itemCombo = $("#cmbItem").data("kendoMultiColumnComboBox");
        var fabCompCombo = $("#cmbFabComposition").data("kendoComboBox");
        var fabCode = $("#txtItemRef").val();
        var itemDesc = $("#txtItemDesc").val();
        var uomCombo = $("#cmbUoM").data("kendoComboBox");
        var colorCombo = $("#cmbColor").data("kendoComboBox");
        var totalValue = $("#txtTotalValue").data("kendoNumericTextBox").value();

        if (itemCombo.value() === "") {
            AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "Required");
            res = false;
        }
        if (styleDCombo.value() === "") {
            AjaxManager.NotifyMsg("cboStyle", "error", "right", 1500, "Required");
            res = false;
        }
        if (uomCombo.value() === "") {
            AjaxManager.NotifyMsg("cmbUoM", "error", "right", 1500, "Required");
            res = false;
        }

        if (itemDesc === "") {
            AjaxManager.NotifyMsg("txtItemDesc", "error", "right", 1500, "Required");
            res = false;
        }
        if (totalValue === null) {
            AjaxManager.NotifyMsg("txtTotalValue", "error", "right", 1500, "Required");
            res = false;
        }
        var item = itemCombo.dataItem();
        if (kendo.toString(item.ItemGroupId).toUpperCase() == "138A3B7B-519E-4D58-8D5E-095B72CDA03A") {
            if (fabCompCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbFabComposition", "error", "right", 1500, "Required");
                res = false;
            }
            if (colorCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbColor", "error", "right", 1500, "Required");
                res = false;
            }
            if (fabCode === "") {
                AjaxManager.NotifyMsg("txtItemRef", "error", "right", 1500, "Required");
                res = false;
            }
        }

        return res;
    },
    ClearItemForm: function () {
        $("#cmbItem").data("kendoMultiColumnComboBox").value("");
        $("#cmbFabComposition").data("kendoComboBox").value("");
        $("#cmbColor").data("kendoComboBox").value("");
        $("#txtItemRef").val("");
        $("#txtItemDesc").val("");
        $("#cmbUoM").data("kendoComboBox").value("");
        $("#txtConsumption").data("kendoNumericTextBox").value("");
        $("#cmbExcessPercent").data("kendoComboBox").value("");
        $("#txtTotalRequiredQty").data("kendoNumericTextBox").value("");
        $("#txtRate").data("kendoNumericTextBox").value("");
        $("#txtTotalValue").data("kendoNumericTextBox").value("");
        $("#btnAddItem").text("Add");
        BuyerCostingHelper.LoadItemCombo();
    },
};