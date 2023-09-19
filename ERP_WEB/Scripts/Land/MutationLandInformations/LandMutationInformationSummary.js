var LandMutationInformationSummaryManager = {
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
                    url: '../MutationLandInformations/GetMutationLandInformationsSummary/',
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
                { field: "DeedNo", aggregate: "count" },
                //{ field: "LandAmount", aggregate: "sum" },
                { field: "MutedLandAmount", aggregate: "sum" }
            ]
        });
        debugger;
        return gridDataSource;
    },
    GetTotalLandAmount: function () {
        var objTotalLandAmount = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetTotalLandAmount";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalLandAmount = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalLandAmount;
    },
    GetTotalMutatedLand: function () {
        var objTotalMutatedLand = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/MutationMaster/GetTotalMutatedLand";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalMutatedLand = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalMutatedLand;
    },
}

var LandMutationInformationSummaryHelper = {
    InitLandMutationInformationSummary: function () {
        
        LandMutationInformationSummaryHelper.GenerateLandInformationGrid();  
        LandMutationInformationSummaryHelper.GetTotalLand();
    },
    GenerateLandInformationGrid: function () {
        $("#gridMutationInfoSummary").kendoGrid({
            toolbar: ["excel",
                { template: kendo.template($("#template").html()) }],
            excel: {
                fileName: "Land Mutation Informations.xlsx",
                filterable: true,
                allPages: true
            },
            dataSource: LandMutationInformationSummaryManager.gridDataSource(),
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
                noRecords: "No Record Found!"
            },
            columns: [
                {
                    title: "File Code",
                    headerTemplate: 'File Code <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpFileCodeClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "FileCodeInfoId", hidden: true },
                        { field: "FileCodeInfoName", title: "File Code", sortable: true, width: 100 }]
                },
                {
                    title: "File No",
                    headerTemplate: 'File No <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpFileColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "FileNoInfoId", hidden: true },
                        { field: "FileNoInfoName", title: "File No", sortable: true,width:100 }]
                },
                {
                    title: "Basis of Ownership",
                    headerTemplate: 'Basis of Ownership <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpOwnerBasisColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "LandOwnerTypeId", hidden: true },
                        { field: "LandOwnerTypeName", title: "Owner Basis", sortable: true, width: 120 }]
                },

                {
                    title: "Division",
                    headerTemplate: 'Division <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpDivisionColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "DivisionId", hidden: true },
                        { field: "DivisionName", title: "Division", sortable: true, width: 100 }]
                },
                {
                    title: "District",
                    headerTemplate: 'District <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpDistrictColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "DistrictId", hidden: true },
                        { field: "DistrictName", title: "District", sortable: true, width: 100 }]
                },
                {
                    title: "Upozila/Thana",
                    headerTemplate: 'Upozila/Thana <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpUpozilaColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "UpozilaId", hidden: true },
                        { field: "UpozilaName", title: "Upozila/Thana", sortable: true, width: 100 }]
                },
                {
                    title: "Mouza",
                    headerTemplate: 'Mouza <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpMouzaColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "MouzaId", hidden: true },
                        { field: "MouzaName", title: "Mouza", sortable: true, width: 200 }]
                },
                {
                    title: "Owner",
                    headerTemplate: 'Owner <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpOwnerColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "OwnerInfoId", hidden: true },
                        { field: "OwnerInfoName", title: "Owner", sortable: true, width: 200 }]
                },
                {
                    title: "Deed No",
                    headerTemplate: 'Deed No <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpDeedColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "DeedNo", title: "Deed No", sortable: true, width: 100/*, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["count"], footerTemplate: "Deed Qty: #=kendo.toString(count)#", footerAttributes: { style: "text-align: right" }*/  }]
                },
                {
                    title: "Deed Date",
                    headerTemplate: 'Deed Date <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpDeeddateColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "EntryDate", title: "Deed Date", sortable: true, width: 100, template: '#= kendo.toString(kendo.parseDate(EntryDate==null?"":EntryDate), "yyyy/MM/dd") #' }]
                },
                {
                    title: "Land Amount",
                    headerTemplate: 'Land Amount <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpLandAmntColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "LandAmount", title: "Total Area of Land(dec)", width: 110, sortable: true }]
                },
                {
                    title: "Mutated Land",
                    headerTemplate: 'Mutated Land <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpMutatedLandAmntColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "MutedLandAmount", title: "Mutated Land", sortable: true, width: 110, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }]
                },
                {
                    title: "Khatians",
                    headerTemplate: 'Khatian Types <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpKhatianTypesColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "CS", title: "CS Khatian", sortable: true,width: 120 },
                        { field: "SA", title: "SA Khatian", sortable: true, width: 120 },
                        { field: "RS", title: "RS Khatian", sortable: true, width: 120 },
                        { field: "BS", title: "BS Khatian", sortable: true, width: 120 }
                    ]
                },
                {
                    title: "Plot No",
                    headerTemplate: 'Khatian Plots <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpPlotsColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "CSPlot", title: "CS Plot", sortable: true, width: 90 },
                        { field: "SAPlot", title: "SA Plot", sortable: true, width: 90 },
                        { field: "RSPlot", title: "RS Plot", sortable: true, width: 90 },
                        { field: "BSPlot", title: "BS Plot", sortable: true, width: 90 }
                    ]
                },

                {
                    title: "Type Muteted Survey",
                    headerTemplate: 'Mutation Info <button class="k-button" style="float: right;" onclick="LandMutationInformationSummaryHelper.onExpTypeMutatedsurColClick(this)"><span class="k-icon k-i-minus"></span></button>',
                    columns: [
                        { field: "KhatianTypeId", hidden: true },
                        //{ field: "TypeMutatedSurvey", title: "Type Mutated Survey", sortable: true, width: 100 },
                        { field: "HoldingNo", title: "Holding No", sortable: true, width: 100 },                        
                        { field: "MutationPlotNo", title: "Plot No", sortable: true, width: 100 },
                        { field: "KhatianNo", title: "Khatian No", sortable: true, width: 100 },
                        { field: "BanglaYearId", hidden: true },
                        { field: "BanglaYearName", title: "LD.Tax Year", sortable: true, width: 100 }
                        //{ field: "KhatianTypeId", hidden: true },
                        //{ field: "TypeMutatedSurvey", title: "Type Mutated Survey", sortable: true, width: 100 },
                        //{ field: "KhatianNo", title: "Khatian No", sortable: true, width: 100 },
                        //{ field: "HoldingNo", title: "Holding No", sortable: true, width: 100 },
                        //{ field: "BanglaYearId", hidden: true },
                        //{ field: "BanglaYearName", title: "LD.Tax Year", sortable: true, width: 100 }
                    ]
                }],
            sortable: true,
            pageable: true,
            filterable: true,
            resizable: true,
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true
        });
    },

    onExpFileCodeClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("FileCodeInfoName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("FileCodeInfoName");
        }
    },

    onExpColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");

        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            //grid.hideColumn("FileNoInfoName");
            grid.hideColumn("LandOwnerTypeName");
            grid.hideColumn("DivisionName");
            grid.hideColumn("DistrictName");
            grid.hideColumn("UpozilaName");
            grid.hideColumn("MouzaName");
            grid.hideColumn("OwnerInfoName");
            //grid.hideColumn("DeedNo");
            grid.hideColumn("EntryDate");
            grid.hideColumn("LandAmount");
            grid.hideColumn("OwnerMutatedLandAmount");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            //grid.showColumn("FileNoInfoName");
            grid.showColumn("LandOwnerTypeName");
            grid.showColumn("DivisionName");
            grid.showColumn("DistrictName");
            grid.showColumn("UpozilaName");
            grid.showColumn("MouzaName");
            grid.showColumn("OwnerInfoName");
            //grid.showColumn("DeedNo");
            grid.showColumn("EntryDate");
            grid.showColumn("LandAmount");
            grid.showColumn("OwnerMutatedLandAmount");
        }
    },

    onExpMutationColClick: function (button) {
        debugger;
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");

        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("KdKhatianTypeName");
            grid.hideColumn("KdKhatianNo");
            grid.hideColumn("KdDagNo");
            grid.hideColumn("TypeMutetedSurvey");
            grid.hideColumn("KhatianNo");
            grid.hideColumn("DagNo");
            grid.hideColumn("BanglaYearName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("KdKhatianTypeName");
            grid.showColumn("KdKhatianNo");
            grid.showColumn("KdDagNo");
            grid.showColumn("TypeMutetedSurvey");
            grid.showColumn("KhatianNo");
            grid.showColumn("DagNo");
            grid.showColumn("BanglaYearName");
        }
    },

    onExpFileColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("FileNoInfoName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("FileNoInfoName");
        }
    },

    onExpOwnerBasisColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("LandOwnerTypeName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("LandOwnerTypeName");
        }
    },

    onExpDivisionColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("DivisionName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("DivisionName");
        }
    },

    onExpDistrictColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("DistrictName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("DistrictName");
        }
    },

    onExpUpozilaColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("UpozilaName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("UpozilaName");
        }
    },

    onExpMouzaColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("MouzaName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("MouzaName");
        }
    },

    onExpOwnerColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("OwnerInfoName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("OwnerInfoName");
        }
    },

    onExpDeedColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("DeedNo");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("DeedNo");
        }
    },

    onExpDeeddateColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("EntryDate");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("EntryDate");
        }
    },

    onExpLandAmntColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("LandAmount");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("LandAmount");
        }
    },

    onExpMutatedLandAmntColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("MutedLandAmount");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("MutedLandAmount");
        }
    },

    onExpMutatedSurveyColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("KdKhatianTypeName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("KdKhatianTypeName");
        }
    },

    onExpKdKhatianNoColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("KdKhatianNo");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("KdKhatianNo");
        }
    },

    onExpKhatianDagColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("KdDagNo");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("KdDagNo");
        }
    },

    onExpTypeMutatedsurColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("TypeMutatedSurvey");
            grid.hideColumn("KhatianNo");
            grid.hideColumn("MutationPlotNo");
            grid.hideColumn("HoldingNo");
            grid.hideColumn("BanglaYearName");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("TypeMutatedSurvey");
            grid.showColumn("KhatianNo");
            grid.showColumn("MutationPlotNo");
            grid.showColumn("HoldingNo");
            grid.showColumn("BanglaYearName");
        }

        //var span = $(button).find("span");
        //var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        //if (span.hasClass("k-i-minus")) {
        //    span.removeClass("k-i-minus");
        //    span.addClass("k-i-plus");

        //    grid.hideColumn("TypeMutatedSurvey");
        //    //grid.hideColumn("KhatianNo");
        //    grid.hideColumn("HoldingNo");
        //    grid.hideColumn("BanglaYearName");

        //} else {
        //    span.removeClass("k-i-plus");
        //    span.addClass("k-i-minus");

        //    grid.showColumn("TypeMutatedSurvey");
        //    //grid.showColumn("KhatianNo");
        //    grid.showColumn("HoldingNo");
        //    grid.showColumn("BanglaYearName");
        //}
    },

    onExpKhatianTypesColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("CS");
            grid.hideColumn("RS");
            grid.hideColumn("SA");
            grid.hideColumn("BS");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("CS");
            grid.showColumn("RS");
            grid.showColumn("SA");
            grid.showColumn("BS");
        }
    },

    onExpPlotsColClick: function (button) {
        var span = $(button).find("span");
        var grid = $("#gridMutationInfoSummary").data("kendoGrid");
        if (span.hasClass("k-i-minus")) {
            span.removeClass("k-i-minus");
            span.addClass("k-i-plus");

            grid.hideColumn("CSPlot");
            grid.hideColumn("RSPlot");
            grid.hideColumn("SAPlot");
            grid.hideColumn("BSPlot");

        } else {
            span.removeClass("k-i-plus");
            span.addClass("k-i-minus");

            grid.showColumn("CSPlot");
            grid.showColumn("RSPlot");
            grid.showColumn("SAPlot");
            grid.showColumn("BSPlot");
        }
    },
    GetTotalLand: function () {
        var grandTotal = LandMutationInformationSummaryManager.GetTotalLandAmount();
        $("#spnGrandTtl").html(grandTotal);
        var unmutatedTotal = LandMutationInformationSummaryManager.GetTotalMutatedLand();
        $("#spnUnmutatedTtl").html(unmutatedTotal);
    }
}