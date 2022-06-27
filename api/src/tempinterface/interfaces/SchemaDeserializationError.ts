import { ExpectIssue } from "../types/ExpectIssue"

export type SchemaDeserializationError =
| ["validation", {
    "message": string
}]
| ["expect", ExpectIssue]
