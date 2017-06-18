var FileService = function () {

    var openedFileName = null;
    var onFileLoadError = null;
    var onFileLoadSuccess = null;

    var checkIfFileNameIsValid = function (fileName) {
        var isFileNameJavaScript = (/^[a-z\d_\.\\:]+\.js$/i).test(fileName);
		var isFileNameTestFile = (/^[a-z\d_\.\\:]+\.spec\.js$/).test(fileName);

        if (isFileNameTestFile || !isFileNameJavaScript) {
            return false;
        }
        return true;
    };

    var getOpenedFileName = function() {
        return openedFileName.toString();
    }

    var getDataFromFile = function(event) {
        var input = event.target;
        var reader = new FileReader();

        reader.onload = function() {
            var rawFileData = reader.result;
            if (typeof onFileLoadSuccess === 'function') {
                onFileLoadSuccess(rawFileData);
            }
        };

        try {
            openedFileName = input.files[0].name;
            if(!checkIfFileNameIsValid(openedFileName) && typeof onFileLoadError === 'function') {
                onFileLoadError('Chosen File was invalid!');
            } else {
                reader.readAsText(input.files[0]);
            }
        } catch(err) {
            if (typeof onFileLoadError === 'function') {
                onFileLoadError('Chosen File was invalid!');
            }
        }
    };

    var saveDataToFile = function (dataToSave) {
        var file = new Blob([dataToSave], {type: 'file'});
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = openedFileName.replace('.js', '.spec.js');
        document.body.appendChild(a);
        a.click();

        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    };

    var setFileLoadErrorListener = function (listener) {
        onFileLoadError = listener;  
    };

     var setFileLoadSuccessListener = function (listener) {
        onFileLoadSuccess = listener;  
    };

    return {
        getOpenedFileName: getOpenedFileName,
        getDataFromFile: getDataFromFile,
        saveDataToFile: saveDataToFile,
        setFileLoadErrorListener: setFileLoadErrorListener,
        setFileLoadSuccessListener: setFileLoadSuccessListener
    }
};