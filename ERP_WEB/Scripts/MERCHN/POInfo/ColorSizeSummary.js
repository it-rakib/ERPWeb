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

        $("#cboStyle").change(function () {
            var colorSizeGrid = $("#grdColorSizeSummary").data("kendoGrid");
            var styleCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
            debugger;
            if (styleCombo.value() !== "") {
                var styleComboData = styleCombo.dataItem();
                var gridData = colorSizeGrid.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var style = gridData[i];
                    //var styleDetailId = styleCombo.value();
                    if (style.BuyerName !== styleComboData.BuyerName || style.BrandName !== styleComboData.BrandName || style.DepartmentName !== styleComboData.DepartmentName || style.SeasonName !== styleComboData.SeasonName || style.Year !== styleComboData.Year || style.StatusName !== styleComboData.StatusName) {
                        AjaxManager.NotifyMsg("cboStyle", "error", "top", 2000, "Please Select Same Buyer,Brand,Dept,Season,Year & Status");
                        styleCombo.value("");
                        styleCombo.text("");
                        return;
                    }
                    //if (style.StyleDetailId === styleDetailId) {
                    //    AjaxManager.NotifyMsg("cboStyle", "error", "top", 1500, "This Style Already Added");
                    //    return;
                    //}
                }
            }
            PODetailsHelper.LoadLeadTimeCombo();
        });
    },
    GenerateStyleGrid: function () {
        $("#grdColorSizeSummary").kendoGrid({
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
                { field: "Poid", hidden: true, width: 20 },
                { field: "StyleDetailId", hidden:true, width: 20 },
                { field: "StyleNo", title: "Style No", width: 100 },
                { field: "ColorId", hidden: true, width: 20 },
                { field: "ColorName", title: "Color", width: 100 },
                { field: "SizeId", hidden: true, width: 20 },
                { field: "SizeName", title: "Size", width: 100 },
                { field: "UnitPrice", title: "Rate", width: 100 },
                { field: "Quantity", title: "Quantity", width: 100 },
                {
                    field: "Action", title: "Edit", filterable: false, width: 100, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: ColorSizeSummaryHelper.ClickEventForDeleteButton
                    }]
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdColorSizeSummary").data("kendoGrid");
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
        var styleCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var colorCombo = $("#cmbColor").data("kendoComboBox");
        var sizeCombo = $("#cmbSize").data("kendoComboBox");
        var quantity = $("#txtQuantity").data("kendoNumericTextBox").value();
        var rate = $("#txtRate").data("kendoNumericTextBox").value();
        var colorSizeGrid = $("#grdColorSizeSummary").data("kendoGrid");
       
        

        if (styleCombo.value() !=="" && colorCombo.value() !== "" && quantity > 0) {
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
            obj.StyleDetailId = styleCombo.value();
            obj.StyleNo = styleCombo.text();
            obj.ColorId = colorCombo.value();
            obj.ColorName = colorCombo.text();
            obj.SizeId = sizeCombo.value();
            obj.SizeName = sizeCombo.text();
            obj.Quantity = quantity;
            obj.UnitPrice = rate;
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
            if (styleCombo.value()=="") {
                AjaxManager.NotifyMsg("cboStyle", "error", "bottom", 1500, "Required");
            }

        }
    },
    CalculateOrderQty: function () {
        $("#txtOrderQty").data("kendoNumericTextBox").value(gbTotalQuantity);
    }
};