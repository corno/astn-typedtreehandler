/*eslint
    "camelcase": 0,
    "no-underscore-dangle": 0,
    "quote-props": 0
*/
import * as pr from "pareto-api-core"

export type __types_T = {
    readonly "value": __value_T
}

export type __root_T = {
    readonly "root type": pr.IReference<__types_T>
    readonly "types": pr.IReadonlyDictionary<__types_T>
}

export type __simple_string_T = {
    readonly "default value": string
    readonly "quoted": boolean
}

export type __dictionary_T = {
    readonly "key": __simple_string_T
    readonly "value": __value_T
}

export type __properties_T = {
    readonly "value": __value_T
}

export type __group_T = {
    readonly "properties": pr.IReadonlyDictionary<__properties_T>
}

export type __list_T = {
    readonly "value": __value_T
}

export type __multiline_string_T = { }

export type __simple_string_type_T = {
    readonly "default value": string
    readonly "quoted": boolean
}

export type __options_T = {
    readonly "value": __value_T
}

export type __tagged_union_T = {
    readonly "default option": pr.IReference<__options_T>
    readonly "options": pr.IReadonlyDictionary<__options_T>
}

export type __type_reference_T = {
    readonly "type": pr.IReference<__types_T>
}

export type __type_TU =
    | ["dictionary", __dictionary_T]
    | ["group", __group_T]
    | ["list", __list_T]
    | ["multiline string", __multiline_string_T]
    | ["simple string", __simple_string_type_T]
    | ["tagged union", __tagged_union_T]
    | ["type reference", __type_reference_T]

export type __value_T = {
    readonly "type": __type_TU
}
