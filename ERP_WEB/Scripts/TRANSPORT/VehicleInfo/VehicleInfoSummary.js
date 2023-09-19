var isAdmin = false;
var VehicleInfoSummaryManager = {
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
                    url: _baseUrlTransport + '/api/VehicleInfo/GetAllGridData',
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
var VehicleInfoSummaryHelper = {
    InitVehicleInfoSummary: function () {
        $("#btnAddNew").click(function () {
            VehicleDetailsHelper.ClearForm();
            $("#divVehicleSummary").hide();
            $("#divVehicleDetails").show();
        });
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);       
        VehicleInfoSummaryHelper.GenerateVehicleInfoGrid();
    },

    GenerateVehicleInfoGrid: function () {
        $("#grdVehicleInfoSummary").kendoGrid({
            dataSource: VehicleInfoSummaryManager.gridDataSource(),
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
                { field: "VehicleId", hidden: true },
                { field: "VehicleName", title: "Vehicle Name", sortable: true },
                { field: "VehicleCategoryName", title: "Category", sortable: true },
                { field: "DepartmentName", title: "Department", sortable: true, hidden:true },
                { field: "DivisionName", title: "Division", sortable: true, hidden: true },
                { field: "RegistrationDate", title: "Registration Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(RegistrationDate), "dd-MM-yyyy") #' },
                { field: "RtacircleOfficeName", title: "Rta Circle Office", sortable: true, hidden: true },
                { field: "LicensePlate", title: "License Plate", sortable: true },
                { field: "VendorName", title: "Vendor", sortable: true, hidden: true },
                { field: "SeatCapacity", title: "Seat Capacity", sortable: true },
                { field: "OwnerShipName", title: "OwnerShip", sortable: true },
                { field: "VehicleManualId", title: "Manual-Id", sortable: true, hidden: true },
                { field: "VehicleNo", title: "Vehicle No", sortable: true },
                { field: "EngineNo", title: "Engine No", sortable: true, hidden: true },
                { field: "AirCondition", title: "Air Condition", sortable: true, hidden: true },
                { field: "VehicleConditionName", title: "Vehicle Condition", sortable: true, hidden: true },
                { field: "VehicleBrandName", title: "Brand", sortable: true },
                { field: "ModelName", title: "Model", sortable: true },
                { field: "RentalCompany", title: "Rental Company", sortable: true, hidden: true },
                { field: "RentalContact", title: "Rental Contact", sortable: true, hidden: true },
                { field: "RentAmnt", title: "Rent Amnt", sortable: true, hidden: true },
                { field: "RentPayDate", title: "Pay Date", sortable: true, hidden: true, template: '#= kendo.toString(kendo.parseDate(RentPayDate), "dd-MM-yyyy") #' },
                { field: "RentAccountName", title: "Account", sortable: true, hidden: true },
                { field: "RentStartDate", title: "Start Date", sortable: true, hidden: true ,template: '#= kendo.toString(kendo.parseDate(RentStartDate), "dd-MM-yyyy") #' },
                { field: "PrimaryFuelTypeName", title: "Primary Fuel", sortable: true},
                { field: "PrimaryFuelLimit", title: "Fuel Limit", sortable: true},
                { field: "SecondaryFuelTypeName", title: "Secondary Fuel", sortable: true, hidden: true },
                { field: "SecondaryFuelLimit", title: "Fuel Limit", sortable: true, hidden: true },
                { field: "FuelPerLitre", title: "Fuel Per ltr", sortable: true },
                { field: "IsDeleted", hidden: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: VehicleInfoSummaryHelper.ClickEventForVehicleEditButton
                    }], /*hidden: !isAdmin,*/ title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: VehicleInfoSummaryHelper.ClickEventForDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;"
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForVehicleEditButton: function (e) {
        e.preventDefault();
        var grid1 = $("#grdVehicleInfoSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem1 = this.dataItem(tr);
        grid1.select(tr);
        if (selectedItem1 != null) {

            //$("#divCaseFile").show();
            $("#divVehicleSummary").hide();
            $("#divVehicleDetails").show();
            $("#btnSave").text("Update");

            VehicleDetailsHelper.FillModelForm(selectedItem1);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdVehicleInfoSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                VehicleDetailsHelper.FillModelForm(selectedItem);
                VehicleInfoDetailsManager.SaveVehicleDetails();
            }
        } else {
            text = "Canceled!";
        }
    },


}