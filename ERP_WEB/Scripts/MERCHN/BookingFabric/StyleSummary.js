var gbStyleList = [];
var gbSuppList = [],
    gbSuppListAll = [];
var StyleSummaryManager = {
    LoadSupplierByStyleDetailId: function (styleDetailId) {
        var objSupp = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/BOM/GetBOMSupplierForBookingByStyleDetailId/" + styleDetailId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objSupp = jsonData.Result;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objSupp;
    }
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
                { field: "Poid", hidden: true, width: 200 },
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
            navigatable: true
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
                if (gbStyleList[i].StyleDetailId === selectedItem.StyleDetailId) {
                    gbStyleList.splice(i, 1);
                    // FabricCompositionSummaryHelper.LoadFabricCompositionGridData(gbStyleList);
                    break;
                }
            }

            var selectedDetailList = gbSuppListAll.filter(x=>x.StyleDetailId === selectedItem.StyleDetailId);
            selectedDetailList.map(x => {
                var obj = gbSuppListAll.findIndex(el => el.StyleDetailId === x.StyleDetailId);
                if (obj >= 0) gbSuppListAll.splice(obj, 1);
            });
            var supplierIds = $.distinct(gbSuppListAll.map(x => x.SupplierId));
            gbSuppList = [];
            supplierIds.map(supplierId => {
                gbSuppList.push({
                    SupplierId: supplierId,
                    SupplierName: gbSuppListAll.find(x=>x.SupplierId === supplierId).SupplierName
                });
            });
            var suppCombo = $("#cmbSupplier").data("kendoComboBox");
            suppCombo.value("");
            suppCombo.setDataSource(gbSuppList);
        }
    },
    AddToList: function () {
        var isExist = false;
        var styleDCombo = $("#cboStyle").data("kendoMultiColumnComboBox");
        var styleGrid = $("#grdStyleSummary").data("kendoGrid");

        if (styleDCombo.value() !== "") {
            //Load Supplier By StyleDetail Id
            var suppCombo = $("#cmbSupplier").data("kendoComboBox");
            suppCombo.value("");
            gbSuppList = suppCombo.dataSource.data();


            var fabCompGrid = $("#grdFabricComposition").data("kendoGrid");
            fabCompGrid.dataSource.data([]);

            var suppData = StyleSummaryManager.LoadSupplierByStyleDetailId(styleDCombo.value());
            if (gbSuppListAll.length === 0) {
                gbSuppListAll = suppData;
                gbSuppList = gbSuppListAll;
                isExist = true;
            } else {
                var supplierIds = gbSuppListAll.map(x => x.SupplierId),
                    suppIds = suppData.map(x => x.SupplierId);
                for (var j = 0; j < suppIds.length; j++) {
                    if (supplierIds.indexOf(suppIds[j]) > -1) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    gbSuppList = gbSuppListAll;
                }
                else gbSuppListAll = [...gbSuppListAll, ...suppData];

                supplierIds = $.distinct(gbSuppListAll.map(x => x.SupplierId));
                gbSuppList = [];
                supplierIds.map(supplierId => {
                    gbSuppList.push({
                        SupplierId: supplierId,
                        SupplierName: gbSuppListAll.find(x=>x.SupplierId === supplierId).SupplierName
                    });
                });
            }
            suppCombo.setDataSource(gbSuppList);
            //===============================

            if (isExist) {
                var styleComboData = styleDCombo.dataItem();
                var gridData = styleGrid.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var style = gridData[i];
                    var styleDetailId = styleDCombo.value();
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
            } else {
                AjaxManager.MsgBox('warning', 'center', 'Warning', "Supplier Not Match With Already Added Style",
                       [{
                           addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                               $noty.close();
                           }
                       }]);
            }

        }
        else {
            if (styleDCombo.value() === "") {
                AjaxManager.NotifyMsg("cboStyle", "error", "bottom", 1500, "Required");
            }

        }
    }
};