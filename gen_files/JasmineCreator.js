// TODO: this file needs refactor
var JasmineCreator = function () {

    var createTest = function (allElements) {
        var result = '';

        var resultParts = [
            describe_P1(0, allElements),
            variableMocks(1, allElements),
            beforeEach_P1(1),
            moduleName(2, allElements),
            injectMocks(2, allElements),
            moduleProvider(2, allElements),
            injectProvider(2, allElements),
            beforeEach_P2(1),
            baseMethodDescribes(1, allElements),
            describe_P2(0)
        ];

        resultParts.forEach(function (part) {
            result += part;
        });

        return result;
    };

    var describe_P1 = function (tabLevel, elements) {
        return _addTabs(tabLevel) + 'describe(\'' + elements.componentName + '\', function () {\n';
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

    var variableMocks = function (tabLevel, elements) {
        var result = _addTabs(tabLevel);
        if (elements.typeOfFile === 'factory') {
            result += 'var ' + elements.componentName + ';\n';
            result += _addTabs(tabLevel);
        }

        result += 'var ' + elements.typeOfFile + ';\n';

        elements.allInjects.forEach(function (inject) {
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

    var moduleName = function (tabLevel, elements) {
        return _addTabs(tabLevel) + 'module(\'' + elements.moduleName + '\');\n\n';
    };

    var injectMocks = function (tabLevel, elements) {
        var result = '';

        elements.allInjects.forEach(function (inject) {
            if (!inject.isNonMockable) {
                result += _addTabs(tabLevel);
                result += inject.name + 'Mock = jasmine.createSpyObj(\'' + inject.name + '\', [\'';
                result += inject.methods.join('\', \'');
                result += '\']);';
                result += '\n\n';
            }
        });

        return result;
    };

    var moduleProvider = function (tabLevel, elements) {
        if (elements.typeOfFile === 'controller') {
            return '';
        }

        var result = _addTabs(tabLevel);
        result += 'module(function ($provide) {\n';

        elements.allInjects.forEach(function (inject) {
            if (!inject.isNonMockable) {
                result += _addTabs(tabLevel + 1);
                result += '$provide.value(\'' + inject.name + '\', ' + inject.name + 'Mock);\n';
            }
        });

        result += _addTabs(tabLevel);
        result += '});\n\n';
        return result;
    };

    var injectProvider = function (tabLevel, elements) {
        var result = _addTabs(tabLevel);
        result += 'inject(function (';

        var nonMockableInjects = elements.allInjects.filter(function (inject) {
            return inject.isNonMockable;
        });
        nonMockableInjects.forEach(function (inject) {
            result += '_' + inject.name + '_, ';
        });

        if (elements.typeOfFile === 'factory') {
            result += '_' + elements.componentName + '_) {\n';
        } else if (elements.typeOfFile === 'controller') {
            result += '$controller) {\n';
        } else {
            result += elements.componentName + ') {\n';
        }

        nonMockableInjects.forEach(function (inject) {
            result += _addTabs(tabLevel + 1);
            result += inject.name + ' = _' + inject.name + '_;\n';
        });
        if (nonMockableInjects.length > 0) {
            result += '\n';
        }

        result += _addTabs(tabLevel + 1);

        if (elements.typeOfFile === 'factory') {
            result += elements.typeOfFile + ' = _' + elements.componentName + '_;\n';
        } else if (elements.typeOfFile === 'controller') {
            result += elements.typeOfFile + ' = $controller(\'' + elements.componentName + '\', {\n';
            elements.allInjects.forEach(function (inject, index, array) {
                if (!inject.isNonMockable) {
                    result += _addTabs(tabLevel + 2);
                    result += inject.name + ': ' + inject.name;
                    result += array.length === index + 1 ? 'Mock\n' : 'Mock,\n';
                }
            });

            result += _addTabs(tabLevel + 1);
            result += '});\n'
        } else {
            result += elements.typeOfFile + ' = ' + elements.componentName + ';\n';
        }

        result += _addTabs(tabLevel);
        result += '});\n';

        return result;
    };

    var baseMethodDescribes = function (tabLevel, elements) {
        var result = '';

        elements.baseMethods.forEach(function (item) {
            result += _addTabs(tabLevel);
            result += 'describe(\'' + item.name + '\', function () {\n';

            if (elements.typeOfFile === 'factory') {
                result += beforeEach_P1(tabLevel + 1);
                result += _addTabs(tabLevel + 2);
                result += elements.typeOfFile + ' = new ' + elements.componentName + '();\n';
                result += beforeEach_P2(tabLevel + 1);
            }

            result += _addTabs(tabLevel + 1);
            result += todoComment('implement test') + '\n';
            result += _addTabs(tabLevel + 1);
            result += 'it(\'should REPLACE_WITH_DESCRIPTION\', function () {\n';
            result += _addTabs(tabLevel + 2);
            result += elements.typeOfFile + '.' + item.name + '();\n';
            result += _addTabs(tabLevel + 1);
            result += '});\n';
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
        return '\/\/ TODO: ' + comment;
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
        createTest: createTest,
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
