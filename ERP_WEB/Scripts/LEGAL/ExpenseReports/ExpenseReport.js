$(document).ready(function () {
    ExpenseReportHelper.InitExpenseReportSummary();
});

var ExpenseReportManager = {
    gridDataSource: function (fromDate, toDate, fileType, court, caseNo) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    
                    url: "../ExpenseReports/GetAllExpenseGridDataByDate/?fromDate=" + fromDate + "&toDate=" + toDate + "&fileType=" + fileType + "&court=" + court + "&caseNo=" + caseNo,
                    //url: _baseUrlLegal + '/api/ExpenseReport/GetAllExpenseGridDataByDate/' + fromDate+'/'+ toDate,
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

                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "Amount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GetCourt() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Court/all");
        return list == null ? [] : list;
    },
    GetFileType() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/FileType/all");
        return list == null ? [] : list;
    },
    GetCourt() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Court/all");
        return list == null ? [] : list;
    },
    GetCase() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/CaseFileMaster/all");
        return list == null ? [] : list;
    }
};

var ExpenseReportHelper = {
    InitExpenseReportSummary: function () {
        ExpenseReportHelper.GenerateDatePicker();
        ExpenseReportHelper.LoadFileTypeCombo("cmbFileType");
        ExpenseReportHelper.LoadCourtCombo("cmbCourt");
        ExpenseReportHelper.LoadCaseCombo("txtCaseNo");
        $("#btnShow").click(function () {
            $("#divExpenseReportGrid").show();
            ExpenseReportHelper.GenerateExpenseReportGrid();
        });
        $("#btnForRpt").click(function () {
            ExpenseReportHelper.LoadExpenseReport();
        });
    },

    GenerateExpenseReportGrid: function () {
        debugger;
        var fromDate = kendo.toString($("#txtFromDate").data("kendoDatePicker").value(), "dd-MM-yyyy");
        var toDate = kendo.toString($("#txtToDate").data("kendoDatePicker").value(), "dd-MM-yyyy");
        var fileTypeId = $("#cmbFileType").data("kendoComboBox").value();
        if (fileTypeId === "") {
            var fileType = 0;
        } else {
            fileType = $("#cmbFileType").data("kendoComboBox").value();
        }

        var courtId = $("#cmbCourt").data("kendoComboBox").value();

        if (courtId === "") {
            var court = 0;
        } else {
            court = $("#cmbCourt").data("kendoComboBox").value();
        }
        var caseId = $("#txtCaseNo").data("kendoComboBox").value();
        if (caseNum === "") {
            caseNo = "";
        } else {
            caseNo = $("#txtCaseNo").val();
        }
        $("#grdExpenseRpt").kendoGrid({
            dataSource: ExpenseReportManager.gridDataSource(fromDate, toDate, fileType,court,caseNo),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            //toolbar: ["search"],
            //search: {
            //    fields: ["RegNo"]
            //},
            columns: [
                { field: "RegNo", title: "Reg No", hidden: true },
                { field: "RegNo", title: "Reg No", hidden: true },
                { field: "CaseNo", title: "Case No" },
                { field: "FileTypeName", title: "File Type", sortable: true },
                { field: "CourtName", title: "Court", sortable: true },
                { field: "IsPublish", title: "Status" },
                { field: "ExpenseDate", title: "Expense Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(ExpenseDate), "dd-MM-yyyy") #' },
                { field: "ExpenseName", title: "Expense Name", sortable: true },
                {
                    field: "Amount", title: "Expense Name", sortable: true,
                    headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" },
                    aggregates: ["sum"], footerTemplate: "Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}",
                    footerAttributes: { style: "text-align: right" }
                }
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: UpdateDiarySummaryHelper.ClickEventForEditButton
                //    }], hidden: !isAdmin, title: "&nbsp;"
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    GenerateDatePicker: function () {
        $("#txtFromDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
        $("#txtToDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    LoadFileTypeCombo(cmbFileType) {
        UtilityHelper.LoadCombo(cmbFileType, "FileTypeId", "FileTypeName", ExpenseReportManager.GetFileType(), "--Select File Type--");
    },
    LoadCourtCombo(cmbCourt) {
        UtilityHelper.LoadCombo(cmbCourt, "CourtId", "CourtName", ExpenseReportManager.GetCourt(), "--Select Court--");
    },
    LoadCaseCombo(txtCaseNo) {
        UtilityHelper.LoadCombo(txtCaseNo, "FileMasterId", "CaseNo", ExpenseReportManager.GetCase(), "--Select Case--");
    },
    LoadExpenseReport: function () {
        var fromDate = kendo.toString($("#txtFromDate").data("kendoDatePicker").value(), "dd-MM-yyyy");
        var toDate = kendo.toString($("#txtToDate").data("kendoDatePicker").value(), "dd-MM-yyyy");
        var fileTypeId = $("#cmbFileType").data("kendoComboBox").value();
        if (fileTypeId === "") {
            var fileType = 0;
        } else {
            fileType = $("#cmbFileType").data("kendoComboBox").value();
        }

        var courtId = $("#cmbCourt").data("kendoComboBox").value();
        var court;
        if (courtId === "") {
            court = 0;
        } else {
            court = $("#cmbCourt").data("kendoComboBox").value();
        }

        var caseNum =$("#txtCaseNo").data("kendoComboBox").value();
        var caseNo;
        if (caseNum === "") {
            caseNo = 0;
        } else {
            caseNo = $("#txtCaseNo").data("kendoComboBox").value();
        }

        var jsonParam = "";
        var serviceUrl = "../ExpenseReports/GetAllExpenseDataByDate/?fromDate=" + fromDate + "&toDate=" + toDate + "&fileType=" + fileType + "&court=" + court + "&caseNo=" + caseNo;
        
        ExpenseReportHelper.GetReportForExpense(serviceUrl, jsonParam, onFailed);
        
        function onFailed(error) {
            alert("Found Error");
        }
    },
    GetReportForExpense: function (serviceUrl, jsonParam, errorCallback) {
        jQuery.ajax({
            url: serviceUrl,
            async: false,
            type: "POST",
            data: "{" + jsonParam + "}",
            contentType: "application/json; charset=utf-8",
            success: function () {
                
                window.open('../LegalReports/ReportViewerLegal.aspx', '_newtab');
            },
            error: errorCallback
        });
    },
}