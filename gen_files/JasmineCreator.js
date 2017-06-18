var JasmineCreator = function () {

    var describe_P1 = function (tabLevel, descText) {
        return _addTabs(tabLevel) + 'describe(\'' + descText + '\', function () {\n';
    };

    var describe_P2 = function (tabLevel) {
        return _addTabs(tabLevel) + '});\n'
    };

    var beforeEach_P1 = function (tabLevel) {
        return _addTabs(tabLevel) + 'beforeEach(function () {\n';
    };

    var beforeEach_P2 = function (tabLevel) {
        return _addTabs(tabLevel) + '});\n\n'
    };

    var variableMocks = function (tabLevel, typeOfFile, allInjects) {
        var result = _addTabs(tabLevel);
        result += 'var ' + typeOfFile + ';\n';

        allInjects.forEach(function (inject) {
            result += _addTabs(tabLevel);
            if (inject.isNonMockable) {
                result += 'var ' + inject.name + ';\n';
            } else {
                result += 'var ' + inject.name + 'Mock;\n';
            }
        });
        result += '\n';
        
        return result;
    };

    var moduleName = function (tabLevel, moduleName) {
        return _addTabs(tabLevel) + 'module(\'' + moduleName + '\');\n\n';
    };

    var injectMocks = function (tabLevel, allInjects) {
        var result = '';
        
        allInjects.forEach(function (inject) {
            if (!inject.isNonMockable) {
                result += _addTabs(tabLevel);
                result += inject.name + 'Mock = jasmine.createSpyObj(\'' + inject.name + '\', [';
                result += inject.methods.join(', ');
                result += ']);';
                result += '\n\n';
            }
        });

        return result;
    };

    var moduleProvider = function (tabLevel, allInjects) {
        var result = _addTabs(tabLevel);
        result += 'module(function ($provide) {\n';
        
        allInjects.forEach(function (inject) {
            if (!inject.isNonMockable) {
                result += _addTabs(tabLevel + 1);
                result += '$provide.value(\'' + inject.name + '\', ' + inject.name + 'Mock);\n';
            }
        });
        
        result += _addTabs(tabLevel);
        result += '});\n\n';
        return result;
    };

    var injectProvider = function (tabLevel, allInjects, componentName, typeOfFile) {
        var result = _addTabs(tabLevel);
        result += 'inject(function (';
        
        var nonMockableInjects = allInjects.filter(function (inject) {
            return inject.isNonMockable;
        });
        nonMockableInjects.forEach(function (inject) {
            result += '_' + inject.name + '_, ';
        });
        result += componentName + ') {\n';
        nonMockableInjects.forEach(function (inject) {
            result += _addTabs(tabLevel + 1);
            result += inject.name + ' = _' + inject.name + '_;\n';
        });
        if (nonMockableInjects.length > 0) {
            result += '\n';
        } 

        result += _addTabs(tabLevel + 1);
        result += typeOfFile + ' = ' + componentName + ';\n';
        result += _addTabs(tabLevel);
        result += '});\n';
        
        return result;
    };

    var baseMethodDescribes = function (tabLevel, baseMethods) {
        var result = '';
        
        baseMethods.forEach(function (item) {
            result += _addTabs(tabLevel);
            result += 'describe(\'' + item.name + '\', function () {\n\n';
            result += _addTabs(tabLevel);
            result += '});\n\n';
        });
        
        return result;
    };

    var it_P1 = function (tabLevel) {
        return _addTabs(tabLevel) + 'it(function (\'should \') {\n';
    };

    var it_P2 = function (tabLevel) {
        return _addTabs(tabLevel) + '});\n\n'
    };

    var todoComment = function (comment) {
        return ' \/\/ TODO: ' + comment;
    };

    var _addTabs = function (tabLevel) {
        var result = '';
        tabLevel = tabLevel || 0;
        for (var index = 0; index < tabLevel; index++) {
            result += '\t';
        }
        return result;
    };

    return {
        baseMethodDescribes: baseMethodDescribes,
        beforeEach_P1: beforeEach_P1,
        beforeEach_P2: beforeEach_P2,
        describe_P1: describe_P1,
        describe_P2: describe_P2,
        injectMocks: injectMocks,
        injectProvider: injectProvider,
        it_P1: it_P1,
        it_P2: it_P2,
        moduleName: moduleName,
        moduleProvider: moduleProvider,
        todoComment: todoComment,
        variableMocks: variableMocks
    }
};