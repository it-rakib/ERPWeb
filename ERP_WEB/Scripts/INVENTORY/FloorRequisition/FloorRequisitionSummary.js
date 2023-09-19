var FloorRequisitionSummaryManager = {
    gridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/FloorRequisition/GetAllFloorRequisitionGridInfo/'+ userId,
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
                    id: "RequisitionId",
                    fields: {
                        RequisitionDate: {
                            type: "date", editable: false
                        }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var FloorRequisitionSummaryHelper = {
    InitFloorRequisitionSummary: function () {
        FloorRequisitionSummaryHelper.GenerateFloorRequisitionGrid();
        FloorRequisitionSummaryHelper.LoadGridData();
    },
    GenerateFloorRequisitionGrid: function () {
        $("#grdFloorRequisitionSummary").kendoGrid({
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
                { field: "RequisitionId", hidden: true },
                { field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "RequisitionDate", title: "Requisition Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(RequisitionDate==null?"":RequisitionDate), "dd-MMM-yyyy") #' },
                { field: "TransTypeId", hidden: true },
                { field: "TransTypeName", title: "Requisition For", sortable: true },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "StoreFromName", title: "From Floor", sortable: true },
                { field: "StoreToName", title: "To Store", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: FloorRequisitionSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadGridData: function () {
        var grid = $("#grdFloorRequisitionSummary").data("kendoGrid");
        var gridData = FloorRequisitionSummaryManager.gridDataSource(CurrentUser.USERID);
        grid.setDataSource(gridData);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdFloorRequisitionSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsIssued === true) {
                $("#btnSave").hide();
                $("#lblMessage").text("Already Issued! Can't update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
            }
            $("#divFloorRequisitionSummary").hide();
            $("#divFloorRequisitionDetails").show();
            FloorRequisitionDetailsHelper.FillFloorRequisitionMasterForm(selectedItem);
        }
    }
};