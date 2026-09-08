import * as t from 'ts-codec';

export const nullish = <C extends t.AnyCodec>(codec: C) => t.optional(t.union(codec, t.Null));
