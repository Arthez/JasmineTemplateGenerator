var viewHelper = ViewHelper();
var dataService = DataService();
var fileService = FileService();

var NON_MOCKABLE_INJECTS;
var finalResult;

viewHelper.updateProgress('Initializing...');

var init = function () {
	NON_MOCKABLE_INJECTS = ['$q', '$rootScope'];
	finalResult = '';

	fileService.setFileLoadErrorListener(function (errorMessage) {
		viewHelper.updateProgress(errorMessage, false);
		viewHelper.disableSaveButton(true);
	});

	fileService.setFileLoadSuccessListener(function (rawFileData) {
		viewHelper.updateProgress('Processing data...');
	  	processFile(rawFileData);
	});

	viewHelper.disableOpenButton(false);
};

var prepareVariablesForNewFile = function () {
	finalResult = '';
	viewHelper.disableSaveButton(true);
	viewHelper.hideResults();
};

var onChooseFile = function () {
	viewHelper.resetFileInput();
};

var openFile = function(event) {
	prepareVariablesForNewFile();
	viewHelper.updateProgress('Loading file...');
	fileService.getDataFromFile(event);
};

var processFile = function (rawFileData) {
	var nonMockableCheckedInjects = viewHelper.getHelperInjectsStatus(NON_MOCKABLE_INJECTS);
	finalResult = dataService.extractFinalResult(rawFileData, nonMockableCheckedInjects);
	if (finalResult.error) {
		viewHelper.updateProgress(finalResult.error, false);
		viewHelper.disableSaveButton(true);
	} else {
		viewHelper.showResult(finalResult);
		viewHelper.updateProgress('Processing data successfully finished!', true);
		viewHelper.disableSaveButton(false);
	}
};

var saveFile = function () {
	if (finalResult) {
		fileService.saveDataToFile(finalResult);
	} else {
		viewHelper.updateProgress('There is no data to save!', false);
	}
};

init();
viewHelper.showHelperInjects(NON_MOCKABLE_INJECTS);
viewHelper.updateProgress('Waiting for user to load file...');