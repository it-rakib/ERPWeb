var isAdmin = false;
var LandInfoSummaryManger = {
    GetAllOwnerInfo() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/OwnerInfo/all");
        return list == null ? [] : list;
    },
    gridDataSourceLandMaster: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllGridData',
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
    }
}

var LandInfoSummaryHelper = {
    InitLandInfoSummary: function () {
        debugger;
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        LandInfoSummaryHelper.GenerateLandMasterGrid();

        LandInfoSummaryHelper.GeneratePlotWiseLandSaleSummaryGrid();
        LandInfoSummaryHelper.GenerateOwnerWiseLandSaleSummaryGrid();

        LandInfoSummaryHelper.GeneratePlotWiseLandTransferSummaryGrid();
        LandInfoSummaryHelper.GenerateOwnerWiseLandTransferSummaryGrid();
        LandInfoSummaryHelper.GenerateSalerInfoGrid();
        LandInfoSummaryHelper.GenerateLandOwnerSummaryGrid();
        LandInfoSummaryHelper.GenerateKhatianDetailSummary();
        LandInfoSummaryHelper.GenerateBayaDeedSummary();
    },

    GenerateLandMasterGrid: function () {

        $("#grdLandMasterSummary").kendoGrid({
            //noRecords: true,
            //messages: {
            //    noRecords: "NO DATA FOUND"
            //},
            dataSource: LandInfoSummaryManger.gridDataSourceLandMaster(),
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
                fields: ["DeedNo"]
            },
            columns: [
                { field: "LandMasterId", hidden: true },
                { field: "FileNo", title: "File Code & No", hidden: true },
                { field: "DeedNo", title: "Deed No", sortable: true },
                { field: "EntryDate", title: "Deed Date", sortable: true, template: '#= kendo.toString(kendo.parseDate(EntryDate), "dd-MM-yyyy") #' },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "UpozilaName", title: "Thana", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "TotalLandAmount", title: "Total Area of Land (Decimal)", sortable: true },
                { field: "LandPurchaseAmount", title: "Price of Land(Deed)", hidden: true },
                { field: "SubRegOfficeId", hidden: true },
                { field: "SubRegOfficeName", title: "Sub-Register Office", hidden: true },
                { field: "BaynaStatus", title: "Bayna Status", hidden: true },
                { field: "TransferedStatus", title: "Transfered Status", hidden: true },
                { field: "SaleStatus", title: "Sale Status", hidden: true },
                { field: "IsDeleted", title: "Is Deleted", hidden: true },
                {
                    command: [{
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonLandMaster
                    }],title: "&nbsp;"
                },
                {
                    command: [
                    {
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonLandMaster
                    }], hidden: !isAdmin, title: "&nbsp;"
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true

        });
    },
    ClickEventForEditButtonLandMaster: function (e) {
        e.preventDefault();
        var grid = $("#grdLandMasterSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divLandInfoSummary").hide();
            $("#divLandInfoDetails").show();
            $("#btnSubmitApplication").text("Update");
            $("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");
            $("#btnAddPlotWiseLandTransfer").text("Add Plot Wise Land Transfer");
            $("#btnAddPlotWiseLandTransfer").addClass("fas fa-arrow-down");
            $("#btnAddKhatian").text("Add Khatian");
            $("#btnAddKhatian").addClass("fas fa-arrow-down");
            $("#btnAddOwner").text("Add Owner");
            $("#btnAddOwner").addClass("fas fa-arrow-down");
            LandInfoDetailsHelper.FillLandMasterDetailsForm(selectedItem);
        }
    },
    ClickEventForDeleteButtonLandMaster: function (e) {
        e.preventDefault();
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdLandMasterSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                LandInfoDetailsHelper.FillLandMasterDetailsForm(selectedItem);
                LandInfoDetailsManager.SaveLandMasterDetails();
            }
        } else {
            text = "Canceled!";
        }
    },

    GeneratePlotWiseLandTransferSummaryGrid: function () {
        $("#grdPlotWiseLandTransferSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "PlotWiseLandTransferDetailId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "TransferedLandMasterId", hidden: true },
                { field: "TransferedDeedNo", title: "Deed No", width: 100 },
                { field: "TransferedKhatianTypeId", hidden: true },
                { field: "TransferedKhatianTypeName", title: "Name of Survey", width: 80 },
                { field: "TransferedDagNo", title: "Plot No", width: 80 },
                { field: "PlotWiseTransferedLandAmount", title: "Plot Wise Transfered Land Amount", width: 150 },
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonPlotWiseLandTransfer
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonPlotWiseLandTransfer
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonPlotWiseLandTransfer: function (e) {
        e.preventDefault();
        var grid = $("#grdPlotWiseLandTransferSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < PlotWiseLandTransferDetailList.length; i++) {
                if (PlotWiseLandTransferDetailList[i].LandMasterId == selectedItem.LandMasterId && PlotWiseLandTransferDetailList[i].PlotWiseLandTransferDetailId == selectedItem.PlotWiseLandTransferDetailId) {
                    PlotWiseLandTransferDetailList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonPlotWiseLandTransfer: function (e) {
        e.preventDefault();
        var grid = $("#grdPlotWiseLandTransferSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillPlotWiseLandTransferDetailForm(selectedItem);
        }
    },

    GenerateOwnerWiseLandTransferSummaryGrid: function () {
        $("#grdOwnerWiseLandTransferSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "OwnerWiseLandTransferDetailId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "TransferedLandMasterId", hidden: true },
                { field: "TransferedDeedNo", title: "Deed No", width: 100 },
                { field: "TransferedKhatianTypeId", hidden: true },
                { field: "TransferedKhatianTypeName", title: "Name of Survey", width: 80 },
                { field: "TransferedOwnerInfoId", hidden: true },
                { field: "TransferedOwnerInfoName", title: "Transfered Name of The Owner", width: 80 },
                { field: "OwnerWiseTransferedLandAmount", title: "Owner Wise Transfered Land Amount", width: 150 },
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonOwnerWiseLandTransfer
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonOwnerWiseLandTransfer
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonOwnerWiseLandTransfer: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerWiseLandTransferSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < OwnerWiseLandTransferDetailList.length; i++) {
                if (OwnerWiseLandTransferDetailList[i].LandMasterId == selectedItem.LandMasterId && OwnerWiseLandTransferDetailList[i].OwnerWiseLandTransferDetailId == selectedItem.OwnerWiseLandTransferDetailId) {
                    OwnerWiseLandTransferDetailList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonOwnerWiseLandTransfer: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerWiseLandTransferSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillOwnerWiseLandTransferDetailForm(selectedItem);
        }
    },

    GeneratePlotWiseLandSaleSummaryGrid: function () {
        $("#grdPlotWiseLandSaleSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "PlotWiseLandSaleDetailId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "SaleLandMasterId", hidden: true },
                { field: "SaleDeedNo", title: "Deed No(Sale)", width: 100 },
                { field: "SaleKhatianTypeId", hidden: true },
                { field: "SaleKhatianTypeName", title: "Name of Survey(Sale)", width: 80 },
                { field: "SaleDagNo", title: "Plot No(Sale)", width: 80 },
                { field: "PlotWiseSaleLandAmount", title: "Plot Wise Sale Land Amount", width: 150 },
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonPlotWiseLandSale
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonPlotWiseLandSale
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonPlotWiseLandSale: function (e) {
        e.preventDefault();
        var grid = $("#grdPlotWiseLandSaleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < PlotWiseLandSaleDetailList.length; i++) {
                if (PlotWiseLandSaleDetailList[i].LandMasterId == selectedItem.LandMasterId && PlotWiseLandSaleDetailList[i].PlotWiseLandSaleDetailId == selectedItem.PlotWiseLandSaleDetailId) {
                    PlotWiseLandSaleDetailList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonPlotWiseLandSale: function (e) {
        e.preventDefault();
        var grid = $("#grdPlotWiseLandSaleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillPlotWiseLandSaleDetailForm(selectedItem);
        }
    },

    GenerateOwnerWiseLandSaleSummaryGrid: function () {
        $("#grdOwnerWiseLandSaleSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "OwnerWiseLandSaleDetailId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "SaleLandMasterId", hidden: true },
                { field: "SaleDeedNo", title: "Deed No(Sale)", width: 100 },
                { field: "SaleKhatianTypeId", hidden: true },
                { field: "SaleKhatianTypeName", title: "Name of Survey(Sale)", width: 80 },
                { field: "SaleOwnerInfoId", hidden: true },
                { field: "SaleOwnerInfoName", title: "Name of The Owner(Sale)", width: 80 },
                { field: "OwnerWiseSaleLandAmount", title: "Owner Wise Sale Land Amount", width: 150 },
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonOwnerWiseLandSale
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonOwnerWiseLandSale
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonOwnerWiseLandSale: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerWiseLandSaleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < OwnerWiseLandSaleDetailList.length; i++) {
                if (OwnerWiseLandSaleDetailList[i].LandMasterId == selectedItem.LandMasterId && OwnerWiseLandSaleDetailList[i].OwnerWiseLandSaleDetailId == selectedItem.OwnerWiseLandSaleDetailId) {
                    OwnerWiseLandSaleDetailList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonOwnerWiseLandSale: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerWiseLandSaleSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillOwnerWiseLandSaleDetailForm(selectedItem);
        }
    },

    GenerateSalerInfoGrid: function () {
        $("#grdSalerInfoSummary").kendoGrid({
            dataSource: [],
            pageable: false,
            filterable: false,
            toolbar: [{ name: "create", text: "Add Seller" }],
            columns: [
                { field: "SalersInfoId", hidden: true },
                { field: "LandMasterId", hidden: true },
                { field: "SalerName", title: "Seller Name", sortable: true  },
                { field: "SalerFatherName", title: "Father's Name", sortable: true },
                { field: "SalerAddress", title: "Seller Address", sortable: true },
                { command: ["destroy"], title: "&nbsp;", width: "250px" }
            ],
            editable: {
                createAt: "top",
                mode: "incell",
                confirmation: false
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            selectable: "row",
            navigatable: true
        });
    },

    GenerateLandOwnerSummaryGrid: function () {
        $("#grdOwnerDetailSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "LandOwnersDetailId", hidden: true },
                { field: "LandMasterId", hidden: true},
                { field: "MouzaId", hidden: true},
                { field: "MouzaName", title: "Mouza" },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Name of The Owner", footerTemplate: "<div style='text-align:right'>Total</div>", hidden: true },//5 Clm
                { field: "SaleOwnerName", title: "Name of The Owner(Sale)", hidden: true},//6 Clm
                { field: "LandAmount", title: "Area of Land", headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'> <span id='spnTotalLandAmount'>0.00</span> </div>", format: "{0:n2}" },
                { field: "OwnerPurchaseAmount", title: "Price of Land(Deed)", headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}" },
                { field: "OwnerRegAmount", title: "Registration Cost", headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}" },
                {
                    field: "Action", title: "Action", filterable: false,  command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonLandOwner
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonLandOwner
                    }]
                }
            ],
            editable: false,
            //editable: {
            //    createAt: "top"
            //},
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonLandOwner: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerDetailSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < LandDetailsOwnerList.length; i++) {
                if (LandDetailsOwnerList[i].MouzaId == selectedItem.MouzaId) {
                    //gbTotalLandAmount = gbTotalLandAmount - selectedItem.LandAmount;
                    LandDetailsOwnerList.splice(i, 1);
                    break;
                }
            }
        }
        LandInfoDetailsHelper.CalculateTotalLandAmount();
    },
    ClickEventForEditButtonLandOwner: function (e) {
        e.preventDefault();
        var grid = $("#grdOwnerDetailSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillOwnerDetailForm(selectedItem);
        }
    },

    GenerateKhatianDetailSummary: function () {
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
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonKhatianDetail
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonKhatianDetail
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonKhatianDetail: function (e) {
        e.preventDefault();
        var grid = $("#grdKhatianDetailSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < LandDetailsKhatianList.length; i++) {
                if (LandDetailsKhatianList[i].MouzaId == selectedItem.MouzaId && LandDetailsKhatianList[i].KhatianTypeId == selectedItem.KhatianTypeId) {
                    LandDetailsKhatianList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonKhatianDetail: function (e) {
        e.preventDefault();
        var grid = $("#grdKhatianDetailSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillKhatianDetailForm(selectedItem);
        }
    },

    GenerateBayaDeedSummary: function () {
        $("#grdBayaDeedSummary").kendoGrid({
            dataSource: [],
            filterable: false,
            sortable: false,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            columns: [
                { field: "BayaDeedDetailId", hidden: true, width: 200 },
                { field: "LandMasterId", hidden: true, width: 200 },
                { field: "BayaDeedNo", title: "Baya Deed No", width: 100 },
                { field: "BayaDeedDate", title: "Baya Deed Date", width: 80, format: "{0:dd-MM-yyyy}" },
                {
                    field: "Action", title: "Action", filterable: false, width: 150, command: [{
                        name: "delete", text: "Delete", iconClass: "k-icon k-i-delete", className: "k-danger", click: LandInfoSummaryHelper.ClickEventForDeleteButtonBayaDeed
                    },
                    {
                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandInfoSummaryHelper.ClickEventForEditButtonBayaDeed
                    }]
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForDeleteButtonBayaDeed: function (e) {
        e.preventDefault();
        var grid = $("#grdBayaDeedSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < BayaDeedList.length; i++) {
                if (BayaDeedList[i].BayaDeedDetailId == selectedItem.BayaDeedDetailId && BayaDeedList[i].LandMasterId == selectedItem.LandMasterId) {
                    BayaDeedList.splice(i, 1);
                    break;
                }
            }
        }
    },
    ClickEventForEditButtonBayaDeed: function (e) {
        e.preventDefault();
        var grid = $("#grdBayaDeedSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            LandInfoDetailsHelper.FillBayaDeedForm(selectedItem);
        }
    }
}