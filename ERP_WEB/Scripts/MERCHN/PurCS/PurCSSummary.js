var PurCSSummaryManager = {
    gridDataSource() {
        var apiName = _isReportingUser ? "GetPendingCSListForApprove" : "GetCSGridList";
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/PurCSs/' + apiName + '/' + CurrentUser.USERID,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    cache: false,
                    async: false
                },
                parameterMap(options) {
                    return JSON.stringify(options);
                }
            },
            batch: true,
            schema: {
                model: {
                    id: "CSId",
                    fields: {
                        CSDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        RFQDate: {
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
var PurCSSummaryHelper = {
    Init() {
        if (_isReportingUser) $(".btnSave").text("Approve");
        PurCSSummaryHelper.GeneratePurCSGrid();
    },
    GeneratePurCSGrid() {
        var gridColumns = [];
        if (_isReportingUser) {
            gridColumns = [
                { field: "CSNo", title: "CS No", sortable: true },
                { field: "CSDate", title: "CS Date", sortable: true, template: '#=kendo.toString(CSDate==null?"-":CSDate,"dd-MMM-yyyy")#' },
                { field: "RFQNo", title: "RFQ No", sortable: true },
                { field: "RFQDate", title: "RFQ Date", sortable: true, template: '#=kendo.toString(RFQDate==null?"-":RFQDate,"dd-MMM-yyyy")#' },
                { field: "CSByName", title: "CS By", sortable: true },
                {
                    field: "Action",
                    command: [
                        {
                            name: "Edit1", text: "", iconClass: "k-icon k-i-eye", className: "k-success", click: PurCSSummaryHelper.ReadCS
                        }
                    ], title: "&nbsp;"
                }
            ];
        } else {
            gridColumns = [
                { field: "RFQNo", title: "RFQ No", sortable: true },
                { field: "StatusName", title: "Status", sortable: true }
            ];
        }
        $("#gridPurCSSummary").kendoGrid({
            dataSource: PurCSSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: gridColumns,
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ReadCS(e) {
        if (_isReportingUser) {
            e.preventDefault();
            var grid = $("#gridPurCSSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if ( selectedItem != null ) {
                debugger;
                PurCSDetailHelper.Reset();
                PurCSDetailHelper.SetInfo(selectedItem);
                PurCSDetailHelper.ShowDetail();

                $(".divQuotation").hide();
                $(".divSupplier").removeClass("col-md-9").addClass("col-md-12");
                PurCSDetailHelper.GenerateRightGrid(selectedItem, selectedItem.CSBy, CurrentUser.USERID);
                PurCSDetailHelper.CheckCSSuppliers(selectedItem);
            }
        }
    },
    //GridItemRemove(e) {
    //    e.preventDefault();
    //    var grid = $("#gridPurCSSummary").data("kendoGrid");
    //    var tr = $(e.currentTarget).closest("tr");
    //    var selectedItem = this.dataItem(tr);
    //    grid.select(tr);
    //    if (selectedItem != null) {
    //        grid.dataSource.remove(selectedItem);
    //    }
    //},
};