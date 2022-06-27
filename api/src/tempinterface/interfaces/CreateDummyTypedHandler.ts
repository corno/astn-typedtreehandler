import { ITypedTreeHandler } from "../../interface";

export type CreateDummyTypedHandler<EventAnnotation> = () => ITypedTreeHandler<EventAnnotation>