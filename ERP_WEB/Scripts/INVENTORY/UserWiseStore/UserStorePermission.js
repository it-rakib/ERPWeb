var gbSelectiveItemArray = [];
var gbRemovedItemArray = [];
var UserStorePermissionSummaryManager = {
    gridDataSource: function (userId) {
        gbSelectiveItemArray = [];
        gbRemovedItemArray = [];
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 10,
            transport: {
                read: {
                    url: _baseUrl + '/api/UserStorePermission/GetUserStoreGrid/'+ userId,
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
                    fields: {

                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        gridDataSource.filter({});
        return gridDataSource;
    }
};

var UserStorePermissionSummaryHelper = {
    InitUserStorePermissionSummary: function () {
        UserStorePermissionSummaryHelper.GenerateUserStorePermissionGrid();
        UserStorePermissionSummaryHelper.UserStorePermissionGridChangeEvent();
    },
    GenerateUserStorePermissionGrid: function () {
        $("#gridStorePermission").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: UserStorePermissionSummaryHelper.GenerateStorePermissionColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
            pageSize: 20
        });
    },
    GenerateStorePermissionColumns: function () {
        return columns = [
            { field: "check_row", title: "", width: 30, filterable: false, sortable: false, template: '#= UserStorePermissionSummaryHelper.CheckedMenu(data) #', headerTemplate: "<input type='checkbox' id='checkAll'/>" },
            { field: "UserId", hidden: true },
            { field: "StoreId", hidden: true },
            { field: "StoreName", title: "Store Name", width: 130 },
            { field: "StoreShortName", title: "Store Short Name", width: 130 },
            //{ field: "UserName", title: "User Name", width: 130 },
        ];
    },
    CheckedMenu: function (data) {
        debugger;
        if (gbSelectiveItemArray.length > 0) {
            var result = gbSelectiveItemArray.filter(function (obj) {
                return obj.StoreId == data.StoreId;
            });
            if (result.length > 0) {
                return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
            }
            else {
                if (data.UserStoreId != "0") {
                    var result2 = gbRemovedItemArray.filter(function (obj) {
                        return obj.StoreId == data.StoreId;
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
            if (data.UserStoreId != "0") {
                var result2 = gbRemovedItemArray.filter(function (obj) {
                    return obj.StoreId == data.StoreId;
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
    UserStorePermissionGridChangeEvent: function () {
        debugger;
        $("#gridStorePermission").on("click", ".check_row", function (e) {
            var $cb = $(this);
            var gridSummary = $("#gridStorePermission").data("kendoGrid");

            var tr = $(e.currentTarget).closest("tr");
            gridSummary.select(tr);

            var selectedItem = gridSummary.dataItem(gridSummary.select());
            var dataItem = gridSummary.dataItem($(this).closest('tr'));
            if ($cb.is(":checked")) {
                if (selectedItem != null) {
                    for (var i = 0; i < gbRemovedItemArray.length; i++) {
                        if (gbRemovedItemArray[i].StoreId == dataItem.StoreId) {
                            gbRemovedItemArray.splice(i, 1);
                            break;
                        }
                    }
                    gbSelectiveItemArray.push(selectedItem);
                }
            } else {
                for (var j = 0; j < gbSelectiveItemArray.length; j++) {
                    if (gbSelectiveItemArray[j].StoreId == dataItem.StoreId) {
                        gbSelectiveItemArray.splice(j, 1);
                        break;
                    }
                }
                if (selectedItem.UserStoreId != 0) {
                    gbRemovedItemArray.push(selectedItem);
                }
            }
        });//Indivisual row selection

        $('#gridStorePermission').on('change', '#checkAll', function (e) {
            debugger;
            gbSelectiveItemArray = [];
            gbRemovedItemArray = [];
            var gridSummary = $("#gridStorePermission").data("kendoGrid");

            var selectAll = document.getElementById("checkAll");
            if (selectAll.checked == true) {
                $("#gridStorePermission tbody input:checkbox").prop("checked", this.checked);
                $("#gridStorePermission table tr").addClass('k-state-selected');
                var gridData = gridSummary.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var obj = gridData[i];
                    gbSelectiveItemArray.push(obj);
                }
            }
            else {
                $("#gridStorePermission tbody input:checkbox").prop("checked", false);
                $("#gridStorePermission table tr").removeClass('k-state-selected');
                gbSelectiveItemArray = [];
                var gridDatarv = gridSummary.dataSource.data();
                for (var k = 0; k < gridDatarv.length; k++) {
                    if (gridDatarv[k].StoreId != 0) {
                        gbRemovedItemArray.push(gridDatarv[k]);
                    }
                }


            }
        });// All Row Selection 

    },
    clickEventForAccessPermissionButton: function (e) {
        e.preventDefault();
        var grid = $("#gridStorePermission").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            $("#divUserAccessPopup").data("kendoWindow").open().center();
            UserAccessPermissionHelper.FillAccessPermissionForm(selectedItem);
        }
    },

};