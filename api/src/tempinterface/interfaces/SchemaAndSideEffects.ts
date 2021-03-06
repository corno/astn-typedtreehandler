import { ITypedTreeHandler, Schema } from "../../interface"
import { DiagnosticSeverity } from "../types/DiagnosticSeverity"


export type ISchemaAndSideEffects<EventAnnotation> = {
    getSchema: () => Schema
    createStreamingValidator: (
        onValidationError: (message: string, annotation: EventAnnotation, severity: DiagnosticSeverity) => void,
    ) => ITypedTreeHandler<EventAnnotation>
}