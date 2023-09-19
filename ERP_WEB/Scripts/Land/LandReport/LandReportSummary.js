
var LandReportSummaryManager = {
    GridDataSourceLandSummaryDistrict: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
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
                    fields: {
                        DeedQty: { type: "number" },
                        TotalCount: { type: "number" }
                    }
                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryDistrictBlank: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    // url: _baseUrlLand + '/api/LandMaster/GetAllGridDataLandSummaryDistrict',
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
                    fields: {
                    }
                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" },
                { field: "TotalLandAmount", aggregate: "sum" }                
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryDistrictMutationBlank: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    // url: _baseUrlLand + '/api/LandMaster/GetAllGridDataLandSummaryDistrict',
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
                    fields: {
                    }
                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                //{ field: "TotalLandAmount",aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryUpozilaMutationBlank: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    // url: _baseUrlLand + '/api/LandMaster/GetAllGridDataLandSummaryDistrict',
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
                    fields: {
                    }
                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                //{ field: "TotalLandAmount",aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryOwnerBlank: function () {

        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    //url: _baseUrlLand + '/api/LandMaster/GetAllGridDataLandSummaryDistrict',
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
                    fields: {
                    }
                },
                data: "Items", total: "TotalCount"
            },
            aggregate: [
                { field: "TotalLand", aggregate: "sum" },
            ]
        });       
        
        return gridDataSource;
    },
    GetAllLandSummaryDistrictByDistrictId: function (districtId) {
        var objData = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/LandSummaryDistrictSingle/" + districtId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objData = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objData;
    },
    GridDataSourceLandSummaryUpazila: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryUpozilaGridAsync',
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
                field: "UpozilaName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAcres", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GetAllLandSummaryUpazilaByUpazilaId: function (upazilaId) {
        var objData = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetAllLandSummaryUpazila/" + upazilaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objData = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objData;
    },
    GridDataSourceLandSummaryMouza: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryMouzaGridAsync',
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
                field: "MouzaName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAmount", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAmount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GetAllLandSummaryMouzaByMouzaId: function (mouzaId) {
        var objData = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/GetAllLandSummaryMouza/" + mouzaId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objData = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objData;
    },
    GridDataSourceLandSummaryOwnerMouzaCommon: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryOwnerMouzaCommonGrid',
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
                field: "OwnerInfoName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLand", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLand", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryFileDeedOwnerMouzaCommon: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryFileDeedOwnerCommonGrid',
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
                field: "MouzaName", aggregates: [
                    { field: "LandAmount", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "LandAmount", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GridDataSourceLandSummaryOwner: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandOwnersDetail/GetAllLandOwnerGridAsync',
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
                { field: "TotalLand", aggregate: "sum" }
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
            pageSize: 10,
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
    GridDataSourceLandSummaryPerson: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
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
    GetAllOwnerInfo() {
        var list = ApiManager.GetList(_baseUrlLand + "/api/OwnerInfo/all");
        return list == null ? [] : list;
    },
    GetAllLandSummaryOwnerDistrictListByOwnerInfoId: function (ownerInfoId) {
        var objOwnerDistrictList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandOwnersDetail/landOwnerDistrictList/" + ownerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerDistrictList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerDistrictList;
    },
    GetAllLandSummaryOwnerUpozilaListByOwnerInfoId: function (ownerInfoId) {
        var objOwnerUpozilaList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandOwnersDetail/landOwnerUpozilaList/" + ownerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerUpozilaList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerUpozilaList;
    },
    GetAllLandSummaryOwnerMouzaListByOwnerInfoId: function (ownerInfoId) {
        var objOwnerMouzaList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandOwnersDetail/landOwnerMouzaList/" + ownerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerMouzaList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerMouzaList;
    },
    GetAllDeedNoByOwnerInfoId: function (ownerInfoId) {
        var objDeedNoList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandMaster/getDeedNoList/" + ownerInfoId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objDeedNoList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objDeedNoList;
    },
    GetAllLandSummaryByLandMasterId: function (landMasterId) {
        var objOwnerDeedList = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLand + "/api/LandOwnersDetail/landSummary/" + landMasterId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objOwnerDeedList = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objOwnerDeedList;
    },
    GridDataSourceLandSummaryUpazilaByDistrictId: function (districtId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryUpozilaByDistrictIdGridAsync/' + districtId,
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
    GridDataSourceLandSummaryMouzaByUpozilaId: function (upozilaId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryMouzaByUpozilaIdGridAsync/' + upozilaId,
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
                { field: "TotalLand", aggregate: "sum" }
            ]
        });
        return gridDataSource;
    },
    GetDivisionLandSummaryById: function (divisionId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryGridByDivisionId/' + divisionId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "DivisionName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetMutationDivisionLandSummaryById: function (divisionId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/MutationMaster/GetAllLandMutationSummaryGridByDivisionId/' + divisionId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "DivisionName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAmount", aggregate: "sum" },
                    { field: "OwnerMutatedLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAmount", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" },
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetDistrictLandSummaryById: function (districtId) {
        debugger;
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryGridByDistrictId/'+ districtId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "DistrictName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAcres", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetMutationDistrictLandSummaryById: function (districtId) {
        debugger;
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/MutationMaster/GetAllLandSummaryMutationGridByDistrictId/' + districtId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "DistrictName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "OwnerMutatedLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetUpozilaLandSummaryById: function (upozilaId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 15,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryGridByUpozilaId/' + upozilaId ,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "UpozilaName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetUpozilaMutationLandSummaryById: function (upozilaId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 15,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/MutationMaster/GetAllLandMutationSummaryGridByUpozilaId/' + upozilaId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "UpozilaName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "OwnerMutatedLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetMouzaLandSummaryById: function (mouzaId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryGridByMouzaId/' + mouzaId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "MouzaName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "TotalLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetMouzaLandMutationSummaryById: function (mouzaId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 15,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/MutationMaster/GetAllLandMutationSummaryGridByMouzaId/' + mouzaId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "MouzaName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "OwnerMutatedLandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetOwnerInfoLandSummaryById: function (mouzaId,ownerInfoId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetAllLandSummaryGridByOwnerId/' + mouzaId + "/" + ownerInfoId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "OwnerInfoName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "LandAmount", aggregate: "sum" },
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "LandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetSingleOwnerInfoLandSummaryById: function (ownerInfoId) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrlLand + '/api/LandMaster/GetLandSummarySingleGridByOwnerId/' + ownerInfoId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
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
                field: "OwnerInfoName", aggregates: [
                    { field: "DeedQty", aggregate: "sum" },
                    { field: "LandAmount", aggregate: "sum" }
                ]
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "LandAmount", aggregate: "sum" }
            ]
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetOwnerInfoLandMutationSummaryById: function (mouzaId, ownerInfoId) {
    var gridDataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: _baseUrlLand + '/api/MutationMaster/GetAllLandMutationSummaryGridByOwnerId/' + mouzaId + "/" + ownerInfoId,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
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
            field: "OwnerInfoName", aggregates: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        },
        aggregate: [
            { field: "DeedQty", aggregate: "sum" },
            { field: "OwnerMutatedLandAmount", aggregate: "sum" }
        ]
    });
    gridDataSource.filter({});
    return gridDataSource;
    },
    GetSingleOwnerMutationInfoLandSummaryById: function (ownerInfoId) {
    var gridDataSource = new kendo.data.DataSource({
        type: "json",
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        allowUnsort: true,
        pageSize: 10,
        transport: {
            read: {
                url: _baseUrlLand + '/api/MutationMaster/GetSingleLandMutationSummaryGridByOwnerId/' + ownerInfoId,
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8"
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
            field: "OwnerInfoName", aggregates: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "OwnerMutatedLandAmount", aggregate: "sum" }
            ]
        },
        aggregate: [
            { field: "DeedQty", aggregate: "sum" },
            { field: "OwnerMutatedLandAmount", aggregate: "sum" }
        ]
    });
    gridDataSource.filter({});
    return gridDataSource;
}
}

var LandReportSummaryHelper = {
    InitLandReportSummary: function () {
        $("#dropdownlist").kendoDropDownList({
            animation: {
                close: {
                    effects: "fadeOut zoom:out",
                    duration: 300
                },
                open: {
                    effects: "fadeIn zoom:in",
                    duration: 300
                }
            }
        });
        LandReportSummaryHelper.GenerateLandSummaryDistrictGrid();
        LandReportSummaryHelper.GenerateLandSummaryDistrictWiseGrid();
        LandReportSummaryHelper.GenerateLandSummaryDistrictWiseGridSingle();

        LandReportSummaryHelper.GenerateLandSummaryUpazilaGrid();
        LandReportSummaryHelper.GenerateLandSummaryUpazilaGridSingle();

        LandReportSummaryHelper.GenerateLandSummaryMouzaGrid();
        LandReportSummaryHelper.GenerateLandSummaryMouzaGridSingle();

        //LandReportSummaryHelper.GenerateLandSummaryOwnerMouzaCommonGrid();
        LandReportSummaryHelper.GenerateLandSummaryFileDeedOwnerMouzaCommonGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerSingleGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerMutationGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerSingleMutationGrid();
        LandReportSummaryHelper.GenerateLandSummaryCompanyGrid();
        LandReportSummaryHelper.GenerateLandSummaryPersonGrid();

        LandReportSummaryHelper.GenerateLandSummaryOwnerDistrictGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerUpazilaGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerMouzaGrid();
        LandReportSummaryHelper.GenerateLandSummaryOwnerDeedGrid();
        LandReportSummaryHelper.GenerateLandSummaryGrid();
        LandReportSummaryHelper.GenerateLandMutationSummaryGrid();
        LandReportSummaryHelper.GenerateDistrictSummaryGrid();
        LandReportSummaryHelper.GenerateDistrictMutationSummaryGrid();
        LandReportSummaryHelper.GenerateUpozilaSummaryGrid();
        LandReportSummaryHelper.GenerateUpozilaMutationSummaryGrid();
        LandReportSummaryHelper.GenerateMouzaSummaryGrid();
        LandReportSummaryHelper.GenerateMouzaMutationSummaryGrid();
        LandReportSummaryHelper.GenerateOwnerInfoSummaryGrid();

        //$("#districtCommon").change(function () {
        //    $('.cmnClass').not(this).prop('checked', false);
        //    var val = $("input[type=checkbox]:checked").val();
        //    if (val == "districtCommon") {
        //        LandReportSummaryHelper.HideAllDiv();
        //            $("#divLandSummaryAllCommon").show();
        //            LandReportSummaryHelper.LoadLandSummaryDistrictGrid();
        //    }
        //});
        //$("#allDistrictCommon").change(function () {
        //    $('.cmnClass').not(this).prop('checked', false);

        //    var val = $("input[type=checkbox]:checked").val();
        //    if (val == "allDistrictCommon") {
        //        LandReportSummaryHelper.HideAllDiv();
        //            $("#divLandSummaryDistrictWise").show();
        //           LandReportSummaryHelper.LoadLandSummaryDistrictWiseGrid();
        //    }
        //});
        //$("#allUpozilaCommon").change(function () {
        //    ;
        //    $('.cmnClass').not(this).prop('checked', false);

        //    var val = $("input[type=checkbox]:checked").val();
        //    if (val == "allUpozilaCommon") {
        //        LandReportSummaryHelper.HideAllDiv();
        //           $("#divLandSummaryUpozilaWise").show();
        //          LandReportSummaryHelper.LoadLandSummaryUpazilaGrid();
        //    }
        //});
        //$("#allMouzaCommon").change(function () {
        //    $('.cmnClass').not(this).prop('checked', false);

        //    var val = $("input[type=checkbox]:checked").val();
        //    if (val == "allMouzaCommon") {
        //        LandReportSummaryHelper.HideAllDiv();
        //            $("#divLandSummaryAllMouzaWise").show();
        //           LandReportSummaryHelper.LoadLandSummaryMouzaGrid();
        //    }
        //});
        //$("#allOwnerCommon").change(function () {
            
        //    $('.cmnClass').not(this).prop('checked', false);
        //    var val = $("input[type=checkbox]:checked").val();
        //    if (val == "allOwnerCommon") {
        //        LandReportSummaryHelper.HideAllDiv();
        //            $("#divLandSummaryAllOwnerWise").show();
        //            LandReportSummaryHelper.LoadLandSummaryOwnerMouzaCommonGrid();
        //    }
        //});
        //$("#allFileCommon").change(function () {
            
        //    $('.cmnClass').not(this).prop('checked', false);
        //    var val = $("input[type=checkbox]:checked").val();
        //    if (val == "allFileCommon") {
        //        LandReportSummaryHelper.HideAllDiv();
        //            $("#divLandSummaryFileDeedOwnerMouzaCommon").show();
        //           LandReportSummaryHelper.LoadLandSummaryFileDeedOwnerMouzaCommonGrid();
        //    }
        //});

        LandHelper.LoadCmnDivisionCombo("cmbCmnDivision");
        LandHelper.LoadCmnDistrictCombo("cmbCmnDistrict");
        LandHelper.LoadCmnUpozilaCombo("cmbCmnUpozila");
        LandHelper.LoadCmnMouzaCombo("cmbCmnMouza");

        $("#cmbCmnDivision").change(function () {
            LandReportSummaryHelper.HideAllDiv();
            LandReportSummaryHelper.ChangeEventOfDivisionCombo();
            LandHelper.ChangeEventOfDivisionCombo();
        });
        $("#cmbCmnDistrict").change(function () {
            LandReportSummaryHelper.HideAllDiv();
            LandReportSummaryHelper.ChangeEventOfDistrictCombo();
            LandHelper.ChangeEventOfDistrictCombo();
        });
        $("#cmbCmnUpozila").change(function () {
            LandHelper.ChangeEventOfUpozilaCombo();
            LandReportSummaryHelper.HideAllDiv();
            LandReportSummaryHelper.ChangeEventOfUpozilaCombo();
        });
        $("#cmbCmnMouza").change(function () {
            LandReportSummaryHelper.HideAllDiv();
            LandReportSummaryHelper.ChangeEventOfMouzaCombo();
        });
        LandReportSummaryHelper.LoadOwnerInfoCombo("cmbOwnerInfo");
        LandReportSummaryHelper.LoadDeedNoCombo("cmbDeedNoOwnerDeed");
        $("#cmbOwnerInfo").change(function () {
            LandReportSummaryHelper.HideAllDiv();
            //LandReportSummaryHelper.ChangeEventOfOwnerInfoDeedCombo();
            LandReportSummaryHelper.ChangeOwnerInfoGrid();
        });
        $("#btnShowSummaryDistrictSingle").click(function () {
            LandReportSummaryHelper.LoadLandSummaryDistrictWiseSingleGrid();
        });
        $("#btnShowSummaryUpazilaSingle").click(function () {
            LandReportSummaryHelper.LoadLandSummaryUpazilaWiseSingleGrid();
        });
        $("#btnShowSummaryMouzaSingle").click(function () {
            LandReportSummaryHelper.LoadLandSummaryMouzaWiseSingleGrid();
        });
        $("#btnShowSummaryOwnerDistrict").click(function () {
            LandReportSummaryHelper.ShowSummaryOwnerDistrict();
        });
        $("#btnShowSummaryOwnerUpazila").click(function () {
            LandReportSummaryHelper.ShowSummaryOwnerUpazila();
        });
        $("#btnShowSummaryOwnerMouza").click(function () {
            LandReportSummaryHelper.ShowSummaryOwnerMouza();
        });
        $("#btnShowSummaryOwnerDeed").click(function () {
            LandReportSummaryHelper.ShowSummaryOwnerDeedWise();
        });
        $("#LoadAllDistrictReport").click(function () {
            
            LandReportSummaryHelper.LoadReport();
        });
        $("#LoadAllUpozilaReport").click(function () {
            
            LandReportSummaryHelper.LoadUpozillaReport();
        });
        $("#LoadUpozilaMutationReport").click(function () {

            LandReportSummaryHelper.LoadUpozillaMutationReport();
        });
        $("#MouzaLoadReport").click(function () {            
            LandReportSummaryHelper.LoadMouzaReport();
        });
        $("#LoadMouzaMutationReport").click(function () {
            LandReportSummaryHelper.LoadMouzaMutationReport();
        });
        $("#MouzaLoadReport1").click(function () {            
            LandReportSummaryHelper.LoadSingleMouzaReport();
        });
        $("#LoadDivisionReport").click(function () {            
            LandReportSummaryHelper.LoadDivisionReport();
        });
        $("#LoadDivisionMutationReport").click(function () {
            LandReportSummaryHelper.LoadDivisionMutationReport();
        });
        $("#LoadReportFile").click(function () {
            LandReportSummaryHelper.LoadFileReport();
        });
        $("#LoadReportDistrict1").click(function () {
            LandReportSummaryHelper.LoadSingleDistrictReport();
        });
        $("#LoadDistrictMutationReport").click(function () {
            LandReportSummaryHelper.LoadSingleDistrictMutationReport();
        });
        $("#OwnerLoadReport1").click(function () {            
            LandReportSummaryHelper.LoadOwnerSingleReport();
        });
        $("#OwnerLoadReportSingle").click(function () {
            LandReportSummaryHelper.LoadOwnerSingleSummaryReport();
        });
        $("#OwnerLoadMutationReportSingle").click(function () {
            LandReportSummaryHelper.LoadOwnerMutationSingleSummaryReport();
        });
        $("#OwnerLoadMutationReport1").click(function () {
            LandReportSummaryHelper.LoadOwnerMutationReport();
        });
        $("#LoadMouzaReport").click(function () {
            LandReportSummaryHelper.LoadMouzaReport();
        });
        $("#LoadOwnerReport").click(function () {
            LandReportSummaryHelper.LoadOwnerReport();
        });
        $("#LoadReportUpozilla").click(function () {
            LandReportSummaryHelper.LoadUpozilaSingleReport();
        });              
    },
    HideAllDiv: function () {
        $("#divLandSummaryDivision").hide();
        $("#divLandSummaryDistrict").hide();
        $("#divLandSummaryDistrictSingle").hide();
        $("#divLandSummaryDistrictWise").hide();
        $("#divLandSummaryUpazila").hide();
        $("#divLandSummaryUpazilaSingle").hide();
        $("#divLandSummaryMouza").hide();
        $("#divLandSummaryMouzaSingle").hide();
        $("#divLandSummaryOwnerMouzaCommon").hide();
        $("#divLandSummaryFileDeedOwnerMouzaCommon").hide();
        $("#divLandSummaryOwner").hide();
        $("#divLandSummaryCompany").hide();
        $("#divLandSummaryPerson").hide();
        $("#divLandSummaryOwnerDistrict").hide();
        $("#divLandSummaryOwnerUpazila").hide();
        $("#divLandSummaryOwnerMouza").hide();
        $("#divLandSummaryOwnerDeed").hide();
        $("#divLandSummaryAllCommon").hide();
        $("#divLandSummaryUpozilaWise").hide();
        $("#divLandSummaryAllMouzaWise").hide();
        $("#divLandSummaryAllOwnerWise").hide();
        $("#divLandSummaryDivisionMutation").hide();
        $("#divLandSummaryDistrictMutation").hide();
        $("#divLandMutationSummaryMouza").hide();
        $("#divLandMutationSummaryUpazila").hide();
        $("#divLandSummaryOwnerMutation").hide();
        $("#divLandSummaryOwnerWiseSingle").hide();
        $("#divLandSummaryOwnerWiseMutationSingle").hide();
    },
    GenerateLandSummaryDistrictGrid: function () {
        $("#grdLandSummaryDistrict").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            detailInit: detailInitUpozila,
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            //toolbar: ["search"],
            //search: {
            //    fields: ["DistrictName"]
            //},
            columns: [
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District Name", sortable: true/*, footerTemplate: "<div style='text-align:right'>Total</div>"*/ },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });

        function detailInitUpozila(e) {
            $("<div/>").appendTo(e.detailCell).kendoGrid({
                dataSource: LandReportSummaryManager.GridDataSourceLandSummaryUpazilaByDistrictId(e.data.DistrictId),
                scrollable: false,
                sortable: true,
                pageable: true,
                detailInit: detailInitMouza,
                noRecords: true,
                messages: {
                    noRecords: "No Record Found!"
                },
                columns: [
                    //{ field: "DistrictId", hidden: true },
                    //{ field: "DistrictName", title: "District", sortable: true },
                    { field: "UpozilaId", hidden: true },
                    { field: "UpozilaName", title: "Upazila/Thana", sortable: true/*, footerTemplate: "<div style='text-align:right'>Total</div>"*/ },
                    { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }/*, "footerTemplate": "<div style='text-align:right'>#: data.DeedQty ? sum: 0 #</div>"*/ },
                    { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }/*, "footerTemplate": "<div style='text-align:right'>#: kendo.toString(sum, '0.00') #</div>"*/, format: "{0:n2}" }
                ]
            });

            function detailInitMouza(e) {
                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: LandReportSummaryManager.GridDataSourceLandSummaryMouzaByUpozilaId(e.data.UpozilaId),
                    scrollable: false,
                    sortable: true,
                    pageable: true,
                    noRecords: true,
                    messages: {
                        noRecords: "No Record Found!"
                    },
                    columns: [
                        //{ field: "DistrictId", hidden: true },
                        //{ field: "DistrictName", title: "District", sortable: true },
                        //{ field: "UpozilaId", hidden: true },
                        //{ field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                        { field: "MouzaId", hidden: true },
                        { field: "MouzaName", title: "Mouza Name", sortable: true/*, footerTemplate: "<div style='text-align:right'>Total</div>"*/ },
                        { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }/*, "footerTemplate": "<div style='text-align:right'>#: data.DeedQty ? sum: 0 #</div>"*/ },
                        { field: "TotalLand", title: "Total Land (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }/*, "footerTemplate": "<div style='text-align:right'>#: kendo.toString(sum, '0.00') #</div>", format: "{0:n2}"*/ }
                    ],
                });
            }
        }

    },
    LoadLandSummaryDistrictGrid: function () {
        var grid = $("#grdLandSummaryDistrict").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryDistrict();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryDistrictWiseGrid: function () {
        $("#grdLandSummaryDistrictWise").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrict(),
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
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            sortable: true,
            pageable: true,
            filterable: true,
            resizable: true,
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryDistrictWiseGrid: function () {
        var grid = $("#grdLandSummaryDistrictWise").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryDistrict();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryDistrictWiseGridSingle: function () {
        $("#grdLandSummaryDistrictWiseSingle").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryDistrictWiseSingleGrid: function () {
        var divisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        var districtId = $("#cmbCmnDistrict").data("kendoComboBox").value();

        if (districtId === "" && divisionId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryDistrictSingle", "error", "right", 1500, "District & Division required!");
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "District required!");
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Division required!");
            return;
        }
        else if (districtId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryDistrictSingle", "error", "right", 1500, "District required!");
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "District required!");
            return;
        }
        else if (divisionId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryDistrictSingle", "error", "right", 1500, "Division required!");
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Division required!");
            return;
        }
        var landSummaryDistrictByDistrictId = LandReportSummaryManager.GetAllLandSummaryDistrictByDistrictId(districtId);

        var landSummaryDistrictWiseGrid = $("#grdLandSummaryDistrictWiseSingle").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landSummaryDistrictByDistrictId,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        landSummaryDistrictWiseGrid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryUpazilaGrid: function () {
        $("#grdLandSummaryUpozillaWise").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                //{ field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryUpazilaGrid: function () {
        var grid = $("#grdLandSummaryUpozillaWise").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryUpazila();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryUpazilaGridSingle: function () {
        $("#grdLandSummaryUpazilaSingle").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryUpazilaWiseSingleGrid: function () {
        var divisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        var districtId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        var upazilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();

        if (districtId === "" && divisionId === "" && upazilaId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryUpazilaSingle", "error", "right", 1500, "District & Division & Upazila required!");
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "District required!");
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Division required!");
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Upazila required!");
            return;
        }
        else if (districtId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryUpazilaSingle", "error", "right", 1500, "District required!");
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "District required!");
            return;
        }
        else if (divisionId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryUpazilaSingle", "error", "right", 1500, "Division required!");
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Division required!");
            return;
        }
        else if (upazilaId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryUpazilaSingle", "error", "right", 1500, "Upazia/Thana required!");
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Upazila required!");
            return;
        }

        var landSummaryUpazilaByUpazilaId = LandReportSummaryManager.GetAllLandSummaryUpazilaByUpazilaId(upazilaId);

        var landSummaryUpazilaWiseGridSingle = $("#grdLandSummaryUpazilaSingle").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landSummaryUpazilaByUpazilaId,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ]
        });
        landSummaryUpazilaWiseGridSingle.setDataSource(gridDataSource);
    },
    GenerateLandSummaryMouzaGrid: function () {
        $("#grdLandSummaryMouzaAll").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "MouzaId", hidden: true },
                //{ field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner Name", sortable: true},
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAmount", title: "Total Land (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryMouzaGrid: function () {
        var grid = $("#grdLandSummaryMouzaAll").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryMouza();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryMouzaGridSingle: function () {
        $("#grdLandSummaryMouzaSingle").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Mouza Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLand", title: "Total Land (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryMouzaWiseSingleGrid: function () {
        var divisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        var districtId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        var upazilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();

        if (districtId === "" && divisionId === "" && upazilaId === "" && mouzaId === "") {
            AjaxManager.NotifyMsg("grdLandSummaryMouzaSingle", "error", "right", 1500, "District & Division & Upazila & Mouza required!");
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "District required!");
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Division required!");
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Upazila required!");
            AjaxManager.NotifyMsg("cmbCmnMouza", "error", "right", 1500, "Mouza required!");
            return;
        }
        else if (districtId === "") {
            AjaxManager.NotifyMsg("grdLandSummaryMouzaSingle", "error", "right", 1500, "District required!");
            AjaxManager.NotifyMsg("cmbCmnDistrict", "error", "right", 1500, "District required!");
            return;
        }
        else if (divisionId === "") {
            AjaxManager.NotifyMsg("grdLandSummaryMouzaSingle", "error", "right", 1500, "Division required!");
            AjaxManager.NotifyMsg("cmbCmnDivision", "error", "right", 1500, "Division required!");
            return;
        }
        else if (upazilaId === "") {
            AjaxManager.NotifyMsg("grdLandSummaryMouzaSingle", "error", "right", 1500, "Upazila required!");
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Upazila required!");
            return;
        }
        else if (mouzaId === "") {
            AjaxManager.NotifyMsg("grdLandSummaryMouzaSingle", "error", "right", 1500, "Division required!");
            AjaxManager.NotifyMsg("cmbCmnUpozila", "error", "right", 1500, "Upazila required!");
            return;
        }

        var landSummaryMouzaByMouzaId = LandReportSummaryManager.GetAllLandSummaryMouzaByMouzaId(mouzaId);

        var mouzaGridSingle = $("#grdLandSummaryMouzaSingle").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landSummaryMouzaByMouzaId,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLand", aggregate: "sum" }
            ]
        });
        mouzaGridSingle.setDataSource(gridDataSource);
    },
    LoadLandSummaryOwnerMouzaCommonGrid: function () {
        var grid = $("#grdLandSummaryAllOwner").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryOwnerMouzaCommon();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryFileDeedOwnerMouzaCommonGrid: function () {
        $("#grdLandSummaryFileDeedOwnerMouzaCommon").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryOwnerBlank(),
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
                { field: "FileCodeInfoId", hidden: true },
                { field: "FileCodeInfoName", title: "File Code", sortable: true },
                { field: "FileNoInfoId", hidden: true },
                { field: "FileNoInfoName", title: "File No", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "MouzaId", hidden: true },
                //{ field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DeedNo", title: "Deed No", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" } },
                { field: "LandAmount", title: "Area of LAnd (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryFileDeedOwnerMouzaCommonGrid: function () {
        var grid = $("#grdLandSummaryFileDeedOwnerMouzaCommon").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryFileDeedOwnerMouzaCommon();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryOwnerGrid: function () {
        $("#grdLandSummaryOwner").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                //{ field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "LandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateLandSummaryOwnerSingleGrid: function () {
        $("#grdLandSummarySingleOwner").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                //{ field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "LandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateLandSummaryOwnerMutationGrid: function () {
        $("#grdLandSummaryOwnerMutation").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictMutationBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                //{ field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "OwnerMutatedLandAmount", title: "Total Mutated Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateLandSummaryOwnerSingleMutationGrid: function () {
        $("#grdLandSummarySingleOwnerMutation").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictMutationBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                //{ field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "OwnerMutatedLandAmount", title: "Total Mutated Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryOwnerGrid: function () {
        var grid = $("#grdLandSummaryAllOwner").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryOwner();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryCompanyGrid: function () {
        $("#grdLandSummaryCompany").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Company Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryCompanyGrid: function () {
        var grid = $("#grdLandSummaryCompany").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryCompany();
        grid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryPersonGrid: function () {
        $("#grdLandSummaryPerson").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Company Name", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    LoadLandSummaryPersonGrid: function () {
        var grid = $("#grdLandSummaryPerson").data("kendoGrid");
        var gridDataSource = LandReportSummaryManager.GridDataSourceLandSummaryPerson();
        grid.setDataSource(gridDataSource);
    },
    LoadOwnerInfoCombo(cmbOwnerInfo) {
        UtilityHelper.LoadCombo(cmbOwnerInfo, "OwnerInfoId", "OwnerInfoName", LandReportSummaryManager.GetAllOwnerInfo(), "--Select Owner--");
    },
    LoadDeedNoCombo(cmbDeedNoOwnerDeed) {
        UtilityHelper.LoadCombo(cmbDeedNoOwnerDeed, "LandMasterId", "DeedNo", [], "--Select Deed--");
    },
    GenerateLandSummaryOwnerDistrictGrid: function () {
        $("#grdLandSummaryOwnerDistrict").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                //{ field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner Name", sortable: true, hidden: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}", aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ShowSummaryOwnerDistrict: function () {
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        if (ownerInfoId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryOwnerDistrict", "error", "right", 1500, "Owner required!");
            AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Owner required!");
            return;
        }
        var landOwnerDistrictList = LandReportSummaryManager.GetAllLandSummaryOwnerDistrictListByOwnerInfoId(ownerInfoId);

        var landSummaryOwnerDistrictGrid = $("#grdLandSummaryOwnerDistrict").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landOwnerDistrictList,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ],
            group: {
                field: "OwnerInfoName"
            }
        });
        landSummaryOwnerDistrictGrid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryOwnerUpazilaGrid: function () {
        $("#grdLandSummaryOwnerUpazila").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoName", title: "Owner Name", sortable: true, hidden: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}", aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ShowSummaryOwnerUpazila: function () {
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        if (ownerInfoId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryOwnerUpazila", "error", "right", 1500, "Owner required!");
            AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Owner required!");
            return;
        }
        var landOwnerUpazilaList = LandReportSummaryManager.GetAllLandSummaryOwnerUpozilaListByOwnerInfoId(ownerInfoId);

        var landSummaryOwnerUpazilaGrid = $("#grdLandSummaryOwnerUpazila").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landOwnerUpazilaList,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLandAcres", aggregate: "sum" }
            ],
            group: {
                field: "OwnerInfoName"
            }
        });
        landSummaryOwnerUpazilaGrid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryOwnerMouzaGrid: function () {
        $("#grdLandSummaryOwnerMouza").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoName", title: "Owner Name", sortable: true, hidden: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=sum#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLand", title: "Total Land (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}", aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ShowSummaryOwnerMouza: function () {
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        if (ownerInfoId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryOwnerMouza", "error", "right", 1500, "Owner required!");
            AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Owner required!");
            return;
        }
        var landOwnerMouzaList = LandReportSummaryManager.GetAllLandSummaryOwnerMouzaListByOwnerInfoId(ownerInfoId);
        var landSummaryOwnerMouzaGrid = $("#grdLandSummaryOwnerMouza").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landOwnerMouzaList,
            schema: {
                model: {
                    fields: {
                        Edit: {
                            editable: false
                        }
                    }
                }
            },
            aggregate: [
                { field: "DeedQty", aggregate: "sum" },
                { field: "TotalLand", aggregate: "sum" }
            ],
            group: {
                field: "OwnerInfoName"
            }
        });
        landSummaryOwnerMouzaGrid.setDataSource(gridDataSource);
    },
    GenerateLandSummaryGrid: function () {
        $("#grdLandSummaryDivision").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DivisionId", hidden: true },
                //{ field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateLandMutationSummaryGrid: function () {
        $("#grdLandMutationSummaryDivision").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DivisionId", hidden: true },
                //{ field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                //{ field: "TotalLandAmount", title: "Total Land(Acrs)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                //{ field: "TotalLandAcres", hidden:true, title: "Total Land(Acrs)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "OwnerMutatedLandAmount", title: "Total Mutated Land (Acrs)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateDistrictSummaryGrid: function () {
        $("#grdLandSummaryDistrict1").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                //{ field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozil/Thana", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAcres", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateDistrictMutationSummaryGrid: function () {
        $("#grdLandMutationSummaryDistrict").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictMutationBlank(),
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
                { field: "DivisionId", hidden: true },
                { field: "DivisionName", title: "Division", sortable: true },
                { field: "DistrictId", hidden: true },
                //{ field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozil/Thana", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
               // { field: "TotalLandAmount", title: "Total Land(Acrs)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "OwnerMutatedLandAmount", title: "Total Mutated Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateUpozilaSummaryGrid: function () {
        $("#grdLandSummaryUpazila1").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },                
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                //{ field: "MouzaId", hidden: true },
                //{ field: "MouzaName", title: "Mouza", sortable: true },                
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateUpozilaMutationSummaryGrid: function () {
        $("#grdLandMutationSummaryUpozila").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryUpozilaMutationBlank(),
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
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upozila", sortable: true },                
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                //{ field: "MouzaId", hidden: true },
                //{ field: "MouzaName", title: "Mouza", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "OwnerMutatedLandAmount", title: "Total Mutated Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }

                //{ field: "TotalLandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateMouzaSummaryGrid: function () {
        $("#grdLandSummaryMouza1").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "MouzaId", hidden: true },
                //{ field: "MouzaName", title: "Mouza", sortable: true },
                //{ field: "DistrictId", hidden: true },
                //{ field: "DistrictName", title: "District", sortable: true },
                //{ field: "UpozilaId", hidden: true },
                //{ field: "UpozilaName", title: "Upozila", sortable: true },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateMouzaMutationSummaryGrid: function () {
        $("#grdLandMutationSummaryMouza").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryUpozilaMutationBlank(),
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
                //{ field: "UpozilaId", hidden: true },
                ////{ field: "UpozilaName", title: "Upozila", sortable: true },                
                //{ field: "DistrictId", hidden: true },
                //{ field: "DistrictName", title: "District", sortable: true },
                { field: "OwnerInfoId", hidden: true },
                { field: "OwnerInfoName", title: "Owner", sortable: true },
                { field: "MouzaId", hidden: true },
                //{ field: "MouzaName", title: "Mouza", sortable: true },
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "OwnerMutatedLandAmount", title: "Total Mutated Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }

                //{ field: "TotalLandAmount", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", footerAttributes: { style: "text-align: right" } }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    GenerateOwnerInfoSummaryGrid: function () {        
        $("#grdLandSummaryAllOwner").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),
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
                { field: "OwnerInfoId", hidden: true },
                //{ field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },                
                { field: "DeedQty", title: "Deed Qty", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "TotalLand", title: "Total Land (Acres)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", format: "{0:n2}", groupFooterTemplate: "Sub-Total: #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } }                
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    //ChangeEventOfOwnerInfoDeedCombo: function () {
    //    var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
    //    var data = LandReportSummaryManager.GetAllDeedNoByOwnerInfoId(ownerInfoId);
    //    var deedCombo = $("#cmbDeedNoOwnerDeed").data("kendoComboBox");
    //    deedCombo.value("");
    //    deedCombo.text("");
    //    deedCombo.setDataSource(data);
    //},
    GenerateLandSummaryOwnerDeedGrid: function () {
        $("#grdLandSummaryOwnerDeed").kendoGrid({
            dataSource: LandReportSummaryManager.GridDataSourceLandSummaryDistrictBlank(),            
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
                //{ field: "OwnerInfoId", hidden: true },
                //{ field: "OwnerInfoName", title: "Owner Name", sortable: true },
                { field: "DeedNo", title: "Deed No", sortable: true, hidden: true },
                { field: "OwnerInfoName", title: "Owner Name", sortable: true, hidden: true },
                { field: "DistrictId", hidden: true },
                { field: "DistrictName", title: "District", sortable: true },
                { field: "UpozilaId", hidden: true },
                { field: "UpozilaName", title: "Upazila/Thana", sortable: true },
                { field: "MouzaId", hidden: true },
                { field: "MouzaName", title: "Mouza", sortable: true },
                { field: "LandAmount", title: "Area of Land (Decimal)", sortable: true, headerAttributes: { style: "text-align: right" }, attributes: { style: "text-align: right" }, format: "{0:n2}", aggregates: ["sum"], footerTemplate: "Grand Total : #=kendo.toString(sum, '0.00')#", footerAttributes: { style: "text-align: right" } },
                { field: "EntryDate", title: "Date", sortable: true, format: "{0:dd-MM-yyyy}" }
            ],
            editable: false,
            selectable: "row",
            navigatable: true
        });
    },
    ShowSummaryOwnerDeedWise: function () {

        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        var landMasterId = $("#cmbDeedNoOwnerDeed").data("kendoComboBox").value();

        if (ownerInfoId === "" && landMasterId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryOwnerDeed", "error", "right", 1500, "Owner & Deed required!");
            AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Owner required!");
            AjaxManager.NotifyMsg("cmbDeedNoOwnerDeed", "error", "right", 1500, "Deed required!");
            return;
        }
        else if (ownerInfoId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryOwnerDeed", "error", "right", 1500, "Owner required!");
            AjaxManager.NotifyMsg("cmbOwnerInfo", "error", "right", 1500, "Owner required!");
            return;
        }
        else if (landMasterId === "") {
            AjaxManager.NotifyMsg("btnShowSummaryOwnerDeed", "error", "right", 1500, "Deed required!");
            AjaxManager.NotifyMsg("cmbDeedNoOwnerDeed", "error", "right", 1500, "Deed required!");
            return;
        }


        var landOwnerDeedList = LandReportSummaryManager.GetAllLandSummaryByLandMasterId(landMasterId);

        var landSummaryOwnerDeedGrid = $("#grdLandSummaryOwnerDeed").data("kendoGrid");
        var gridDataSource = new kendo.data.DataSource({
            data: landOwnerDeedList,
            schema: {
                model: {
                    fields: {
                        EntryDate: { type: "date", format: "{0:dd-MM-yyyy}" }
                    }
                }
            },
            aggregate: [
                { field: "LandAmount", aggregate: "sum" }
            ],
            group: {
                field: "OwnerInfoName"

            }
        });
        landSummaryOwnerDeedGrid.setDataSource(gridDataSource);
    },
    LoadReport: function () {        
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetAllDistrictWiseReport";
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },    
    LoadUpozillaReport: function () {
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetUpozillaWiseReport";
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadUpozillaMutationReport: function (upozilaId) {
        var upozilaId = $("#cmbCmnUpozila").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetUpozillaWiseMutationReport/?upozilaId=" + upozilaId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadMouzaReport: function () {
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetMouzaWiseReport";
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadMouzaMutationReport: function (mouzaId) {
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        debugger;
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetMouzaWiseMutationReport/?mouzaId=" + mouzaId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadSingleMouzaReport: function (mouzaId) {
        
        var mouzaId = $("#cmbCmnMouza").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleMouzaWiseReport/?mouzaId=" + mouzaId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadOwnerReport: function () {
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetOwnerWiseReport";
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadFileReport: function () {
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetFileWiseReport";
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadDivisionReport: function (divisionId) {
        
        var divisionId = $("#cmbCmnDivision").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetDivisionWiseReport/?divisionId=" + divisionId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadDivisionMutationReport: function (divisionId) {
        var divisionId = $("#cmbCmnDivision").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetDivisionWiseMutationReport/?divisionId=" + divisionId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadSingleDistrictReport: function (districtId) {
        var districtId = $("#cmbCmnDistrict").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleDistrictWiseReport/?districtId=" + districtId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadSingleDistrictMutationReport: function (districtId) {
        var districtId = $("#cmbCmnDistrict").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleDistrictWiseMutationReport/?districtId=" + districtId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadUpozilaSingleReport: function (upozilaId) {
        var upozilaId = $("#cmbCmnUpozila").val();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleUpozilaWiseReport/?upozilaId=" + upozilaId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadOwnerSingleReport: function (mouzaId, ownerInfoId) {
        debugger;
        var ownerInfoId = $("#cmbOwnerInfo").val();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleOwnerWiseReport/?mouzaId=" + mouzaId + "&ownerInfoId=" + ownerInfoId;
        //var serviceUrl = "../LandReport/GetSingleOwnerWiseReport/?ownerInfoId=" + ownerInfoId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadOwnerSingleSummaryReport: function (ownerInfoId) {
        debugger;
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleOwnerWiseSummaryReport/?ownerInfoId=" + ownerInfoId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadOwnerMutationReport: function (mouzaId, ownerInfoId) {
        debugger;
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleOwnerWiseMutationReport/?mouzaId=" + mouzaId + "&ownerInfoId=" + ownerInfoId;
        //var serviceUrl = "../LandReport/GetSingleOwnerWiseReport/?ownerInfoId=" + ownerInfoId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    LoadOwnerMutationSingleSummaryReport: function(ownerInfoId) {
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        var jsonParam = "";
        var serviceUrl = "../LandReport/GetSingleOwnerWiseMutationSummaryReport/?ownerInfoId=" + ownerInfoId;
        LandReportSummaryHelper.GetReport(serviceUrl, jsonParam, onFailed);
        function onFailed(error) {
            alert("Found Error");
        }
    },
    GetReport: function (serviceUrl, jsonParam, errorCallback) {
        jQuery.ajax({
            url: serviceUrl,
            async: false,
            type: "POST",
            data: "{" + jsonParam + "}",
            contentType: "application/json; charset=utf-8",
            success: function () {
                window.open('../LandReports/ReportViewer.aspx', '_newtab');
            },
            error: errorCallback
        });
    },
    ChangeEventOfDivisionCombo: function () {        
        var divisionId = $("#cmbCmnDivision").data("kendoComboBox").value();
        if (divisionId != "") {
            var data = LandReportSummaryManager.GetDivisionLandSummaryById(divisionId);
            $("#grdLandSummaryDivision").data("kendoGrid").setDataSource(data);
            var mutationData = LandReportSummaryManager.GetMutationDivisionLandSummaryById(divisionId);
            $("#grdLandMutationSummaryDivision").data("kendoGrid").setDataSource(mutationData);
            //$("#divLandSummaryDivision").hide();
            $("#divLandSummaryDivision").show();
            $("#divLandSummaryDivisionMutation").show();
        }
    },
    ChangeEventOfDistrictCombo: function () {
        var districtId = $("#cmbCmnDistrict").data("kendoComboBox").value();
        if (districtId != "") {
            debugger;
            var data = LandReportSummaryManager.GetDistrictLandSummaryById(districtId);
            $("#grdLandSummaryDistrict1").data("kendoGrid").setDataSource(data);
            var mutationData = LandReportSummaryManager.GetMutationDistrictLandSummaryById(districtId);
            $("#grdLandMutationSummaryDistrict").data("kendoGrid").setDataSource(mutationData);
            $("#divLandSummaryDivision").hide();
            $("#divLandSummaryDistrict").show();
            $("#divLandSummaryDistrictMutation").show();
            
        }
    },
    ChangeEventOfUpozilaCombo: function () {
        var upozilaId = $("#cmbCmnUpozila").data("kendoComboBox").value();
        if (upozilaId != "") {
            var data = LandReportSummaryManager.GetUpozilaLandSummaryById(upozilaId);
            $("#grdLandSummaryUpazila1").data("kendoGrid").setDataSource(data);
            var mutationData = LandReportSummaryManager.GetUpozilaMutationLandSummaryById(upozilaId);
            $("#grdLandMutationSummaryUpozila").data("kendoGrid").setDataSource(mutationData);
            $("#divLandSummaryDivision").hide();
            $("#divLandSummaryDistrict").hide();
            $("#divLandSummaryUpazila").show();
            $("#divLandMutationSummaryUpazila").show();
        }
    },
    ChangeEventOfMouzaCombo: function () {
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        if (mouzaId != "") {
            debugger;
            var data = LandReportSummaryManager.GetMouzaLandSummaryById(mouzaId);
            $("#grdLandSummaryMouza1").data("kendoGrid").setDataSource(data);

            $("#divLandSummaryMouza").show();
            $("#divLandMutationSummaryMouza").show();

            var mutationData = LandReportSummaryManager.GetMouzaLandMutationSummaryById(mouzaId);
            $("#grdLandMutationSummaryMouza").data("kendoGrid").setDataSource(mutationData);


            //$("#divLandSummaryDivision").hide();
            //$("#divLandSummaryDistrict").hide();
            //$("#divLandSummaryUpazila").hide();
            //$("#divLandMutationSummaryUpazila").hide();
            
        }
    },
    ChangeOwnerInfoGrid: function () {
        debugger;
        var mouzaId = $("#cmbCmnMouza").data("kendoComboBox").value();
        var ownerInfoId = $("#cmbOwnerInfo").data("kendoComboBox").value();
        //if (mouzaId == "") {
        //    mouzaId = "00000000-0000-0000-0000-000000000000";
        //}
        if (ownerInfoId !== "" && mouzaId !== "") {
            var data = LandReportSummaryManager.GetOwnerInfoLandSummaryById(mouzaId, ownerInfoId);
            $("#grdLandSummaryOwner").data("kendoGrid").setDataSource(data);

            var mutationData = LandReportSummaryManager.GetOwnerInfoLandMutationSummaryById(mouzaId, ownerInfoId);
            $("#grdLandSummaryOwnerMutation").data("kendoGrid").setDataSource(mutationData);

            $("#divLandSummaryDivision").hide();
            $("#divLandSummaryDistrict").hide();
            $("#divLandSummaryUpazila").hide();
            $("#divLandSummaryMouza").hide();
            $("#divLandSummaryAllOwnerWise").hide();
            $("#divLandSummaryOwner").show();
            $("#divLandSummaryOwnerMutation").show();
        } else {
            var ownerData = LandReportSummaryManager.GetSingleOwnerInfoLandSummaryById(ownerInfoId);
            $("#grdLandSummarySingleOwner").data("kendoGrid").setDataSource(ownerData);
            var ownerMutatedData = LandReportSummaryManager.GetSingleOwnerMutationInfoLandSummaryById(ownerInfoId);
            $("#grdLandSummarySingleOwnerMutation").data("kendoGrid").setDataSource(ownerMutatedData);

            $("#divLandSummaryDivision").hide();
            $("#divLandSummaryDistrict").hide();
            $("#divLandSummaryUpazila").hide();
            $("#divLandSummaryMouza").hide();
            $("#divLandSummaryAllOwnerWise").hide();
            $("#divLandSummaryOwner").hide();
            $("#divLandSummaryOwnerMutation").hide();
            $("#divLandSummaryOwnerWiseSingle").show();
            $("#divLandSummaryOwnerWiseMutationSingle").show();
        }
    }
}