var StyleGridFromManager = {
    gridDataSource: function (storeId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + "/api/StyleTransfer/GetGridStylesByStoreId/" + $.trim(storeId),
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
                    id: "FromStyleId",
                    fields: {
                        FromStyleId: { editable: false },
                        FromStyleNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var StyleGridFromHelper = {
    InitStyleGridFrom: function () {
        StyleGridFromHelper.GenerateStylePopUpFromGrid();
        $('#txtsearch').on('input', function (e) {
            StyleGridFromHelper.LoadStyleFromDataSource();
        });
        $("#popupStyleGridFrom").kendoWindow({
            title: "Style Information",
            resizeable: true,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        $("#btnSearchStyleFrom").click(function () {
            StyleGridFromHelper.LoadStyleFromDataSource();
            $("#popupStyleGridFrom").data("kendoWindow").open().center();
        });
        $("#btnClose").click(function () {
            $("#popupStyleGridFrom").data("kendoWindow").close();
        });
    },
    GenerateStylePopUpFromGrid: function () {
        $("#grdStylePopUpFrom").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "FromStyleId", hidden: true },
                { field: "FromStyleDetailsId", hidden: true },
                { field: "FromStyleNo", title: "Style No", width: 20, sortable: true },
                { field: "BuyerName", title: "Buyer", width: 20, sortable: true },
                { field: "BrandName", title: "Brand", width: 15, sortable: true },
                { field: "DepartmentName", title: "Department", width: 15, sortable: true },
                { field: "SeasonName", title: "Season", width: 10, sortable: true },
                { field: "StatusName", title: "Status", width: 10, sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: StyleGridFromHelper.ClickEventForSelectButton
                    }], width: 10, title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["FromStyleNo"]
            }
        });
        
        $("#grdStylePopUpFrom").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdStylePopUpFrom").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    StyleTransferItemListHelper.LoadStyleTransferItemListGridByStyle(selectedItem);
                    $("#popupStyleGridFrom").data("kendoWindow").close();
                }
            }
        });
    },
    LoadStyleFromDataSource: function () {
        var storeId = $("#cmbFromStore").data("kendoComboBox").value();
        var grid = $("#grdStylePopUpFrom").data("kendoGrid");
        var data = StyleGridFromManager.gridDataSource(storeId);
        grid.setDataSource(data);
    },
    ClickEventForSelectButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStylePopUpFrom").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            StyleTransferItemListHelper.LoadStyleTransferItemListGridByStyle(selectedItem);
            $("#popupStyleGridFrom").data("kendoWindow").close();  
        }
    }
};