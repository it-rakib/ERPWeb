var StyleGridToManager = {
    gridDataSource: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + "/api/StyleTransfer/GetStyleGridFromPI",
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
                    id: "ToStyleId",
                    fields: {
                        //ToStyleId: { editable: false },
                        //ToStyleNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var StyleGridToHelper = {
    InitStyleGridTo: function () {
        StyleGridToHelper.GenerateStylePopUpToGrid();

        $('#txtsearch').on('input', function (e) {
            StyleGridToHelper.LoadStyleToDataSource();
        });
        $("#popupStyleGridTo").kendoWindow({
            title: "Style Information",
            resizeable: true,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        $("#btnSearchStyleTo").click(function () {
            StyleGridToHelper.LoadStyleToDataSource();
            $("#popupStyleGridTo").data("kendoWindow").open().center();
        });
        $("#btnClose").click(function () {
            $("#popupStyleGridTo").data("kendoWindow").close();
        });
    },
    GenerateStylePopUpToGrid: function () {
        $("#grdStylePopUpTo").kendoGrid({
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
                { field: "ToStyleId", hidden: true },
                { field: "ToStyleDetailsId", hidden: true },
                { field: "ToStyleNo", title: "Style No", width: 20, sortable: true },
                { field: "BuyerName", title: "Buyer", width: 20, sortable: true },
                { field: "BrandName", title: "Brand", width: 15, sortable: true },
                { field: "DepartmentName", title: "Department", width: 15, sortable: true },
                { field: "SeasonName", title: "Season", width: 10, sortable: true },
                { field: "StatusName", title: "Status", width: 10, sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: StyleGridToHelper.ClickEventForSelectButton
                    }], width: 10, title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["ToStyleNo"]
            }
        });
        
        $("#grdStylePopUpTo").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdStylePopUpTo").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    //StyleTransferItemListHelper.LoadStyleTransferItemListGridByStyle(selectedItem);
                    StyleTransferItemListHelper.SetToStyleTransferDetails(selectedItem);
                    $("#popupStyleGridTo").data("kendoWindow").close();
                }
            }
        });
    },
    LoadStyleToDataSource: function () {
        var grid = $("#grdStylePopUpTo").data("kendoGrid");
        var data = StyleGridToManager.gridDataSource();
        grid.setDataSource(data);
    },
    ClickEventForSelectButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStylePopUpTo").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            //StyleTransferItemListHelper.LoadStyleTransferItemListGridByStyle(selectedItem);
            StyleTransferItemListHelper.SetToStyleTransferDetails(selectedItem);
            $("#popupStyleGridTo").data("kendoWindow").close();  
        }
    }
};