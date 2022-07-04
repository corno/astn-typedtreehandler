import { Schema, ValueDefinition } from "astn-typedtreehandler-api"
import * as pl from "pareto-lang-lib"
import * as pr from "pareto-runtime"
import * as pa from "pareto-lang-api"
import { ContentToken } from "astn-tokenconsumer-api"

export function serializeSchema(
    schema: Schema,
    sendEvent: (event: ContentToken) => void,
): void {
    function serializeDictionary<T>(
        dict: pa.IReadonlyDictionary<T>,
        entryCallback: (t: T) => void,
    ) {
        sendEvent(["structural", {
            "type": ["open dictionary", {}],
        }])
        dict.toArray().forEach((entry) => {
            sendEvent(["simple string", {
                value: entry.key,
                wrapping: ["quote", {}],
            }])
            entryCallback(entry.value)
        })
        sendEvent(["structural", {
            "type": ["close dictionary", {}],
        }])
    }

    function serializeVerboseType(
        properties: { [key: string]: () => void }
    ) {
        sendEvent(["structural", {
            "type": ["open verbose group", {}],
        }])
        pr.Objectkeys(properties).sort().forEach((key) => {
            sendEvent(["simple string", {
                value: key,
                wrapping: ["apostrophe", {}],
            }])
            properties[key]()
        })
        sendEvent(["structural", {
            "type": ["close verbose group", {}],
        }])
    }
    function serializeTaggedUnion(option: string, callback: () => void) {
        sendEvent(["structural", {
            "type": ["tagged union start", {}],
        }])
        sendEvent(["simple string", {
            value: option,
            wrapping: ["apostrophe", {}],
        }])
        callback()
    }
    function serializeQuotedString(value: string) {
        sendEvent(["simple string", {
            value: value,
            wrapping: ["quote", {}],
        }])
    }
    function serializeReference<T>(reference: pa.IReference<T>) {
        sendEvent(["simple string", {
            value: reference.name,
            wrapping: ["quote", {}],
        }])
    }

    function serializeNonWrappedString(value: string) {
        sendEvent(["simple string", {
            value: value,
            wrapping: ["none", {}],
        }])
    }


    function serializeValueDefinition(valueDefinition: ValueDefinition) {
        serializeVerboseType({
            type: () => {
                serializeTaggedUnion(valueDefinition.type[0], () => {
                    switch (valueDefinition.type[0]) {
                        case "dictionary": {
                            const $$ = valueDefinition.type[1]
                            serializeVerboseType({
                                "key": () => {
                                    serializeVerboseType({
                                        "default value": () => {
                                            serializeQuotedString($$.key["default value"])
                                        },
                                        "quoted": () => {
                                            serializeNonWrappedString($$.key.quoted ? "true" : "false")
                                        },
                                    })
                                },
                                "value": () => {
                                    serializeValueDefinition($$.value)
                                },
                            })
                            break
                        }
                        case "list": {
                            const $$ = valueDefinition.type[1]
                            serializeVerboseType({
                                "value": () => {
                                    serializeValueDefinition($$.value)
                                },
                            })
                            break
                        }
                        case "type reference": {
                            const $ = valueDefinition.type[1]
                            serializeVerboseType({
                                type: () => {
                                    serializeReference($.type)
                                },
                            })
                            break
                        }
                        case "tagged union": {
                            const $ = valueDefinition.type[1]
                            serializeVerboseType({
                                "default option": () => {
                                    serializeReference($["default option"])
                                },
                                "options": () => {
                                    serializeDictionary(
                                        $.options,
                                        (state) => {
                                            serializeVerboseType({
                                                node: () => serializeValueDefinition(state.value),
                                            })
                                        },
                                    )
                                },

                            })
                            break
                        }
                        case "simple string": {
                            const $ = valueDefinition.type[1]
                            serializeVerboseType({
                                "default value": () => {
                                    serializeQuotedString($["default value"])
                                },
                                "quoted": () => {
                                    serializeNonWrappedString($.quoted ? "true" : "false")
                                },
                            })
                            break
                        }
                        case "multiline string": {
                            //const $ = propDef.type[1]
                            serializeVerboseType({})
                            break
                        }
                        case "group": {
                            const $ = valueDefinition.type[1]
                            serializeVerboseType({
                                properties: () => {
                                    serializeDictionary(
                                        $.properties,
                                        ($) => {
                                            serializeValueDefinition($.value)
                                        },
                                    )
                                },
                            })
                            break
                        }
                        default:
                            pl.au(valueDefinition.type[0])
                    }
                })
            },
        })
    }
    serializeVerboseType({
        "component types": () => {
            serializeDictionary(
                schema.types,
                (entry) => {
                    serializeVerboseType({
                        node: () => serializeValueDefinition(entry.value),
                    })
                },
            )
        },
        "root type": () => {
            serializeReference(schema["root type"])
        },
    })
}