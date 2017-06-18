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
        return _processFileData(rawData, helpers);
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
            var allElements = _extractAllElements(fileElements, helpers);
            finalResult = _createFinalResult(allElements);
        }
        return finalResult;
    };

    var _appendResult = function (text) {
        finalResult += text;
    };

    var _createFinalResult = function (allElements) {
        var result = '';

        var resultParts = [
            jasmineCreator.describe_P1(0, allElements),
            jasmineCreator.variableMocks(1, allElements),
            jasmineCreator.beforeEach_P1(1),
            jasmineCreator.moduleName(2, allElements),
            jasmineCreator.injectMocks(2, allElements),
            jasmineCreator.moduleProvider(2, allElements),
            jasmineCreator.injectProvider(2, allElements),
            jasmineCreator.beforeEach_P2(1),
            jasmineCreator.baseMethodDescribes(1, allElements),
            jasmineCreator.describe_P2(0)
        ];

        resultParts.forEach(function (part) {
            result += part;
        });
        
        return result;
    };

    var _classifyInjects = function (injects, nonMockableInjects) {
        var result = [];

        var helpers = nonMockableInjects.map(function (inject) {
            return inject.name;
        });

        nonMockableInjects.forEach(function (item) {
            if (item.isChecked) {
                result.push({isNonMockable: true, name: item.name, methods: []});
            }
        });

        var nonMockableInResult = result.slice();

        injects.forEach(function (inject) {
            var isNonMockable = helpers.filter(function (nonMockableInject) {
                return nonMockableInject === inject.name;
            }).length > 0;
            var isAlreadyInResult = nonMockableInResult.filter(function (item) {
                return item.name === inject.name;
            }).length > 0;
            if (!isAlreadyInResult) {
                result.push({isNonMockable: isNonMockable, name: inject.name, methods: inject.methods});
            }
        });

        return result;
    };

    var _extractAllElements = function (fileElements, helpers) {
        var allInjects = _classifyInjects(fileElements.injects, helpers);
        allInjects = _removeDuplicatedMethods(allInjects);
        allInjects = _removeInjectsWithoutMethods(allInjects);
        allInjects = _sortInjects(allInjects);
        var baseMethods = _sortBaseMethods(fileElements.baseMethods);

        return {
            allInjects: allInjects,
            baseMethods: baseMethods,
            componentName: fileElements.componentName,
            moduleName: fileElements.moduleName,
            typeOfFile: fileElements.typeOfFile
        };
    };

    var _getCleanedData = function () {
        return rawFileData.replace(/\s*\n*\t*/gm, '');
    };

    var _sortByName = function (A, B) {
        var a = A.name.toLowerCase();
        var b = B.name.toLowerCase();
        return a !== b ? a < b ? -1 : 1 : 0;
    };

    var _removeDuplicatedMethods = function (allInjects) {
        var result = allInjects.slice();
        result.forEach(function (inject) {
            inject.methods = Array.from(new Set(inject.methods));
        });
        return result;
    };

    var _removeInjectsWithoutMethods = function (allInjects) {
        var result = allInjects.slice();
        result = result.filter(function (inject) {
            return inject.methods.length > 0;
        });
        return result;
    };

    var _sortInjects = function (allInjects) {
        var result = allInjects.slice();
        result.sort(_sortByName);
        result.forEach(function (inject) {
            inject.methods.sort();
        });
        return result;
    };

    var _sortBaseMethods = function (baseMethods) {
        var result = baseMethods.slice();
        var privateMethods = result.filter(function (method) {
            return method.name[0] === '_';
        });
        var publicMethods = result.filter(function (method) {
            return method.name[0] !== '_';
        });

        privateMethods.sort(_sortByName);
        publicMethods.sort(_sortByName);
        result = publicMethods.concat(privateMethods);

        return result;
    };

    return {
        clearAllData: clearAllData,
        extractFinalResult: extractFinalResult,
        getFinalResult: getFinalResult
    }
};

