var gbSelectiveSizeArray = [];
//var gbSelectedObj = [];

var POSizeTemplateDetailsManager = {
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
                    url: _baseUrl + '/api/POSizeBreakdownTemplate/GetAllPOSizeBreakownGridData',
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
                //model: {
                //    fields: {
                //        PIDate: {
                //            type: "date",
                //            template: '#= kendo.toString("dd-MMM-yyyy") #',
                //            editable: false
                //        }

                //    }
                //},
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    LoadBrands: function () {
        $("#cmbBrand").data("kendoComboBox").text("");
        var buyerId = $("#cmbBuyer").data("kendoComboBox").value(),
            brands = [];
        if (!UtilityHelper.IsNullOrEmpty(buyerId)) {
            brands = ApiManager.GetList(_baseUrl + "/api/BuyerBrands/brands/" + buyerId);
            brands.unshift({
                BrandId: "",
                BuyerBrandName: "--Select Brand--"
            });
            $("#cmbBrand").data("kendoComboBox").setDataSource(brands);
        }
    },
    LoadDepartments: function() {
        $("#cmbDepartment").data("kendoComboBox").text("");
        var brandId = $("#cmbBrand").data("kendoComboBox").value(),
            departments = [];
        if (!UtilityHelper.IsNullOrEmpty(brandId)) {
            departments = ApiManager.GetList(_baseUrl + "/api/BrandDepartments/department/" + brandId);
            departments.unshift({
                DepartmentId: "",
                BuyerDepartmentName: "--Select Department--"
            });
            $("#cmbDepartment").data("kendoComboBox").setDataSource(departments);
        }
    },
    GetAllSizeGridData: function () {
        //debugger;
        //var sizeList = ApiManager.GetList(_baseUrl + "/api/CmnSizes/all");
        //if (sizeList != null)
        //    return sizeList;
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            //pageSize: 20,
            transport: {
                read: {
                    url: _baseUrl + '/api/CmnSizes/GetAllGridData',
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: {
                model: {
                    id: "SizeId"
                },
                data: "Items", total: "TotalCount"
            },
            
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    SavePOSizeBreakdownTemplateInfo: function () {
        if (POSizeTemplateDetailsHelper.ValidateForm()) {
            var createPOSizeCommands = POSizeTemplateDetailsHelper.CreatePOSizeBreakdownTemplateInfoObject();
            debugger;

            var jsonParam = JSON.stringify(createPOSizeCommands);
            var serviceUrl = _baseUrl + "/api/POSizeBreakdownTemplate/CreatePOSizeBreakdownTemplate";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            var msg = jsonData.Message;
            if (jsonData.Success) {
                var summary = POSizeTemplateDetailsManager.gridDataSource();
                debugger;
                var grid = $("#grdTemplateSummary").data("kendoGrid");
                grid.setDataSource(summary);
                //$("#divPIDetails").hide();
                //$("#divPISummary").show();

                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            POSizeTemplateDetailsHelper.ClearFrom();
                            $("#btnSaveItem").removeClass("fa-edit");
                            $("#btnSaveItem").addClass("fa-save");
                            $("#btnSaveItem").text(" Save");
                            $("#hdnPOSizeBreakdownId").val("00000000-0000-0000-0000-000000000000")
                            //debugger;
                            //$("#hdnExInvoiceId").val(jsonData.createComExportInvoiceDto.ExportInvoiceId);
                            //$("#txtInvoiceNo").val(jsonData.createComExportInvoiceDto.InvoiceNo);
                            //$("#grdExportInvoiceSummary").data("kendoGrid").dataSource.read();
                        }
                    }]);
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            debugger;
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    GetSizeListByTemplateId: function () {
        var result = [];
        var templateId = $("#hdnPOSizeBreakdownId").val();
        if (!UtilityHelper.IsNullOrEmpty(templateId)) {
            result = ApiManager.GetList(_baseUrl + "/api/POSizeBreakdownTemplate/" + templateId);
        }
        return result;
    },
    SaveNewSize: function () {
        if (POSizeTemplateDetailsHelper.ValidateModalForm()) {
            debugger;
            var createCmnSizeCommand = POSizeTemplateDetailsHelper.CreateSizeObject();
            var jsonParam = JSON.stringify(createCmnSizeCommand);
            var serviceUrl = _baseUrl + "/api/CmnSizes/CreateUpdateCmnSize";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            debugger;
            var msg = jsonData.Message;
            var cmnSize = jsonData.CmnSizeDto;
            if (jsonData.Success) {
                $('#sizeList')
                    .append(`<div class="col-md-3"><input type="checkbox" id="${cmnSize.SizeId}" name="${cmnSize.SizeId}" value="${cmnSize.SizeId}">
                                               <label for="${cmnSize.SizeId}">${cmnSize.SizeName}</label>
                          </div>`); 
                $('#sizeModal').modal('hide');

                gbSelectiveSizeArray.push(cmnSize.SizeId);
                $('input:checkbox[name=' + cmnSize.SizeId + ']').prop('checked', true);


                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            debugger;
                            $noty.close();
                            //POSizeTemplateDetailsHelper.ClearFrom();
                            //$("#btnSaveItem").removeClass("fa-edit");
                            //$("#btnSaveItem").addClass("fa-save");
                            //$("#btnSaveItem").text(" Save");
                            //$("#hdnPOSizeBreakdownId").val("00000000-0000-0000-0000-000000000000")
                            //debugger;
                            //$("#hdnExInvoiceId").val(jsonData.createComExportInvoiceDto.ExportInvoiceId);
                            //$("#txtInvoiceNo").val(jsonData.createComExportInvoiceDto.InvoiceNo);
                            //$("#grdExportInvoiceSummary").data("kendoGrid").dataSource.read();
                        }
                    }]);
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            debugger;
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
};

var POSizeTemplateDetailsHelper = {
    InitPOSizeTemplateDetails: function () {
        POSizeTemplateDetailsHelper.GenerateTemplateSummaryGrid();

        $("#cmbBuyer").change(function () {
            POSizeTemplateDetailsHelper.ResetFrom();
            POSizeTemplateDetailsManager.LoadBrands();
        });
        $("#cmbBrand").change(function () {
            POSizeTemplateDetailsManager.LoadDepartments();
        });

        MerchantHelper.LoadBuyerCombo("cmbBuyer");
        MerchantHelper.LoadProductCombo("cmbProduct");
        MerchantHelper.LoadCountryCombo("cmbCountry");
        // POSizeTemplateDetailsHelper.GenerateGrid();
        POSizeTemplateDetailsHelper.SizeListLoad();

        $('input[type="checkbox"]').change(function (ev) {
            if (ev.target.checked) {
                gbSelectiveSizeArray.push(ev.target.value);
                console.log(gbSelectiveSizeArray);
            } else {
                var index = gbSelectiveSizeArray.indexOf(ev.target.value);
                if (index !== -1) {
                    gbSelectiveSizeArray.splice(index, 1);
                    console.log(gbSelectiveSizeArray);

                }
            }
            //gbSelectiveSizeArray = [];
            //$('input[type="checkbox"]:checked').each(function () {
            //    console.log(this.value);
            //    gbSelectiveSizeArray.push(this.value);
            //});
        });

        $("#cmbBrand").kendoComboBox({
            dataTextField: "BuyerBrandName",
            dataValueField: "BrandId",
            placeholder: "--Select Brand--"
        });
        $("#cmbDepartment").kendoComboBox({
            dataTextField: "BuyerDepartmentName",
            dataValueField: "DepartmentId",
            placeholder: "--Select Department--"

        });
        $("#btnSaveItem").click(function () {
            POSizeTemplateDetailsManager.SavePOSizeBreakdownTemplateInfo();
        });
        $("#btnClearItem").click(function () {
            POSizeTemplateDetailsHelper.ClearFrom();
        });

        $("#btnSaveSize").click(function () {
            POSizeTemplateDetailsManager.SaveNewSize();
        });
    },
    ResetFrom: function () {
        $("#cmbDepartment").data("kendoComboBox").value("");
        $("#cmbBrand").data("kendoComboBox").value("");
    },
    ClearFrom: function () {
        $("#cmbBuyer").data("kendoComboBox").value("");
        $("#cmbBrand").data("kendoComboBox").value("");
        $("#cmbDepartment").data("kendoComboBox").value("");
        $("#cmbProduct").data("kendoComboBox").value("");
        $("#cmbCountry").data("kendoComboBox").value("");
        gbSelectiveSizeArray = [];
        $('input:checkbox').prop('checked', false);
        $("#btnSaveItem").removeClass("fa-edit");
        $("#btnSaveItem").addClass("fa-save");
        $("#btnSaveItem").text(" Save");
    },
    GenerateTemplateSummaryGrid: function () {
        $("#grdTemplateSummary").kendoGrid({
            dataSource: POSizeTemplateDetailsManager.gridDataSource(),
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
                noRecords: "NO DATA FOUND"
            },
            columns: [
                { field: "PosizeTemplateId", hidden: true },
                { field: "BuyerId", hidden: true },
                { field: "BrandId", hidden: true },
                { field: "DepartmentId", hidden: true },
                { field: "ProductId", hidden: true },
                { field: "CountryId", hidden: true },
                { field: "BuyerName", title: "Buyer <br/> Name", width: 12, sortable: true },
                { field: "BuyerBrandName", title: "Brand <br/> Name", width: 12, sortable: true },
                { field: "BuyerDepartmentName", title: "Department <br/> Name", width: 12, sortable: true },
                { field: "ProductName", title: "Product <br/> Name", width: 12, sortable: true },
                { field: "CountryName", title: "Country <br/> Name", width: 12, sortable: true },
                { field: "SizeName", title: "Size <br/> Name", width: 12, sortable: true },

                {
                    field: "Action", title: "Action", filterable: false, width: 10, command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-search k-icon-xm", className: "k-success", click: POSizeTemplateDetailsHelper.ClickEventForEditButton
                    }], sortable: false
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            scrollable: true,
            toolbar: ["search"],
            search: {
                fields: ["BuyerName"]
            }
        });
        $("#grdTemplateSummary").on("dblclick", "tr.k-state-selected", function () {
            var grid = $("#grdTemplateSummary").data("kendoGrid");
            if (grid.select().length > 0) {
                var selectedItem = grid.dataItem(grid.select());
                if (selectedItem != null) {
                    POSizeTemplateDetailsHelper.FillTemplateFormSizelist(selectedItem);
                }
            }
        });
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        var grid = $("#grdTemplateSummary").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            POSizeTemplateDetailsHelper.FillTemplateFormSizelist(selectedItem);
        }
    },
    FillTemplateFormSizelist: function (obj) {
        gbSelectiveSizeArray = [];
        $('input:checkbox').prop('checked', false);
        if (obj !== null && obj !== undefined) {
            $("#hdnPOSizeBreakdownId").val(obj.PosizeTemplateId);
            $("#cmbBuyer").data("kendoComboBox").value(obj.BuyerId);

            POSizeTemplateDetailsManager.LoadBrands();
            $("#cmbBrand").data("kendoComboBox").value(obj.BrandId);

            POSizeTemplateDetailsManager.LoadDepartments();
            $("#cmbDepartment").data("kendoComboBox").value(obj.DepartmentId);

            $("#cmbProduct").data("kendoComboBox").value(obj.ProductId);
            $("#cmbCountry").data("kendoComboBox").value(obj.CountryId);
            // size data get and check the size
            var sizeListData = POSizeTemplateDetailsManager.GetSizeListByTemplateId();
            for (var i = 0; i < sizeListData.length; i++) {
                $('input:checkbox[name=' + sizeListData[i].SizeId + ']').prop('checked', true);
                gbSelectiveSizeArray.push(sizeListData[i].SizeId);
            }
            //
            $("#btnSaveItem").addClass("fa fa-edit");
            $("#btnSaveItem").text(" Update");

        }

    },
    //GenerateGrid: function () {
    //    $("#grdSizeSummary").kendoGrid({
    //        dataSource: POSizeTemplateDetailsManager.GetAllSizeGridData(),
    //        pageable: true,
    //        filterable: true,
    //        sortable: true,
    //        pageSize: 5,
    //        height: 250,
    //        scrollable: true,
    //        change: POSizeTemplateDetailsHelper.SelectedSizeRow,
    //        persistSelection: true,
    //        columns: [
    //            { selectable: true, width: "50px" },
    //            { field: "SizeId", hidden: true, width: 40, sortable: true },
    //            { field: "SizeName", title: "Size Name", width: 40, sortable: true },
    //        ],
    //    });
    //},
    
    //SelectedSizeRow: function (e) {
    //    debugger;
    //    var rows = e.sender.select();
    //    gbSelectiveSizeArray = this.selectedKeyNames();

    //    rows.each(function(e) {
    //        var grid = $("#grdSizeSummary").data("kendoGrid");
    //        var dataItem = grid.dataItem(this);
    //        gbSelectedObj.push(dataItem);
    //    });
    //},

    SizeListLoad: function () {
        var list = POSizeTemplateDetailsManager.GetAllSizeGridData();
        for (var value of list._data) {
            $('#sizeList')
                .append(`<div class="col-md-3"><input type="checkbox" id="${value.SizeId}" name="${value.SizeId}" value="${value.SizeId}">
                                               <label for="${value.SizeId}">${value.SizeName}</label>
                          </div>`);
        }
    },
    CreatePOSizeBreakdownTemplateInfoObject: function () {
        var obj = new Object();
        obj.PosizeTemplateId = $("#hdnPOSizeBreakdownId").val();
        obj.BuyerId = $("#cmbBuyer").data("kendoComboBox").value();
        obj.BrandId = $("#cmbBrand").data("kendoComboBox").value();
        obj.DepartmentId = $("#cmbDepartment").data("kendoComboBox").value() === "" ? AjaxManager.DefaultGuidId() : $("#cmbDepartment").data("kendoComboBox").value() ;
        obj.CountryId = $("#cmbCountry").data("kendoComboBox").value();
        obj.ProductId = $("#cmbProduct").data("kendoComboBox").value();
       
        obj.CreatedBy = CurrentUser.USERID;


        obj.SizeBreakdownList = POSizeTemplateDetailsHelper.CreatePoWiseSizeBreakDownObject();
        return obj;
    },
    CreatePoWiseSizeBreakDownObject: function () {
        var sizeBreakDownList = [];
        for (var i = 0; i < gbSelectiveSizeArray.length; i++) {
            var obj = new Object();
            obj.SizeId = gbSelectiveSizeArray[i];//AjaxManager.DefaultGuidId();
            obj.PosizeTemplateId = $("#hdnPOSizeBreakdownId").val();
            obj.PosizeTemplateDetailId = AjaxManager.DefaultGuidId();
            
            sizeBreakDownList.push(obj);
        }
        return sizeBreakDownList;
    },
    CreateSizeObject: function () {
       
        var obj = new Object();
        obj.SizeName = $("#txtSizeName").val().trim();
        return obj;
    },
    ValidateForm: function () {
        debugger;
        var res = true;
        var buyer = $("#cmbBuyer").data("kendoComboBox");
        if (buyer.value() === "" || buyer.value() === undefined) {
            AjaxManager.NotifyMsg("cmbBuyer", "error", "right", 1500, "Required");
            res = false;
        }
        //var brand = $("#cmbBrand").data("kendoComboBox");
        //if (brand.value() === "" || brand.value() === undefined) {
        //    AjaxManager.NotifyMsg("cmbBrand", "error", "right", 1500, "Required");
        //    res = false;
        //}
        var product = $("#cmbProduct").data("kendoComboBox");
        if (product.value() === "" || product.value() === undefined) {
            AjaxManager.NotifyMsg("cmbProduct", "error", "right", 1500, "Required");
            res = false;
        }
        var country = $("#cmbCountry").data("kendoComboBox");
        if (country.value() === "" || country.value() === undefined) {
            AjaxManager.NotifyMsg("cmbCountry", "error", "right", 1500, "Required");
            res = false;
        }
        if (gbSelectiveSizeArray.length <= 0) {
            kendo.alert("Select At Least One Size From Size List.");
            res = false;
        }
        return res;
    },
    ValidateModalForm: function () {
        var res = true;
        var sizeName = $("#txtSizeName").val().trim();
        if (sizeName === "" || sizeName === undefined) {
            AjaxManager.NotifyMsg("txtSizeName", "error", "right", 1500, "Required");
            res = false;
        }
        return res;
    }
};