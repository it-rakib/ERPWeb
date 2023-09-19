

var gbSelectiveEmpArray = [];
var gbRemovedEmpArray = [];
var pageId = "";
var gbEmpList = [],
    gbEmpList1 = [];

var EmployeeSummaryManager = {
    gridDataSource: function (checkedNodes, searchKey, status, holidayId, empId, isSelected) {
        var gridDataSource = new window.kendo.data.DataSource({
            type: "json",
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
            allowUnsort: false,
            // pageSize: 20,
            transport: {
                read: {
                    //url: '../EmployeeBasic/GetEmployeeSummary/?treelist=' + { data: checkedNodes} + '&searchKey=' + searchKey + "&status=" + status,
                    url: '../EmployeeBasic/GetEmployeeSummary/?searchKey=' + searchKey + "&status=" + status + "&holidayId=" + holidayId + "&empId=" + empId + "&isSelected=" + isSelected,
                    data: {
                        treelist: checkedNodes
                    },
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: {
                data: "Items", total: "TotalCount",
                model: {
                    fields: {
                        JoiningDate: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        },
                        DateOfBirth: {
                            type: "date",
                            template: '#= kendo.toString("dd-MMM-yyyy") #',
                            editable: false
                        }

                    }
                }
            }
        });
        return gridDataSource;
    },
    GetEmployeeSummary2: function (searchKey, status, holidayId, empId, isSelected) {
        var objCou = "";
        var jsonParam = "";
        var serviceUrl = "../EmployeeBasic/GetEmployeeSummary2/?searchKey=" + searchKey + "&status=" + status + "&holidayId=" + holidayId + "&empId=" + empId + "&isSelected=" + isSelected;
        AjaxManager.GetJsonResult(serviceUrl, jsonParam, false, false, onSuccess, onFailed);

        function onSuccess(jsonData) {
            objCou = jsonData;
        }
        function onFailed(error) {
            alert(error.statusText);
        }
        return objCou;
    },
};

var EmployeeSummaryHelper = {
    InitEmployeeSummary: function () {
        EmployeeSummaryHelper.GenerateImployeeInfoGrid();

        $("#btnSearchEmp").click(function () {
            EmployeeSummaryHelper.SearchEmployee();
        });
        $("#btnSearchEmployee").click(function () {
            EmployeeSummaryHelper.SearchEmployee();
        });
        $("#txtSearchKey").keypress(function (event) {
            if (event.keyCode == 13) {
                EmployeeSummaryHelper.SearchEmployee();
            }
        });

        EmployeeSummaryHelper.EmployeeGridChangeEvent();

        $('#chkIsSelected').change(function() {
            if ($(this).is(":checked")) {
                $("#txtSearchKey").attr("placeholder", "Enter 6 Digit Emp. ID");
            } else {
                $("#txtSearchKey").attr("placeholder", "Employee ID / Name / Designation");
            }
        });
    },

   SearchEmployee: function () {
        if (pageId === "HOLIDAYEMPWISE") {
            gbSelectiveEmpArray = [];
            HolidaySetupHelper.SearchEmployee();
        }
        else if (pageId === "APPROVALORGANOGRAM") {
            gbSelectiveEmpArray = [];
            AppOrgSearchEmployeeHelper.SearchEmployee();
        }
        else {
            EmployeeSummaryHelper.GetAllEmployeeBySearch();
        }

    },

    GetAllEmployeeBySearch: function () {
        gbSelectiveEmpArray = [];
        $("#grdEmployee thead input:checkbox").prop("checked", false);

        EmployeeTreeHelper.GetAllCheckedItem();
        var searchKey = $("#txtSearchKey").val();
        var status = $("#cmbStatus").data("kendoComboBox").value();
        var empGrid = $("#grdEmployee").data("kendoGrid");
       
        var isSelected = $("#chkIsSelected").is(":checked") === true ? 1 : 0;
        if (isSelected === 0) {
            gbEmpList = [];
        }
        if (isSelected === 1) {
            if (searchKey.trim() !== "" && searchKey.trim().length===6) {
                var duplicateEmp = gbEmpList.find(x => x.EmpCode.trim() === searchKey.trim());
                if (duplicateEmp == null) {
                    var emp = EmployeeSummaryManager.GetEmployeeSummary2(searchKey, status, 0, 0, isSelected);
                    if (emp != null && emp.length > 0) {
                        gbEmpList.push(emp[0]);
                        var dataSource = new kendo.data.DataSource({
                            data: gbEmpList
                        });
                        empGrid.setDataSource(dataSource);
                        var count = empGrid.dataSource.total();
                        $("#txtTotalEmp").val("Total Employee : " + count);
                    }
                }
            } else {
                AjaxManager.MsgBox('warning', 'center', 'Warning:', "Please Input 6 digit Employee ID",
                   [{
                       addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                           $noty.close();
                       }
                   }]);
            }
          
        } else {
            var empList = EmployeeSummaryManager.gridDataSource(checkedNodes, searchKey, status, 0, 0, isSelected);
            empGrid.setDataSource(empList);
            var count1 = empGrid.dataSource.total();
            $("#txtTotalEmp").val("Total Employee : " + count1);
        }
    },

    GenerateImployeeInfoGrid: function () {
        $("#grdEmployee").kendoGrid({
            dataSource: [],
            filterable: true,
            sortable: true,
            //scrollable:true,
            columns: EmployeeSummaryHelper.GenerateEmployeeInfoColumns(),
            editable: false,
            navigatable: true,
            selectable: "row"

        });
    },
    GenerateEmployeeInfoColumns: function () {
        var columns = [
            { field: "check_row", title: "", filterable: false, sortable: false, template: '#= EmployeeSummaryHelper.CheckedMenu(data) #', headerTemplate: "<input type='checkbox' id='checkAll'/>" },
            { field: "EmpID", hidden: true },
            { field: "EmpCode", title: "ID No", editable: false },
            { field: "Name", title: "Name", editable: false },
            { field: "DesignationName", title: "Designation", editable: false },
            { field: "View", title: "Details", filterable: false, template: "#=EmployeeSummaryHelper.buttonTemplate(data) #", attributes: { class: "ob-center" } }

        ];
        return columns;
    },
    buttonTemplate: function (data) {

        if (pageId === "SHIFT") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-search" value="Edit" id="spnApproverbtn" onClick="EmployeeShiftSummaryHelper.clickEventForViewButton()" ></button>';
        }
        else if (pageId === "SEPERATION") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="EmployeeSeparationHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "TRANSFER") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="TransferInfoHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "PROMOTION") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="PromotionInfoHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "EMPALLOWANCE") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="EmployeeWiseAllowanceDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "TAXATION") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="EmployeeTaxDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "SALARYSETUP") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="SalaryDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "APPROVERSETUP") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="ApproverSetupDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "ROSTERUPDATE") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="RosterDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "INCREMENT") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="IncrementInfoHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "SALARYSTOP") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="SalaryStopDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "PUNCHALTER") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="PunchAlterDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "EMPLOYEECONTRACT") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="EmployeeContractInfoHelper.clickEventForEditButton()" ></button>';
        }
        else if (pageId === "EMPLOYEEPF") {
            return '<button type="button" class="btn btn-info btn-sm glyphicon glyphicon-unchecked" value="Edit" id="spnApproverbtn" onClick="EmployeePFDetailsHelper.clickEventForEditButton()" ></button>';
        }
        else {
            return '';
        }
    },

    EmployeeGridChangeEvent: function () {
        $("#grdEmployee").on("click", ".check_row", function () {
            var $cb = $(this);
            var gridSummary = $("#grdEmployee").data("kendoGrid");
            var selectedItem = gridSummary.dataItem(gridSummary.select());
            var dataItem = gridSummary.dataItem($(this).closest('tr'));
            if ($cb.is(":checked")) {
                if (selectedItem != null) {
                    for (var i = 0; i < gbRemovedEmpArray.length; i++) {
                        if (gbRemovedEmpArray[i].EmpID === dataItem.EmpID) {
                            gbRemovedEmpArray.splice(i, 1);
                            break;
                        }
                    }
                    gbSelectiveEmpArray.push(selectedItem);
                } else {
                    $cb.attr('checked', false);
                }
            }
            else {
                for (var j = 0; j < gbSelectiveEmpArray.length; j++) {
                    if (gbSelectiveEmpArray[j].EmpID === dataItem.EmpID) {
                        gbSelectiveEmpArray.splice(j, 1);
                        break;
                    }
                }

                if (pageId === "HOLIDAYEMPWISE" ) {
                    if (selectedItem.HolidayId > 0) {
                        gbRemovedEmpArray.push(selectedItem);
                    }
                }
                if (pageId === "APPROVALORGANOGRAM") {
                    if (selectedItem.SupervisorEmpId > 0) {
                        gbRemovedEmpArray.push(selectedItem);
                    }
                }


            }
        });//Indivisual row selection

        $('#grdEmployee').on('change', '#checkAll', function (e) {
            gbSelectiveEmpArray = [];
            gbRemovedEmpArray = [];
            var gridSummary = $("#grdEmployee").data("kendoGrid");
            var selectAll = document.getElementById("checkAll");
            if (selectAll.checked === true) {
                $("#grdEmployee tbody input:checkbox").prop("checked", this.checked);
                $("#grdEmployee table tr").addClass('k-state-selected');
                var gridData = gridSummary.dataSource.data();
                for (var i = 0; i < gridData.length; i++) {
                    var obj = gridData[i];
                    gbSelectiveEmpArray.push(obj);
                }
            }
            else {
                $("#grdEmployee tbody input:checkbox").removeAttr("checked", this.checked);
                $("#grdEmployee table tr").removeClass('k-state-selected');
                gbSelectiveEmpArray = [];
                var gridDatarv = gridSummary.dataSource.data();
                for (var k = 0; k < gridDatarv.length; k++) {
                    if (pageId === "HOLIDAYEMPWISE") {
                        if (gridDatarv[k].HolidayId > 0) {
                            gbRemovedEmpArray.push(gridDatarv[k]);
                        }
                    }
                    if (pageId === "APPROVALORGANOGRAM") {
                        if (gridDatarv[k].SupervisorEmpId > 0) {
                            gbRemovedEmpArray.push(gridDatarv[k]);
                        }
                    }
                }
            }
        });// All Row Selection 
    },
    CheckedMenu: function (data) {
        if (gbSelectiveEmpArray.length > 0) {

            var result = gbSelectiveEmpArray.filter(function (obj) {
                return obj.EmpID === data.EmpID;
            });
            if (result.length > 0) {
                return '<input id="check_row" class="check_row" type="checkbox" checked="checked"/>';
            }
            else {
                return '<input id="check_row" class="check_row" type="checkbox"/>';
            }

        }
        else {
            return '<input id="check_row" class="check_row" type="checkbox"/>';
        }
    }
};
