var isAdmin = false;
var MutationInfoSummaryManager = {
    gridDataSourceLandMaster: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 15,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/MutationMaster/GetAllGridData',
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
                field: "HoldingNo", aggregates: [
                    { field: "OwnerMutatedLandAmount", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    }     
}

var MutationInfoSummaryHelper = {
    InitMutationInfoSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        MutationInfoSummaryHelper.GenerateOwnerWiseMutationSummary();
        MutationInfoSummaryHelper.GenerateMutationMasterGrid();
        MutationInfoSummaryHelper.GenerateKhatianDetailSummaryGrid();
        MutationInfoSummaryHelper.GeneratePlotWiseMutationSummaryGrid();
        MutationInfoSummaryHelper.GenerateLandOwnerDetailSummaryGrid();
    },

    GenerateOwnerWiseMutationSummary: function () {
        $("#grdOwnerWiseMutationSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "OwnerWiseMutationDetailId", hidden: true},
                { field: "MutationMasterId", hidden: true},
                { field: "LandMasterId", hidden:true },
                { field: "DeedNo", title: "Deed No", width: 100 },
                { field: "KhatianTypeId", hidden: true, width: 200 },
                { field: "KhatianTypeName", title: "Name of Survey", width: 80 },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner Name", width: 100},
                { field: "OwnerLandAmount", title: "Owner Area of Land (Decimal)", width: 100},
                { field: "OwnerMutatedLandAmount", title: "Owner Wise Mutated Land", width: 100}
                //{
                //    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                //        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: MutationInfoSummaryHelper.ClickEventForDeleteButtonOwnerWiseMutationSummary
                //    },
                //    {
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: MutationInfoSummaryHelper.ClickEventForEditButtonOwnerWiseMutationSummary
                //    }]
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonOwnerWiseMutationSummary: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerWiseMutationSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbOwnerWiseMutationList.length; i++) {
                if (gbOwnerWiseMutationList[i].OwnerWiseMutationDetaiIId == selectedItem.OwnerWiseMutationDetaiIId && gbOwnerWiseMutationList[i].LandMasterId == selectedItem.LandMasterId) {
                    gbOwnerWiseMutationList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonOwnerWiseMutationSummary: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerWiseMutationSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            MutationInfoDetailsHelper.FillOwnerWiseMutationDetailForm(selectedItem);
        }
    },

    GenerateMutationMasterGrid: function () {
        $("#grdMutationMasterSummary").kendoGrid({
            //dataSource: MutationInfoSummaryManager.GridDataSourceMutationLandSummaryBlank(),
            //toolbar: ["excel",
            //    //{ template: kendo.template($("#template").html()) }
            //],
            //excel: {
            //    fileName: "Land Mutation Informations.xlsx",
            //    filterable: true,
            //    allPages: true
            //},
            dataSource: MutationInfoSummaryManager.gridDataSourceLandMaster(),
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
                fields: ["HoldingNo", "CaseNo", "DeedNo"]
            },
            columns: [
                { field: "MutationMasterId", hidden: true },
                { field: "HoldingNo", title: "Holding No", sortable: true },
                { field: "MutationApplicationNo", title: "Mutation Application No", sortable: true },
                { field: "CaseNo", title: "Case No", sortable: true },
                { field: "OwnerInfoName", title: "Owner", sortable: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "UpozilaName", title: "Thana", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DeedNo", title: "DeedNo", sortable: true },
                { field: "OwnerMutatedLandAmount", title: "Total Area of Land (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" }  },
                { field: "MutationKhatianNo", title: "Mutation Khatian No", hidden: true },
                {
                    command: [{
                        name: "edit", text: "View", iconClass: "k-icon k-i-edit", className: "k-success", click: MutationInfoSummaryHelper.ClickEventForEditButtonMutationMaster
                    }], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButtonMutationMaster: function (e) {
        e.preventDefault();
        var grid = $("#grdMutationMasterSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divMutationInfoSummary").hide();
            $("#divMutationInfoDetails").show();
            $("#btnSubmitApplication").text("Update");
            $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");
            $("#btnAddToListOwnerWise").text("Add Owner Wise Mutation");
            $("#btnAddToListOwnerWise").addClass("fas fa-arrow-down");
            $("#btnAddToListPlotWiseMutation").text("Add Plot Wise Mutation");
            $("#btnAddToListPlotWiseMutation").addClass("fas fa-arrow-down");
            MutationInfoDetailsHelper.FillMutationMasterDetailsForm(selectedItem);
        }
    },
    ClickEventForDeleteButtonLandMutation: function (e) {

        e.preventDefault();
        
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdMutationMasterSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                MutationInfoDetailsHelper.FillMutationMasterDetailsForm(selectedItem);
                MutationInfoDetailsManager.SaveMutationMasterDetails();
            }
        } else {
            text = "Canceled!";
        }
    },

    GenerateKhatianDetailSummaryGrid: function () {
        $("#grdKhatianDetailSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "KhatianDetailId", hidden: true, width: 200 },
                { field: "LandMasterId", hidden: true, width: 200 },
                { field: "MouzaId", hidden: true, width: 200 },
                { field: "MouzaName", title: "Mouza", width: 100 },
                { field: "KhatianTypeId", hidden: true, width: 200 },
                { field: "KhatianTypeName", title: "Name of Survey", width: 80 },
                { field: "KhatianNo", title: "Khatian No", width: 80 },
                { field: "DagNo", title: "Plot No", width: 80 },
                { field: "RecordedOwnerName", title: "Recorded Owner", width: 150 },
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },

    GeneratePlotWiseMutationSummaryGrid: function () {
        $("#grdPlotWiseMutationSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "PlotWiseMutationDetailId", hidden: true },
                { field: "MutationMasterId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "DeedNo", title: "Deed No", width: 80 },
                { field: "KhatianTypeId", hidden: true, width: 200 },
                { field: "KhatianTypeName", title: "Name of Survey", width: 80 },
                { field: "KhatianNo", title: "Khatian No", width: 80},
                { field: "DagNo", title: "Plot No", width: 80, footerTemplate: "<div style='text-align:right'>Total :</div>" },
                { field: "PlotWiseMutationLandAmount", title: "Plot Wise Mutated Land", width: 80, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'> <span id='spnTotalLandAmount'>0.00</span> </div>", format: "{0:n2}"  }
                //{
                //    field: "Action", title: "Action", filterable: false, width: 150, command: [
                //        //{
                //        //name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: MutationInfoSummaryHelper.ClickEventForDeleteButtonPlotWiseMutation
                //        //},
                //    {
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: MutationInfoSummaryHelper.ClickEventForEditButtonPlotWiseMutation
                //    }]
                //}
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonPlotWiseMutation: function (e) {
        e.preventDefault();
        var grid = $("#grdPlotWiseMutationSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbPlotWiseMutationList.length; i++) {
                if (gbPlotWiseMutationList[i].DeedNo == selectedItem.DeedNo
                    && gbPlotWiseMutationList[i].KhatianTypeId == selectedItem.KhatianTypeId
                    && gbPlotWiseMutationList[i].KhatianNo == selectedItem.KhatianNo
                    && gbPlotWiseMutationList[i].DagNo == selectedItem.DagNo) {
                    gbPlotWiseMutationList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonPlotWiseMutation: function (e) {
        e.preventDefault();
        var grid = $("#grdPlotWiseMutationSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            MutationInfoDetailsHelper.FillPlotWiseMutationDetailForm(selectedItem);
        }
    },

    GenerateLandOwnerDetailSummaryGrid: function () {
        $("#grdLandOwnerDetailSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "LandOwnersDetailId", hidden: true, width: 200 },
                { field: "LandMasterId", hidden: true, width: 200 },
                { field: "MouzaId", hidden: true, width: 200 },
                { field: "MouzaName", title: "Mouza", width: 80 },
                { field: "OwnerInfoId", hidden: true, width: 200 },
                { field: "OwnerInfoName", title: "Owner Name", width: 100 },
                { field: "LandAmount", title: "Area of Land (Decimal):", width: 80 }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    }
}