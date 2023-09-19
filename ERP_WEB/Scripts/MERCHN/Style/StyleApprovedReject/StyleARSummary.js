var StyleSummaryManager = {
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
                    url: _baseUrl + '/api/Styles/GetAllGridDataForAcknowledgement',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
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

var StyleARSummaryHelper = {
    InitStyleSummary: function () {
        StyleARSummaryHelper.GenerateStyleGrid();
        StyleARSummaryHelper.LoadStyleMAsterGridData();
    },
    GenerateStyleGrid: function () {
        $("#grdStyleSummary").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: StyleARSummaryHelper.GenerateStyleMAsterColumns(),
            editable: false,
            navigatable: true,
            selectable: "row"
        });
    },
    GenerateStyleMAsterColumns: function () {
        return columns = [
            { field: "StyleId", hidden: true },
            //{ field: "CreatedAt", hidden: true, template: '#= kendo.toString(kendo.parseDate(CreatedAt), "dd-MMM-yyyy") #' },
            { field: "StyleNo", title: "Style No", width: 100, sortable: true },
            { field: "StyleStatusName", title: "Status", width: 60, sortable: true },
            { field: "ProductName", title: "Product Name", width: 60, sortable: true },
            { field: "ProductTypeName", title: "Product Type", width: 60, sortable: true },
            { field: "BuyerName", title: "Buyer", width: 60, sortable: true },
            { field: "BrandName", title: "Brand", width: 60, sortable: true },
            { field: "DepartmentName", title: "Department", width: 60, sortable: true },
            { field: "AgentName", title: "Agent", width: 60, sortable: true },
            { field: "StyleAcckStatusName", width: 60, title: "Acck Status", sortable: true },
            {
                field: "",width: 30, command: [{
                    name: "edit", text: "Details", iconClass: "k-icon k-i-eye", className: "k-primary", click: StyleARSummaryHelper.ClickEventForEditButton
                }], title: "Action &nbsp;"
            }

        ];
    },
   
    LoadStyleMAsterGridData: function () {
        var grid = $("#grdStyleSummary").data("kendoGrid");
        var data = StyleSummaryManager.gridDataSource();
        grid.setDataSource(data);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();

        var grid = $("#grdStyleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            console.log(selectedItem);
            SmARHelper.ShowDetail();
            SmARHelper.FillStyleForm(selectedItem, true);
        }
    }
};