
var CmnSubRegOfficeSummaryManager = {
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
                    url: _baseUrlLand + '/api/CmnSubRegOffice/GetAllGridData',
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

                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
}

var CmnSubRegOfficeSummaryHelper = {
    InitCmnSubRegOfficeSummary: function () {
        CmnSubRegOfficeSummaryHelper.GenerateCmnSubRegOfficeGrid();
    },
    GenerateCmnSubRegOfficeGrid: function () {
        $("#grdCmnSubRegOfficeSummary").kendoGrid({
            dataSource: CmnSubRegOfficeSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            toolbar: ["search"],
            search: {
                fields: ["SubRegOfficeName"]
            },
            columns: [
                { field: "SubRegOfficeId", hidden: true },
                { field: "SubRegOfficeName", title: "Sub-Register Office Name", sortable: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DivisionName", title: "Division", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: CmnSubRegOfficeSummaryHelper.ClickEventForEditButton
                    },
                        {
                            name: "delete", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", click: CmnSubRegOfficeSummaryHelper.ClickEventForDeleteButton
                        }
                    ], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdCmnSubRegOfficeSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSave").text("Update");
            CmnSubRegOfficeDetailsHelper.FillCmnSubRegOfficeForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        debugger;
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdCmnSubRegOfficeSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                $("#btnSave").text("Delete");
                CmnSubRegOfficeDetailsHelper.FillCmnSubRegOfficeFormDelete(selectedItem);
                CmnSubRegOfficeDetailsManager.SaveCmnSubRegOfficeDetails();
            }
        } else {
            text = "Canceled!";
        }
    }
}