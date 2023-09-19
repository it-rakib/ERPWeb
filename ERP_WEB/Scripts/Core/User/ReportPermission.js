var gbSelectiveReportArray = [];
var gbRemovedReportArray = [];
var reportPermissionSummaryManager = {
    gridDataSource: function (usrId,projectId, menuId) {
        gbSelectiveReportArray = [];
        gbRemovedReportArray = [];
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 20,
            transport: {
                read: {
                    url: '../Menu/GetReportPermissionSummary/?usrId=' + usrId + "&projectId=" + projectId + "&menuId=" + menuId,

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

var reportPermissionSummaryHelper = {
    InitReportPermissionSummary: function () {
        reportPermissionSummaryHelper.GenerateReportPermissionGrid();
        reportPermissionSummaryHelper.ReportPermissionGridChangeEvent();
    },
    GenerateReportPermissionGrid: function () {
        $("#gridReportPermission").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            sortable: true,
            columns: reportPermissionSummaryHelper.GenerateMenuPermissionColumns(),
            editable: false,
            navigatable: true,
            selectable: "row",
        });
    },
    GenerateMenuPermissionColumns: function () {
        return columns = [
            { field: "check_row", title: "", width: 30, filterable: false, sortable: false, template: '#= reportPermissionSummaryHelper.CheckedMenu(data) #', headerTemplate: "<input type='checkbox' id='checkAll2'/>" },
            { field: "ReportName", title: "Report Name", width: 130 },
            { field: "MenuName", title: "Menu Name", width: 130 },
            { field: "ReportId", hidden: true }
            //{ field: "Edit", title: "Access", filterable: false, width: 30, template: '<button type="button" class="btn btn-default btn-sm" value="Edit" id="btnEdit" onClick="reportPermissionSummaryHelper.clickEventForAccessPermissionButton()" ><span class="glyphicon glyphicon-cog"></span></button>', sortable: false }

        ];
    },
    CheckedMenu: function (data) {
        if (gbSelectiveReportArray.length > 0) {
            var result = gbSelectiveReportArray.filter(function (obj) {
                return obj.ReportId == data.ReportId;
            });
            if (result.length > 0) {
                return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
            }
            else {
                if (data.ReportPermissionId > 0) {
                    var result2 = gbRemovedReportArray.filter(function (obj) {
                        return obj.ReportId == data.ReportId;
                    });
                    if (result2.length > 0) {
                        return '<input id="check_row" class="check_row" type="checkbox"/>';
                    } else {
                        gbSelectiveReportArray.push(data);
                        return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
                    }


                } else {
                    return '<input id="check_row" class="check_row" type="checkbox"/>';
                }
            }
        }
        else {
           
            if (data.ReportPermissionId > 0) {
           
                var result2 = gbRemovedReportArray.filter(function (obj) {
                    return obj.ReportId == data.ReportId;
                });
                if (result2.length > 0) {
                    return '<input id="check_row" class="check_row" type="checkbox"/>';
                } else {
                    gbSelectiveReportArray.push(data);
                    return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
                }
            } else {
                return '<input id="check_row" class="check_row" type="checkbox"/>';
            }
        }
    },
    ReportPermissionGridChangeEvent: function () {
        $("#gridReportPermission").on("click", ".check_row", function () {
            var $cb = $(this);
            var gridSummary = $("#gridReportPermission").data("kendoGrid");
            var selectedItem = gridSummary.dataItem(gridSummary.select());
            var dataItem = gridSummary.dataItem($(this).closest('tr'));
            if ($cb.is(":checked")) {
                if (selectedItem != null) {
                    for (var i = 0; i < gbRemovedReportArray.length; i++) {
                        if (gbRemovedReportArray[i].ReportId == dataItem.ReportId) {
                            gbRemovedReportArray.splice(i, 1);
                            break;
                        }
                    }
                    gbSelectiveReportArray.push(selectedItem);
                }
            } else {
                for (var j = 0; j < gbSelectiveReportArray.length; j++) {
                    if (gbSelectiveReportArray[j].ReportId == dataItem.ReportId) {
                        gbSelectiveReportArray.splice(j, 1);
                        break;
                    }
                }
                if (selectedItem.ReportPermissionId > 0) {
                    gbRemovedReportArray.push(selectedItem);
                }
            }
        });//Indivisual row selection

        $('#gridReportPermission').on('change', '#checkAll2', function (e) {
            gbSelectiveReportArray = [];
            gbRemovedReportArray = [];
            var gridSummary = $("#gridReportPermission").data("kendoGrid");

            var selectAll = document.getElementById("checkAll2");
            if (selectAll.checked == true) {
                $("#gridReportPermission tbody input:checkbox").prop("checked", this.checked);
                $("#gridReportPermission table tr").addClass('k-state-selected');
                var gridData = gridSummary.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var obj = gridData[i];
                    gbSelectiveReportArray.push(obj);
                }
            }
            else {
                $("#gridReportPermission tbody input:checkbox").removeAttr("checked", this.checked);
                $("#gridReportPermission table tr").removeClass('k-state-selected');
                gbSelectiveReportArray = [];
                var gridDatarv = gridSummary.dataSource.data();
                for (var k = 0; k < gridDatarv.length; k++) {
                    if (gridDatarv[k].ReportId > 0) {
                        gbRemovedReportArray.push(gridDatarv[k]);
                    }
                }
            }
        });// All Row Selection 

    }
    

};

