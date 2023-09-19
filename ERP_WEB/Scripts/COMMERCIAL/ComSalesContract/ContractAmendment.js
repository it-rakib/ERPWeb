var StaticScId;

var ContractAmendmentManager = {
    AmendgridDataSource: function (Scid) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            pageSize: 7,
            transport: {
                read: {
                    url: _baseUrl + '/api/ComSalesContractAmendment/GetAllAmendmentByScIdGrid/' + Scid,
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
                        styleId: { editable: false },
                        styleNo: { type: "string", validation: { required: true } }
                    }
                },
                data: "Items", total: "TotalCount"
            }
        });
        return gridDataSource;
    },
    SaveAmendmentDetails: function () {
        var msg = "";
        var objAmendment = ContractAmendmentHelper.CreateAmendmentObject();
        var jsonParam = JSON.stringify(objAmendment);
        var serviceUrl = _baseUrl + "/api/ComSalesContractAmendment/CreateUpdateComSalesContractAmendment";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#gridAmendment").data("kendoGrid").dataSource.read();
                            ContractAmendmentHelper.ClearForm();
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

    LastInsertAmendmentDataSource: function (ScId) {
        var lastInsertAmendment = ApiManager.GetList(_baseUrl + '/api/ComSalesContractAmendment/GetLastInsertedAmendmentByScId/' + ScId);
        return lastInsertAmendment;
    }
};

var ContractAmendmentHelper = {
    InitContractAmendment: function () {
        ContractAmendmentHelper.GenerateDatePicker();
        ContractAmendmentHelper.GenerateNumericTextBox();
        ContractAmendmentHelper.GenerateAmendmentGrid();
        $("#btnSaveAmendment").click(function () {
            var SCID = $("#hdSCId").val();
            if (SCID != "00000000-0000-0000-0000-000000000000") {
                ContractAmendmentManager.SaveAmendmentDetails();
                ContractAmendmentHelper.LoadAmendmentGrid(SCID);
            } else {
                AjaxManager.MsgBox('error', 'center', 'Please Select', "Please select a Contract First.",
                    [{
                        addClass: 'btn btn-primary',
                        text: 'OK',
                        onClick: function ($noty) {
                            $noty.close();
                            $("#btnSearchContact").focus();
                        }
                    }])
            }
        });
    },
    LoadAmendmentGrid(scid) {
        StaticScId = scid;
        var data = ContractAmendmentManager.AmendgridDataSource(scid);
        $("#gridAmendment").data("kendoGrid").setDataSource(data);
        var grid = $("#gridAmendment").data("kendoGrid").dataSource.data().length;
        if (grid > 0) {
            var lastinsertamend = ContractAmendmentManager.LastInsertAmendmentDataSource(scid);
            $("#txtSCOpeningValue").data("kendoNumericTextBox").readonly();
            $("#txtSCCurrentValue").data("kendoNumericTextBox").readonly();
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
                { field: "SCID", hidden: true },
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
    InputDatepickerEditor: function (container, options) {
        $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDatePicker({
                format: "dd-MMM-yyyy"
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
                ContractAmendmentHelper.CalculateTotalAmount();
            }
        });
        $("#txtCurSCAmt").kendoNumericTextBox({
            format: "#.####",
            //min: 0,
            decimals: 4,
            change: function () {
                ContractAmendmentHelper.CalculateTotalAmount();
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
    CreateAmendmentObject: function (amendmentObj) {
        var obj = new Object();
        obj.AmendId = $("#hdnAmendId").val();
        obj.Scid = $("#hdSCId").val();
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
        $("#hdnAmendId").val(AjaxManager.DefaultGuidId());
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