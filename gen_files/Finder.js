var Finder = function () {

    var findAll = function (fileDataText) {
        var typeOfFile = findTypeOfFile(fileDataText);
        if (!isFileTypeSupported(typeOfFile)) {
            return {error: 'File type not supported!'};
        }

        var baseMethods = _findBaseMethods(typeOfFile, fileDataText);
        var componentName = _findComponentName(typeOfFile, fileDataText);
        var injects = _findInjects(typeOfFile, fileDataText);
        var moduleName = _findModuleName(typeOfFile, fileDataText);

        if (!moduleName) {
            return {error: 'Problem with finding module name!'};
        } else if (!componentName) {
            return {error: 'Problem with finding component name!'};
        } else if (!injects) {
            return {error: 'Problem with finding injects!'};
        } else if (!baseMethods) {
            return {error: 'Problem with finding abse methods!'};
        }

        return {
            baseMethods: baseMethods,
            componentName: componentName,
            injects: injects,
            moduleName: moduleName,
            typeOfFile: typeOfFile
        };
    };

    var findTypeOfFile = function (fileDataText) {
        var typeRegEx = /angular\.module\('.{2,}'\)\.[a-z\d]{2,}\('/gmi;
        var fileType = typeRegEx.exec(fileDataText);
        if (fileType && fileType[0]) {
            fileType = fileType[0].replace(/angular\.module\('.{2,}'\)\./gmi, '').replace(/\('/gmi, '');
            return fileType;
        }

        return 'TYPE_NOT_SUPPORTED';
    };

    var isFileTypeSupported = function (fileType) {
        return fileType === 'controller' || fileType === 'factory' || fileType === 'service';
    };

    var _alphabeticalSort = function (A, B) {
        var a = A.toLowerCase();
        var b = B.toLowerCase();
        return a !== b ? a < b ? -1 : 1 : 0;
    };

    var _findBaseMethods = function (typeOfFile, fileDataText) {
        var baseFunctionRegEx = /this\.[_a-z]{2,}=function\(([a-z]{2,},?([a-z,\d]{2,}))*\)\{/gmi;
        var rawFunctions = [];
        
        var foundFunction;
        while(foundFunction = baseFunctionRegEx.exec(fileDataText)) {
            rawFunctions.push(foundFunction[0]);
        }
        
        var result = [];	
        rawFunctions.forEach(function (item) {
            var functionNameRegEx = /[_a-z\d]{2,}(?==function)/gmi;
            var functionParamsRegEx = /[a-z,\d]{2,}(?=\){)/gmi;

            var name = functionNameRegEx.exec(item);
            name = name ? name[0] : '';
            
            var params = functionParamsRegEx.exec(item);
            params = params ? params[0].split(',') : [];
        
            result.push({
                name: name,
                params: params
            });
        });
        return result;
    };

    var _findComponentName = function (typeOfFile, fileDataText) {
        var componentNameRegEx = /\.service\('[a-z\d]{2,}'/gmi;
        var result = componentNameRegEx.exec(fileDataText);
        result = result ? result[0] : '';
        result = result.replace(/\.service\(/gm, '');
        result = result.replace(/'/gm, '');
        return result;
    };

    var _findInjects = function (typeOfFile, fileDataText) {
        var injectsRegEx = /,\[('[\$a-z]{2,}'),(function|(('[\$a-z]{2,}'),)*)/gmi;
        var result = injectsRegEx.exec(fileDataText);
        result = result ? result[0] : '';
        result = result.replace(/\[*'*/gm, '');
        result = result.split(',');
        result = result.filter(function (item) {return !!item;})

        result = _findInjectMethods(result, fileDataText);

        return result;
    };

    var _findInjectMethods = function (foundInjectArray, fileDataText) {
        var result = [];
        
        foundInjectArray.forEach(function (inject) {
            var injectMethods = [];
            var injectMethodRegEx = new RegExp(inject + '\\.[_a-z\\d]{2,}\\(', 'gmi');

            var foundFunction;
            while(foundFunction = injectMethodRegEx.exec(fileDataText)) {
                foundFunction = foundFunction[0].replace(/.{2,}\./gmi, '').replace(/\(/, '');
                injectMethods.push(foundFunction);
            }

            injectMethods = injectMethods.sort(_alphabeticalSort);
            result.push({name: inject, methods: injectMethods});
        });
        // result.sort(_alphabeticalSort); // TODO
        return result;
    };

    var _findModuleName = function (typeOfFile, fileDataText) {
        var moduleNameRegEx = /angular\.module\('[a-z\.]{2,}'/gmi;
        var result = moduleNameRegEx.exec(fileDataText);
        result = result ? result[0] : '';
        result = result.replace(/angular\.module\(/gm, '');
        result = result.replace(/'/gm, '');
        return result;
    };

    return {
        findAll: findAll,
        findTypeOfFile: findTypeOfFile
    }
};