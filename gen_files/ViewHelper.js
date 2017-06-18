var ViewHelper = function () {

    var disableOpenButton = function (disable) {
        document.getElementById('load_file_button').disabled = disable;
    };

    var disableSaveButton = function (disable) {
        document.getElementById('save_file_button').disabled = disable;
    };

    var hideHelperInjects = function () {
        document.getElementById('helper_injects').innerHTML = '';
    };

    var showHelperInjects = function (helpers) {
        var checkboxGroup = '';
        checkboxGroup += '<div class="checkbox-group"><strong>Non mockable injects to include: </strong>';
        helpers.forEach(function(helper) {
            checkboxGroup += '<input class="checkbox-input" type="checkbox" id="helper_' + helper + '">' + helper + '</input>';
        });
        checkboxGroup += '</div>';
        document.getElementById('helper_injects').innerHTML = checkboxGroup;
    };

    var getHelperInjectsStatus = function (helpers) {
        var result = [];
        var checkbox;
        helpers.forEach(function (helperName) {
            checkbox = document.getElementById('helper_' + helperName);
            if (checkbox) {
                result.push({
                    name: helperName,
                    isChecked: checkbox.checked
                });
            }
        });

        return result;
    };

    var hideResults = function () {
        document.getElementById('result_title').innerHTML = '';
        var resultTextElement = document.getElementById('result_text');
        resultTextElement.innerHTML = '';
        resultTextElement.className = '';
    };

    var showResult = function (result) {
        document.getElementById('result_title').innerHTML = 'Result: ';
        var resultTextElement = document.getElementById('result_text');
        resultTextElement.innerHTML = result;
        resultTextElement.className = 'result-text';
    };

    var resetFileInput = function () {
        document.getElementById('load_file_button').value = null;
    };

    var updateProgress = function (text, isSuccess) {
        var progressText = document.getElementById('progress_text');
        progressText.innerHTML = text;
        if (isSuccess === true) {
            progressText.style.color = 'yellowgreen ';
        } else if (isSuccess === false) {
            progressText.style.color = 'red';
        } else {
            progressText.style.color = 'black';
        }
    };

    return {
        disableOpenButton: disableOpenButton,
        disableSaveButton: disableSaveButton,
        hideHelperInjects: hideHelperInjects,
        showHelperInjects: showHelperInjects,
        getHelperInjectsStatus: getHelperInjectsStatus,
        hideResults: hideResults,
        showResult: showResult,
        resetFileInput: resetFileInput,
        updateProgress, updateProgress,
    };
};