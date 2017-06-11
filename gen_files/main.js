var viewHelper = ViewHelper();
var dataService = DataService();

var finalResult = '';
var openedFileName = '';
var NON_MOCKABLE_INJECTS = ['$q', '$rootScope'];

var prepareVariablesForNewFile = function () {
	finalResult = '';
	openedFileName = '';
	viewHelper.disableSaveButton(true);
	viewHelper.hideResults();
};

var openFile = function(event) {
	viewHelper.updateProgress('Loading file...');
	prepareVariablesForNewFile();
	var input = event.target;

	var reader = new FileReader();
	reader.onload = function(){
	  var rawFileData = reader.result;
	  viewHelper.updateProgress('Loading file complete!', true);
	  processFile(rawFileData);
	};
	try {
		reader.readAsText(input.files[0]);
		openedFileName = input.files[0].name;
		if(checkIfFileNameIsValid(openedFileName)) {
			viewHelper.disableSaveButton(true);
			viewHelper.updateProgress('Chosen File was invalid!', false);
		}
	} catch(err) {
		viewHelper.updateProgress('Chosen File was invalid!', false);
	}
};

var checkIfFileNameIsValid = function (fileName) {
		var isFileNameTest = (/^[a-z\d_\.\\:]+\.spec\.js$/).test(fileName);
        viewHelper.disableSaveButton(isFileNameTest);
        if (isFileNameTest) {
            return false;
        }

        var isFileNameValid = (/^[a-z\d_\.\\:]+\.js$/i).test(fileName);
        return isFileNameValid;
};

var processFile = function (rawFileData) {
	viewHelper.updateProgress('Started processing data...');
	var nonMockableCheckedInjects = viewHelper.getHelperInjectsStatus(NON_MOCKABLE_INJECTS);
	finalResult = dataService.extractFinalResult(rawFileData, nonMockableCheckedInjects);
	if (finalResult.error) {
		viewHelper.updateProgress(finalResult.error, false);
	} else {
		viewHelper.showResult(finalResult);
		viewHelper.updateProgress('Processing data successfully finished!', true);
		viewHelper.disableSaveButton(false);
	}
};

var saveFile = function () {
    var file = new Blob([finalResult], {type: 'file'});

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

viewHelper.showHelperInjects(NON_MOCKABLE_INJECTS);
viewHelper.updateProgress('Waiting for user to load file...');