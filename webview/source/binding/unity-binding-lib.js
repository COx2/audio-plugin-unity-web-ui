let Module = null
let helperFunctions = null
const functionMap = new Map()

function __unity_getBinding(module, _helperFunctions, methodName) {
    Module = module
    helperFunctions = _helperFunctions
    return functionMap.get(methodName)
}

function bindFunction(methodName, func) {
    functionMap.set(methodName, func)
}