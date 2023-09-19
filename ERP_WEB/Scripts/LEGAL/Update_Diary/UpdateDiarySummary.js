//var isAdmin = false;
//var UpdateDiarySummaryManager = {
//    gridDataSource: function () {
//        var gridDataSource = new kendo.data.DataSource({
//            type: "json",
//            serverPaging: true,
//            serverSorting: true,
//            serverFiltering: true,
//            allowUnsort: true,
//            pageSize: 10,
//            transport: {
//                read: {
//                    url: _baseUrlLegal + '/api/UpdateDiary/GetAllGridData',
//                    type: "POST",
//                    dataType: "json",
//                    contentType: "application/json;",
//                    cache: false,
//                    async: false
//                },
//                parameterMap: function (options) {
//                    return JSON.stringify(options);
//                }
//            },
//            batch: true,
//            schema: {
//                model: {

//                },
//                data: "Items", total: "TotalCount"
//            }
//        });
//        debugger;
//        return gridDataSource;
//    },
//}
//var UpdateDiarySummaryHelper = {
//    InitUpdateDiarySummary: function () {
//        debugger;
//        isAdmin = ApiManager.GetList(_baseUrl + "/api/MerchEmpOrganograms/CheckIsReportingBoss/" + CurrentUser.EMPNO);

//        UpdateDiarySummaryHelper.GenerateUpdateDiaryGrid();
//    },

//    GenerateUpdateDiaryGrid: function () {
//        $("#grdUpdateDiarySummary").kendoGrid({
//            dataSource: UpdateDiarySummaryManager.gridDataSource(),
//            pageable: {
//                refresh: true,
//                serverPaging: true,
//                serverFiltering: true,
//                serverSorting: true
//            },
//            filterable: true,
//            sortable: true,
//            toolbar: ["search"],
//            search: {
//                fields: ["RegNo"]
//            },
//            columns: [
//                { field: "DiaryId", hidden: true },
//                { field: "FileMasterId", hidden: true },
//                { field: "RegNo", title: "Reg No", hidden: true },
//                { field: "PreviousDate", title: "Previous Date", template: '#= kendo.toString(kendo.parseDate(PreviousDate), "dd-MM-yyyy") #' },
//                { field: "PreviousDateFor", title: "Previous Date For" },
//                { field: "NextDate", title: "Next Date", template: '#= kendo.toString(kendo.parseDate(NextDate), "dd-MM-yyyy") #' },
//                { field: "NextDateFor", title: "Next Date For" },
//                {
//                    command: [{
//                        name: "edit", text: "Edit", iconClass: "k-icon k-i-edit", className: "k-success", click: UpdateDiarySummaryHelper.ClickEventForEditButton
//                    }], hidden: !isAdmin, title: "&nbsp;"
//                }
//            ],
//            editable: false,
//            selectable: "row",
//            navigatable: true

//        });
//    },

//    ClickEventForEditButton: function (e) {
//        e.preventDefault();
//        var grid = $("#grdUpdateDiarySummary").data("kendoGrid");
//        var tr = $(e.currentTarget).closest("tr");
//        var selectedItem = this.dataItem(tr);
//        grid.select(tr);
//        if (selectedItem != null) {
//            $("#btnSave").text("Update");
//            $("#divUpdateDiarySummary").hide();
//            $("#divUpdateDiaryDetails").show();
//            debugger;
//            UpdateDiaryDetailsHelper.FillUpdateDiaryForm(selectedItem);
//        }
//    }


//}