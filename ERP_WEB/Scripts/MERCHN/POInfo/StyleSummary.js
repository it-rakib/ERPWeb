var gbStyleList = [];
var StyleSummaryManager = {

};
var StyleSummaryHelper = {
    InitStyleSummary: function () {
        StyleSummaryHelper.GenerateStyleGrid();
        $("#btnAddStyle").click(function () {
            StyleSummaryHelper.AddToList();
        });
    },
    GenerateStyleGrid: function () {
        $("#grdStyleSummary").kendoGrid({
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
                { field: "Poid",hidden:true, width: 200 },
                { field: "StyleNo", title: "Style No", width: 200 },
                { field: "BuyerName", title: "Buyer", width: 200 },
                { field: "BrandName", title: "Brand", width: 200 },
                { field: "DepartmentName", title: "Department", width: 200 },
                { field: "SeasonName", title: "Season", width: 200 },
                { field: "Year", title: "Year", width: 100 },
                {
                    field: "Action", title: "Edit", filterable: false, width: 160, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: StyleSummaryHelper.ClickEventForDeleteButton
                    }]
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable:false
        });
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStyleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbStyleList.length; i++) {
                if (gbStyleList[i].StyleDetailId == selectedItem.StyleDetailId) {
                    gbStyleList.splice(i, 1);
                    POHistorySummaryHelper.LoadPOHistoryGrid(gbStyleList);
                    break;
                }
            }
        }
    },
    AddToList: function () {
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var styleGrid = $("#grdStyleSummary").data("kendoGrid");
        if (styleDCombo.value() !== "") {
            var styleComboData = styleDCombo.dataItem();
            var gridData = styleGrid.dataSource.data();
            for (var i = 0; i < gridData.length; i++) {
                var style = gridData[i];
                var styleDetailId = styleDCombo.value();
                if (style.BuyerName !== styleComboData.BuyerName || style.BrandName !== styleComboData.BrandName || style.DepartmentName !== styleComboData.DepartmentName || style.SeasonName !== styleComboData.SeasonName || style.Year !== styleComboData.Year || style.StatusName !== styleComboData.StatusName) {
                    AjaxManager.NotifyMsg("cboStyle", "error", "top", 2000, "Please Select Same Buyer,Brand,Dept,Season,Year & Status");
                    return;
                }
                if (style.StyleDetailId === styleDetailId) {
                    AjaxManager.NotifyMsg("cboStyle", "error", "top", 1500, "This Style Already Added");
                    return;
                }
            }
            var obj = new Object();
           // obj.PobreakdownId = AjaxManager.DefaultGuidId();
            obj.Poid = AjaxManager.DefaultGuidId();
            obj.StyleDetailId = styleDCombo.value();
            obj.StyleNo = styleDCombo.text();
            obj.BuyerName = styleComboData.BuyerName;
            obj.BrandName = styleComboData.BrandName;
            obj.DepartmentName = styleComboData.DepartmentName;
            obj.SeasonName = styleComboData.SeasonName;
            obj.Year = styleComboData.Year;
            obj.StatusName = styleComboData.StatusName;
            gbStyleList.push(obj);
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
            PODetailsHelper.LoadLeadTimeCombo();
        }
        else {
            if (styleDCombo.value() === "") {
                AjaxManager.NotifyMsg("cboStyle", "error", "bottom", 1500, "Required");
            }
        }
    },
};