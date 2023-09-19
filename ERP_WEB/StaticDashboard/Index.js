
$(document).ready(function () {

    setInterval(function () {
        var jsonParam = '';
        var serviceURL = "/Home/CustomSessionExtend/";
        AjaxManager.SendJson(serviceURL, jsonParam, onSuccess, onFailed);
        function onSuccess(jsonData) {
        }
        function onFailed(xhr, status, err) {
            Message.Exception(xhr);
        }
    }, 120000);

});




HideTopMenu = {
    Hide: function () {
        $(".1").hide();
        $(".2").hide();
        $(".3").hide();
        $(".4").hide();
        $(".5").hide();
        $(".6").hide();
        $(".7").hide();
        $(".8").hide();
        $(".9").hide();
        $(".10").hide();
        $(".11").hide();
        $(".12").hide();
    }
};



$('#100').click(function () {
    HideTopMenu.Hide();
    $(".1").show();
});

$('#200').click(function () {
    HideTopMenu.Hide();
    $(".2").show();
});

$('#300').click(function () {
    HideTopMenu.Hide();
    $(".3").show();
});

$('#400').click(function () {
    HideTopMenu.Hide();
    $(".4").show();
});

$('#500').click(function () {
    HideTopMenu.Hide();
    $(".5").show();
});

$('#600').click(function () {
    HideTopMenu.Hide();
    $(".6").show();
});

$('#700').click(function () {
    HideTopMenu.Hide();
    $(".7").show();
});

$('#800').click(function () {
    HideTopMenu.Hide();
    $(".8").show();
});

$('#900').click(function () {
    HideTopMenu.Hide();
    $(".9").show();
});

$('#1000').click(function () {
    HideTopMenu.Hide();
    $(".10").show();
});

$('#1100').click(function () {
    HideTopMenu.Hide();
    $(".11").show();
});

$('#1200').click(function () {
    HideTopMenu.Hide();
    $(".12").show();
});
