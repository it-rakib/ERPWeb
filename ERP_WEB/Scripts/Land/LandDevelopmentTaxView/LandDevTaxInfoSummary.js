
var isAdmin = false;
var LandDevTaxInfoSummaryManger = {
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
                    url: _baseUrlLand + '/api/LandDevelopmentTax/GetAllGridData',
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
                    { field: "OwnerMutatedLandAmount", aggregate: "sum" },
                    { field: "TaxAmount", aggregate: "sum" }
                ]
            }
            //aggregate: [
            //    { field: "OwnerMutatedLandAmount", aggregate: "sum" },
            //    { field: "TaxAmount", aggregate: "sum" }
            //]
        });
        return gridDataSource;
    }
}

var LandDevTaxInfoSummaryHelper = {
    InitLandDevTaxInfoSummary: function () {
        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);
        LandDevTaxInfoSummaryHelper.GenerateLandDevTaxGrid();
    },
    GenerateLandDevTaxGrid: function () {
        $("#grdLandDevTaxSummary").kendoGrid({
            dataSource: LandDevTaxInfoSummaryManger.gridDataSource(),
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
                fields: ["HoldingNo"]
            },
            columns: [
                { field: "LandDevelopmentTaxId", hidden: true },
                { field: "MutationMasterId", hidden: true },
                { field: "HoldingNo", title: "Holding No", sortable: true },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "FromDate", hidden: true },
                { field: "FromDateName", title: "From Year", sortable: true },
                { field: "ToDate", hidden: true },
                { field: "ToDateName", title: "To Year", sortable: true },
                { field: "OwnerMutatedLandAmount", title: "Area Of Land(deci)", sortable: true },
                { field: "TaxAmount", title: "LD.tax(tk)", sortable: true, title: "Tax Amount(BDT)" } ,
                //, sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                //{
                //    command: [{
                //        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: LandDevTaxInfoSummaryHelper.ClickEventForEditButton
                //    }], title: "&nbsp;"
                //}
                {
                    command: [{
                        name: "edit", text: "View", iconClass: "k-icon k-i-edit", className: "k-success", click: LandDevTaxInfoSummaryHelper.ClickEventForEditButton
                    }
                    ], title: "&nbsp;"
                }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdLandDevTaxSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            //$("#btnSubmitApplication").text("Update");
            //$("#btnSubmitApplication").addClass("glyphicon glyphicon-floppy-disk");
            $("#divLandDevTaxInfoSummary").hide();
            $("#divLandDevTaxInfoDetails").show();
            LandDevTaxInfoDetailsHelper.FillForm(selectedItem);
        }
    },
    ClickEventForDeleteButton: function (e) {
        e.preventDefault();
        debugger;
        let text;
        if (confirm("Are you sure you want to delete?") == true) {
            var grid = $("#grdLandDevTaxSummary").data("kendoGrid");
            var tr = $(e.currentTarget).closest("tr");
            var selectedItem = this.dataItem(tr);
            grid.select(tr);
            if (selectedItem != null) {
                selectedItem.IsDeleted = true;
                LandDevTaxInfoDetailsHelper.FillForm(selectedItem);
                LandDevTaxInfoDetailsManager.SaveLandDevTaxDetails();
            }
        } else {
            text = "Canceled!";
        }
    }
}