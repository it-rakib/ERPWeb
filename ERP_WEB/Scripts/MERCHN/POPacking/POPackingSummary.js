var POPackingSummaryManager = {
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
                    url: _baseUrl + '/api/POPackingList/GetAllPOPackingGridData',
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
                    fields: {
                        //PackingDate: {
                        //    type: "date",
                        //    template: '#= kendo.toString("dd-MMM-yyyy") #',
                        //    editable: false
                        //}

                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var POPackingSummaryHelper = {
    InitPOPackingSummary: function () {
        POPackingSummaryHelper.GeneratePOPackingSummaryGrid();
    },
    GeneratePOPackingSummaryGrid: function () {

        $("#grdPOPackingSummary").kendoGrid({
            dataSource: POPackingSummaryManager.gridDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            //noRecords: {
            //    template: "<label>NO DATA FOUND</label>"
            //},
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "PopackingId", hidden: true },
                //{ field: "PackingNo", title: "Packing No", width: 40, sortable: true },
                //{ field: "PackingDate", title: "Date", width: 40, sortable: true, template: '#=kendo.toString(PackingDate==null?"":PackingDate,"dd-MMM-yyyy")#' },
                { field: "Pono", title: "PO No", width: 40, sortable: true },
                { field: "PcsPerCarton", title: "Pcs Per Carton", width: 40, sortable: true },

//              { field: "BankName", title: "Bank Name", width: 40, sortable: true },
//              {
//                  command: [{
//                      name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: PIInfoSummaryHelper.ClickEventForEditButton
//                  }], width: 20, title: "&nbsp;"
//              }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["PONo"]
            }
        });
    },
    //ClickEventForEditButton: function (e) {
    //    e.preventDefault();
    //    var grid = $("#grdPISummary").data("kendoGrid");
    //    var tr = $(e.currentTarget).closest("tr");
    //    var selectedItem = this.dataItem(tr);
    //    grid.select(tr);
    //    if (selectedItem != null) {
    //        PIDetailsHelper.ResetForm();
    //        $("#divPIDetails").show();
    //        $("#divPISummary").hide();
    //        PIDetailsHelper.FillPIDetailsForm(selectedItem);
    //    }
    //}
};