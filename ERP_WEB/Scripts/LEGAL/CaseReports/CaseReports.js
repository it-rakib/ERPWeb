$(document).ready(function () {
    CaseReportHelper.InitCaseReportSummary();
});
var CaseReportManager = {
    //gridDataSource: function (fileType, courtId, statusId, unitId) {
    //    
    //    var gridDataSource = new kendo.data.DataSource({
    //        type: "json",
    //        serverPaging: true,
    //        serverSorting: true,
    //        serverFiltering: true,
    //        allowUnsort: true,
    //        pageSize: 10,
    //        transport: {
    //            read: {
    //                url: '../CaseReports/GetCaseFileReportGrid/' + fileType + courtId + statusId + unitId,
    //                type: "POST",
    //                dataType: "json",
    //                contentType: "application/json;",
    //                cache: false,
    //                async: false
    //            },
    //            parameterMap: function (options) {
    //                return JSON.stringify(options);
    //            }
    //        },
    //        batch: true,
    //        schema: {
    //            model: {
    //            },
    //            data: "Items", total: "TotalCount"
    //        }
    //        //aggregate: [
    //        //    { field: "Amount", aggregate: "sum" }
    //        //]
    //    });
    //    
    //    return gridDataSource;
    //},
    GetCourt() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Court/all");
        return list == null ? [] : list;
    },
    GetFileType() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/FileType/all");
        return list == null ? [] : list;
    },
    GetReference() {
        var list = ApiManager.GetList("../Common/GetAllUnit/");
        return list == null ? [] : list;
    },
    GetStatus() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/Status/all");
        return list == null ? [] : list;
    },
    GetDistrict() {
        var list = ApiManager.GetList("../Common/GetAllDistrict/");
        return list == null ? [] : list;
    },
    GetMatter() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/MatterInfo/all");
        return list == null ? [] : list;
    },
    GetLawyers() {
        var list = ApiManager.GetList(_baseUrlLegal + "/api/LawyerInfo/all");
        return list == null ? [] : list;
    },
};
var CaseReportHelper = {
    InitCaseReportSummary: function () {
        //CaseReportHelper.GenerateDatePicker();
        CaseReportHelper.LoadFileTypeCombo("cmbFileType");
        CaseReportHelper.LoadUnitCombo("cmbUnit");
        CaseReportHelper.LoadStatusCombo("cmbStatus");
        CaseReportHelper.LoadCourtCombo("cmbCourt");
        CaseReportHelper.LoadDistrictCombo("cmbDistrict");
        CaseReportHelper.LoadMatterCombo("cmbMatter");
        CaseReportHelper.LoadAssignLawyerCombo("cmbAssignLawyer");
        //CaseReportHelper.GenerateCaseReportGrid();

        //$("#btnShow").click(function () {
        //    //$("#grdCaseRpt").show();
        //    CaseReportHelper.GenerateCaseReportGrid();
        //});
        $("#btnForRpt").click(function () {
            
            CaseReportHelper.LoadCaseReport();
        });
    },
    GenerateCaseReportGrid: function () {
        var fileType = $("#cmbFileType").data("kendoComboBox").value();
        if (fileType === "") {
            var fileTypeId = 0;
        } else {
            fileTypeId = $("#cmbFileType").data("kendoComboBox").value();
        }

        var court = $("#cmbCourt").data("kendoComboBox").value();
        if (court === "") {
            var courtId = 0;
        } else {
            courtId = $("#cmbCourt").data("kendoComboBox").value();
        }

        var status = $("#cmbStatus").data("kendoComboBox").value();
        if (status === "") {
            var statusId = 0;
        } else {
            statusId = $("#cmbStatus").data("kendoComboBox").value();
        }

        var unit = $("#cmbUnit").data("kendoComboBox").value();
        if (unit === "") {
            var unitId = 0;
        } else {
            unitId = $("#cmbUnit").data("kendoComboBox").value();
        }
        
        $("#grdCaseRpt").kendoGrid({
            dataSource: CaseReportManager.gridDataSource(fileTypeId, courtId, statusId, unitId),
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
            //    fields: ["CourtName", "StatusName"]
            //},
            columns: [
                { field: "SlNo", title: "SL No", sortable: true },
                { field: "RegNo", title: "Reg No", sortable: true },
                { field: "Petitioner", title: "Plaintiff", sortable: true },
                { field: "OppositeParty", title: "Opposite Party", sortable: true },
                { field: "CourtName", title: "Court", sortable: true },
                { field: "CaseNo", title: "Case No", sortable: true },
                { field: "StatusName", title: "Status", sortable: true },            
                { field: "NextDate", title: "Next Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(NextDate), "dd-MM-yyyy") #' }
               
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    LoadCaseReport: function () {
        debugger;
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
        var statusId = $("#cmbStatus").data("kendoComboBox").value();
        if (statusId === "") {
            var status = 0;
        } else {
            status = $("#cmbStatus").data("kendoComboBox").value();
        }
        var unitId = $("#cmbUnit").data("kendoComboBox").value();
        if (unitId === "") {
            var unit = 0;
        } else {
            unit = $("#cmbUnit").data("kendoComboBox").value();
        }

        var assignLawyer = $("#cmbAssignLawyer").data("kendoComboBox").value();
        if (assignLawyer === "") {
            var assignLawyer = 0;
        } else {
            assignLawyer = $("#cmbAssignLawyer").data("kendoComboBox").value();
        }

        var isPublish = $("#chkIsPublish").is(":checked");
        
        if (isPublish === false){
            isPublish = false;
        } else {
            isPublish = true;
        }

        var district = $("#cmbDistrict").data("kendoComboBox").value();
        
        if (district === "") {
            var district = 0;
        } else {
            district = $("#cmbDistrict").data("kendoComboBox").value();
        }
        
        var matter = $("#cmbMatter").data("kendoComboBox").value();
        if (matter === "") {
            var matter = 0;
        } else {
            matter = $("#cmbMatter").data("kendoComboBox").value();
        }
        var jsonParam = "";
        
        var serviceUrl = "../CaseReports/GetAllCaseData/?fileType=" + fileType + "&court=" + court + "&status=" + status + "&unit=" + unit + "&assignLawyer=" + assignLawyer + "&isPublish=" + isPublish + "&district=" + district + "&matter=" + matter;

        CaseReportHelper.GetReportForCase(serviceUrl, jsonParam, onFailed);
        
        function onFailed(error) {
            alert("Found Error");
        }
    },
    GetReportForCase: function (serviceUrl, jsonParam, errorCallback) {
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
    LoadCourtCombo(cmbCourt) {
        UtilityHelper.LoadCombo(cmbCourt, "CourtId", "CourtName",CaseReportManager.GetCourt(), "--Select Court--");
    },
    LoadFileTypeCombo(cmbFileType) {
        UtilityHelper.LoadCombo(cmbFileType, "FileTypeId", "FileTypeName", CaseReportManager.GetFileType(), "--Select File Type--");
    },
    LoadUnitCombo(cmbUnit) {
        UtilityHelper.LoadCombo(cmbUnit, "UnitId", "UnitName", CaseReportManager.GetReference(), "--Select Reference--");
    },
    LoadStatusCombo: function (cmbStatus) {
        UtilityHelper.LoadCombo(cmbStatus, "StatusId", "StatusName", CaseReportManager.GetStatus(), "--Select Status--");
    },
    LoadDistrictCombo(cmbDistrict) {
        UtilityHelper.LoadCombo(cmbDistrict, "DistrictID", "DistrictName", CaseReportManager.GetDistrict(), "--Select District--");
    },
    LoadMatterCombo(cmbMatter) {
        UtilityHelper.LoadCombo(cmbMatter, "MatterId", "MatterName", CaseReportManager.GetMatter(), "--Select Matter--");
    },
    LoadAssignLawyerCombo(cmbAssignLawyer) {
        UtilityHelper.LoadCombo(cmbAssignLawyer, "LawyerId", "LawyerName", CaseReportManager.GetLawyers(), "--Select Assign Lawyer--");
    },
    //GenerateDatePicker: function () {
    //    $("#txtFromDate").kendoDatePicker({
    //        format: "dd-MM-yyyy",
    //        value: new Date()
    //    });
    //    $("#txtToDate").kendoDatePicker({
    //        format: "dd-MM-yyyy",
    //        value: new Date()
    //    });
    //}
}