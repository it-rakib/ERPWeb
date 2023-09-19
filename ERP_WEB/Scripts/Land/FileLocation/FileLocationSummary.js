
var isAdmin = false;

var FileLocationSummaryManger = {
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
                    url: _baseUrlLand + '/api/FileLocation/GetAllGridData',
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

var FileLocationSummaryHelper = {
    InitFileLocationSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        FileLocationSummaryHelper.GenerateFileLocationMasterGrid();
        FileLocationSummaryHelper.GenerateFileLocationDetailGrid();
    },

    GenerateFileLocationMasterGrid: function () {
        $("#grdFileLocationMasterSummary").kendoGrid({
            dataSource: FileLocationSummaryManger.gridDataSource(),
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
                fields: ["FileCodeInfoName"]
            },
            columns: [
                { field: "FileLocationMasterId", hidden: true },
                { field: "FileCodeInfoId", hidden: true },
                { field: "FileCodeInfoName", title: "File Code", sortable: true },
                { field: "FileNoInfoId", hidden: true },
                { field: "FileNoInfoName", title: "File No", sortable: true },
                { field: "AlmirahNoInfoId", hidden: true },
                { field: "AlmirahNoInfoName", title: "Almirah/Shelf No", sortable: true },
                { field: "RackNoInfoId", hidden: true },
                { field: "RackNoInfoName", title: "Rack No", sortable: true },
                //{ field: "Remarks", title: "Remarks", sortable: true },
                { field: "DeedNo", title: "Deed No", sortable: true },
                { field: "IsDeleted", title: "Is Deleted", sortable: true, hidden: true },

                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: FileLocationSummaryHelper.ClickEventForEditButtonLocationMaster
                    }
                    ],title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: FileLocationSummaryHelper.ClickEventForFileLocDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButtonLocationMaster: function (e) {
        e.preventDefault();
        var grid = $("#grdFileLocationMasterSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSubmitApplication").text("Update");
            $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");
            $("#btnAddDeed").text("Add Deed");
            $("#btnAddDeed").addClass("fas fa-arrow-down");
            $("#divFileLocationSummary").hide();
            $("#divFileLocationDetails").show();
            FileLocationDetailsHelper.FillFileLocationMasterForm(selectedItem);
        }
    },

    ClickEventForFileLocDeleteButton: function (e) {
        e.preventDefault();
        debugger;
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdFileLocationMasterSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                FileLocationDetailsHelper.FillFileLocationMasterForm(selectedItem);
                FileLocationDetailsManager.SaveFileLocationDetails();
            }
        } else {
            text = "Canceled!";
        }
    },



    GenerateFileLocationDetailGrid: function () {
        $("#grdFileLocationDetail").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "FileLocationDetailId", hidden: true },
                { field: "FileLocationMasterId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "DeedNo", title: "Deed No", width: 100 },
                //{ field: "EntryDate", title: "Entry Date", width: 100 },
                //{ field: "SubRegOfficeId", hidden: true },
                //{ field: "SubRegOfficeName", title: "Sub-Reg Office", width: 80 },
                //{ field: "TotalLandAmount", title: "Total Area of Land (Decimal)", width: 80 },
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: FileLocationSummaryHelper.ClickEventForDeleteButton
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: FileLocationSummaryHelper.ClickEventForEditButton
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
        var grid = $("#grdFileLocationDetail").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < DeedList.length; i++) {
                if (DeedList[i].LandMasterId == selectedItem.LandMasterId && DeedList[i].FileLocationDetailId == selectedItem.FileLocationDetailId) {
                    DeedList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdFileLocationDetail").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            FileLocationDetailsHelper.FillDeedDetailForm(selectedItem);
        }
    }
}