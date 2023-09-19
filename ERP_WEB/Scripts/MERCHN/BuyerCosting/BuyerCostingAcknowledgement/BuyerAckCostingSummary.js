var BuyerCostingSummaryManager = {
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
                    url: _baseUrl + '/api/BuyerCosting/GetAllGridDataForAcknowledgement',
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
    },
};

var BuyerCostingSummaryHelper = {
    InitBuyerCostingSummary: function () {
        BuyerCostingSummaryHelper.GenerateBuyerCostingGrid();
    },
    GenerateBuyerCostingGrid: function () {
        $("#grdBuyerCostingSummary").kendoGrid({
            dataSource: BuyerCostingSummaryManager.gridDataSource(),
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
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "BrandName", title: "Brand", sortable: true },
                { field: "DepartmentName", title: "Department", sortable: true },
                { field: "SeasonName", title: "Season", sortable: true },
                { field: "Year", title: "Year", sortable: true },
                { field: "Cm", title: "CM / Pc", sortable: true },
                { field: "Fob", title: "FOB / Pc", sortable: true },
                { field: "CurrencyCode", title: "Currency", sortable: true },
                { field: "StatusName", title: "Status", sortable: true },
                { field: "AprrovedStatusName", title: "Ack. Status", sortable: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-preview k-i-eye", className: "k-success", click: BuyerCostingSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdBuyerCostingSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#btnSaveBuyerCost").text(" Update");
            $("#btnSaveBuyerCost").addClass("fa fa-save");

            $("#divBuyerCostingDetails").show();
            $("#divBuyerCostingSummary").hide();
            if (selectedItem.StatusId == "f08d8d7f-7e56-4aeb-bf2d-52ff1055b9d6") {
                $("#btnSaveBuyerCost").hide();
                $("#lblMessage").html("This buyer costing already Finalized!");
            } else {
                $("#btnSaveBuyerCost").show();
                $("#lblMessage").html("");
            }

            BuyerCostingHelper.ClearFullForms();
            BuyerCostingHelper.FillBuyerCostingDetailsForm(selectedItem);
        }
       
    }
};

