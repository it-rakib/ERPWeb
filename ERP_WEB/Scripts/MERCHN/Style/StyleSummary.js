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
                    url: _baseUrl + '/api/Styles/GetAllGridData',
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
        debugger;
        return gridDataSource;
    },
};

var StyleSummaryHelper = {
    InitStyleSummary: function () {
        StyleSummaryHelper.GenerateStyleGrid();
    },
    GenerateStyleGrid: function () {
        $("#grdStyleSummary").kendoGrid({
            dataSource: StyleSummaryManager.gridDataSource(),
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
                //{ field: "CreatedAt", hidden: true, template: '#= kendo.toString(kendo.parseDate(CreatedAt), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true },
                { field: "StyleStatusName", title: "Status", sortable: true },
                { field: "ProductName", title: "Product Name", sortable: true },
                { field: "ProductTypeName", title: "Product Type", sortable: true },
                { field: "BuyerName", title: "Buyer", sortable: true },
                { field: "BrandName", title: "Brand", sortable: true },
                { field: "DepartmentName", title: "Department", sortable: true },
                { field: "AgentName", title: "Agent", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: StyleSummaryHelper.ClickEventForEditButton
                    }], title: "&nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    ClickEventForEditButton: function (e) {
        //debugger;
        e.preventDefault();
        var grid = $("#grdStyleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            debugger;
            $("#btnSave").text("Update");
            $("#btnSave").addClass("fa fa-save");
            SmHelper.ShowDetail();
            debugger;
            SmHelper.FillStyleForm(selectedItem, true);            
            if (selectedItem.StatusId == "c600cf8c-9927-49bc-970b-dc9f5d73a371") {
                $("#btnSave").hide();
                $("#lblMessage").html("This Style already Confirmed!");
            } else {
                $("#btnSave").show();
                $("#lblMessage").html("");
            }
        }
    }
};