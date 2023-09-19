var validationSuccess = $("#validation-success");
var ExpenseDetailsManager = {
    SaveExpenseDetails: function () {
        var msg = "";
        
        var objExpense = ExpenseDetailsHelper.CreateExpenseObject();
        var jsonParam = JSON.stringify(objExpense);
        var serviceUrl = _baseUrlLegal + "/api/Expense/CreateUpdateExpenseInfo";
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                msg = jsonData.Message;
                AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                            $("#grdExpenseSummary").data("kendoGrid").dataSource.read();
                            //$("#divExpenseSummary").show();
                            //$("#divExpenseDetails").hide();
                            ExpenseDetailsHelper.ClearForm();
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
    GetAllFiles: function (searchKey) {
        var objFile = "";
        var jsonParam = "";
        
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/" + $.trim(searchKey);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objFile;
    },
    GetExpenseByCaseFileId: function (caseFileId) {
        var objCaseFile = "";
        var jsonParam = "";
        var serviceUrl = _baseUrlLegal + "/api/CaseFileMaster/fileMasterByFileMasterId/" + $.trim(caseFileId);
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objCaseFile = jsonData;
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
        return objCaseFile;
    }
};

var ExpenseDetailsHelper = {
    InitExpenseDetails: function () {
        ExpenseDetailsHelper.GenerateDatePicker();
        ExpenseDetailsHelper.GenerateMulticolumnComboBox("cboCaseFile");
        $("#btnSave").click(function () {
            
            ExpenseDetailsManager.SaveExpenseDetails();
        });


        //$("#btnAddNew").click(function () {
        //    ExpenseDetailsHelper.ClearForm();
        //    $("#divExpenseSummary").hide();           
        //    $("#divExpenseDetails").show();            
        //});
        $("#btnSearchStyle").click(function () {
            //var searchKey = ("#txtSearchKey").val();
            ExpenseDetailsHelper.GenerateMulticolumnCombo();
            //ExpenseDetailsHelper.GetDataBySearchKey(searchKey);
        });
        $("#cboCaseFile").change(function () {
            
            var caseFileId = $("#cboCaseFile").data("kendoMultiColumnComboBox").value();
            ExpenseDetailsHelper.FillDiaryByFileChange(caseFileId);
        });

        $("#btnClearAll").click(function () {
            
            //$("#divExpenseSummary").show();
            //$("#divExpenseDetails").hide();
            ExpenseDetailsHelper.ClearForm();
        });
    },
    FillExpenseForm: function (obj) {
        
        $("#hdnExpenseId").val(obj.ExpenseId);
        $("#hdnFileMasterId").val(obj.FileMasterId);
        $("#txtExpenseDate").data("kendoDatePicker").value(obj.ExpenseDate);
        $("#txtExpenseNm").val(obj.ExpenseName);
        $("#txtExpenseAmnt").val(obj.Amount);
        $("#txtDiscription").val(obj.Discription);
        
        var bCostObj = ExpenseDetailsManager.GetExpenseByCaseFileId(obj.FileMasterId);
        if (bCostObj != null) {
            var obj = bCostObj[0];
            //$("#hdnFileMasterId").val(obj.FileMasterId);
            $("#txtRegNo").val(obj.RegNo);
            $("#txtCourt").val(obj.CourtName);
            $("#txtCaseNo").val(obj.CaseNo);
        }

    },

    CreateExpenseObject: function (ExpenseObj) {
        
        var obj = new Object();
        obj.ExpenseId = $("#hdnExpenseId").val();
        obj.FileMasterId = $("#hdnFileMasterId").val();
        obj.ExpenseDate = kendo.toString( $("#txtExpenseDate").data("kendoDatePicker").value());
        obj.ExpenseName = $("#txtExpenseNm").val();
        obj.Amount = $("#txtExpenseAmnt").val();
        obj.Discription = $("#txtDiscription").val();
        obj.CreatedBy = CurrentUser.USERID;

        return obj;
    },
    ClearForm: function (obj) {
        
        $("#btnSave").text("Save");
        $("#hdnExpenseId").val("0");
        $("#hdnFileMasterId").val("0");
        $("#txtRegNo").val("");
        $("#txtCourt").val("");
        $("#txtCaseNo").val("");
        $("#txtExpenseDate").data("kendoDatePicker").value("");
        $("#txtExpenseNm").val("");
        $("#txtExpenseAmnt").val("");
        $("#txtDiscription").val("");
        $("#txtSearchKey").val("");
        $("#cboCaseFile").data("kendoMultiColumnComboBox").value("");
    },
    GenerateDatePicker: function () {
        $("#txtExpenseDate").kendoDatePicker({
            format: "dd-MM-yyyy",
            value: new Date()
        });
    },
    GenerateMulticolumnComboBox: function (ctrlId) {
        $("#" + ctrlId).kendoMultiColumnComboBox({
            dataSource: [],
            dataTextField: "RegNo",
            dataValueField: "FileMasterId",
            columns: [
                { field: "RegNo", title: "Reg No", width: 120 },
                { field: "CaseNo", title: "Case No", width: 120 },
                { field: "CourtName", title: "Court", width: 120 }
            ],
            filter: "startswith",
            filterFields: ["StyleNo"],
            footerTemplate: 'Total #: instance.dataSource.total() # items found',
            index: 0,
            placeholder: "---Select File---",
            height: 400

        });
    },
    GenerateMulticolumnCombo: function () {
        var searchKey = $("#txtSearchKey").val();
        if (searchKey !== "") {
            var data = ExpenseDetailsManager.GetAllFiles(searchKey);
            data.unshift(ExpenseDetailsHelper.GetUnshiftForFileSearch());
            var cboFile = $("#cboCaseFile").data("kendoMultiColumnComboBox");
            cboFile.value("");
            cboFile.setDataSource(data);
            cboFile.select(0);
        } else {
            AjaxManager.MsgBox('warning', 'center', 'Alert', "Please type some text to search file!",
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
        }
    },
    GetUnshiftForFileSearch() {
        return {
            FileMasterId: "",
            RegNo: "--Select File--",
            CaseNo: "",
            CourtName: ""
        };
    },
    FillDiaryByFileChange: function (caseFileId) {
        
        var bCostObj = ExpenseDetailsManager.GetExpenseByCaseFileId(caseFileId);
        if (bCostObj != null) {
            var obj = bCostObj[0];
            $("#hdnFileMasterId").val(obj.FileMasterId);
            $("#txtRegNo").val(obj.RegNo);
            $("#txtCourt").val(obj.CourtName);
            $("#txtCaseNo").val(obj.CaseNo);
        }
    }
};