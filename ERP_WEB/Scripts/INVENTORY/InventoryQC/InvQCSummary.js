var InvQCSummaryManager = {
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
                    url: _baseUrl + '/api/InvQC/GetAllQCInfo',
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
                    id: "Qcid",
                    fields: {
                        Qcdate: {
                            type: "date", editable: false
                        },
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    GetQCReturnCauseByQCId: function (qcId) {
        var objCauseList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/InvQC/GetQCReturnCauseByQCId/" + qcId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCauseList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCauseList;
    }
};

var InvQCSummaryHelper = {
    InitInvQCSummary: function () {
        InvQCSummaryHelper.GenerateInventoryQCGrid();
        InvQCSummaryHelper.LoadQCGrid();
    },
    GenerateInventoryQCGrid: function () {
        $("#grdInvQCSummary").kendoGrid({
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
                { field: "Qcid", hidden: true },
                { field: "Qcno", title: "QC No", sortable: true },
                { field: "Qcdate", title: "QC Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(Qcdate==null?"":Qcdate), "dd-MMM-yyyy") #' },
                { field: "PINo", title: "PI No", sortable: true },
                { field: "ConsignmentNo", title: "Consignment No", sortable: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: InvQCSummaryHelper.ClickEventForEditButton
                    }], title: "Action &nbsp;"
                }],
            toolbar: [{ name: "search", text: "Search By QC No" }],
            search: {
                fields: ["Qcno"]
            },
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadQCGrid: function () {
        var grid = $("#grdInvQCSummary").data("kendoGrid");
        var qcGridData = InvQCSummaryManager.gridDataSource();
        grid.setDataSource(qcGridData);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdInvQCSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divQCSummary").hide();
            $("#divQCDetails").show();
            InvQCDetailsHelper.FillQCMasterForm(selectedItem);
        }
    }
};