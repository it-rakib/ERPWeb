
var objEmployeeInfo = null;
var absentEmployeeArray = null;
var inactiveOrLeftyEmpId = null;
var $continuedAbsentRowDiv = null;

$(document).ready(function () {

    Manager.AbsentLast15Days();
    Manager.PresentLast30Days();
    Manager.EmployeeInLeaveLast3Month();
    Manager.EmployeeInLeaveCurrentMonth();
    Manager.GetIncrementableEmployee();
    Manager.OverTimeLast12Month();
    Manager.BasicEmployeeInfo();
    Manager.NewJoiningEmployeeLast30Days();
    Manager.ContinuedAbsentLast30Days();
    Manager.OverTimeLast30Days();

    $('#iBasedOn').change(function () {
        if ($(this).val() == "3") {
            $('#iAmount').val('');
            $('#iBasicOrGrossPercentage').val('');
            $('#iHouseRentsPercentage').val('');
            $('#iPercentageDiv').slideUp();
        }
        else {
            Manager.CalculateIncrementedamount();
            $('#iPercentageDiv').slideDown();
        }
    });

    $('#iBasicOrGrossPercentage').keyup(function () {
        Manager.CalculateIncrementedamount();
    });

    $('#iHouseRentsPercentage').keyup(function () {
        Manager.CalculateIncrementedamount();
    });

    $('#iSubmitButton').click(function () {
        Manager.SaveEmployeeIncrement();
    });

    $('#aSubmitButton').click(function () {
        Manager.MakeAbsentEmployeeInactiveOrLefty();
    });

    $("#iEffectiveDate").datetimepicker({
        timepicker: false,
        format: "m/d/Y"
    });

    $("#aDiscontinuationDate").datetimepicker({
        timepicker: false,
        format: "m/d/Y"
    });
});

$(window).load(function () {
    setTimeout(function () {

    }
 , 1000);
});


var Manager = {

    MakeAbsentEmployeeInactiveOrLefty: function () {
        if (!$('#aDiscontinuationDate').val()) {
            Message.Warning("Discontinuation date is required");
        }
        else {
            if (Message.Prompt()) {
                var objEmployee = {
                    employeeId: inactiveOrLeftyEmpId,
                    inactiveOrLefty:$('input[name=inactiveOrLeftyRadio]:checked').val(),
                    discontinuationDate: $('#aDiscontinuationDate').val(),
                    reason: $('#aReason').val()
                };
                console.log(objEmployee);
                var jsonParam = objEmployee;
                var serviceURL = "/Personal/MakeAbsentEmployeeInactiveOrLefty/";
                AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
            }
        }
        function onSuccess(jsonData) {
            if (jsonData == "0") {
                Message.Error("save");
            }
            else {
                Manager.ResetContinuedAbsent();
                $('#InactiveOrLeftyModal').modal('hide');
                Message.Success("save");
            }
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    SaveEmployeeIncrement: function () {
        if ($('#iIncrementType').val() == "" || $('#iIncrementType').val() == "0") {
            Message.Warning("Increment type is required");
        }
        else if ($('#iAmount').val() <= 0) {
            Message.Warning("Valid increment amount is required");
        }
        else if (!$('#iEffectiveDate').val()) {
            Message.Warning("Effective date is required");
        }
        else {
            if (Message.Prompt()) {
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var refNo = 'Increment/' + month + '/' + year;
                var objIncrement = {
                    Id: 0,
                    RefNo: refNo,
                    HrmEmployeeId: objEmployeeInfo.EId,
                    PreviousHrmGradeId: objEmployeeInfo.PrevGradeId,
                    HrmGradeId: $('#iNewGrade').val(),
                    HrmIncrementTypeId: $('#iIncrementType').val(),
                    PreviousBasicOrGross: objEmployeeInfo.Gross,
                    Date: $('#iEffectiveDate').val(),
                    Amount: $('#iAmount').val(),
                    Status: 1
                };

                var incrementList = [];
                incrementList.push(objIncrement);
                var jsonParam = 'objIncrement=' + JSON.stringify(incrementList);
                var serviceURL = "/Personal/InsertOrUpdateIncrement/";
                AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
            }
        }
        function onSuccess(jsonData) {
            if (jsonData == "0") {
                Message.Error("save");
            }
            else {
                Manager.GetIncrementableEmployee();
                $('#frmModal').modal('hide');
                Message.Success("save");
            }
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    CalculateIncrementedamount: function () {
        var bgPercent = !$('#iBasicOrGrossPercentage').val() ? 0 : $('#iBasicOrGrossPercentage').val();
        var hRPercent = !$('#iHouseRentsPercentage').val() ? 0 : $('#iHouseRentsPercentage').val();

        var basicOrGross = $('#iBasedOn').val() == "1" ? (Math.round(objEmployeeInfo.Basic)) : (Math.round(objEmployeeInfo.Gross));
        var houseRent = Math.round(objEmployeeInfo.HouseRent);

        var amount = ((basicOrGross * bgPercent) / 100) + ((houseRent * hRPercent) / 100);
        $('#iAmount').val(Math.round(amount));
    },

    LoadEmployeeInfoForIncrement: function (empId) {
        var jsonParam = { employeeId: empId };
        var serviceURL = "/PrlDashBoardData/GetEmployeeInfoForIncrement/";
        AjaxManager.SendJsonAsyncON(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            objEmployeeInfo = jsonData;
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    ContinuedAbsentLast30Days: function () {
        var jsonParam = '';
        var serviceURL = "/PrlDashBoardData/ContinuedAbsentLast30Days/";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            absentEmployeeArray = jsonData;
            var count = 0;
            $.each(jsonData, function (i, val) {
                count++;
                $('#divContinuedAbsent').append("<div style='padding:5px;padding-left:10px;font-size:11px;background:#fff;border-bottom:1px solid #f1efef;'><b>" + val.EmployeeId + " </b>( " + val.Name + " ) (<b>days:</b> " + val.absCount + ")<br><span style='color:#2196f3;'>Last Present: </span><b>" + val.lastDateOfPresent + "</b><i data-id='" + val.Id + "' class='fa fa-check-square-o inactiveOrLeftyIcon pull-right' aria-hidden='true' title='Make Inactive or Lefty' style='padding-left:55px; color:green; font-size:16px; cursor:pointer'></i></div>");
            });
            $("#continuedAbsent").append("<span id='totalContinuedAbsentSpan' style='position: absolute; background: red; left: 8px; top: 3px; font-size: 10px; min-width: 13px; padding: 0px 4px 4px 4px; border-radius: 5px;color:#fff;'>" + count + "</span>");
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
    },

    NewJoiningEmployeeLast30Days: function () {
        var jsonParam = '';
        var serviceURL = "/PrlDashBoardData/NewJoiningEmployeeLast30Days/";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            var count = 0;
            $.each(jsonData, function (i, val) {
                count++;
                $('#divNewJoining').append("<div style='padding:5px;padding-left:10px;font-size:11px;background:#fff;border-bottom:1px solid #f1efef;'><b>" + val.EmployeeId + " </b>( " + val.Name + " )<br><span style='color:#2196f3;'>Joining Date: </span><b>" + val.DOJ + "</b></div>");
            });
            $("#newJoining").append("<span style='position: absolute; background: red; left: 8px; top: 3px; font-size: 10px; min-width: 13px; padding: 0px 4px 4px 4px; border-radius: 5px;color:#fff;'>" + count + "</span>");
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }
    },

    BasicEmployeeInfo: function () {
        var jsonParam = '';
        var serviceURL = "/PrlDashBoardData/BasicEmployeeInfo/";
        AjaxManager.GetJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            $("#totalEmployee").text(jsonData.TotalEmployee);
            $("#activeEmployee").append("<span>Total: " + Math.round(jsonData.ActiveEmployee) + "<br/>Per: " + Math.round((jsonData.ActiveEmployee * 100) / jsonData.TotalEmployee) + " %</span>");
            $("#male").append("<span>Total: " + Math.round(jsonData.Male) + "<br/>Per: " + Math.round((jsonData.Male * 100) / jsonData.ActiveEmployee) + " %</span>");
            $("#female").append("<span>Total: " + Math.round(jsonData.Female) + "<br/>Per: " + Math.round((jsonData.Female * 100) / jsonData.ActiveEmployee) + " %</span>");
            $("#totalSalary").append("<span>Total: " + Math.round(jsonData.TotalSalary) + "<br/>Avg: " + Math.round(jsonData.TotalSalary / jsonData.ActiveEmployee) + " </span>");
            $("#totalEmployee").text(jsonData.TotalEmployee);
            $("#totalEmployee").text(jsonData.TotalEmployee);
            $("#avgAge").append("<span>Joining: " + Math.round(jsonData.AvgJoiningAge) + " year<br/>Age: " + Math.round(jsonData.AvgAge) + " year</span>");
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }

    },

    LoadIncrementTypeDDL: function () {
        var jsonParam = '';
        var serviceURL = "/DropDown/IncrementType/";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('iIncrementType', jsonData, 'Select Increment Type');
            $('#iIncrementType').chosen();
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    LoadGradeDDL: function () {
        var jsonParam = '';
        var serviceURL = "/DropDown/GetGradeById/";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            AjaxManager.populateCombo('iNewGrade', jsonData, 'Select Grade');
            $('#iNewGrade').chosen();
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    },

    OverTimeLast30Days: function () {
        var jsonParam = '';
        var serviceURL = "/PrlDashBoardData/OverTimeInLast30Days/";
        AjaxManager.GetJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            Morris.Bar({
                element: 'OverTimeInLast30Days',
                data: jsonData,
                xkey: 'date',
                ykeys: ['ot'],
                labels: ['OverTime'],
                hideHover: 'auto',
                barColors: ['#cc0098']

            });
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }

    },

    OverTimeLast12Month: function () {
        var jsonParam = '';
        var serviceURL = "/PrlDashBoardData/OverTimeInLast12Month/";
        AjaxManager.GetJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            Morris.Bar({
                element: 'OverTimeInLast12Month',
                data: jsonData,
                xkey: 'monthName',
                ykeys: ['ot'],
                labels: ['OverTime'],
                hideHover: 'auto',
                barColors: ['#1a83ff']

            });
        }
        function onFailed(error) {
            window.alert(error.statusText);
        }

    },

    GetIncrementableEmployee: function () {
        var jsonParam = '';
        var serviceURL = "/PrlDashBoardData/IncrementalEmployee/";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);

        function onSuccess(jsonData) {
            var count = 0;
            $('#divIncrement').empty();
            $.each(jsonData, function (i, val) {
                count++;
                $('#divIncrement').append("<div style='padding:5px;padding-left:10px;font-size:11px;background:#fff;border-bottom:1px solid #f1efef;'><span data-empid='" + val.empId + "'></span><b>" + val.EmployeeId + " </b>( " + val.Name + " )<br><span style='color:#2196f3;'>Last Increment Date: </span><b>" + val.Date + "</b><i data-id='" + val.empId + "' class='fa fa-check-square-o incrementIcon' aria-hidden='true' title='Click to submit increment' style='float:right; color:green; font-size:16px; cursor:pointer'></i></div>");
            });
            $("#incInMonth").append("<span style='position: absolute; background: red; left: 8px; top: 3px; font-size: 10px; min-width: 13px; padding: 0px 4px 4px 4px; border-radius: 5px;color:#fff;'>" + count + "</span>");
        }

        function onFailed(error) {
            window.alert(error.statusText);
        }
    },

    EmployeeInLeaveCurrentMonth: function () {
        $.ajax({
            url: '/PrlDashBoardData/EmployeeInLeaveCurrent/',
            type: 'GET',
            dataType: 'JSON',
            async: false,
        }).done(function (data) {
            Morris.Bar({
                element: 'EmployeeInLeaveCurrent',
                data: data,
                xkey: 'name',
                ykeys: ['days'],
                labels: ['Leave'],
                xLabelAngle: 50,
                hideHover: 'auto',
                barColors: ['#fe3398']
            });

        });

    },

    AbsentLast15Days: function () {
        $.ajax({
            url: '/PrlDashBoardData/AbsentInLast15Days/',
            type: 'GET',
            dataType: 'JSON',
            async: false,
        }).done(function (data) {
            Morris.Area({
                element: 'AbsentInLast15Days',
                data: data,
                xkey: 'date',
                ykeys: ['count'],
                labels: ['Absent'],
                xLabelAngle: 50,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors: ['red'],
                pointStrokeColors: ['#fff'],
                lineColors: ['#2196f3'],
                lineWidth: ['3px']


            });
        });


    },

    PresentLast30Days: function () {
        $.ajax({
            url: '/PrlDashBoardData/Present30Days/',
            type: 'GET',
            dataType: 'JSON',
            async: false,
        }).done(function (data) {
            Morris.Area({
                element: 'Present30Days',
                data: data,
                xkey: 'date',
                ykeys: ['count'],
                labels: ['Present'],
                xLabelAngle: 75,
                hideHover: 'auto',
                behaveLikeLine: true,
                resize: true,
                pointFillColors: ['red'],
                pointStrokeColors: ['#fff'],
                lineColors: ['#2196f3'],
                lineWidth: ['1.5px']
            });

        });


    },

    EmployeeInLeaveLast3Month: function () {
        $.ajax({
            url: '/PrlDashBoardData/EmployeeInLeave/',
            type: 'GET',
            dataType: 'JSON',
            async: false,
        }).done(function (data) {
            Morris.Donut({
                element: 'EmployeeInLeave',
                data: data,
                colors: ["#7f017f", "#cc0097", '#ff339a'],
            });

        });
    },

    GetAbsentEmployeeObjectById: function (empId) {
        var rtr = null;
        var filteredArray = $.grep(absentEmployeeArray, function (e) {
            return e.Id === empId;
        });
        if (filteredArray.length === 1) {
            rtr = filteredArray[0];
        }
        return rtr;
    },

    PrepareInactiveOrLeftyModal: function (empId) {
        var objEmp = Manager.GetAbsentEmployeeObjectById(empId);
        if (objEmp != null) {
            var empInfo = '<strong>Employee ID :</strong> ' + objEmp.EmployeeId + ' <br><strong>Name : </strong>' + objEmp.Name + '<br><strong>Designation : </strong>' + objEmp.Designaion;
            $('#aEmployeeInfo').html(empInfo);

            $('#InactiveOrLeftyModal').modal('show');
        }
    },

    ResetContinuedAbsent:function() {
        absentEmployeeArray = $.grep(absentEmployeeArray, function(value) {
            return value.Id !== inactiveOrLeftyEmpId;
        });
        $('#totalContinuedAbsentSpan').html(absentEmployeeArray.length);
        $continuedAbsentRowDiv.remove();
    }
};

$(document).on('click', '.incrementIcon', function () {
    var empId = $(this).data('id');
    Manager.LoadIncrementTypeDDL();
    Manager.LoadGradeDDL();
    Manager.LoadEmployeeInfoForIncrement(empId);

    var empInfo = objEmployeeInfo.EmployeeID + ' - ' + objEmployeeInfo.Name + '<br>' + '<strong>Designation:</strong> ' + objEmployeeInfo.Designation + ', <strong>Grade:</strong> ' + objEmployeeInfo.Grade + '<br/>' + '<strong>Gross:</strong> ' + objEmployeeInfo.Gross.toFixed(2) + ', <strong>Basic:</strong> ' + objEmployeeInfo.Basic.toFixed(2) + ', <strong>House Rent:</strong> ' + objEmployeeInfo.HouseRent.toFixed(2);
    $('#iEmployeeInfo').html(empInfo);

    $('#frmModal').modal('show');
});


$(document).on('click', '.inactiveOrLeftyIcon', function () {
    $continuedAbsentRowDiv = $(this).parent();
    var empId = $(this).data('id');
    inactiveOrLeftyEmpId = empId;
    Manager.PrepareInactiveOrLeftyModal(empId);
});


$(document).on('hidden.bs.modal', '#frmModal', function () {
    objEmployeeInfo = null;
    $('#incrementForm')[0].reset();
    $('#iNewGrade').trigger('chosen:updated');
    $('#iIncrementType').trigger('chosen:updated');
});


$(document).on('hidden.bs.modal', '#InactiveOrLeftyModal', function () {
    inactiveOrLeftyEmpId = null;
    $('#inactiveOrLftyForm')[0].reset();
});
