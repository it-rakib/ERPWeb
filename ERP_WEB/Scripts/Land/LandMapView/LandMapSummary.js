
var isAdmin = false;
var LandMapSummaryManger = {
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
                    url: _baseUrlLand + '/api/LandMapInfo/GetAllGridData',
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

var LandMapSummaryHelper = {
    InitLandMapSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        LandMapSummaryHelper.GenerateLandMapGrid();
    },
    GenerateLandMapGrid: function () {
        $("#grdLandMapSummary").kendoGrid({
            dataSource: LandMapSummaryManger.gridDataSource(),
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
                fields: ["HoldingNo"]
            },
            columns: [
                { field: "LandMapId", hidden: true },
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "MapTypeId", hidden: true },
                { field: "MapTypeName", title: "Map Type", sortable: true },
                { field: "SheetNoInfoId", hidden: true },
                { field: "SheetNo", title: "Sheet No", sortable: true },
                { field: "Remarks", hidden: true },
                { field: "FileRemarks", hidden: true },
                { field: "IsDeleted", title: "Is Deleted", sortable: true, hidden: true },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandDevTaxInfoSummaryHelper.ClickEventForEditButton
                //    }], title: "&nbsp;"
                //}
                {
                    command: [{
                        name: "edit", text: "View", iconClass: "k-icon k-i-edit", className: "k-success", click: LandMapSummaryHelper.ClickEventForEditButton
                    }
                    ],title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdLandMapSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divLandMapSummary").hide();
            $("#divLandMapDetails").show();
            $("#btnSubmitApplication").text("Update");
            $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");
            $("#divLandDevTaxInfoSummary").hide();
            $("#divLandDevTaxInfoDetails").show();
            LandMapDetailsHelper.FillForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdLandMapSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                LandMapDetailsHelper.FillForm(selectedItem);
                LandMapDetailsManager.SaveLandMapDetails();
            }
        } else {
            text = "Canceled!";
        }
    }
}