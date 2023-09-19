var _nColspan = 0,
    _nSL = 0,
    _EditableText = "Editable",
    _isAdminUser = false;

var PABXManager = {
    LoadData: function (selectedItems, textFromSearch, isAdminUser) {
        var dataList = [];
        selectedItems = JSON.stringify(selectedItems);
        var jsonParam = "treeNode:" + selectedItems + ",textSearchKey:" + JSON.stringify(textFromSearch) + ",isAdminUser:" + JSON.stringify(isAdminUser);
        var serviceUrl = "../PABXInfo/LoadData/";
        AjaxManager.SendJson2(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(data) {
            dataList = data;
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
            [
                {
                    addClass: 'btn btn-primary',
                    text: 'Ok',
                    onClick: function ($noty) {
                        $noty.close();
                    }
                }
            ]);
        }
        return dataList;
    },
    //LoadDataBySearch: function (textFromSearch) {
    //    var treeItem = {
    //        text: $.trim(textFromSearch)
    //    };
    //    var dataList = [];
    //    treeItem = JSON.stringify(treeItem);
    //    var jsonParam = "treeItem:" + treeItem;
    //    var serviceUrl = "../PABXInfo/SearchByText/";
    //    AjaxManager.SendJson2(serviceUrl, jsonParam, onSuccess, onFailed);

    //    function onSuccess(data) {
    //        dataList = data;
    //    }
    //    function onFailed(error) {
    //        AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
    //        [
    //            {
    //                addClass: 'btn btn-primary',
    //                text: 'Ok',
    //                onClick: function ($noty) {
    //                    $noty.close();
    //                }
    //            }
    //        ]);
    //    }
    //    return dataList;
    //},
    Save: function (nRowIndex) {
        var rv = null;
        if (nRowIndex <= 0 || nRowIndex == null) {
            AjaxManager.MsgBox('error', 'center', 'Failed', "Invalid Row !!!",
            [{
                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                    $noty.close();
                }
            }]);
            return null;
        }
        var oPABXInfo = PABXHelper.GetObject(nRowIndex);
        oPABXInfo = JSON.stringify(oPABXInfo);
        var jsonParam = 'oPABXInfo:' + oPABXInfo;
        var serviceUrl = "../PABXInfo/Save/";
        AjaxManager.SendJson2(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.EmpID > 0) {
                rv = jsonData;
            }
            else {
                AjaxManager.MsgBox('error', 'center', 'Failed', jsonData.Message,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                        $noty.close();
                    }
                }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Failed', error.statusText,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                            }
                        }]);
        }
        return rv;
    },
}
var PABXHelper = {
    Init: function (isAdminUser) {
        _isAdminUser = isAdminUser;
        if (!_isAdminUser) $(".actionPABX").remove();

        if (!_isAdminUser) $(".divExportPabx").remove();

        $("#txtSearch").focus();
        _nColspan = $("#tblPABX thead tr th").length;
        $("#btnLoad").click(function () {
            PABXHelper.LoadGrid();
        });
        $("#btnSearchPabx").click(function () {
            PABXHelper.LoadGrid();
        });
        $('#txtSearch').keydown(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                PABXHelper.LoadGrid();
            }
        });

        $("#btnExport").click(function () {
            PABXHelper.TableToExcel();
        });
    },
    GenerateTableRow: function (oPABXInfos) {
        PABXHelper.ClearTable();
        if (oPABXInfos.length > 0) {
            $.map(oPABXInfos, function (oPABXInfo) {
                _nSL++;
                PABXHelper.GenerateSingleRow(oPABXInfo, _nSL, false, false);
            });
        }
        else {
            $("#tblPABX tbody").append("<tr><td colspan=" + _nColspan + " style='text-align:center;font-weight:bold;font-size:18px;'>No List Found</td></tr>");
        }
    },
    GenerateSingleRow: function (oPABXInfo, nRowIndex, isEditable, isReplaceRow) {
        var btnText = !isEditable ? "Edit" : "Update",
            editableFlag = !isEditable ? "" : _EditableText;

        var sTemp = "<tr rowIndex=" + nRowIndex + " EmpId=" + oPABXInfo.EmpID + " " + editableFlag + ">";
        sTemp += !isEditable ? PABXHelper.SetNonEditableRow(oPABXInfo, nRowIndex) : PABXHelper.SetEditableRow(oPABXInfo, nRowIndex);
        sTemp += "<td class='actionPABX'><button id='btnUpdateInfo" + nRowIndex + "' class='k-button-primary-sm'>" + btnText + "</button></td>";
        sTemp += "</tr>";

        if (isReplaceRow) {
            $("#tblPABX tbody tr[rowIndex=" + nRowIndex + "]").replaceWith(sTemp);
        }
        else {
            $("#tblPABX tbody").append(sTemp);
        }
        if (!_isAdminUser) $(".actionPABX").remove();

        if (_isAdminUser) {
            $("#btnUpdateInfo" + nRowIndex).click(function () {
                PABXHelper.SaveRow(oPABXInfo, nRowIndex);
            });
            $("#tblPABX tbody tr[rowIndex=" + nRowIndex + "] td[PABX] input").keydown(function (event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13) {
                    PABXHelper.SaveRow(oPABXInfo, nRowIndex);
                }
            });
            $("#tblPABX tbody tr[rowIndex=" + nRowIndex + "] td[MOBILE] input").keydown(function (event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13) {
                    PABXHelper.SaveRow(oPABXInfo, nRowIndex);
                }
            });
            $("#tblPABX tbody tr[rowIndex=" + nRowIndex + "] td[EMAIL] input").keydown(function (event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode == 13) {
                    PABXHelper.SaveRow(oPABXInfo, nRowIndex);
                }
            });
            $("#tblPABX tbody tr[rowIndex=" + nRowIndex + "]").dblclick(function () {
                PABXHelper.MakeNonEditable();
                PABXHelper.GenerateSingleRow(oPABXInfo, nRowIndex, true, true);
            });
        }
    },
    ClearTable: function () {
        _nSL = 0;
        $("#tblPABX tbody tr").remove();
    },
    LoadGrid: function () {
        var textFromSearch = $.trim($("#txtSearch").val());
        var oPABXInfos = [];

        var isAdminUser = _isAdminUser;
      
         EmployeeTreeHelper.GetAllCheckedItem();
         var selectedItems = checkedNodes;
         oPABXInfos = PABXManager.LoadData(selectedItems, textFromSearch, isAdminUser);
        
        //else {
        //    oPABXInfos = PABXManager.LoadDataBySearch(textFromSearch);
        //}
        PABXHelper.GenerateTableRow(oPABXInfos);
    },
    SetEditableRow: function (oPABXInfo, nRowIndex) {
        var sTemp = ""
        sTemp += "<td style='width:60px;'>" + nRowIndex + "</td>";
        sTemp += "<td Name>" + oPABXInfo.Name + "</td>";
        sTemp += "<td EmpCode class='actionPABX'>" + oPABXInfo.EmpCode + "</td>";
        sTemp += "<td DesignationName>" + oPABXInfo.DesignationName + "</td>";
        sTemp += "<td DepartmentName>" + oPABXInfo.DepartmentName + "</td>";
        sTemp += "<td SectionName>" + oPABXInfo.SectionName + "</td>";
        sTemp += "<td Mobile style='width:100px;'><input type='text' style='width:100%;' class='k-textbox' value='" + oPABXInfo.Mobile + "' /></td>";
        sTemp += "<td EmailOffice style='width:200px;'><input type='text' style='width:100%;' class='k-textbox' value='" + oPABXInfo.EmailOffice + "' /></td>";
        sTemp += "<td PABX style='width:100px;'><input type='text' value='" + oPABXInfo.PABX + "' style='width:100%;' class='k-textbox' onkeypress='return IkrAllowOnlyNumber(event, this);' /></td>";
        return sTemp;
    },
    SetNonEditableRow: function (oPABXInfo, nRowIndex) {
        var sTemp = ""
        sTemp += "<td style='width:60px;'>" + nRowIndex + "</td>";
        sTemp += "<td Name>" + oPABXInfo.Name + "</td>";
        sTemp += "<td EmpCode class='actionPABX'>" + oPABXInfo.EmpCode + "</td>";
        sTemp += "<td DesignationName>" + oPABXInfo.DesignationName + "</td>";
        sTemp += "<td DepartmentName>" + oPABXInfo.DepartmentName + "</td>";
        sTemp += "<td SectionName>" + oPABXInfo.SectionName + "</td>";
        sTemp += "<td Mobile style='width:100px;'>" + oPABXInfo.Mobile + "</td>";
        sTemp += "<td EmailOffice style='width:200px;'>" + oPABXInfo.EmailOffice + "</td>";
        sTemp += "<td PABX style='width:100px;'>" + oPABXInfo.PABX + "</td>";
        return sTemp;
    },
    MakeNonEditable: function () {
        var selectedRow = $("#tblPABX tbody tr[" + _EditableText + "]"),
            nRowIndex = parseInt(selectedRow.attr("rowIndex"));
        var oPABXInfo = {
            EmpID: parseInt(selectedRow.attr("EmpID")),
            Name: selectedRow.find("td[Name]").text(),
            EmpCode: selectedRow.find("td[EmpCode]").text(),
            DesignationName: selectedRow.find("td[DesignationName]").text(),
            DepartmentName: selectedRow.find("td[DepartmentName]").text(),
            SectionName: selectedRow.find("td[SectionName]").text(),
            PABX: selectedRow.find("td[PABX] input").val(),
            Mobile: selectedRow.find("td[Mobile] input").val(),
            EmailOffice: selectedRow.find("td[EmailOffice] input").val()
        };
        PABXHelper.GenerateSingleRow(oPABXInfo, nRowIndex, false, true);
        $("#tblPABX tbody tr[" + _EditableText + "]").removeAttr(_EditableText);
    },
    GetObject: function (nRowIndex) {
        var selectedRow = $("#tblPABX tbody tr[RowIndex=" + nRowIndex + "]");
        var oPABXInfo = {
            EmpID: parseInt(selectedRow.attr("EmpID")),
            PABX: selectedRow.find("td[PABX] input").val(),
            Mobile: selectedRow.find("td[Mobile] input").val(),
            EmailOffice: selectedRow.find("td[EmailOffice] input").val()
        };
        return oPABXInfo;
    },
    SaveRow: function (oPABXInfo, nRowIndex) {
        var btnText = $("#btnUpdateInfo" + nRowIndex).text();
        if (btnText == "Edit") {
            PABXHelper.MakeNonEditable();
            PABXHelper.GenerateSingleRow(oPABXInfo, nRowIndex, true, true);
        } else if (btnText == "Update") {
            var pabx = PABXManager.Save(nRowIndex);
            if (pabx.EmpID > 0 && pabx != null) PABXHelper.GenerateSingleRow(pabx, nRowIndex, false, true);
        }
    },

    TableToExcel: function () {
        $("#tblPABX").table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "PABX Info" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true
        });
    },
}
function IkrAllowOnlyNumber(evt, obj) {
    //onkeypress='return IkrAllowOnlyNumber(event, this);'
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var value = obj.value;
    if (charCode == 46) return false;
    else if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    else return true;
}
