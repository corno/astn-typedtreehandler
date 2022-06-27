import * as astn from "astn-typedtreehandler-api"

import { createASTNSchemaDeserializer } from "./createASTNSchemaDeserializer.generated" //FIXME

export function createASTNSchemaBuilder<SchemaAnnotation, BodyAnnotation>(
    createExpectContext: astn.CreateExpectContext<SchemaAnnotation>,
    createDummyTypedHandler: astn.CreateDummyTypedHandler<BodyAnnotation>,
): astn.SchemaSchemaBuilder<SchemaAnnotation, BodyAnnotation> | null {
    return (onError2, onSchema) => {
        let foundErrors = false
        return createASTNSchemaDeserializer(
            createExpectContext({
                issueHandler: ($) => {
                    if ($.severity === ["error", {}]) {
                        onError2(["expect", $.issue], $.annotation)
                    }
                },
                duplicateEntrySeverity: ["warning", {}],
                onDuplicateEntry: ["ignore", {}],
            }),
            (message, annotation) => {
                foundErrors = true
                onError2(["validation", { message: message }], annotation)
            },
            (schema) => {
                if (schema === null) {
                    if (foundErrors === false) {
                        throw new Error("no schema, no errors")
                    }
                } else {
                    onSchema({
                        getSchema: () => schema,
                        createStreamingValidator: () => {
                            return createDummyTypedHandler()
                        },
                    })
                }
            },
        )
    }
}
