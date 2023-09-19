var PIInfoSummaryManager = {
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
                    url: _baseUrl + '/api/ProformaInvoice/GetAllPIGridAsync',
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
                        PIDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }

                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
};

var PIInfoSummaryHelper = {
    InitPIInfoSummary: function () {
        PIInfoSummaryHelper.GeneratePISummaryGrid();
    },
    GeneratePISummaryGrid: function () {
        $("#grdPISummary").kendoGrid({
            dataSource: PIInfoSummaryManager.gridDataSource(),
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
                { field: "PIId", hidden: true },
                { field: "PINo", title: "PI No", width: 40, sortable: true },
                { field: "PIDate", title: "PI Date", width: 40, sortable: true, template: '#=kendo.toString(PIDate==null?"":PIDate,"dd-MMM-yyyy")#' },
                { field: "SupplierName", title: "Supplier Name", width: 40, sortable: true },

                { field: "BankName", title: "Bank Name", width: 40, sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: PIInfoSummaryHelper.ClickEventForEditButton
                    }], width: 20, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["PINo"]
            }
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdPISummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            PIDetailsHelper.ResetForm();
            $("#divPIDetails").show();
            $("#divPISummary").hide();
            $("#btnSavePIInfo").text(" Update");
            $("#btnSavePIInfo").addClass("fa fa-save");
            PIDetailsHelper.FillPIDetailsForm(selectedItem);
        }
    }
};