import * as def from "../types/definitions"
import * as tokens from "astn-handlers-api"

export type IGroupHandler<EventAnnotation> = {
    onUnexpectedProperty($: {
        token: tokens.SimpleStringToken<EventAnnotation> //cannot be shorthand, so there must be a token, so no null
        expectedProperties: string[]
        groupDefinition: def.GroupDefinition
    }): void
    onProperty($: {
        key: string
        token: null | tokens.SimpleStringToken<EventAnnotation>
        definition: def.ValueDefinition
    }): ITypedValueHandler<EventAnnotation>
    onClose($: {
        token: null | tokens.CloseObjectToken<EventAnnotation>
    }): void
}

export type IDictionaryHandler<EventAnnotation> = {
    onEntry($: {
        token: tokens.SimpleStringToken<EventAnnotation>
    }): ITypedValueHandler<EventAnnotation>
    onClose($: {
        token: null | tokens.CloseObjectToken<EventAnnotation>
    }): void
}

export type IListHandler<EventAnnotation> = {
    onClose($: {
        token: null | tokens.CloseArrayToken<EventAnnotation>
    }): void
    onElement($: { }): ITypedValueHandler<EventAnnotation>
}

export type ITypedTaggedUnionHandler<EventAnnotation> = {
    onOption($: {
        name: string
        token: null | tokens.SimpleStringToken<EventAnnotation>
        definition: def.OptionDefinition
    }): ITypedValueHandler<EventAnnotation>
    onUnexpectedOption($: {
        token: tokens.SimpleStringToken<EventAnnotation>
        expectedOptions: string[]
        defaultOption: string //the unmarshaller will initialize the default option.
    }): ITypedValueHandler<EventAnnotation>
    onEnd($: { }): void
}

export type IGroupType<EventAnnotation> =
    | ["verbose", tokens.OpenObjectToken<EventAnnotation>]
    | ["shorthand", tokens.OpenArrayToken<EventAnnotation>]
    | ["mixin", {}]
    | ["omitted", {}]

export type ITypedValueHandler<EventAnnotation> = {
    onGroup($: {
        type: IGroupType<EventAnnotation>
        definition: def.GroupDefinition
    }): IGroupHandler<EventAnnotation>
    onList($: {
        token: null | tokens.OpenArrayToken<EventAnnotation>
        definition: def.ListDefinition
    }): IListHandler<EventAnnotation>
    onDictionary($: {
        token: null | tokens.OpenObjectToken<EventAnnotation>
        definition: def.DictionaryDefinition
    }): IDictionaryHandler<EventAnnotation>
    onTypeReference($: {
        definition: def.TypeReferenceDefinition
    }): ITypedValueHandler<EventAnnotation>
    onTaggedUnion($: {
        definition: def.TaggedUnionDefinition
        token: null | tokens.TaggedUnionToken<EventAnnotation>
    }): ITypedTaggedUnionHandler<EventAnnotation>
    onSimpleString($: {
        value: string
        token: null | tokens.SimpleStringToken<EventAnnotation>
        definition: def.SimpleStringDefinition
    }): void
    onMultilineString($: {
        token: null | tokens.MultilineStringToken<EventAnnotation>
        definition: def.MultiLineStringDefinition
    }): void
}

export type ITypedTreeHandler<EventAnnotation> = {
    root: ITypedValueHandler<EventAnnotation>
    onEnd: ($: { }) => void
}