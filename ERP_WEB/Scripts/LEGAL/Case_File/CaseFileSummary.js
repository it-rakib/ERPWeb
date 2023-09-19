var isAdmin = false;
var CaseFileSummaryManager = {
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
                    url: _baseUrlLegal + '/api/CaseFileMaster/GetAllGridData',
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
            }
        });
        
        return gridDataSource;
    },
}
var CaseFileSummaryHelper = {
    InitCaseFileSummary: function () {
        $("#btnAddNew").click(function () {
            
            CaseFileDetailsHelper.ClearForm();
            $("#divCaseFileSummary").hide();
            $("#divCaseFileDetails").show();
        });
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        CaseFileSummaryHelper.GenerateCaseFileGrid();
    },

    GenerateCaseFileGrid: function () {
        $("#grdCaseFileSummary").kendoGrid({
            dataSource: CaseFileSummaryManager.gridDataSource(),
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
                fields: ["RegNo", "CaseNo" ]
            },
            columns: [
                { field: "FileMasterId", hidden: true },
                { field: "RegNo", title: "Reg No", width:90, sortable: true },
                { field: "FileTypeName", title: "File Type", width: 90, sortable: true },
                { field: "DistrictName", title: "District", width: 90, sortable: true },
                { field: "Petitioner", title: "Petitioner",width: 90,sortable: true },
                { field: "OppositeLawyer", title: "Opposite Lawyer",width: 90, sortable: true },
                //{ field: "JurisdictionName", title: "Jurisdiction", sortable: true },
                { field: "CourtName", title: "Court",width: 90, sortable: true },
                { field: "CaseNo", title: "Case No", width: 90, sortable: true },
                { field: "FillingLawyer", title: "Filing Lawyer", width: 90, sortable: true },
                { field: "AssignLawyerName", title: "Assign Lawyer", width: 90, sortable: true },
                { field: "Discription", title: "Discription", width: 90, sortable: true },
                { field: "MatterName", title: "Matter", width: 90, sortable: true },
                { field: "OppositeParty", title: "Opposite Party", width: 90, sortable: true },
                { field: "CompanyName", title: "Ref. Company",width: 90,sortable: true },
                { field: "UnitName", title: "Reference", width: 90, sortable: true },
                { field: "IsPublish", title: "Is Publish", width: 90, hidden: true },
                { field: "StatusName", title: "Status", width: 90, sortable: true },
                { field: "IsDeleted", title: "Is Deleted", sortable: true, hidden: true },
                {
                    command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-plus", className: "k-success", click: CaseFileSummaryHelper.ClickEventForUpdateDairyButton
                    }],
                    title: "&nbsp;", width: 50
                },
                {
                    command: [{
                        name: "update", text: "", iconClass: "k-icon k-i-edit", className: "k-success", width: 50, click: CaseFileSummaryHelper.ClickEventForCaseFileEditButton
                    }], hidden: !isAdmin, title: "&nbsp;",width: 50
                },
                {
                    command: [{
                        name: "view", text: "", iconClass: "k-icon k-i-eye", className: "k-primary", width: 50, click: CaseFileSummaryHelper.ClickEventForCaseFileViewButton
                    }], title: "&nbsp;", width: 50
                },
                {
                    command: [
                        {
                            name: "delete", text: "", iconClass: "k-icon k-i-delete", className: "k-danger", width: 50, click: CaseFileSummaryHelper.ClickEventForDeleteButtonLandMaster
                        }
                    ], hidden: !isAdmin, title: "&nbsp;", width: 50
                }
               
            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForUpdateDairyButton: function (e) {
        e.preventDefault();
        var grid = $("#grdCaseFileSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            
            $("#divCaseFileSummary").hide();
            $("#divCaseFileDetails").hide();
            $("#divUpdateDiaryDetails").show();
            $("#btnBack1").hide();
            UpdateDiaryDetailsHelper.FillDiaryByFileChange(selectedItem.FileMasterId);            
            UpdateDiaryDetailsHelper.GenerateUpdateDiaryGrid(selectedItem.FileMasterId);
        }

    },
    ClickEventForCaseFileEditButton: function (e) {
        e.preventDefault();
        var grid1 = $("#grdCaseFileSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem1 = this.dataItem(tr);
        grid1.select(tr);
        if (selectedItem1 != null) {      
            
            //$("#divCaseFile").show();
            $("#divCaseFileDetails").show();
            $("#divCaseFileSummary").hide();
            $("#divUpdateDiaryDetails").hide();
            $("#btnSave").show();
            $("#btnSave").text("Update");
            $("#btnBack1").hide();
            
            CaseFileDetailsHelper.FillCaseFileForm(selectedItem1);
        }
    },
    ClickEventForDeleteButtonLandMaster: function (e) {
        e.preventDefault();
        var text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdCaseFileSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                CaseFileDetailsHelper.FillCaseFileForm(selectedItem);
                CaseFileDetailsManager.SaveCaseFileDetails();
            }
        } else {
            text = "Canceled!";
        }
    },
    ClickEventForCaseFileViewButton: function (e) {
        e.preventDefault();
        var grid1 = $("#grdCaseFileSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem1 = this.dataItem(tr);
        grid1.select(tr);
        if (selectedItem1 != null) {

            //$("#divCaseFile").show();
            $("#divCaseFileDetails").show();
            $("#divCaseFileSummary").hide();
            $("#divUpdateDiaryDetails").hide();
            $("#btnSave").hide();
            $("#btnBack1").hide();

            CaseFileDetailsHelper.FillCaseFileFormDisabled(selectedItem1);
        }
    }


}