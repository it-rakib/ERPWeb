var gbSelectiveItemArray = [];
var gbRemovedItemArray = [];
var PurSupplierItemPermissionSummaryManager = {
    gridDataSource: function (supplierId, itemGroupId, itemCategoryId) {
        gbSelectiveItemArray = [];
        gbRemovedItemArray = [];
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 20,
            transport: {
                read: {
                    url: _baseUrl + '/api/Suppliers/GetSupplierItemGrid/' + itemGroupId + "/" + itemCategoryId + "/" + supplierId,
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
    }
};
var PurSupplierItemPermissionSummaryHelper = {
    InitPurSupplierItemPermissionSummary: function () {
        PurSupplierItemPermissionSummaryHelper.GenerateSupplierItemPermissionGrid();
        PurSupplierItemPermissionSummaryHelper.SupplierItemPermissionGridChangeEvent();
    },
    GenerateSupplierItemPermissionGrid: function () {
        $("#gridSupplierPermission").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: PurSupplierItemPermissionSummaryHelper.GenerateItemPermissionColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
        });
    },
    GenerateItemPermissionColumns: function () {
        return columns = [
            { field: "check_row", title: "", width: 30, filterable: false, sortable: false, template: '#= PurSupplierItemPermissionSummaryHelper.CheckedMenu(data) #', headerTemplate: "<input type='checkbox' id='checkAll'/>" },
            { field: "ItemName", title: "Item Name", width: 130 },
            { field: "GroupName", title: "Group Name", width: 130 }
        ];
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
                if (data.SupplierItemId != "00000000-0000-0000-0000-000000000000") {
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
            if (data.SupplierItemId != "00000000-0000-0000-0000-000000000000") {
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
    SupplierItemPermissionGridChangeEvent: function () {
        $("#gridSupplierPermission").on("click", ".check_row", function (e) {
            debugger;
            var $cb = $(this);
            var gridSummary = $("#gridSupplierPermission").data("kendoGrid");

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
                    gbSelectiveItemArray.push(selectedItem);
                }
            } else {
                for (var j = 0; j < gbSelectiveItemArray.length; j++) {
                    if (gbSelectiveItemArray[j].ItemId == dataItem.ItemId) {
                        gbSelectiveItemArray.splice(j, 1);
                        break;
                    }
                }
                if (selectedItem.SupplierItemId != AjaxManager.DefaultGuidId()) {
                    gbRemovedItemArray.push(selectedItem);
                }
            }
        });//Indivisual row selection

        $('#gridSupplierPermission').on('change', '#checkAll', function (e) {
            gbSelectiveItemArray = [];
            gbRemovedItemArray = [];
            var gridSummary = $("#gridSupplierPermission").data("kendoGrid");

            var selectAll = document.getElementById("checkAll");
            if (selectAll.checked == true) {
                $("#gridSupplierPermission tbody input:checkbox").prop("checked", this.checked);
                $("#gridSupplierPermission table tr").addClass('k-state-selected');
                var gridData = gridSummary.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var obj = gridData[i];
                    gbSelectiveItemArray.push(obj);
                }
            }
            else {
                $("#gridSupplierPermission tbody input:checkbox").prop("checked", false);
                $("#gridSupplierPermission table tr").removeClass('k-state-selected');
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
}