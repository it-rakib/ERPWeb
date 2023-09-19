var _sendMailControllerName = "",
    _sendMailActionName = "",
    _sendMailParamObj = null;

$(document).ready(function () {
    EmailHelper.Init();
});
var EmailManager = {
    MailSend() {
        var jsonParam = JSON.stringify(_sendMailParamObj);
        var serviceUrl = _baseUrl + "/api/" + _sendMailControllerName + "/" + _sendMailActionName;
        AjaxManager.PostJsonApi(serviceUrl, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
            if (jsonData.Success) {
                AjaxManager.MsgBox('success', 'center', 'Success', "Mail Sent",
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }

            else {
                AjaxManager.MsgBox('error', 'center', 'Error', jsonData,
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                            $noty.close();
                        }
                    }]);
            }
        }
        function onFailed(error) {
            AjaxManager.MsgBox('error', 'center', 'Error', error.statusText,
                [{
                    addClass: 'btn btn-primary', text: 'Ok', onClick($noty) {
                        $noty.close();
                    }
                }]);
        }
    }
}
var EmailHelper = {
    Init() {
        $(".btnOpenMail").click(function () {
            EmailHelper.OpenMail();
        });
        $(".btnCloseMail").click(function () {
            EmailHelper.CloseMail();
            EmailHelper.ResetMail();
        });
        $("#btnMailSendBulk").click(function () {
            if ($.trim(_sendMailControllerName).length == 0) {
                alert("Set controller name at variable : _sendMailControllerName");
                return false;
            }
            if ($.trim(_sendMailActionName).length == 0) {
                alert("Set action name at variable : _sendMailActionName");
                return false;
            }
            if (_sendMailParamObj == null) {
                alert("Set object name at variable : _sendMailParamObj");
                return false;
            }
            EmailManager.MailSend();
        });
    },
    GenerateTabs(totalTab, list, tabTitlePropNameOrValue) {
        var tabName = $.trim(tabTitlePropNameOrValue);
        if (totalTab > 1) {
            tabName = $.trim(list[0][tabTitlePropNameOrValue]);
        }
        $(".tab1").find(".tabMail-label").text(tabName);
        $(".tab1").find(".tabMail-label").attr("for", "tabMail1").attr("title", tabName);

        if (totalTab == 1) {
            $(".tabInfo").hide();
            $(".tabsMail").css({
                "background": "#ffffff",
                "margin": "0px"
            });
            $(".tabMail-content").css({
                "padding": "0px"
            });
        } else if (totalTab > 1) {
            for (var i = 2; i <= totalTab; i++) {
                var tabName = $.trim(list[i - 1][tabTitlePropNameOrValue]);
                $(".tabsMail").append($(".tab1").clone());
                $(".tabsMail .tab1:last").addClass("tab" + i).removeClass("tab1");
                $(".tab" + i).find(".tabMail-switch").attr("id", "tabMail" + i);
                $(".tab" + i).find(".tabMail-label").attr("for", "tabMail" + i).attr("title", tabName);
                $(".tab" + i).find(".tabMail-label").text(tabName);
                $("#tabMail" + i).prop('checked', false);
            }
            $("#tabMail1").prop('checked', true);
        }
    },
    OpenMail() {
        $("#divMailTemplate").addClass("show");
    },
    CloseMail() {
        EmailHelper.ResetMail();
        $("#divMailTemplate").removeClass("show");
    },
    ResetMail() {
        $(".inputToMail, .inputCCMail, .inputBCCMail, .inputSubjectMail").val("");
        $(".inputBodyMail").text("");
        $(".divBodyMain .otherMailTags").remove();
        $(".tabMail").not(".tab1").remove();
    },
    MailTo(tabIndex, mailIds) {
        $(".tab" + tabIndex).find(".inputToMail").val("");
        mailIds = mailIds.length > 0 ? mailIds.join("; ") + ";" : "";
        if (mailIds.length > 0) $(".tab" + tabIndex).find(".inputToMail").val(mailIds);
    },
    MailCC(tabIndex, mailIds) {
        $(".tab" + tabIndex).find(".inputCCMail").val("");
        mailIds = mailIds.length > 0 ? mailIds.join("; ") + ";" : "";
        if (mailIds.length > 0) $(".tab" + tabIndex).find(".inputCCMail").val(mailIds);
    },
    MailBCC(tabIndex, mailIds) {
        $(".tab" + tabIndex).find(".inputBCCMail").val("");
        mailIds = mailIds.length > 0 ? mailIds.join("; ") + ";" : "";
        if (mailIds.length > 0) $(".tab" + tabIndex).find(".inputBCCMail").val(mailIds);
    },
    MailSubject(tabIndex, text) {
        $(".tab" + tabIndex).find(".inputSubjectMail").val(text);
    },
    MailBody(tabIndex, text) {
        text = text.replace(/LineNew/g, '<br>');
        $(".tab" + tabIndex).find(".inputBodyMail").html(text);
    },
    MailBodyHtmlContentAfterTextarea(tabIndex, htmlText) {
        $(".tab" + tabIndex).find(".divBodyMain").append(htmlText);
    },
    MailBodyHtmlContentBeforeTextarea(tabIndex, htmlText, textAreaId) {
        $(".tab" + tabIndex).find(textAreaId).before(htmlText);
    }
}