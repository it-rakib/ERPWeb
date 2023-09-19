var DemandSummaryManager = {
  
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
                    url: _baseUrl + '/api/PurDemands/GetDemandGrid',
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
                    id: "DemandId",
                    fields: {
                        DemandId: { editable: false },
                        DemandNo: { type: "string", validation: { required: true } },
                        DemandDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        DueDate: {
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
var DemandSummaryHelper = {
    Init() {
        DemandSummaryHelper.GenerateDemandGrid();
    },
    GenerateDemandGrid() {
        $("#grdDemandSummary").kendoGrid({
            dataSource: DemandSummaryManager.gridDataSource(),
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
                fields: ["DemandNo"]
            },
            resizable: true,
            reorderable:true,
            columns: [
                { field: "DemandNo", title: "Demand No", sortable: true },
                { field: "DemandDate", title: "Demand Date", sortable: true, template: '#=kendo.toString(DemandDate==null?"-":DemandDate,"dd-MMM-yyyy")#' },
                { field: "DueDate", title: "Due Date", sortable: true, template: '#=kendo.toString(DueDate==null?"-":DueDate,"dd-MMM-yyyy")#' },
                { field: "StatusName", title: "Status", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: DemandSummaryHelper.GridItemEdit
                    },
                        //{
                        //name: "delete", text: "Delete", iconClass: "k-icon k-i-trash", className: "k-success", click: DemandSummaryHelper.GridItemRemove
                        //}
                    ], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });


    },
    GridItemEdit(e) {
        e.preventDefault();
        var grid = $("#grdDemandSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            //if (selectedItem.StatusId == "b4fb922a-ec21-4294-bf48-dd9983379615") {
            //    AjaxManager.MsgBox('error', 'center', 'Error1', "Edit not possible, already send to procurement.",
            //        [{
            //            addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
            //                $noty.close();
            //            }
            //        }]);
            //    return;
            //}
            DemandDetailsHelper.SetInformations(selectedItem);
        }
    },
    GridItemRemove(e) {
        e.preventDefault();
        var grid = $("#grdDemandSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
        }
    },
};