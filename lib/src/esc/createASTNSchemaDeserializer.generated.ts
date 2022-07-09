/*eslint
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-shadow": 0,
    "camelcase": 0,
    "dot-notation": 0,
    "no-underscore-dangle": 0,
    "quote-props": 0
*/

import * as pr from "pareto-runtime"
import * as pl from "pareto-lib-core"
import * as pa from "pareto-api-core"

import * as x from "astn-typedtreehandler-api"

import { IRequiredValueHandler, ITreeHandler, IValueHandler } from "astn-handlers-api"
import { IExpectContext } from "astn-typedtreehandler-api"

type AnnotatedString<Annotation> = {
    value: string
    annotation: Annotation
}

export function createASTNSchemaDeserializer<EventAnnotation>(
    context: IExpectContext<EventAnnotation>,
    raiseValidationError: (message: string, annotation: EventAnnotation) => void,
    callback: (result: x.__root_T | null) => void,
): ITreeHandler<EventAnnotation> {
    const resolveRegistry = pr.createResolveRegistry<EventAnnotation>()

    function wrap(handler: IValueHandler<EventAnnotation>): IRequiredValueHandler<EventAnnotation> {
        return {
            exists: handler,
            missing: () => { },
        }
    }
    function _generateHandler_root(
        callback: (out: x.__root_T) => void,
    ): IValueHandler<EventAnnotation> {
        return ((callback: (out: x.__root_T) => void) => {
            let _root_type_v: AnnotatedString<EventAnnotation> | null = null
            const _types_v = pl.createDictionaryBuilder<x.__types_T>()
            return context.expectVerboseGroup({
                properties: {
                    "root type": {
                        onNotExists: () => { /**/ },
                        onExists: () => wrap(context.expectQuotedString({
                            warningOnly: true,
                            callback: ($) => {
                                _root_type_v = {
                                    annotation: $.token.annotation,
                                    value: $.token.token.value,
                                }
                            },
                        })),
                    },
                    "types": {
                        onNotExists: () => { /**/ },
                        onExists: () => wrap(context.expectDictionary({
                            onProperty: (propertyData) => {
                                return wrap(((callback: (out: x.__types_T) => void) => {
                                    let _value_v: x.__value_T | null = null
                                    return context.expectVerboseGroup({
                                        properties: {
                                            "value": {
                                                onNotExists: () => { /**/ },
                                                onExists: () => wrap(_generateHandler_value(
                                                    (node) => _value_v = node,
                                                    _types_v.toDictionary().getLookup(),
                                                )),
                                            },
                                        },
                                        onEnd: () => {
                                            if (_value_v === null) {
                                                _value_v = {
                                                    "type": [ "simple string", {
                                                        "default value": "",
                                                        "quoted": true,
                                                    } ],
                                                }
                                            }
                                            callback({
                                                "value": _value_v,
                                            })
                                        },
                                    })
                                })((node) => _types_v.add(propertyData.token.token.value, node)))
                            },
                        })),
                    },
                },
                onEnd: ($) => {
                    // if (_root_type_v === null) {
                    //     _root_type_v = ""
                    // }
                    callback({
                        "root type": pr.createReference(
                            "root type",
                            _root_type_v,
                            "root",
                            $.annotation,
                            _types_v.toDictionary().getLookup(),
                            resolveRegistry.getRegistrater(),
                        ),
                        "types": _types_v.toDictionary(),
                    })
                },
            })
        })((node) => callback(node))
    }

    function _generateHandler_simple_string(
        callback: (out: x.__simple_string_T) => void,
    ): IValueHandler<EventAnnotation> {
        return ((callback: (out: x.__simple_string_T) => void) => {
            let _default_value_v: string | null = null
            let _quoted_v: boolean | null = null
            return context.expectVerboseGroup({
                properties: {
                    "default value": {
                        onNotExists: () => { /**/ },
                        onExists: () => wrap(context.expectQuotedString({
                            warningOnly: true,
                            callback: ($) => {
                                _default_value_v = $.token.token.value
                            },
                        })),
                    },
                    "quoted": {
                        onNotExists: () => { /**/ },
                        onExists: () => wrap(context.expectTaggedUnion({
                            options: {
                                "yes": () => {
                                    return wrap(context.expectGroup({}))
                                },
                                "no": () => {
                                    _quoted_v = false
                                    return wrap(context.expectGroup({}))
                                },
                            },
                        })),
                    },
                },
                onEnd: () => {
                    if (_default_value_v === null) {
                        _default_value_v = ""
                    }
                    if (_quoted_v === null) {
                        _quoted_v = true
                    }
                    callback({
                        "default value": _default_value_v,
                        "quoted": _quoted_v,
                    })
                },
            })
        })((node) => callback(node))
    }

    function _generateHandler_value(
        callback: (out: x.__value_T) => void,
        types: pa.IReadonlyLookup<x.__types_T>,
    ): IValueHandler<EventAnnotation> {
        return ((callback: (out: x.__value_T) => void) => {
            let _type_v: x.__type_TU | null = null
            return context.expectVerboseGroup({
                properties: {
                    "type": {
                        onNotExists: () => { /**/ },
                        onExists: () => wrap(context.expectTaggedUnion({
                            options: {
                                "dictionary": () => {
                                    return wrap(((callback: (out: x.__dictionary_T) => void) => {
                                        let _key_v: x.__simple_string_T | null = null
                                        let _value_v: x.__value_T | null = null
                                        return context.expectVerboseGroup({
                                            properties: {
                                                "key": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(_generateHandler_simple_string(
                                                        (node) => _key_v = node
                                                    )),
                                                },
                                                "value": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(_generateHandler_value(
                                                        (node) => _value_v = node,
                                                        types,
                                                    )),
                                                },
                                            },
                                            onEnd: () => {
                                                if (_key_v === null) {
                                                    _key_v = {
                                                        "default value": "",
                                                        "quoted": true,
                                                    }
                                                }
                                                if (_value_v === null) {
                                                    _value_v = {
                                                        "type": [ "simple string", {
                                                            "default value": "",
                                                            "quoted": true,
                                                        } ],
                                                    }
                                                }
                                                callback({
                                                    "key": _key_v,
                                                    "value": _value_v,
                                                })
                                            },
                                        })
                                    })((node) => _type_v = ["dictionary", node]))
                                },
                                "group": () => {
                                    return wrap(((callback: (out: x.__group_T) => void) => {
                                        const _properties_v = pl.createDictionaryBuilder<x.__properties_T>()
                                        return context.expectVerboseGroup({
                                            properties: {
                                                "properties": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(context.expectDictionary({
                                                        onProperty: (propertyData) => {
                                                            return wrap(((callback: (out: x.__properties_T) => void) => {
                                                                let _value_v: x.__value_T | null = null
                                                                return context.expectVerboseGroup({
                                                                    properties: {
                                                                        "value": {
                                                                            onNotExists: () => { /**/ },
                                                                            onExists: () => wrap(_generateHandler_value(
                                                                                (node) => _value_v = node,
                                                                                types,
                                                                            )),
                                                                        },
                                                                    },
                                                                    onEnd: () => {
                                                                        if (_value_v === null) {
                                                                            _value_v = {
                                                                                "type": [ "simple string", {
                                                                                    "default value": "",
                                                                                    "quoted": true,
                                                                                } ],
                                                                            }
                                                                        }
                                                                        callback({
                                                                            "value": _value_v,
                                                                        })
                                                                    },
                                                                })
                                                            })((node) => _properties_v.add(propertyData.token.token.value, node)))
                                                        },
                                                    })),
                                                },
                                            },
                                            onEnd: () => {
                                                callback({
                                                    "properties": _properties_v.toDictionary(),
                                                })
                                            },
                                        })
                                    })((node) => _type_v = ["group", node]))
                                },
                                "list": () => {
                                    return wrap(((callback: (out: x.__list_T) => void) => {
                                        let _value_v: x.__value_T | null = null
                                        return context.expectVerboseGroup({
                                            properties: {
                                                "value": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(_generateHandler_value(
                                                        (node) => _value_v = node,
                                                        types,
                                                    )),
                                                },
                                            },
                                            onEnd: () => {
                                                if (_value_v === null) {
                                                    _value_v = {
                                                        "type": [ "simple string", {
                                                            "default value": "",
                                                            "quoted": true,
                                                        } ],
                                                    }
                                                }
                                                callback({
                                                    "value": _value_v,
                                                })
                                            },
                                        })
                                    })((node) => _type_v = ["list", node]))
                                },
                                "multiline string": () => {
                                    return wrap(((callback: (out: x.__multiline_string_T) => void) => {
                                        return context.expectVerboseGroup({
                                            properties: { },
                                            onEnd: () => {
                                                callback({ })
                                            },
                                        })
                                    })((node) => _type_v = ["multiline string", node]))
                                },
                                "simple string": () => {
                                    return wrap(((callback: (out: x.__simple_string_type_T) => void) => {
                                        let _default_value_v: string | null = null
                                        let _quoted_v: boolean | null = null
                                        return context.expectVerboseGroup({
                                            properties: {
                                                "default value": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(context.expectQuotedString({
                                                        warningOnly: true,
                                                        callback: ($) => {
                                                            _default_value_v = $.token.token.value
                                                        },
                                                    })),
                                                },
                                                "quoted": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(context.expectTaggedUnion({
                                                        options: {
                                                            "yes": () => {
                                                                return wrap(context.expectGroup({}))
                                                            },
                                                            "no": () => {
                                                                _quoted_v = false
                                                                return wrap(context.expectGroup({}))
                                                            },
                                                        },
                                                    })),
                                                },
                                            },
                                            onEnd: () => {
                                                if (_default_value_v === null) {
                                                    _default_value_v = ""
                                                }
                                                if (_quoted_v === null) {
                                                    _quoted_v = true
                                                }
                                                callback({
                                                    "default value": _default_value_v,
                                                    "quoted": _quoted_v,
                                                })
                                            },
                                        })
                                    })((node) => _type_v = ["simple string", node]))
                                },
                                "tagged union": () => {
                                    return wrap(((callback: (out: x.__tagged_union_T) => void) => {
                                        let _default_option_v: AnnotatedString<EventAnnotation> | null = null
                                        const _options_v = pl.createDictionaryBuilder<x.__options_T>()
                                        return context.expectVerboseGroup({
                                            properties: {
                                                "default option": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(context.expectQuotedString({
                                                        warningOnly: true,
                                                        callback: ($) => {
                                                            _default_option_v = {
                                                                value: $.token.token.value,
                                                                annotation: $.token.annotation,
                                                            }
                                                        },
                                                    })),
                                                },
                                                "options": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(context.expectDictionary({
                                                        onProperty: (propertyData) => {
                                                            return wrap(((callback: (out: x.__options_T) => void) => {
                                                                let _value_v: x.__value_T | null = null
                                                                return context.expectVerboseGroup({
                                                                    properties: {
                                                                        "value": {
                                                                            onNotExists: () => { /**/ },
                                                                            onExists: () => wrap(_generateHandler_value(
                                                                                (node) => _value_v = node,
                                                                                types,
                                                                            )),
                                                                        },
                                                                    },
                                                                    onEnd: () => {
                                                                        if (_value_v === null) {
                                                                            _value_v = {
                                                                                "type": [ "simple string", {
                                                                                    "default value": "",
                                                                                    "quoted": true,
                                                                                } ],
                                                                            }
                                                                        }
                                                                        callback({
                                                                            "value": _value_v,
                                                                        })
                                                                    },
                                                                })
                                                            })((node) => _options_v.add(propertyData.token.token.value, node)))
                                                        },
                                                    })),
                                                },
                                            },
                                            onEnd: ($) => {
                                                // if (_default_option_v === null) {
                                                //     _default_option_v = ""
                                                // }
                                                callback({
                                                    "default option": pr.createReference(
                                                        "default option",
                                                        _default_option_v,
                                                        "yes",
                                                        $.annotation,
                                                        _options_v.toDictionary().getLookup(),
                                                        resolveRegistry.getRegistrater(),
                                                    ),
                                                    "options": _options_v.toDictionary(),
                                                })
                                            },
                                        })
                                    })((node) => _type_v = ["tagged union", node]))
                                },
                                "type reference": () => {
                                    return wrap(((callback: (out: x.__type_reference_T) => void) => {
                                        let _type_v: AnnotatedString<EventAnnotation> | null = null
                                        return context.expectVerboseGroup({
                                            properties: {
                                                "type": {
                                                    onNotExists: () => { /**/ },
                                                    onExists: () => wrap(context.expectQuotedString({
                                                        warningOnly: true,
                                                        callback: ($) => {
                                                            _type_v = {
                                                                value: $.token.token.value,
                                                                annotation: $.token.annotation,
                                                            }
                                                        },
                                                    })),
                                                },
                                            },
                                            onEnd: ($) => {
                                                // if (_type_v === null) {
                                                //     _type_v = ""
                                                // }
                                                callback({
                                                    "type": pr.createReference(
                                                        "type",
                                                        _type_v,
                                                        "",
                                                        $.annotation,
                                                        types,
                                                        resolveRegistry.getRegistrater(),
                                                    ),
                                                })
                                            },
                                        })
                                    })((node) => _type_v = ["type reference", node]))
                                },
                            },
                        })),
                    },
                },
                onEnd: () => {
                    if (_type_v === null) {
                        _type_v = ["simple string", {
                            "default value": "",
                            "quoted": true,
                        }]
                    }
                    callback({
                        "type": _type_v,
                    })
                },
            })
        })((node) => callback(node))
    }

    return {
        "root": wrap(_generateHandler_root((root) => {
            const success = resolveRegistry.resolve(
                (error) => {
                    raiseValidationError(error.message, error.annotation)
                }
            )
            if (success) {
                callback(root)
            } else {
                callback(null)
            }
        })),
        onEnd: () => { },
    }
}