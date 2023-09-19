$(document).ready(function () {
    LegalDashboardSummaryHelper.InitDashboardSummary();
    UpdateDiaryDetailsHelper.InitUpdateDiaryDetails();
});

var isAdmin = false;
var LegalDashboardSummaryManager = {
    GetTotalLLCPending: function() {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalPendingLLC";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLLCDisposed: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalDisposedLLC";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLDCPending: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalPendingLDC";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLDCDisposed: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalDisposedLDC";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLHDPending: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalPendingLHD";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLHDDisposed: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalDisposedLHD";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLADPending: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalPendingLAD";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    GetTotalLADDisposed: function () {
        var objTotalCase = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/Dashboard/GetTotalDisposedLAD";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCase = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCase;
    },
    gridUpcomingCaseDataSource: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLegal + '/api/Dashboard/GetAllUpcomingDatedGridData',
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
            group: {
                field: "FileTypeName"
                //aggregates: [
                //    { field: "OwnerMutatedLandAmount", aggregate: "sum" }
                //]
            }
        });        
        return gridDataSource;
    },
    gridOverDatedCaseDataSource: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: '../LegalDashboard/GetAllOverDatedGridData/',
                    //url: _baseUrlLegal + '/api/Dashboard/GetAllOverDatedGridData',
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
            group: {
                field: "FileTypeName"
                //aggregates: [
                //    { field: "OwnerMutatedLandAmount", aggregate: "sum" }
                //]
            }
        });
        
        return gridDataSource;
    },
    GetUpdateDiaryByCaseFileId: function (caseFileId) {
        var objCaseFile = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/fileMasterByFileMasterId/" + $.trim(caseFileId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCaseFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCaseFile;
    }
}
var LegalDashboardSummaryHelper = {
    InitDashboardSummary: function () {
        LegalDashboardSummaryHelper.FillLLCPending();
        LegalDashboardSummaryHelper.FillLLCDisposed();
        LegalDashboardSummaryHelper.FillLDCPending();
        LegalDashboardSummaryHelper.FillLDCDisposed();
        LegalDashboardSummaryHelper.FillLHDPending();
        LegalDashboardSummaryHelper.FillLHDDisposed();
        LegalDashboardSummaryHelper.FillLADPending();
        LegalDashboardSummaryHelper.FillLADDisposed();
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        LegalDashboardSummaryHelper.GenerateUpcomingCaseGrid();
        LegalDashboardSummaryHelper.GenerateOverDatedCaseGrid();
        $("#btnBack1").click(function () {
                $("#divUpdateDiaryDetails").hide();
                $("#divCaseFileDetails").hide();
                $("#divCaseFileSummary").hide();
                $("#divCourt").show();
                $("#divGrid").show();
                //UpdateDiaryDetailsHelper.ClearForm();
            });
    },

    FillLLCPending: function () {
        var totalLLCPending = LegalDashboardSummaryManager.GetTotalLLCPending();
        $("#spnTotalLLCPending").html(totalLLCPending);
    },
    FillLLCDisposed: function () {
        var totalLLCDisposed = LegalDashboardSummaryManager.GetTotalLLCDisposed();
        $("#spnTotalLLCDisposed").html(totalLLCDisposed);
    },
    FillLDCPending: function () {
        var totalLDCPending = LegalDashboardSummaryManager.GetTotalLDCPending();
        $("#spnTotalLDCPending").html(totalLDCPending);
    },
    FillLDCDisposed: function () {
        var totalLDCDisposed = LegalDashboardSummaryManager.GetTotalLDCDisposed();
        $("#spnTotalLDCDisposed").html(totalLDCDisposed);
    },
    FillLHDPending: function () {
        var totalLHDPending = LegalDashboardSummaryManager.GetTotalLHDPending();
        $("#spnTotalLHDPending").html(totalLHDPending);
    },
    FillLHDDisposed: function () {
        var totalLHDDisposed = LegalDashboardSummaryManager.GetTotalLHDDisposed();
        $("#spnTotalLHDDisposed").html(totalLHDDisposed);
    },
    FillLADPending: function () {
        var totalLADPending = LegalDashboardSummaryManager.GetTotalLADPending();
        $("#spnTotalLADPending").html(totalLADPending);
    },
    FillLADDisposed: function () {
        var totalLADDisposed = LegalDashboardSummaryManager.GetTotalLADDisposed();
        $("#spnTotalLADDisposed").html(totalLADDisposed);
    },
    GenerateUpcomingCaseGrid: function () {
        $("#grdUpcomingCases").kendoGrid({
            dataSource: LegalDashboardSummaryManager.gridUpcomingCaseDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSize: 5,
            },
            filterable: true,
            sortable: true,
            toolbar: ["search"],
            search: {
                fields: ["RegNo", "CaseNo", "FileTypeName"]
            },
            columns: [
                { field: "FileMasterId", hidden: true },
                { field: "RegNo", title: "Reg No", sortable: true},
                { field: "FileTypeId", hidden: true },
                { field: "FileTypeName", title: "File Type", sortable: true},
                { field: "Petitioner", title: "Plaintiff", sortable: true },
                { field: "OppositeParty", title: "Opposite Party", sortable: true },
                { field: "CourtId", hidden: true },
                { field: "CourtName", title: "Court", sortable: true},
                { field: "CaseNo", title: "Case No", sortable: true },
                { field: "PreviousDate", title: "Previous Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PreviousDate), "dd-MM-yyyy") #' },
                { field: "NextDate", title: "Next Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(NextDate), "dd-MM-yyyy") #' },
                { field: "NextDateFor", title: "For", sortable: true },
                {
                    command: [{
                        name: "update", text: "", iconClass: "k-icon k-i-edit", className: "k-success", width: 50, click: LegalDashboardSummaryHelper.ClickEventForUpdateDairyButton
                    }], hidden: !isAdmin, title: "&nbsp;" , width: 80
                }//,
                //{
                //    command: [{
                //        name: "view", text: "", iconClass: "k-icon k-i-eye", className: "k-primary", width: 50, click: LegalDashboardSummaryHelper.ClickEventForCaseFileViewButtonUpcoming
                //    }], title: "&nbsp;", width: 60
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });        
    },
    GenerateOverDatedCaseGrid: function () {
        $("#grdOverDatedCase").kendoGrid({
            dataSource: LegalDashboardSummaryManager.gridOverDatedCaseDataSource(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            //pageable: {
            //    refresh: true,
            //    pageSizes: true,
            //    buttonCount: 5
            //},
            toolbar: ["search"],
            search: {
                fields: ["RegNo", "CaseNo", "FileTypeName"]
            },
            columns: [
                { field: "FileMasterId", hidden: true },
                { field: "RegNo", title: "Reg No", sortable: true},
                { field: "FileTypeId", hidden: true },
                { field: "FileTypeName", title: "File Type", sortable: true },
                { field: "Petitioner", title: "Plaintiff", sortable: true },
                { field: "OppositeParty", title: "Opposite Party", sortable: true },
                { field: "CourtId", hidden: true },
                { field: "CourtName", title: "Court", sortable: true },
                { field: "CaseNo", title: "Case No", sortable: true },
                { field: "PreviousDate", title: "Previous Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(PreviousDate), "dd-MM-yyyy") #' },
                { field: "NextDate", title: "Next Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(NextDate), "dd-MM-yyyy") #' },
                { field: "NextDateFor", title: "For", sortable: true },
                {
                    command: [{
                        name: "update", text: "", iconClass: "k-icon k-i-edit", className: "k-success", click: LegalDashboardSummaryHelper.ClickEventForUpdateDairyButton
                    }], hidden: !isAdmin, title: "&nbsp;", width: 80
                }
                //{
                //    command: [{
                //        name: "view", text: "", iconClass: "k-icon k-i-eye", className: "k-primary", click: LegalDashboardSummaryHelper.ClickEventForCaseFileViewButton
                //    }], title: "&nbsp;", width: 60
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForUpdateDairyButton: function (e) {
        
        e.preventDefault();
        var grid = $("#grdUpcomingCases").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            
            $("#divCourt").hide();
            $("#divGrid").hide();
            $("#divUpdateDiaryDetails").show();
            $("#btnSave").show();
            $("#btnSave").text("Update");
            $("#btnBack").hide();
            $("#btnBack1").show();
            LegalDashboardSummaryHelper.FillDiaryByFileChange(selectedItem.FileMasterId);
            LegalDashboardSummaryHelper.GenerateUpdateDiaryGrid(selectedItem.FileMasterId);
        }
    },
    FillDiaryByFileChange: function (caseFileId) {

        var bCostObj = LegalDashboardSummaryManager.GetUpdateDiaryByCaseFileId(caseFileId);
        if (bCostObj != null) {
            var obj = bCostObj[0];
            $("#hdnFileMasterId").val(obj.FileMasterId);
            $("#txtRegNo1").val(obj.RegNo);
            $("#txtCourt1").val(obj.CourtName);
            $("#txtCaseNo1").val(obj.CaseNo);
        }
    },
    GenerateUpdateDiaryGrid: function (fileMasterId) {
        $("#grdUpdateDiarySummary").kendoGrid({
            dataSource: UpdateDiaryDetailsManager.gridDataSource(fileMasterId),
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
                fields: ["RegNo"]
            },
            columns: [
                { field: "DiaryId", hidden: true },
                { field: "FileMasterId", hidden: true },
                { field: "RegNo", title: "Reg No", hidden: true },
                { field: "PreviousDate", title: "Previous Date", template: '#= kendo.toString(kendo.parseDate(PreviousDate), "dd-MM-yyyy") #' },
                { field: "PreviousDateFor", title: "Previous Date For" },
                { field: "NextDate", title: "Next Date", template: '#= kendo.toString(kendo.parseDate(NextDate), "dd-MM-yyyy") #' },
                { field: "NextDateFor", title: "Next Date For" },
                { field: "StatusName", title: "Status" },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: UpdateDiaryDetailsHelper.ClickEventForEditButton
                    }], hidden: !isAdmin, title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForCaseFileViewButtonUpcoming: function (e) {
        e.preventDefault();
        var grid1 = $("#grdUpcomingCases").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem1 = this.dataItem(tr);
        grid1.select(tr);
        if (selectedItem1 != null) {

            $("#divCourt").hide();
            $("#divGrid").hide();
            $("#divUpdateDiaryDetails").show();
            $("#btnSave").hide();
            //$("#btnSave").text("Update");
            LegalDashboardSummaryHelper.FillDiaryByFileChange(selectedItem.FileMasterId);
            LegalDashboardSummaryHelper.GenerateUpdateDiaryGrid(selectedItem.FileMasterId);

            LegalDashboardSummaryHelper.FillUpdateDiaryFormDisabled(selectedItem1);
        }
    },
    FillUpdateDiaryFormDisabled: function () {

    }
}