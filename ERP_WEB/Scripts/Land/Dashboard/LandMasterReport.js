
var LandMasterReportManager = {
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
    GetTotalLandPurchaseAmount: function () {
        var objTotalLandPurchaseAmount = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetTotalLandPurchaseAmount";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalLandPurchaseAmount = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalLandPurchaseAmount;
    },
    GetTotalDeed: function () {
        var objTotalDeed = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetTotalDeed";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalDeed = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalDeed;
    },
    GetTotalDistrict: function () {
        var objTotalDistrict = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetTotalDistrict";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalDistrict = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalDistrict;
    },
    GetTotalUpozila: function () {
        var objTotalUpozila = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetTotalUpozila";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalUpozila = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalUpozila;
    },
    GetTotalMouza: function () {
        var objTotalMouza = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetTotalMouza";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalMouza = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalMouza;
    },
    GetTotalCompany: function () {
        var objTotalCompany = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/OwnerInfo/GetTotalCompany";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalCompany = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalCompany;
    },
    GetTotalPerson: function () {
        var objTotalPerson = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/OwnerInfo/GetTotalPerson";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objTotalPerson = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objTotalPerson;
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
    GridDataSourceLandSummaryDistrict: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            //pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllGridDataLandSummaryDistrict',
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
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GetAllLandSummaryDistrictList: function () {
        var objLandSummaryDistrictList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetAllLandSummaryDistrictList";
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objLandSummaryDistrictList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objLandSummaryDistrictList;
    },
    GetUpozilaByDistrictIdSummary: function (districtId) {
        var objUpozilaSummary = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/upozila/" + districtId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objUpozilaSummary = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objUpozilaSummary;
    },
    GridDataSourceLandSummaryPerson: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            //pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandOwnersDetail/GetAllLandSummaryPersonGridAsync',
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
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryCompany: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            //pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandOwnersDetail/GetAllLandSummaryCompanyGridAsync',
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
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
}

var LandMasterReportHelper = {
    InitLandMasterReport: function() {
        LandMasterReportHelper.FillTotalLandAmount();
        LandMasterReportHelper.FillTotalLandPurchaseAmount();
        LandMasterReportHelper.FillTotalDeed();
        LandMasterReportHelper.FillTotalDistrict();
        LandMasterReportHelper.FillTotalUpozila();
        LandMasterReportHelper.FillTotalMouza();
        LandMasterReportHelper.FillTotalCompany();
        LandMasterReportHelper.FillTotalPerson();
        LandMasterReportHelper.FillTotalMutatedLand();
        LandMasterReportHelper.GenerateLandSummaryDistrictGrid();
        LandMasterReportHelper.GenerateLandSummaryDistrictChart();
        $("#popupUpozilaByDistrictIdSummary").kendoWindow({
            title: "Upazila/Thana Summary",
            resizeable: true,
            width: "50%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        LandMasterReportHelper.GenerateUpozilaByDistrictIdSummaryGrid();
        LandMasterReportHelper.GenerateLandSummaryPersonGrid();
        LandMasterReportHelper.GenerateLandSummaryCompanyGrid();
    },
    FillTotalLandAmount: function () {
        var totalLandAmountAcres = LandMasterReportManager.GetTotalLandAmount();
        $("#spnTotalLandAmountAcres").html(totalLandAmountAcres);
    },
    FillTotalLandPurchaseAmount: function () {
        var totalLandPurchaseAmount = LandMasterReportManager.GetTotalLandPurchaseAmount();
        $("#spnTotalLandPurchaseAmount").html(totalLandPurchaseAmount);
    },
    FillTotalDeed: function () {
        var totalDeed = LandMasterReportManager.GetTotalDeed();
        $("#spnTotalDeed").html(totalDeed);
    },
    FillTotalDistrict: function () {
        var totalDistrict = LandMasterReportManager.GetTotalDistrict();
        $("#spnTotalDistrict").html(totalDistrict);
    },
    FillTotalUpozila: function () {
        var totalUpozila = LandMasterReportManager.GetTotalUpozila();
        $("#spnTotalUpozila").html(totalUpozila);
    },
    FillTotalMouza: function () {
        var totalMouza = LandMasterReportManager.GetTotalMouza();
        $("#spnTotalMouza").html(totalMouza);
    },
    FillTotalCompany: function () {
        var totalCompany = LandMasterReportManager.GetTotalCompany();
        $("#spnTotalCompany").html(totalCompany);
    },
    FillTotalPerson: function () {
        var totalPerson = LandMasterReportManager.GetTotalPerson();
        $("#spnTotalPerson").html(totalPerson);
    },
    FillTotalMutatedLand: function () {
        var totalMutatedLandAcres = LandMasterReportManager.GetTotalMutatedLand();
        $("#spnTotalMutatedLandAcres").html(totalMutatedLandAcres);
    },
    GenerateLandSummaryDistrictGrid: function () {
        $("#grdLandSummaryDistrict").kendoGrid({
            dataSource: LandMasterReportManager.GridDataSourceLandSummaryDistrict(),
            pageable: false,
            columns: [
                { field: "DistrictId", hidden:true },
                { field: "DistrictName", title: "District", sortable: true, footerTemplate: "<div style='text-align:right'>Total</div>" },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: data.DeedQty ? sum: 0 #</div>"},
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: kendo.toString(sum, '0.00') #</div>", format: "{0:n2}"}
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            height: 290
        });

        $("#grdLandSummaryDistrict").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdLandSummaryDistrict").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    LandMasterReportHelper.LoadUpozilaByDistrictIdSummaryGrid(selectedItem);
                    $("#popupUpozilaByDistrictIdSummary").data("kendoWindow").open().center();
                }
            }
        });
    },
    GenerateLandSummaryDistrictChart: function() {
        var chart = AmCharts.makeChart("chartdivLandSummaryDistrict", {
            "type": "pie",
            "theme": "none",
            "dataProvider": LandMasterReportManager.GetAllLandSummaryDistrictList(),
            "valueField": "TotalLandAcres",
            "titleField": "DistrictName",
            "balloon": {
                "fixedPosition": true
            },
            "export": {
                "enabled": true
            }
        });
        return chart;
    },
    GenerateUpozilaByDistrictIdSummaryGrid: function () {
        $("#grdUpozilaByDistrictIdSummary").kendoGrid({
            dataSource: [],
            pageable: false,
            columns: [
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }},
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            height: 250
        });
    },
    LoadUpozilaByDistrictIdSummaryGrid: function(obj) {
        if (obj !== null) {
            var grid = $("#grdUpozilaByDistrictIdSummary").data("kendoGrid");
            grid.dataSource.data([]);
            var upozilaByDistrictIdSummary = LandMasterReportManager.GetUpozilaByDistrictIdSummary(obj.DistrictId);
            var gridDataSource = new kendo.data.DataSource({
                data: upozilaByDistrictIdSummary,
                schema: {
                    model: {

                    }
                }
            });
            grid.setDataSource(gridDataSource);
        }
    },
    GenerateLandSummaryPersonGrid: function () {
        $("#grdLandSummaryPerson").kendoGrid({
            dataSource: LandMasterReportManager.GridDataSourceLandSummaryPerson(),
            pageable: false,
            columns: [
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Name", sortable: true, footerTemplate: "<div style='text-align:right'>Total</div>"},
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: data.DeedQty ? sum: 0 #</div>"},
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: kendo.toString(sum, '0.00') #</div>", format: "{0:n2}" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            height: 290
        });
    },
    GenerateLandSummaryCompanyGrid: function () {
        $("#grdLandSummaryCompany").kendoGrid({
            dataSource: LandMasterReportManager.GridDataSourceLandSummaryCompany(),
            pageable: false,
            columns: [
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Name", sortable: true, footerTemplate: "<div style='text-align:right'>Total</div>" },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: data.DeedQty ? sum: 0 #</div>" },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, "footerTemplate": "<div style='text-align:right'>#: kendo.toString(sum, '0.00') #</div>", format: "{0:n2}" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            height: 290
        });
    },
}