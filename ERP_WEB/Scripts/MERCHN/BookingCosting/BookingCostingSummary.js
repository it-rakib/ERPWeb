var BookingCostingSummaryManager = {
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
                    url: _baseUrl + '/api/BOM/GetAllBOMGrid',
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
                        styleNo: { type: "string", validation: { required: true } },
                        BOMCreateDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var BookingCostingSummaryHelper = {
    InitBookingCostingSummary: function () {
        BookingCostingSummaryHelper.GenerateBookingCostingGrid();
    },
    GenerateBookingCostingGrid: function () {
        $("#grdBookingCostingSummary").kendoGrid({
            dataSource: BookingCostingSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: [
                { field: "StyleId", hidden: true },
                { field: "BOMId", hidden: true },
                { field: "BOMNo", title: "BOM No.", sortable: true },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "CurrencyCode", title: "Currency" },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "BrandName", title: "Brand", sortable: true },
                { field: "DepartmentName", title: "Department", sortable: true },
                { field: "SeasonName", title: "Season", sortable: true },
                { field: "Year", title: "Year", sortable: true },
                { field: "StatusName", title: "Status", sortable: true },
                { field: "BOMCreateDate", title: "Create Date", sortable: true, template: '#=kendo.toString(BOMCreateDate==null?"":BOMCreateDate,"dd-MMM-yyyy")#' },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: BookingCostingSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    ClickEventForEditButton: function (e) {
        debugger;
        e.preventDefault();
        var grid = $("#grdBookingCostingSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            
            $("#divBookingCostingDetails").show();
            $("#divBookingCostingSummary").hide();
            BookingCostingHelper.ClearFullForms();
            $("#btnSaveBookingCost").text(" Update");
            $("#btnSaveBookingCost").addClass("fa fa-save");
            //$("#btnSaveBookingCost").text("Update");
            BookingCostingHelper.FillBookingCostingDetailsForm(selectedItem);
        }
    }
};