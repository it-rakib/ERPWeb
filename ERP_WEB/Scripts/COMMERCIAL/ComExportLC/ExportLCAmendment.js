var StaticLcId;

var ExportLCAmendmentManager = {
    AmendgridDataSource: function (Lcid) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 7,
            transport: {
                read: {
                    url: _baseUrl + '/api/ComExportLCAmendment/GetAllAmendmentByLcIdGrid/' + Lcid,
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
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
                    id: "AmendId",
                    fields: {
                        amendId: { editable: false },
                        amendNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    SaveAmendmentDetails: function () {
        var msg = "";
        var objAmendment = ExportLCAmendmentHelper.CreateAmendmentObject();
        var jsonParam = JSON.stringify(objAmendment);
        var serviceUrl = _baseUrl + "/api/ComExportLCAmendment/CreateUpdateComExportLCAmendment";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#gridAmendment").data("kendoGrid").dataSource.read();
                            ExportLCAmendmentHelper.ClearForm();
                        }
                    }]);
            }
            else {
                msg = jsonData.Message;
                AjaxManager.MsgBox('error', 'center', 'Error1', msg,
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

    LastInsertAmendmentDataSource: function (LcId) {
        var lastInsertAmendment = ApiManager.GetList(_baseUrl + '/api/ComExportLCAmendment/GetLastInsertedAmendmentBylcid/' + LcId);
        return lastInsertAmendment;
    }
};

var ExportLCAmendmentHelper = {
    InitExportLCAmendment: function () {
        ExportLCAmendmentHelper.GenerateDatePicker();
        ExportLCAmendmentHelper.GenerateNumericTextBox();
        ExportLCAmendmentHelper.GenerateAmendmentGrid();
        $("#btnSaveAmendment").click(function () {
            var LCID = $("#hdLCId").val();
            if (LCID != "00000000-0000-0000-0000-000000000000") {
                ExportLCAmendmentManager.SaveAmendmentDetails();
                ExportLCAmendmentHelper.LoadAmendmentGrid(LCID);
            } else {
                AjaxManager.MsgBox('error', 'center', 'Please Select', "Please select a Export LC First.",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'OK',
                        onClick: function ($noty) {
                            $noty.close();
                            $("#btnSearchLC").focus();
                        }
                    }])
            }
        });
    },
    LoadAmendmentGrid(lcid) {
        StaticLcId = lcid;
        var data = ExportLCAmendmentManager.AmendgridDataSource(lcid);
        $("#gridAmendment").data("kendoGrid").setDataSource(data);
        var grid = $("#gridAmendment").data("kendoGrid").dataSource.data().length;
        if (grid > 0) {
            var lastinsertamend = ExportLCAmendmentManager.LastInsertAmendmentDataSource(lcid);
            $("#txtLCOpeningValue").data("kendoNumericTextBox").readonly();
            $("#txtLCCurrentValue").data("kendoNumericTextBox").readonly();
            if (lastinsertamend.TotalAmt > 0) {
                $("#txtPreSCAmt").data("kendoNumericTextBox").value(lastinsertamend.TotalAmt);
            }
            if (lastinsertamend.PreShipDate != null) {
                $("#dtPreShipDate").data("kendoDatePicker").value(lastinsertamend.CurShipDate);
            }
            if (lastinsertamend.PreExpDate != null) {
                $("#dtPreExpDate").data("kendoDatePicker").value(lastinsertamend.CurExpDate);
            }
        }
    },
    GenerateAmendmentGrid: function () {
        $("#gridAmendment").kendoGrid({
            dataSource: [],
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: true,
            columns: [
                { field: "LCID", hidden: true },
                { field: "AmendID", hidden: true },
                { field: "AmendDate", title: "Amendment <br/>Date", width: 20, template: '#= kendo.toString(kendo.parseDate(AmendDate==null?"":AmendDate), "dd-MMM-yyyy") #' },
                { field: "PreScamt", title: "Previous <br/>Amount", sortable: true, width: 20 },
                { field: "CurScamt", title: "Changed <br/>By", sortable: true, width: 20 },
                { field: "TotalAmt", title: "Current <br/>Amount", sortable: true, width: 20 },
                { field: "PreShipDate", title: "Previous <br/>Ship Date", sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(PreShipDate==null?"":PreShipDate), "dd-MMM-yyyy") #' },
                { field: "CurShipDate", title: "Changed <br/>To", sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(CurShipDate==null?"":CurShipDate), "dd-MMM-yyyy") #' },
                { field: "PreExpDate", title: "Previous <br/>Expire Date", sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(PreExpDate==null?"":PreExpDate), "dd-MMM-yyyy") #' },
                { field: "CurExpDate", title: "Changed <br/>To", sortable: true, width: 20, template: '#= kendo.toString(kendo.parseDate(CurExpDate==null?"":CurExpDate), "dd-MMM-yyyy") #' },
                { field: "Remarks", title: "Remarks", sortable: true, width: 20 }
            ],
            noRecords: true,
            messages: {
                noRecords: "No Amendment Added Yet!"
            },
            selectable: "row",
            navigatable: true
        });
    },
    GenerateDatePicker: function () {
        $("#dtAmendDate,#dtPreShipDate,#dtCurShipDate,#dtPreExpDate,#dtCurExpDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
    GenerateNumericTextBox: function () {
        $("#txtPreSCAmt").kendoNumericTextBox({
            format: "#.####",
            min: 0,
            decimals: 4,
            change: function () {
                ExportLCAmendmentHelper.CalculateTotalAmount();
            }
        });
        $("#txtCurSCAmt").kendoNumericTextBox({
            format: "#.####",
            //min: 0,
            decimals: 4,
            change: function () {
                ExportLCAmendmentHelper.CalculateTotalAmount();
            }
        });
        $("#txtTotalAmt").kendoNumericTextBox({
            format: "#.####",
            //min: 0,
            decimals: 4
        });
    },
    CalculateTotalAmount: function () {
        var pre = IkrHelper.EmptyThenZero($("#txtPreSCAmt").data("kendoNumericTextBox").value());
        var cur = IkrHelper.EmptyThenZero($("#txtCurSCAmt").data("kendoNumericTextBox").value());
        var totalAmount = 0;
        if (Math.sign(cur) > 0) {
            totalAmount = (pre + cur);
        }
        else {
            totalAmount = (pre + cur);
        }
        $("#txtTotalAmt").data("kendoNumericTextBox").value(totalAmount);
    },
    InitModalEvents: function (nRowIndex) {
        $("#dtAmendDate" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //$("#dtAmendDate" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtAmendDate" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtAmendDate" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#txtPreSCAmt" + nRowIndex).focus();
            } else if (keyCode == 37) {

            }
        });
        $("#txtPreSCAmt" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //$("#txtPreSCAmt" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtPreSCAmt" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtPreSCAmt" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#txtCurSCAmt" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#dtAmendDate" + nRowIndex).focus();
            }
        });
        $("#txtCurSCAmt" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    // ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    // $("#txtCurSCAmt" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtCurSCAmt" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtCurSCAmt" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#txtTotalAmt" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#txtPreSCAmt" + nRowIndex).focus();
            }
        });
        $("#txtTotalAmt" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //  ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#txtTotalAmt" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtTotalAmt" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtTotalAmt" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#dtPreShipDate" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#txtCurSCAmt" + nRowIndex).focus();
            }
        });
        $("#dtPreShipDate" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //  ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#dtPreShipDate" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtPreShipDate" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtPreShipDate" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#dtCurShipDate" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#txtTotalAmt" + nRowIndex).focus();
            }
        });
        $("#dtCurShipDate" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //  ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#dtCurShipDate" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtCurShipDate" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtCurShipDate" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#dtPreExpDate" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#dtPreShipDate" + nRowIndex).focus();
            }
        });
        $("#dtPreExpDate" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //   ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //   $("#dtPreExpDate" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtPreExpDate" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtPreExpDate" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#dtCurExpDate" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#dtCurShipDate" + nRowIndex).focus();
            }
        });
        $("#dtCurExpDate" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    //  ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    //  $("#dtCurExpDate" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtCurExpDate" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#dtCurExpDate" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#txtAmendRemarks" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#dtPreExpDate" + nRowIndex).focus();
            }
        });
        $("#txtAmendRemarks" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                var nMaxRow = $("#tblExportLCAmendment tbody tr").length;
                if (nRowIndex == nMaxRow) {
                    // ExportLCAmendmentHelper.SetAmendmentGrid(0, "", "", "", "", "", "", "", "", "");
                    // $("#txtAmendRemarks" + (nRowIndex + 1)).focus();
                }
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtAmendRemarks" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#txtAmendRemarks" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {
                $("#btnRemoveRow" + nRowIndex).focus();
            } else if (keyCode == 37) {
                $("#dtCurExpDate" + nRowIndex).focus();
            }
        });
        $("#btnSaveAmendment" + nRowIndex).keyup(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                ExportLCAmendmentHelper.SaveAmendMentAction(nRowIndex);
            } else if (keyCode == 40) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#btnSaveAmendment" + (nIndex + 1)).focus();
            } else if (keyCode == 38) {
                var nIndex = parseInt($(this).closest(".trParent").attr("RowIndex"));
                $("#btnSaveAmendment" + (nIndex - 1)).focus();
            } else if (keyCode == 39) {

            } else if (keyCode == 37) {
                $("#txtAmendRemarks" + nRowIndex).focus();
            }
        });
        $("#btnSaveAmendment" + nRowIndex).click(function () {
            if (nRowIndex > 0) {
                ExportLCAmendmentManager.SaveAmendmentDetails();
                ExportLCAmendmentManager.LoadAmendmentGrid(StaticLcId);
            }
            else {
                function onFailed(error) {
                    AjaxManager.MsgBox('error', 'center', 'Alert', 'No Row Added Yet. Press ENTER to add new row.',
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
                }
            }
        });
    },
    CreateAmendmentObject: function (amendmentObj) {
        var obj = new Object();
        obj.AmendId = $("#hdnAmendId").val();
        obj.Lcid = $("#hdLCId").val();
        obj.AmendDate = $("#dtAmendDate").data("kendoDatePicker").value();
        obj.PreScamt = $("#txtPreSCAmt").data("kendoNumericTextBox").value();
        obj.CurScamt = $("#txtCurSCAmt").data("kendoNumericTextBox").value();
        obj.TotalAmt = $("#txtTotalAmt").data("kendoNumericTextBox").value();
        obj.PreShipDate = $("#dtPreShipDate").data("kendoDatePicker").value();
        obj.CurShipDate = $("#dtCurShipDate").data("kendoDatePicker").value();
        obj.PreExpDate = $("#dtPreExpDate").data("kendoDatePicker").value();
        obj.CurExpDate = $("#dtCurExpDate").data("kendoDatePicker").value();
        obj.Remarks = $("#txtAmendRemarks").val();
        obj.CreatedBy = CurrentUser.USERID;
        return obj;
    },
    ClearForm: function (obj) {
        $("#hdnAmendId").val("00000000-0000-0000-0000-000000000000");
        $("#dtAmendDate").data("kendoDatePicker").value("");
        $("#txtCurSCAmt").data("kendoNumericTextBox").value("");
        $("#txtTotalAmt").data("kendoNumericTextBox").value("");
        $("#dtCurShipDate").data("kendoDatePicker").value("");
        $("#dtCurExpDate").data("kendoDatePicker").value("");
        $("#txtAmendRemarks").val("");
        $("#dtAmendDate,#dtCurShipDate,#dtCurExpDate").kendoDatePicker({
            value: new Date(),
            format: "dd-MMM-yyyy"
        });
    },
};