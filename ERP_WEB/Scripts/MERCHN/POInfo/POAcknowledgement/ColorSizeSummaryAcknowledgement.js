var gbColorSizeList = [];
var gbTotalQuantity = 0;
var ColorSizeSummaryManager = {

};
var ColorSizeSummaryHelper = {
    InitColorSizeSummary: function () {
        ColorSizeSummaryHelper.GenerateStyleGrid();
        $("#btnAddColorSize").click(function () {
            ColorSizeSummaryHelper.AddToList();
        });
    },
    GenerateStyleGrid: function () {
        $("#grdColorSizeSummaryAcknowledgement").kendoGrid({
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
                { field: "Poid", hidden: true, width: 200 },
                { field: "ColorId", hidden:true, width: 200 },
                { field: "ColorName", title: "Color", width: 200 },
                { field: "SizeId", hidden: true, width: 200 },
                { field: "SizeName", title: "Size", width: 200 },
                { field: "Quantity", title: "Quantity", width: 200 },
                //{
                //    field: "Action", title: "Edit", filterable: false, width: 160, command: [{
                //        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: ColorSizeSummaryHelper.ClickEventForDeleteButton
                //    }]
                //}

            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdColorSizeSummaryAcknowledgement").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbColorSizeList.length; i++) {
                if (gbColorSizeList[i].ColorId == selectedItem.ColorId && gbColorSizeList[i].SizeId == selectedItem.SizeId) {
                    gbTotalQuantity = gbTotalQuantity - selectedItem.Quantity;
                    gbColorSizeList.splice(i, 1);
                    break;
                }
            }
            ColorSizeSummaryHelper.CalculateOrderQty();
        }
    },
    AddToList: function () {
        var colorCombo = $("#cmbColor").data("kendoComboBox");
        var sizeCombo = $("#cmbSize").data("kendoComboBox");
        var quantity = $("#txtQuantity").data("kendoNumericTextBox").value();
        var colorSizeGrid = $("#grdColorSizeSummaryAcknowledgement").data("kendoGrid");

    
        if (colorCombo.value() !== ""  && quantity>0) {
            var gridData = colorSizeGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var colsize = gridData[i];
                var colorId = colorCombo.value();
                var sizeId = sizeCombo.value();
                if (colsize.ColorId === colorId && colsize.SizeId === sizeId) {
                    AjaxManager.NotifyMsg("btnAddColorSize", "error", "right", 1500, "This Color & Size Already Added");
                    return;
                }
            }
            var obj = new Object();
            obj.PobreakdownId = AjaxManager.DefaultGuidId();
            obj.Poid = AjaxManager.DefaultGuidId();
            obj.ColorId = colorCombo.value();
            obj.ColorName = colorCombo.text();
            obj.SizeId = sizeCombo.value();
            obj.SizeName = sizeCombo.text();
            obj.Quantity = quantity;
            gbTotalQuantity += quantity;
         
            gbColorSizeList.push(obj);
            var gridDataSource = new kendo.data.DataSource({
                data: gbColorSizeList,
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
            colorSizeGrid.setDataSource(gridDataSource);
            ColorSizeSummaryHelper.CalculateOrderQty();
        }
        else {
            if (colorCombo.value() === "0") {
                AjaxManager.NotifyMsg("cmbColor", "error", "bottom", 1500, "Required");
            }
            if (sizeCombo.value() === "0") {
                AjaxManager.NotifyMsg("cmbSize", "error", "bottom", 1500, "Required");
            }
            if (quantity==null) {
                AjaxManager.NotifyMsg("txtQuantity", "error", "bottom", 1500, "Required");
            }

        }
    },
    CalculateOrderQty: function () {
        $("#txtOrderQty").data("kendoNumericTextBox").value(gbTotalQuantity);
    }
};