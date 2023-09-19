var _files = {
    FrontDocTypeId: "4be83b29-0bc9-4fe1-b314-1f93b19b92ba",
    BackDocTypeId: "02dca355-0dbf-4115-a11b-39d0ec9e25af",
    FileTypeId: "b36d8ac6-6b33-4067-befc-644a5fc1296e",

    FrontDocId: AjaxManager.DefaultGuidId(),
    FrontPart: null,
    BackDocId: AjaxManager.DefaultGuidId(),
    BackPart: null,
    DocumentId: AjaxManager.DefaultGuidId(),
    FilePart: null,
    DefaultImg: "../Images/clickHereToUpload.png",

    FrontDocPath: "",
    BackDocPath: "",
    FilePath: ""
};

var SSCIHelper = {
    Init() {
        SSCIHelper.InitUploadEvents();
    },
    InitUploadEvents() {
        $("#txtFrontPart").change(function () {
            _files.FrontPart = $(this);
            var file = this.files[0];
            var fileSize = (file.size);
            if (fileSize > 2000000) {
                AjaxManager.MsgBox('error', 'center', 'Error: ', 'Please select image size less than 2 MB',
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
                $("#txtFrontPart").val("");
                $("#imgFrontPart").attr("src", _files.DefaultImg);
                return;
            };
            $("#imgFrontPart").attr("src", window.URL.createObjectURL(file));
        });
        $("#txtBackPart").change(function () {
            _files.BackPart = $(this);
            var file = this.files[0];
            var fileSize = (file.size);
            if (fileSize > 2000000) {
                AjaxManager.MsgBox('error', 'center', 'Error: ', 'Please select image size less than 2 MB',
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
                $("#txtBackPart").val("");
                $("#txtBackPart").attr("src", _files.DefaultImg);
                return;
            };
            $("#imgBackPart").attr("src", window.URL.createObjectURL(file));
        });        
        $("#txtFiles").change(function () {
            debugger;
            _files.FilePart = $(this);
            var file = this.files[0];
            var fileSize = (file.size);
            if (fileSize > 2000000) {
                AjaxManager.MsgBox('error', 'center', 'Error: ', 'Please select file size less than 2 MB',
                    [{
                        addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                            $noty.close();
                        }
                    }]);
                $("#txtFiles").val("");
                //$("#imgFiles").attr("src", _files.DefaultImg);
                return;
            };
            //$("#imgFiles").attr("src", window.URL.createObjectURL(file.name));
            //$("#imgFiles").attr("src", file.name);
        });

    },
    ResetFileParts() {
        _files.FrontPart = null;
        _files.BackPart = null;
        _files.FilePart = null;
    },
    ResetFileDocPaths() {
        _files.FrontDocPath = "";
        _files.BackDocPath = "";
        _files.FilePath = "";
    },
    ResetFile() {
        _files.FrontPart = null;
        _files.BackPart = null;
        _files.FilePart = null;
        _files.FrontDocId = AjaxManager.DefaultGuidId();
        _files.BackDocId = AjaxManager.DefaultGuidId();        
        _files.FileTypeId = AjaxManager.DefaultGuidId();
    },
    SetDefaultImage() {
        $("img[docType='" + _files.FrontDocTypeId + "']").attr("src", _files.DefaultImg);
        $("img[docType='" + _files.BackDocTypeId + "']").attr("src", _files.DefaultImg);
        $("img[docType='" + _files.FileTypeId + "']").attr("src", _files.DefaultImg);
    }
}