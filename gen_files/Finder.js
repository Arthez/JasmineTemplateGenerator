var Finder = function () {

    var findAll = function (fileDataText) {
        var typeOfFile = findTypeOfFile(fileDataText);
        if (typeOfFile === 'UNKOWN_TYPE') {
            return {error: 'File type not supported!'};
        }

        var baseMethods = _findBaseMethods(fileDataText);
        var componentName = _findComponentName(fileDataText);
        var injects = _findInjects(fileDataText);
        var moduleName = _findModuleName(fileDataText);

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
        var typeServiceRegEx = /\.service\('[a-z\d]{2,}'/gmi;
        var isService = Boolean(typeServiceRegEx.exec(fileDataText));
        if (isService) {
            return 'service';
        }

        // TODO: process controller
        // var typeControllerRegEx = /\.controller\('[a-z\d]{2,}'/gmi;
        // var isController = Boolean(typeControllerRegEx.exec(fileDataText));
        // if (isController) {
        //     return 'controller';
        // }

        // TODO: process factory
        // var typeFactoryRegEx = /\.factory\('[a-z\d]{2,}'/gmi;
        // var isFactory = Boolean(typeFactoryRegEx.exec(fileDataText));
        // if (isFactory) {
        //     return 'factory';
        // }

        return 'UNKOWN_TYPE';
    };

    var _findBaseMethods = function (fileDataText) {
        var baseFunctionRegEx = /this\.[_a-z]{2,}=function\(([a-z]{2,},?([a-z,\d]{2,}))*\){/gmi;
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

    var _findComponentName = function (fileDataText) {
        var componentNameRegEx = /\.service\('[a-z\d]{2,}'/gmi;
        var result = componentNameRegEx.exec(fileDataText);
        result = result ? result[0] : '';
        result = result.replace(/\.service\(/gm, '');
        result = result.replace(/'/gm, '');
        return result;
    };

    var _findInjects = function (fileDataText) {
        var injectsRegEx = /,\[('[\$a-z]{2,}'),(function|(('[\$a-z]{2,}'),)*)/gmi;
        var result = injectsRegEx.exec(fileDataText);
        result = result ? result[0] : '';
        result = result.replace(/\[*'*/gm, '');
        result = result.split(',');
        result = result.filter(function (item) {return !!item;})
        return result;
    };

    var _findModuleName = function (fileDataText) {
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