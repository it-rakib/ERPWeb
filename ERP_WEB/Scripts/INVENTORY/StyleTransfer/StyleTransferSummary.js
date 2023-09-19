var StyleTransferSummaryManager = {
    StyleTransferGridDataSource: function (userId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/StyleTransfer/GetAllStyleTransferOutInfoGrid/' +  $.trim(userId),
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
                    id: "STOutId",
                    fields: {
                        STOutDate: {
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

var StyleTransferSummaryHelper = {
    InitStyleTransferSummary: function () {
        StyleTransferSummaryHelper.GenerateStyleTransferGrid();
        StyleTransferSummaryHelper.LoadStyleTransferGridData();
    },
    GenerateStyleTransferGrid: function () {
        $("#grdStyleTransferSummary").kendoGrid({
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
            toolbar: ["search"],
            search: {
                fields: ["STOutNo"]
            },
            columns: [
                { field: "STOutId", hidden: true },
                { field: "STOutNo", title: "ST Out No", sortable: true },
                { field: "STOutDate", title: "Transfer Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(STOutDate==null?"":STOutDate), "dd-MMM-yyyy") #' },
                { field: "FromStyleNo", title: "From Style", sortable: true },
                { field: "ToStyleNo", title: "To Style", sortable: true },
                //{ field: "RequisitionNo", title: "Requisition No", sortable: true },
                { field: "Remarks", title: "Remarks", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: StyleTransferSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadStyleTransferGridData: function () {
        var grid = $("#grdStyleTransferSummary").data("kendoGrid");
        var gridData = StyleTransferSummaryManager.StyleTransferGridDataSource(CurrentUser.USERID);
        grid.setDataSource(gridData);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdStyleTransferSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            if (selectedItem.IsReceived === true) {
                $("#btnSave").hide();
                $("#lblMessage").text("Automatically Received! Can't update Now.");
            } else {
                $("#lblMessage").text("");
                $("#btnSave").show();
            }
            $("#divSummary").hide();
            $("#divDetails").show();
            StyleTransferDetailsHelper.FillStyleTransferMasterForm(selectedItem);
        }
    }
};