var DataService = function () {

    var finder = Finder();
    var jasmineCreator = JasmineCreator();

    var rawFileData = '';
    var cleanedFileData = '';
    var finalResult = '';

    var clearAllData = function () {
        rawFileData = '';
        cleanedFileData = '';
        finalResult = '';
    };

    var extractFinalResult = function (rawData, helpers) {
        _processFileData(rawData, helpers);
        return finalResult;
    };

    var getFinalResult = function () {
        return finalResult;
    };

    var _processFileData = function (rawData, helpers) {
        rawFileData = rawData;
        cleanedFileData = _getCleanedData();
        var fileElements = finder.findAll(cleanedFileData);
        if (fileElements.error) {
            finalResult = fileElements;
        } else {
            finalResult = _createFinalResult(fileElements, helpers);
        }
    };

    var _appendResult = function (text) {
        finalResult += text;
    };

    var _createFinalResult = function (fileElements, helpers) {
        var result = '';
        var allInjects = _classifyInjects(fileElements.injects, helpers);

        var resultParts = [
            jasmineCreator.describe_P1(0, fileElements.componentName),
            jasmineCreator.variableMocks(1, fileElements.typeOfFile, allInjects),
            jasmineCreator.beforeEach_P1(1),
            jasmineCreator.moduleName(2, fileElements.moduleName),
            jasmineCreator.injectMocks(2, allInjects),
            jasmineCreator.moduleProvider(2, allInjects),
            jasmineCreator.injectProvider(2, allInjects, fileElements.componentName, fileElements.typeOfFile),
            jasmineCreator.beforeEach_P2(1),
            jasmineCreator.baseMethodDescribes(1, fileElements.baseMethods),
            jasmineCreator.describe_P2(0, fileElements.baseMethods)
        ];

        resultParts.forEach(function (part) {
            result += part;
        });
        
        return result;
    };

    var _classifyInjects = function (injects, nonMockableInjects) {
        var result = [];

        nonMockableInjects.forEach(function (item) {
            if (item.isChecked) {
                result.push({name: item.name, isNonMockable: true});
            }
        });

        injects.forEach(function (inject) {
            var isNonMockable = result.filter(function (nonMockableInject) {
                return nonMockableInject.name === inject;
            }).length > 0;
            if (!isNonMockable) {
                result.push({name: inject, isNonMockable: false});
            }
        });

        return result;
    };

    var _getCleanedData = function () {
        return rawFileData.replace(/\s*\n*\t*/gm, '');
    };

    return {
        clearAllData: clearAllData,
        extractFinalResult: extractFinalResult,
        getFinalResult: getFinalResult
    }
};

