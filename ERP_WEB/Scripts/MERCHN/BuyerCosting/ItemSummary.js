var gbItemList = [];
var gbTotalValue = 0.0;
var gbGriditemList = [];

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
                        ColorName: { editable: true },
                        CompositionName: { editable: true },
                        ItemRef: { editable: true },
                        ItemDesc: { editable: true },
                        UomName: { editable: true },
                        Consumption: { editable: true, type: "number", validation: { min: 0 } },
                        ExcessPercent: { editable: true ,type: "number", validation: { min: 0 } },
                        RequiredQty: { editable: false ,type: "number", validation: { min: 0 }},
                        Rate: { editable: true ,type: "number", validation: { min: 0 }},
                        TotalValue: { editable: false, type: "number", validation: { min: 0.00 } },
                        ItemGroupId: { editable: false },
                        CmnColors: { editable: true },
                        MerchFabricCompositions: { editable: true },
                        CmnUoms: { editable: true }
                    }
                },
                data: "items", total: "totalCount"
            },
            aggregate: [{ field: "TotalValue", aggregate: "sum" }],
        });

        return gridDataSource;
    },
    GetItemGridData: function (styleDetailId) {
        var objItemList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BuyerCosting/GetBuyerCostingFabTrims/" + styleDetailId;
        //
        //var serviceUrl = _baseUrl + "/api/ProductWiseFabTrimTamplate/GetItemByStyleDetailIdGridData/" + $.trim(styleDetailId);
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
        ItemSummaryHelper.GenerateItemGrid1();
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
            // dataSource: ItemSummaryManager.gridDataSource(),
            filterable: false,
            sortable: false,
            editable: false,
            columns: [
                { field: "StyleDetailId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ItemName", title: "Item", editable: true },
                { field: "ColorId", hidden: true },
                { field: "ItemGroupId", hidden: true },
                { field: "ColorName", title: "Color" },
                { field: "FabricCompositionId", hidden: true },
                { field: "CompositionName", title: "Composition" },
                { field: "ItemRef", title: "Ref." },
                { field: "ItemDesc", title: "Desc." },
                { field: "UomId", hidden: true },
                { field: "UomName", title: "Unit" },
                { field: "Consumption", title: "Consumption" },
                { field: "ExcessPercent", title: "Excess (%)", editor: ItemSummaryHelper.ExcessPercentDownEditor, template: "#=ExcessPercent#" },
                { field: "RequiredQty", title: "Req Qty" },
                { field: "Rate", title: "Rate" },
                { field: "TotalValue", title: "Total Value", footerTemplate: "Total : <span id='spnTotalValue'></span>" },
                {
                    field: "Action", title: "Action", filterable: false, width: 160, command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-edit", className: "k-success", click: ItemSummaryHelper.ClickEventForEditButton
                    }, {
                        name: "delete", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", click: ItemSummaryHelper.ClickEventForDeleteButton
                    }]
                }

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
    GenerateItemGrid1: function () {
        $("#grdItemSummary1").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            save: function (e) {
            },
            dataSource: [],
            filterable: false,
            sortable: false,
            editable: true,
            columns: [

                { field: "StyleDetailId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ItemGroupId", hidden: true },
                { field: "ItemName", title: "Item", editable: false, },
                { field: "ColorId", hidden: true },
                { field: "CmnColors", title: "Color", editor: ItemSummaryHelper.ItemColorDropDownEditor, template: "#=CmnColors.ColorName#" },
                { field: "FabricCompositionId", hidden: true },
                { field: "MerchFabricCompositions", title: "Composition", editor: ItemSummaryHelper.CompositionDropDownEditor, template: "#=MerchFabricCompositions.CompositionName#" },
                { field: "ItemRef", title: "Ref." },
                { field: "ItemDesc", title: "Desc." },
                { field: "UomId", hidden: true },
                { field: "CmnUoms", title: "Unit", editor: ItemSummaryHelper.UnitDropDownEditor, template: "#=CmnUoms.UOMName#" },
                { field: "Consumption", title: "Consumption", editor: ItemSummaryHelper.InputNumericTextBoxEditor },
                { field: "ExcessPercent", title: "Excess (%)", editor: ItemSummaryHelper.ExcessPercentDownEditor, template: "#=ExcessPercent#" },
                { field: "Rate", title: "Rate", editor: ItemSummaryHelper.InputNumericTextBoxEditor },
                { field: "RequiredQty", title: "Req Qty", editable: false, editor: ItemSummaryHelper.InputNumericTextBoxEditor },
                { field: "TotalValue", title: "Total Value", editable: false, editor: ItemSummaryHelper.InputNumericTextBoxEditor, footerTemplate: "Total : <span id='spnTotalValue'></span>" },
                {
                    field: "Action", title: "Action", filterable: false, width: 160, command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-edit", className: "k-success", click: ItemSummaryHelper.ClickEventForEditButton
                    },
                    {
                        name: "delete1", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", click: ItemSummaryHelper.ClickEventForItemGridDeleteButton
                    }
                    ]
                }

            ],
            selectable: "row",
            navigatable: true,
            dataBound: function (e) {

                var rows = e.sender.content.find('tr');
                var data = e.sender.dataSource._data;

                var ddaIndex = e.sender.wrapper.find(".k-grid-header [data-field='CmnColors']").index();
                var ddbIndex = e.sender.wrapper.find(".k-grid-header [data-field='MerchFabricCompositions']").index();
                var ddcIndex = e.sender.wrapper.find(".k-grid-header [data-field='ItemRef']").index();
                var dddIndex = e.sender.wrapper.find(".k-grid-header [data-field='ItemDesc']").index();
                var ddeIndex = e.sender.wrapper.find(".k-grid-header [data-field='CmnUoms']").index();
                var dqIndex = e.sender.wrapper.find(".k-grid-header [data-field='Consumption']").index();
                var dpIndex = e.sender.wrapper.find(".k-grid-header [data-field='ExcessPercent']").index();
                var ujIndex = e.sender.wrapper.find(".k-grid-header [data-field='Rate']").index();
                var reqQtyIndex = e.sender.wrapper.find(".k-grid-header [data-field='RequiredQty']").index();
                var totalValIndex = e.sender.wrapper.find(".k-grid-header [data-field='TotalValue']").index();


                rows.each(function (index, row) {
                    var dataItem = e.sender.dataItem(row);
                    var tableHeadRow = $("#grdItemSummary1 thead tr");
                    $(row).children('td:eq(' + ddaIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + ddbIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + ddcIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + dddIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + ddeIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + dqIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + dpIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + ujIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + reqQtyIndex + ')').addClass('editable-cell');
                    $(row).children('td:eq(' + totalValIndex + ')').addClass('editable-cell');

                    //if (!dataItem.ItemName) {
                    //    tableHeadRow.find('th:eq(' + ddaIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + ddbIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + ddcIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + dddIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + ddeIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + dqIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + dpIndex + ')').removeClass('non-editable').addClass('editable');
                    //    tableHeadRow.find('th:eq(' + ujIndex + ')').removeClass('non-editable').addClass('editable');
                    //} else {
                    //    tableHeadRow.find('th:eq(' + ddaIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + ddbIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + ddcIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + dddIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + ddeIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + dqIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + dpIndex + ')').removeClass('editable').addClass('non-editable');
                    //    tableHeadRow.find('th:eq(' + ujIndex + ')').removeClass('editable').addClass('non-editable');
                    //}

                    //if (kendo.toString(dataItem.ItemGroupId).toUpperCase() == "138A3B7B-519E-4D58-8D5E-095B72CDA03A") {
                    //   // 
                    //    $(row).children('td:eq(' + ddaIndex + ')').attr("disabled", "disabled");
                    //    //$(row).children('td:eq(' + ddbIndex + ')').removeClass('non-editable').addClass('editable');
                    //    //percentCmb.enable
                    //} else {
                    //    $(row).children('td:eq(' + ddaIndex + ')').removeAttr("disabled");
                    //}
                });

            },

            edit: function (e) {

                var fieldName = e.sender.editable.options.fields.field;
                var tableBody = $("#grdItemSummary1 tbody");


                if (e.model.ItemGroupId.toUpperCase() != "138A3B7B-519E-4D58-8D5E-095B72CDA03A" && (fieldName == "CmnColors" || fieldName == "MerchFabricCompositions")) {

                    var grid = $("#grdItemSummary1").data("kendoGrid");
                    tableBody.find("tr[data-uid='" + e.model.uid + "'] td:eq(" + 4 + ")").removeClass('editable-cell');
                    tableBody.find("tr[data-uid='" + e.model.uid + "'] td:eq(" + 4 + ")").removeClass('k-edit-cell');
                    tableBody.find("tr[data-uid='" + e.model.uid + "'] td:eq(" + 4 + ")").removeClass('k-dirty-cell');
                    grid.closeCell();
                }
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
    InputNumericTextBoxEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoNumericTextBox({
                format: "#",
                decimals: 2,
                min: 0
            });
    },
    ClickEventForItemGridDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdItemSummary1").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);

            for (var i = 0; i < gbGriditemList.length; i++) {
                if (gbGriditemList[i].ItemId == selectedItem.ItemId) {
                    gbTotalValue = gbTotalValue - selectedItem.TotalValue;
                    gbGriditemList.splice(i, 1);
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
        //var itemGrid = $("#grdItemSummary").data("kendoGrid");
        var itemGrid1 = $("#grdItemSummary1").data("kendoGrid");

        if (styleDCombo.value() !== "" && itemCombo.value() !== "" /*&& totalValue > 0*/) {
            var gridData = itemGrid1.dataSource.data();
            //itemList.push(gridData);

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
            obj.ItemGroupId = itemCombo.dataSource._data.find(x => x.ItemId == obj.ItemId).ItemGroupId;

            var colorObj = new Object();
            colorObj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(colorCombo.value());
            colorObj.ColorName = colorObj.ColorId == AjaxManager.DefaultGuidId() ? '--Select--' : colorCombo.text();
            obj.CmnColors = colorObj;
            obj.ItemRef = fabCode;
            obj.ItemDesc = itemDesc;

            var uomObj = new Object();
            uomObj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(uomCombo.value());
            uomObj.UOMName = uomObj.UOMId == AjaxManager.DefaultGuidId() ? '--Select--' : uomCombo.text();

            var fabObj = new Object();
            fabObj.FabricCompositionId = UtilityHelper.EmptyThenDefaultGuidId(fabCompCombo.value());
            fabObj.CompositionName = fabObj.FabricCompositionId == AjaxManager.DefaultGuidId() ? '--Select--' : fabCompCombo.text();

            obj.Consumption = consumption == "" || consumption == null ? 0 : consumption;
            obj.ExcessPercent = excessPercent == null || excessPercent == "" ? '--Select--' : excessPercent;
            obj.RequiredQty = totalReqQty;
            obj.Rate = rate;
            obj.TotalValue = totalValue == null || totalValue == "" ? 0 : totalValue;
            obj.CmnUoms = uomObj;
            obj.MerchFabricCompositions = fabObj;

            gbGriditemList.push(obj);

            var gridDataSource = new kendo.data.DataSource({
                //data: gbItemList,
                data: gbGriditemList,
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

                        var tableBody = $("#grdItemSummary1 tbody");
                        gbTotalValue += totalPrice;

                        tableBody.find("#spnTotalValue").text(gbTotalValue.toFixed(4));

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
            BuyerCostingHelper.CalculateTotalFOB();
        }
        else {
            if (itemCombo.value() === "") {
                AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "Required");
            }
            if (styleDCombo.value() === "") {
                AjaxManager.NotifyMsg("cboStyle", "error", "right", 1500, "Required");
            }
        }
        ItemSummaryHelper.ClearItemForm();
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
        ItemSummaryHelper.ClearItemForm();
    },

    ValidationItemForm: function () {

        var res = true;
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var itemCombo = $("#cmbItem").data("kendoMultiColumnComboBox").value();
        var fabCompCombo = $("#cmbFabComposition").data("kendoComboBox");
        var fabCode = $("#txtItemRef").val();
        var itemDesc = $("#txtItemDesc").val();
        var uomCombo = $("#cmbUoM").data("kendoComboBox");
        var colorCombo = $("#cmbColor").data("kendoComboBox");
        var totalValue = $("#txtTotalValue").data("kendoNumericTextBox").value();
        //var excess = $("#cmbExcessPercent").data("kendoComboBox");

        //if (excess.value() === "" || excess.value() === AjaxManager.DefaultGuidId()) {
        //    AjaxManager.NotifyMsg("cmbExcessPercent", "error", "right", 1500, "Select Excess Percent");
        //    res = false;
        //}
        //return res;

        if (itemCombo === "" || itemCombo === "00000000-0000-0000-0000-000000000000") {
            AjaxManager.NotifyMsg("cmbItem", "error", "right", 1500, "Required");
            res = false;
        }
        //if (styleDCombo.value() === "") {
        //    AjaxManager.NotifyMsg("cboStyle", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //if (uomCombo.value() === "") {
        //    AjaxManager.NotifyMsg("cmbUoM", "error", "right", 1500, "Required");
        //    res = false;
        //}

        //if (itemDesc === "") {
        //    AjaxManager.NotifyMsg("txtItemDesc", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //if (totalValue === null) {
        //    AjaxManager.NotifyMsg("txtTotalValue", "error", "right", 1500, "Required");
        //    res = false;
        //}
        //var item = itemCombo.dataItem();
        //if (kendo.toString(item.ItemGroupId).toUpperCase() == "138A3B7B-519E-4D58-8D5E-095B72CDA03A") {
        //    //if (fabCompCombo.value() === "") {
        //    //    AjaxManager.NotifyMsg("cmbFabComposition", "error", "right", 1500, "Required");
        //    //    res = false;
        //    //}
        //    //if (colorCombo.value() === "") {
        //    //    AjaxManager.NotifyMsg("cmbColor", "error", "right", 1500, "Required");
        //    //    res = false;
        //    //}
        //    //if (fabCode === "") {
        //    //    AjaxManager.NotifyMsg("txtItemRef", "error", "right", 1500, "Required");
        //    //    res = false;
        //    //}            
        //}

        return res;
    },
    ClearItemForm: function () {
        BuyerCostingHelper.LoadItemCombo();
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

    },
    ItemColorDropDownEditor: function (container, options) {
        var data = MerchantManager.GetAllColor1();
        var obj = new Object();
        obj.ColorId = AjaxManager.DefaultGuidId();
        obj.ColorName = "--Select--";
        obj.ColorCode = "";
        data.unshift(obj);
        $('<input id="colorCmb" data-text-field="ColorName" data-value-field="ColorId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    },
    CompositionDropDownEditor: function (container, options) {
        var data = MerchantManager.GetFabricCompositions();
        $('<input id="fabCompositionCmb" data-text-field="CompositionName" data-value-field="FabricCompositionId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    },
    UnitDropDownEditor: function (container, options) {
        var data = MerchantManager.GetUoM();
        $('<input id="uomCmb" data-text-field="UOMName" data-value-field="UOMId" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    },
    ExcessPercentDownEditor: function (container, options) {
        var data = MerchantManager.LoadExccessPercentData();
        $('<input id="percentCmb" data-text-field="ExcessPercent" data-value-field="ExcessPercent" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                optionLabel: '--Select--',
                dataSource: data,
                //placeholder: "--Select--",
                index: 0
            });
    }
}