import { ITreeHandler } from "astn-handlers-api"
import { ISchemaAndSideEffects } from "./SchemaAndSideEffects"
import { SchemaDeserializationError } from "./SchemaDeserializationError"

export type SchemaSchemaBuilder<SchemaAnnotation, BodyAnnotation> = (
    onSchemaError: (error: SchemaDeserializationError, annotation: SchemaAnnotation) => void,
    onSchema: (schema: ISchemaAndSideEffects<BodyAnnotation>) => void,
) => ITreeHandler<SchemaAnnotation>
