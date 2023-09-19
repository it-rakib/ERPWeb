var SubContractReturnSummaryManager = {
    SubContractReturnGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/SubContractReturn/GetAllSubContractReturnInfoGrid/' + userId,
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
                    id: "IssueId",
                    fields: {
                        IssueDate: {
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

var SubContractReturnSummaryHelper = {
    InitSubContractReturnSummary: function () {
        SubContractReturnSummaryHelper.GenerateSubContractReturnGrid();
        SubContractReturnSummaryHelper.LoadSubContractReturnGridDataSource();
    },
    GenerateSubContractReturnGrid: function () {
        $("#grdSubContractReturnSummary").kendoGrid({
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
                { field: "IssueId", hidden: true },
                { field: "IssueNo", title: "Return No", sortable: true },
                { field: "IssueDate", title: "Return Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(IssueDate==null?"":IssueDate), "dd-MMM-yyyy") #' },
                { field: "StyleNo", title: "Style No", sortable: true },
                //{ field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: SubContractReturnSummaryHelper.ClickEventForEdit
                    }], title: "Action &nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            toolbar: ["search"],
            search: {
                fields: ["IssueNo"]
            }
        });
    },
    LoadSubContractReturnGridDataSource: function () {
        var grid = $("#grdSubContractReturnSummary").data("kendoGrid");
        var data = SubContractReturnSummaryManager.SubContractReturnGridDataSource(CurrentUser.USERID);
        grid.setDataSource(data);
    },
    ClickEventForEdit: function (e) {
        e.preventDefault();
        var grid = $("#grdSubContractReturnSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnSave").hide();
                $("#lblMessage").text("Already Received! Can't Update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
            }
            $("#divSummary").hide();
            $("#divDetails").show();
            SubContractReturnDetailsHelper.FillSubContractReturnMasterForm(selectedItem);
        }
    }
};