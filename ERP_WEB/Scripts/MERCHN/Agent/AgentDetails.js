var validationSuccess = $("#validation-success");
var AgentDetailsManager = {
    SaveAgentDetails: function () {
        var msg = "";
            var objAgent = AgentDetailsHelper.CreateAgentObject();
            var jsonParam = JSON.stringify(objAgent);
            var serviceUrl = _baseUrl + "/api/Agent/CreateUpdateAgent";
            AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
            function onSuccess(jsonData) {
                if (jsonData.Success) {
                    msg = jsonData.Message;
                    AjaxManager.MsgBox('success', 'center', 'Success:', msg,
                        [{
                            addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                                $noty.close();
                                $("#grdAgentSummary").data("kendoGrid").dataSource.read();
                                AgentDetailsHelper.ClearForm();
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
};

var AgentDetailsHelper = {
    InitAgentDetails: function () {

        $("#btnSave").click(function () {
            AgentDetailsManager.SaveAgentDetails();
        });

        $("#btnClearAll").click(function () {
            AgentDetailsHelper.ClearForm();
        });
    },
    FillAgentForm: function (obj) {
        debugger;
        $("#hdnAgentId").val(obj.AgentId);
        $("#txtAgentName").val(obj.AgentName);
    },

    CreateAgentObject: function (agentObj) {
        var obj = new Object();
        obj.AgentId = $("#hdnAgentId").val();
        obj.AgentName = $("#txtAgentName").val().trim();
        return obj;
    },
    ClearForm: function (obj) {
        $("#btnSave").text("Save");
        $("#hdnAgentId").val("00000000-0000-0000-0000-000000000000");
        $("#txtAgentName").val("");
    }
};