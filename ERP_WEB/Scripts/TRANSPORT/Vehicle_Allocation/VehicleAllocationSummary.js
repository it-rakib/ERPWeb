var isAdmin = false;
var AllocationSummaryManager = {
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
                    url: _baseUrlTransport + '/api/VehicleAllocation/GetAllGridData',
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
    },
}
var AllocationSummaryHelper = {
    InitAllocationSummary: function () {
        $("#btnAddNew").click(function () {
            VehicleAllocationDetailsHelper.ClearForm();
            $("#divAllocationSummary").hide();
            $("#divAllocationDetails").show();
        });
        //isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        AllocationSummaryHelper.GenerateAllocationInfoGrid();
    },

    GenerateAllocationInfoGrid: function () {
        $("#grdAllocationSummary").kendoGrid({
            dataSource: AllocationSummaryManager.gridDataSource(),
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
                fields: ["RegNo", "CaseNo"]
            },
            columns: [
                { field: "VehicleAllocationId", hidden: true },
                { field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "VehicleName", title: "Vehicle Name", sortable: true },
                { field: "DriverName", title: "Driver", sortable: true },
                { field: "VehicleRouteName", title: "Route Name", sortable: true },
                { field: "CompanyName", title: "Company", sortable: true },
                { field: "UnitName", title: "Unit", sortable: true },
                { field: "ParkingLocation", title: "Parking Location", sortable: true },
                { field: "ParkingCost", title: "ParkingCost", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },               
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: AllocationSummaryHelper.ClickEventForVehicleAllocationEditButton
                    }], /*hidden: !isAdmin,*/ title: "&nbsp;"
                }
                //{
                //    command: [
                //        {
                //            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: AllocationSummaryHelper.ClickEventForDeleteButton
                //        }
                //    ], hidden: !isAdmin, title: "&nbsp;"
                //}

            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForVehicleAllocationEditButton: function (e) {
        e.preventDefault();
        var grid1 = $("#grdAllocationSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem1 = this.dataItem(tr);
        grid1.select(tr);
        if (selectedItem1 != null) {

            //$("#divCaseFile").show();
            $("#divAllocationSummary").hide();
            $("#divAllocationDetails").show();
            $("#btnSave").text("Update");

            VehicleAllocationDetailsHelper.FillAllocationForm(selectedItem1);
        }
    },
    //ClickEventForDeleteButton: function (e) {
    //    e.preventDefault();
    //    var text;
    //    if (confirm("Are you sure you want to delete?") == true) {
    //        var grid = $("#grdAllocationSummary").data("kendoGrid");
    //        var tr = $(e.currentTarget).closest("tr");
    //        var selectedItem = this.dataItem(tr);
    //        grid.select(tr);
    //        if (selectedItem != null) {
    //            selectedItem.IsDeleted = true;
    //            VehicleDetailsHelper.FillModelForm(selectedItem);
    //            VehicleInfoDetailsManager.SaveVehicleDetails();
    //        }
    //    } else {
    //        text = "Canceled!";
    //    }
    //},
}