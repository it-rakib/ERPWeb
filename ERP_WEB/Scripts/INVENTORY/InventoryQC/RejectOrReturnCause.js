let gbCauseList = [];
var RejectOrReturnCauseManager = {
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
                    url: _baseUrl + '',
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
                        PIDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }

                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    }
};

var RejectOrReturnCauseHelper = {
    InitRejectOrReturnCause: function () {
        $("#popupROrRCause").kendoWindow({
            title: "Reject Or Return Cause",
            resizeable: false,
            width: "60%",
            actions: ["Pin", "Refresh", "Maximize", "Close"],
            modal: true,
            visible: false
        });
        RejectOrReturnCauseHelper.GenerateRejectOrReturnCauseGrid();
        
        $("#btnSaveCause").click(function () {
            RejectOrReturnCauseHelper.SaveCause();
        });

    },
    GenerateRejectOrReturnCauseGrid: function () {
        $("#gridRejectOrReturnCause").kendoGrid({
            dataSource: [],
            pageable: false,
            filterable: false,
            toolbar: [{ name: "create", text: "Add Row" }],
            columns: [
                { field: "CauseId", hidden: true },
                { field: "ItemId", hidden: true },
                { field: "ColorId", hidden: true },
                { field: "SizeId", hidden: true },
                { field: "UOMId", hidden: true },
                { field: "Cause", title: "Cause", sortable: true },
                {
                    field: "Action", title: "Action", filterable: false, width: "250px", command: [{
                        name: "remove", text: "Remove", iconClass: "k-icon k-i-delete", className: "k-danger", click: RejectOrReturnCauseHelper.ClickEventForDeleteCause
                    }]
                },
            ],
            editable: {
                createAt: "bottom",
                mode: "incell",
                confirmation: false
            },
            noRecords: true,
            messages: {
                noRecords: "NO DATA FOUND"
            },
            selectable: "row",
            
        });
    },
    ClickEventForDeleteCause: function (e) {
        e.preventDefault();
        var grid = $("#gridRejectOrReturnCause").data("kendoGrid");
        var tr = $(e.currentTarget).closest("tr");
        var selectedItem = this.dataItem(tr);
        grid.select(tr);
        if (selectedItem != null) {
            grid.dataSource.remove(selectedItem);
            for (var i = 0; i < gbCauseList.length; i++) {
                if (gbCauseList[i].CauseId === selectedItem.CauseId) {
                    gbCauseList.splice(i, 1);
                    $("#gridRejectOrReturnCause").data("kendoGrid").setDataSource(gbCauseList);
                    break;
                }
            }
        }
    },
    SaveCause: function () {
        var entityGrid = $("#grdReceivedItemSummary").data("kendoGrid");
        var selectedItem = entityGrid.dataItem(entityGrid.select());

        var causeGrid = $("#gridRejectOrReturnCause").data("kendoGrid");
        var gridData = causeGrid.dataSource.data();
        for (var i = 0; i < gridData.length; i++) {
            var detailsData = gridData[i];
            var obj = new Object();
            obj.CauseId = UtilityHelper.EmptyThenDefaultGuidId(detailsData.CauseId);
            obj.ItemId = UtilityHelper.EmptyThenDefaultGuidId(selectedItem.ItemId);
            obj.ColorId = UtilityHelper.EmptyThenDefaultGuidId(selectedItem.ColorId);
            obj.SizeId = UtilityHelper.EmptyThenDefaultGuidId(selectedItem.SizeId);
            obj.UOMId = UtilityHelper.EmptyThenDefaultGuidId(selectedItem.UOMId);
            obj.Cause = detailsData.Cause;
            if (obj.CauseId === AjaxManager.DefaultGuidId()) {
                gbCauseList.push(obj);
            }
        }
        $("#popupROrRCause").data("kendoWindow").close();
    },
    FillCauseGrid: function (obj) {
        if (obj !== null && obj !== undefined) {
            var grid = $("#gridRejectOrReturnCause").data("kendoGrid");
            grid.dataSource.data([]);
            let itemList = gbCauseList.filter(function (e) {
                return e.ItemId === obj.ItemId && e.ColorId === obj.ColorId && e.SizeId === obj.SizeId && e.UOMId === obj.UOMId;
            });
            var gridDataSource = new kendo.data.DataSource({
                data: itemList,
                schema: {
                    model: {
                        fields: {
                            Cause: { editable: true }
                        }
                    }
                }
            });
            grid.setDataSource(gridDataSource);
        }        
    },
    ClearCauseGrid: function () {
        gbCauseList = [];
        $("#gridRejectOrReturnCause").data("kendoGrid").dataSource.data([]);
    }
};