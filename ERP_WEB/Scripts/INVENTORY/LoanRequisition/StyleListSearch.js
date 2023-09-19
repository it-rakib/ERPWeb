﻿var StyleListPopUpManager = {
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
                    url: _baseUrl + '/api/LoanRequisition/GetStylesGridByStoreId/' + $.trim(storeId),
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
                    id: "StyleId",
                    fields: {
                        styleId: { editable: false },
                        styleNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var StyleListPopUpHelper = {
    InitStylePopUpGrid: function () {
        StyleListPopUpHelper.GenerateStyleSummaryGrid();

        $('#txtsearch').on('input', function (e) {
            StyleListPopUpHelper.LoadDataSource();
        });
        $("#popupStyleSearch").kendoWindow({
            title: "Style Information",
            resizeable: true,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        $("#btnSearchStyle").click(function () {
            StyleListPopUpHelper.LoadDataSource();
            $("#popupStyleSearch").data("kendoWindow").open().center();
        });
        $("#btnClose").click(function () {
            $("#popupStyleSearch").data("kendoWindow").close();
        });
    },
    GenerateStyleSummaryGrid: function () {
        $("#grdStyleSummary").kendoGrid({
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
                { field: "StyleId", hidden: true },
                { field: "StyleNo", title: "Style No", width: 20, sortable: true },
                { field: "BuyerName", title: "Buyer", width: 20, sortable: true },
                { field: "BrandName", title: "Brand", width: 15, sortable: true },
                { field: "DepartmentName", title: "Department", width: 15, sortable: true },
                { field: "SeasonName", title: "Season", width: 10, sortable: true },
                { field: "StatusName", title: "Status", width: 10, sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-arrow-down", className: "k-success", click: StyleListPopUpHelper.ClickEventForSelectButton
                    }], width: 10, title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["StyleNo"]
            }
        });
        
        $("#grdStyleSummary").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdStyleSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    LoanRequisitionItemListHelper.LoadRequisitionItemListGrid(selectedItem);
                    $("#popupStyleSearch").data("kendoWindow").close();
                }
            }
        });
    },
    LoadDataSource: function () {
        var search = $("#txtsearch").val();
        var storeId = $("#cmbStoreTo").data("kendoComboBox").value();
        var grid = $("#grdStyleSummary").data("kendoGrid");
        var data = StyleListPopUpManager.gridDataSource(storeId);
        grid.setDataSource(data);
    },
    ClickEventForSelectButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStyleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LoanRequisitionItemListHelper.LoadRequisitionItemListGrid(selectedItem);
            $("#popupStyleSearch").data("kendoWindow").close();  
        }
    }
};