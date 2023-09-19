var isAdmin = false;
var VehicleRequisitionApprovalSummaryManager = {
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
                    url: _baseUrlTransport + '/api/VehicleRequisition/GetAllPendingGridData',
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
var VehicleRequisitionApprovalSummaryHelper = {
    InitVehicleRequisitionApprovalSummary: function () {
        //$("#btnAddNew").click(function () {
        //    VehicleRequisitionApprovalDetailsHelper.ClearForm();
        //    $("#divVehicleRequisitionSummary").hide();
        //    $("#divVehicleRequisitionDetails").show();
        //});
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        VehicleRequisitionApprovalSummaryHelper.GenerateVehicleRequisitionApprovalGrid();
        VehicleRequisitionApprovalSummaryHelper.GeneratePassengerGrid();
    },

    GenerateVehicleRequisitionApprovalGrid: function () {
        $("#grdVehicleRequisition").kendoGrid({
            dataSource: VehicleRequisitionApprovalSummaryManager.gridDataSource(),
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
                { field: "VehicleRequisitionId", hidden: true },
                { field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "TimeFrom", title: "Time From", sortable: true, template: '#= kendo.toString(kendo.parseDate(TimeFrom), "hh:mm:ss tt") #' },
                { field: "TimeTo", title: "Time To", sortable: true, template: '#= kendo.toString(kendo.parseDate(TimeTo), "hh:mm:ss tt") #' },
                { field: "VehicleTypeName", title: "Vehicle Type", sortable: true },
                { field: "ToleranceDuration", title: "Tolerance Duration", sortable: true },
                { field: "WhereFrom", title: "Where From", sortable: true },
                { field: "NoOfPassenfer", title: "No Of Passenfer", sortable: true },
                { field: "WhereTo", title: "WhereTo", sortable: true },
                { field: "PickUp", title: "PickUp", sortable: true },
                { field: "VehicleRequisitionPurposeName", title: "Purpose", sortable: true },
                { field: "RequisitionDate", title: "Requisition Date", sortable: true, hidden: true, template: '#= kendo.toString(kendo.parseDate(RequisitionDate), "dd-MM-yyyy") #' },
                { field: "Details", title: "Details", sortable: true },
                { field: "StatusName", title: "Status", sortable: true },
                { field: "UserName", title: "Passenger", sortable: true, hidden: true },
                { field: "VehicleRequisitionTypeName", title: "Requisition Type", sortable: true },
                { field: "IsDeleted", hidden: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: VehicleRequisitionApprovalSummaryHelper.ClickEventForVehicleReqEditButton
                    }], /*hidden: !isAdmin,*/ title: "&nbsp;"
                },
                {
                    command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: VehicleRequisitionApprovalSummaryHelper.ClickEventForDeleteButton
                        }
                    ], hidden: !isAdmin, title: "&nbsp;"
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForVehicleReqEditButton: function (e) {
        e.preventDefault();
        var grid1 = $("#grdVehicleRequisition").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem1 = this.dataItem(tr);
        grid1.select(tr);
        if (selectedItem1 != null) {

            //$("#divCaseFile").show();
            $("#divVehicleRequisitionSummary").hide();
            $("#divVehicleRequisitionDetails").show();
            $("#btnSave").text("Update");

            VehicleRequisitionApprovalDetailsHelper.FillVehicleRequisitionForm(selectedItem1);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        var text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdVehicleRequisition").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                VehicleRequisitionApprovalDetailsHelper.FillVehicleRequisitionForm(selectedItem);
                VehicleRequisitionDetailsManager.SaveVehicleRequisitionDetails();
            }
        } else {
            text = "Canceled!";
        }
    },
    GeneratePassengerGrid: function () {
        $("#grdRequisitionEmp").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "VehiclePassengerId", hidden: true },
                { field: "VehicleRequisitionId", hidden: true },
                { field: "EmpId", hidden: true },
                { field: "Name", Title: "Name" },
                { field: "Stoppage", title: "Stoppage" },
                {
                    field: "Action", title: "Action", filterable: false, command: [
                        {
                            name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: VehicleRequisitionApprovalSummaryHelper.ClickEventForDeleteButtonPassenger
                        },
                        {
                            name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: VehicleRequisitionApprovalSummaryHelper.ClickEventForEditButtonPassenger
                        }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButtonPassenger: function (e) {
        e.preventDefault();
        var grid = $("#grdRequisitionEmp").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            VehicleRequisitionApprovalDetailsHelper.FillPassengerForm(selectedItem);
        }
    },
    ClickEventForDeleteButtonPassenger: function (e) {
        e.preventDefault();
        var grid = $("#grdRequisitionEmp").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < empList.length; i++) {
                if (empList[i].VehicleRequisitionId == selectedItem.VehicleRequisitionId && empList[i].VehiclePassengerId == selectedItem.VehiclePassengerId) {
                    empList.splice(i, 1);
                    break;
                }
            }
        }
    },
}