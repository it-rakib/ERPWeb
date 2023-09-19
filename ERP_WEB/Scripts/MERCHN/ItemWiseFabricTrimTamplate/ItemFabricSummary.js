var gbItemList = [];
var gbTotalValue = 0;
var gbSelectiveItemArray = [];
var gbRemovedItemArray = [];

var ItemFabricSummaryManager = {
    GetProductGridData: function (productCategoryId, productId) {
        gbSelectiveItemArray = [];
        gbRemovedItemArray = [];
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 05,
            transport: {
                read: {
                    url: _baseUrl + '/api/ProductWiseFabTrimTamplate/GetItemByProductsId/' + productCategoryId + "/" + productId,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: { data: "Items", total: "TotalCount" }
        });
        gridDataSource.filter({});
        return gridDataSource;
    },
    GetProductByCategoryId: function (productCategoryId) {
        var objProduct = "";
        var jsonParam = "";
        var serviceUrl = _baseUrl + "/api/MerchProducts/product/" + productCategoryId;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objProduct = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objProduct;
    },
    SaveProductWiseItemPermission: function () {
        if (ItemFabricSummaryHelper.ValidateForm()) {
            var command = ItemFabricSummaryHelper.CreateProductObj();
            var jsonParam = JSON.stringify(command);
            var serviceUrl = _baseUrl + '/api/ProductWiseFabTrimTamplate/CreateOrUpdateProductWiseItem';
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        }
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success:', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            gbSelectiveMenuArray = [];
                            gbRemovedMenuArray = [];
                            $("#grdItemSummary").data("kendoGrid").dataSource.read();
                        }
                    }]);
                ItemFabricSummaryHelper.ClearItemForm();
                ItemFabricSummaryHelper.GenerateProductAccessoriesGrid();

            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Error', jsonData.Message,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    GetProductGrid: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/MerchProducts/GetAllGridData',
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
    GetProductAccessoriesGrid: function () {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/ProductWiseFabTrimTamplate/GetAllProductWiseItemGridData',
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
};

var ItemFabricSummaryHelper = {
    InitFabricItemSummary: function () {
        ItemFabricSummaryHelper.GenerateProductGrid();
        ItemFabricSummaryHelper.GenerateProductAccessoriesGrid();
        MerchantHelper.LoadProductCategoryCombo("cmbProductCategory");
        ItemFabricSummaryHelper.LoadProductCombo("cmbProduct");
        ItemFabricSummaryHelper.UserItemPermissionGridChangeEvent();
        $("#effectDate").kendoDatePicker({
            value: new Date(),
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy-MM-dd"]

        });
        $("#cmbProductCategory").change(function () {
            ItemFabricSummaryHelper.ChangeEventOfCategoryCombo();
        });
        $("#cmbProduct").change(function () {
            ItemFabricSummaryHelper.ChangeEventOfProductCombo();
        });
        $("#effectDate").change(function () {
            ItemFabricSummaryHelper.ChangeEventOfEffectDateCombo();
        });
        ItemFabricSummaryHelper.GenerateItemsGrid();
        ItemFabricSummaryHelper.LoadProductGrid();

        $("#btnSaveItem").click(function () {
            ItemFabricSummaryManager.SaveProductWiseItemPermission();

        });

        $("#btnClearItem").click(function () {
            ItemFabricSummaryHelper.ClearItemForm();
        });

    },
    CreateProductObj: function () {
        var date = $("#effectDate").val();
        var obj = new Object();
        obj.ProductId = $("#cmbProduct").val();
        obj.ProductCategoryId = $("#cmbProductCategory").val();
        obj.EffectDate = date.toString('dd/mm/yyyy HH:mm:ss');
        obj.AddProductWiseItems = ItemFabricSummaryHelper.SelectedItemObj();
        obj.RemoveProductWiseItems = ItemFabricSummaryHelper.RemoveProductWiseItems();
        return obj;
    },
    SelectedItemObj: function () {
        var selectedItmList = [];
        for (var i = 0; i < gbSelectiveItemArray.length; i++) {
            var itm = gbSelectiveItemArray[i];
            if (itm.TamplateId == AjaxManager.DefaultGuidId()) {
                var obj = new Object();
                obj.TamplateId = AjaxManager.DefaultGuidId();
                obj.ProductId = $("#cmbProduct").val();
                obj.ProductCategoryId = $("#cmbProductCategory").val();
                obj.ItemId = itm.ItemId;
                obj.EffectDate = $("#effectDate").val();
                //obj.EffectDate = $("#effectDate").val();
                selectedItmList.push(obj);
            }
        }
        return selectedItmList;
    },
    RemoveProductWiseItems: function () {
        var removedItmList = [];
        for (var i = 0; i < gbRemovedItemArray.length; i++) {
            var itm = gbRemovedItemArray[i];
            if (itm.TamplateId != AjaxManager.DefaultGuidId()) {
                var obj = new Object();
                obj.TamplateId = itm.TamplateId;
                obj.ProductId = $("#cmbProduct").val();
                obj.ProductCategoryId = $("#cmbProductCategory").val();
                obj.ItemId = itm.ItemId;
                removedItmList.push(obj);
            }
        }
        return removedItmList;
    },
    GenerateProductGrid: function () {
        $("#grdItemSummary").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: ItemFabricSummaryManager.GetProductGrid(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: false,
            sortable: false,
            columns: [
                { field: "ProductId", hidden: true },
                { field: "ProductCategoryId", hidden: true },
                { field: "ProductCategoryName", title: "Product Category", editable: true },
                { field: "ProductName", title: "Product Name", editable: true },
                { field: "EffectDate", hidden: true },
                {
                    field: "Action", title: "Action", filterable: false, width: 160, command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-search", className: "k-success", click: ItemFabricSummaryHelper.ClickEventForSearchButton
                    }], sortable: false
                }

            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            selectable: "row",
        });
    },
    GenerateItemsGrid: function () {
        $("#grdProductSummary").kendoGrid({
            dataSource: [],
            toolbar: ["search"],
            search: {
                fields: ["ItemName"]
            },
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: ItemFabricSummaryHelper.GenerateItemColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
        });
    },
    GenerateItemColumns: function () {
        return columns = [
            { field: "check_row", title: "", width: 30, filterable: false, sortable: false, template: '#= ItemFabricSummaryHelper.CheckedMenu(data) #', headerTemplate: "<input type='checkbox' id='checkAll'/>" },
            { field: "ItemId", hidden: true },
            { field: "ProductCategoryId", hidden: true },
            { field: "ItemGroupId", hidden: true },
            { field: "ItemName", title: "Item Name", width: 130 },
            { field: "GroupName", title: "Group Name", width: 130 },
            { field: "CategoryName", title: "Category Name", width: 130 },

        ];
    },
    GenerateProductAccessoriesGrid: function () {
        $("#grdProductAccessories").kendoGrid({
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            dataSource: ItemFabricSummaryManager.GetProductAccessoriesGrid(),
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: false,
            sortable: false,
            //toolbar: ["search"],
            //search: {
            //    fields: ["ItemName"]
            //},
            columns: [
                { field: "TamplateId", hidden: true },
                { field: "ProductCategoryId", hidden: true },
                { field: "ProductId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ProductCategoryName", title: "Product Category", editable: true },
                { field: "ProductName", title: "Product Name", editable: true },
                { field: "EffectDate", title: "Effect Date", editable: true, template: '#= kendo.toString(kendo.parseDate(EffectDate), "yyyy-MM-dd") #' },
                { field: "ItemName", title: "Product Accessories", editable: true },
                {
                    field: "Action", title: "Action", filterable: false, width: 160, command: [{
                        name: "edit", text: "", iconClass: "k-icon k-i-edit", className: "k-success", click: ItemFabricSummaryHelper.ClickEventForEditButton
                    }], sortable: false
                }

            ],
            editable: true,
            selectable: "row",
            navigatable: true,
            selectable: "row",
        });
    },
    ClickEventForSearchButton: function (e) {
        e.preventDefault();
        ItemFabricSummaryHelper.ClearItemForm();
        var grid = $("#grdProductAccessories").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#hdnProductId").val(selectedItem.ProductId);
            var productCategoryId = UtilityHelper.EmptyThenDefaultGuidId();
            var productId = UtilityHelper.EmptyThenDefaultGuidId();
            var data = ItemFabricSummaryManager.GetProductGridData(productCategoryId, productId);
            $("#grdProductSummary").data("kendoGrid").setDataSource(data);
        }
    },
    UncheckedItemsGrid: function () {
        debugger;
        var productCategoryId = UtilityHelper.EmptyThenDefaultGuidId();
        var productId = UtilityHelper.EmptyThenDefaultGuidId();
        var data = ItemFabricSummaryManager.GetProductGridData(productCategoryId, productId);
        $("#grdProductSummary").data("kendoGrid").setDataSource(data);
    },
    ClickEventForEditButton: function (e) {
        e.preventDefault();
        $("#btnSaveItem").addClass("fa fa-edit");
        $("#btnSaveItem").text("Update");
        var grid = $("#grdProductAccessories").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#cmbProductCategory").data("kendoComboBox").value(selectedItem.ProductCategoryId);
            $("#cmbProduct").data("kendoComboBox").value(selectedItem.ProductId);
            //$("#effectDate").data("kendoDatePicker").value(selectedItem.EffectDate);
            ItemFabricSummaryHelper.LoadProductGrid();
        }

    },
    ClearItemForm: function () {
        $("#cmbProductCategory").data("kendoComboBox").value("");
        $("#cmbProduct").data("kendoComboBox").value("");
        $("#effectDate").data("kendoDatePicker").value(new Date());
        $("#grdProductSummary").data("kendoGrid").dataSource.read();
        $("#grdProductSummary tbody input:checkbox").removeAttr("checked", this.checked);
        $("#btnSaveItem").addClass("glyphicon glyphicon-floppy-disk");
        $("#btnSaveItem").text("Save");
    },
    CheckedMenu: function (data) {
        if (gbSelectiveItemArray.length > 0) {
            var result = gbSelectiveItemArray.filter(function (obj) {
                return obj.ItemId == data.ItemId;
            });
            if (result.length > 0) {
                return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
            }
            else {
                if (data.TamplateId != "00000000-0000-0000-0000-000000000000") {
                    var result2 = gbRemovedItemArray.filter(function (obj) {
                        return obj.ItemId == data.ItemId;
                    });
                    if (result2.length > 0) {
                        return '<input id="check_row" class="check_row" type="checkbox"/>';
                    } else {
                        gbSelectiveItemArray.push(data);
                        return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
                    }
                } else {
                    return '<input id="check_row" class="check_row" type="checkbox"/>';
                }

            }

        }
        else {
            if (data.TamplateId != "00000000-0000-0000-0000-000000000000") {
                var result2 = gbRemovedItemArray.filter(function (obj) {
                    return obj.ItemId == data.ItemId;
                });
                if (result2.length > 0) {
                    return '<input id="check_row" class="check_row" type="checkbox"/>';
                } else {
                    gbSelectiveItemArray.push(data);
                    return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
                }
            } else {

                return '<input id="check_row" class="check_row" type="checkbox"/>';
            }

        }
    },
    UserItemPermissionGridChangeEvent: function () {
        $("#grdProductSummary").on("click", ".check_row", function (e) {
            var $cb = $(this);
            var gridSummary = $("#grdProductSummary").data("kendoGrid");

            var tr = $(e.currentTarget).closest("tr");
            gridSummary.select(tr);

            var selectedItem = gridSummary.dataItem(gridSummary.select());
            var dataItem = gridSummary.dataItem($(this).closest('tr'));
            if ($cb.is(":checked")) {
                if (selectedItem != null) {
                    for (var i = 0; i < gbRemovedItemArray.length; i++) {
                        if (gbRemovedItemArray[i].ItemId == dataItem.ItemId) {
                            gbRemovedItemArray.splice(i, 1);
                            break;
                        }
                    }
                    var a = selectedItem;
                    gbSelectiveItemArray.push(selectedItem);
                }
            } else {
                for (var j = 0; j < gbSelectiveItemArray.length; j++) {
                    if (gbSelectiveItemArray[j].ItemId == dataItem.ItemId) {
                        gbSelectiveItemArray.splice(j, 1);
                        break;
                    }
                }
                if (selectedItem.TamplateId != AjaxManager.DefaultGuidId()) {
                    gbRemovedItemArray.push(selectedItem);
                }
            }
        });//Indivisual row selection

        $('#grdProductSummary').on('change', '#checkAll', function (e) {
            gbSelectiveItemArray = [];
            gbRemovedItemArray = [];
            var gridSummary = $("#grdProductSummary").data("kendoGrid");

            var selectAll = document.getElementById("checkAll");
            if (selectAll.checked == true) {
                $("#grdProductSummary tbody input:checkbox").prop("checked", this.checked);
                $("#grdProductSummary table tr").addClass('k-state-selected');
                var gridData = gridSummary.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var obj = gridData[i];
                    gbSelectiveItemArray.push(obj);
                }
            }
            else {
                $("#grdProductSummary tbody input:checkbox").prop("checked", false);
                $("#grdProductSummary table tr").removeClass('k-state-selected');
                gbSelectiveItemArray = [];
                var gridDatarv = gridSummary.dataSource.data();
                for (var k = 0; k < gridDatarv.length; k++) {
                    if (gridDatarv[k].ItemId != AjaxManager.DefaultGuidId()) {
                        gbRemovedItemArray.push(gridDatarv[k]);
                    }
                }
            }
        });// All Row Selection 

    },
    LoadProductCombo(cboId) {
        UtilityHelper.LoadCombo(cboId, "ProductId", "ProductName", MerchantManager.GetProducts(), "--Select Product--");
    },
    ChangeEventOfProductCombo: function () {
        ItemFabricSummaryHelper.UncheckedItemsGrid();

        ItemFabricSummaryHelper.LoadProductGrid();
    },
    ChangeEventOfCategoryCombo: function () {
        var productCategoryId = $("#cmbProductCategory").data("kendoComboBox").value();
        var data = ItemFabricSummaryManager.GetProductByCategoryId(productCategoryId);
        var productCombo = $("#cmbProduct").data("kendoComboBox");
        productCombo.value("");
        productCombo.text("");
        productCombo.setDataSource(data);

        //ItemFabricSummaryHelper.UncheckedItemsGrid();
        ItemFabricSummaryHelper.LoadProductGrid();
    },
    ChangeEventOfEffectDateCombo: function () {
        ItemFabricSummaryHelper.UncheckedItemsGrid();
        //ItemFabricSummaryHelper.ItemFabricSummaryHelper.LoadProductGrid();
    },
    LoadProductGrid: function () {
        debugger;
        var productId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbProduct").data("kendoComboBox").value());
        var productCategoryId = UtilityHelper.EmptyThenDefaultGuidId($("#cmbProductCategory").data("kendoComboBox").value());
        if (productCategoryId != "00000000-0000-0000-0000-000000000000") {
            var data = ItemFabricSummaryManager.GetProductGridData(productCategoryId, productId);
            $("#grdProductSummary").data("kendoGrid").setDataSource(data);


        } else {
            $("#grdProductSummary").data("kendoGrid").setDataSource([]);
        }
    },
    ValidateForm: function () {
        var res = true;
        var productCategory = $("#cmbProductCategory").data("kendoComboBox");
        if (productCategory.value() === "" || productCategory.value() === undefined) {
            AjaxManager.NotifyMsg("cmbProductCategory", "error", "right", 1500, "Required");
            res = false;
        }
        var product = $("#cmbProduct").data("kendoComboBox");
        if (product.value() === "" || product.value() === undefined) {
            AjaxManager.NotifyMsg("cmbProduct", "error", "right", 1500, "Required");
            res = false;
        }

        return res;
    }
};