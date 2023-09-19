
var LandInfoViewSummaryManger = {
    gridDataSourceLandMaster: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllGridData',
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

var LandInfoViewSummaryHelper = {
    InitLandInfoViewSummary: function () {
        LandInfoViewSummaryHelper.GenerateSalerInfoViewGrid();
        LandInfoViewSummaryHelper.GenerateKhatianDetailSummary();
        LandInfoViewSummaryHelper.GenerateLandOwnerSummaryGrid();
        LandInfoViewSummaryHelper.GenerateLandMasterGrid();
    },
    GenerateSalerInfoViewGrid: function () {
        $("#grdSalerInfoViewSummary").kendoGrid({
            dataSource: [],
            pageable: false,
            filterable: false,
            columns: [
                { field: "SalersInfoId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "SalerName", title: "Saler Name", sortable: true },
                { field: "SalerFatherName", title: "Father's Name", sortable: true },
                { field: "SalerAddress", title: "Saler Address", sortable: true }
            ],
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            selectable: "row",
            navigatable: true
        });
    },
    GenerateKhatianDetailSummary: function () {
        $("#grdKhatianDetailViewSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "KhatianDetailId", hidden: true, width: 200 },
                { field: "LandMasterId", hidden: true, width: 200 },
                { field: "MouzaId", hidden: true, width: 200 },
                { field: "MouzaName", title: "Mouza", width: 100 },
                { field: "KhatianTypeId", hidden: true, width: 200 },
                { field: "KhatianTypeName", title: "Name of Survey", width: 80 },
                { field: "KhatianNo", title: "Khatian No", width: 80 },
                { field: "DagNo", title: "Plot No", width: 80 },
                { field: "RecordedOwnerName", title: "Recorded Owner", width: 150 },
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateLandOwnerSummaryGrid: function () {
        $("#grdOwnerDetailViewSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "LandOwnersDetailId", hidden: true, width: 200 },
                { field: "LandMasterId", hidden: true, width: 200 },
                { field: "MouzaId", hidden: true, width: 200 },
                { field: "MouzaName", title: "Mouza", width: 100 },
                { field: "OwnerInfoId", hidden: true, width: 200 },
                { field: "OwnerInfoName", title: "Name of The Owner", width: 100 },
                { field: "LandAmount", title: "Area of Land", width: 50 },
                { field: "OwnerPurchaseAmount", title: "Price of Land(Deed)", width: 50 },
                { field: "OwnerRegAmount", title: "Registration Cost", width: 50 }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateLandMasterGrid: function () {
        $("#grdLandMasterViewSummary").kendoGrid({
            dataSource: LandInfoViewSummaryManger.gridDataSourceLandMaster(),
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
                fields: ["DeedNo"]
            },
            columns: [
                { field: "LandMasterId", hidden: true },
                { field: "DeedNo", title: "Deed No", sortable: true },
                { field: "TotalLandAmount", title: "Total Area of Land (Decimal)", sortable: true },
                { field: "LandPurchaseAmount", title: "Price of Land(Deed)", sortable: true },
                { field: "SubRegOfficeId", hidden: true },
                { field: "SubRegOfficeName", title: "Sub-Register Office", sortable: true },
                { field: "BaynaStatus", title: "Status", sortable: true },
                {
                    command: [{
                        name: "edit", text: "View", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoViewSummaryHelper.ClickEventForViewButtonLandMasterView
                    }], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForViewButtonLandMasterView: function (e) {
        e.preventDefault();
        var grid = $("#grdLandMasterViewSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divLandInfoViewSummary").hide();
            $("#divLandInfoViewDetails").show();
            LandInfoViewDetailsHelper.FillLandMasterDetailsForm(selectedItem);
        }
    }
}