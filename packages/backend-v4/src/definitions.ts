// Referenced by inferred codec declarations.
import type * as bson from 'bson';
import * as t from 'ts-codec';
import * as codecs from '@journeyapps/micro-codecs';
import { OplogPaginationResponse } from './pagination';
import { nullish } from './nullish';

export enum V4FieldType {
  TEXT = 'text',
  INTEGER = 'integer',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  SINGLE_CHOICE = 'single-choice',
  SINGLE_CHOICE_INTEGER = 'single-choice-integer',
  BOOLEAN = 'boolean',
  MULTIPLE_CHOICE = 'multiple-choice',
  MULTIPLE_CHOICE_INTEGER = 'multiple-choice-integer',
  PHOTO = 'photo',
  SIGNATURE = 'signature',
  TRACK = 'track',
  ATTACHMENT = 'attachment',
  LOCATION = 'location'
}

export enum V4FieldSubType {
  EMAIL = 'email',
  ADDRESS = 'address',
  NAME = 'name',
  URL = 'url',
  PARAGRAPH = 'paragraph',
  NUMBER = 'number',
  SIGNED_NUMBER = 'signed-number',
  SOUTH_AFRICAN_ID = 'south-african-id',
  PHONE_NUMBER = 'phone-number',
  DECIMAL_NUMBER = 'decimal-number',
  PASSWORD = 'password',
  PHONE_NUMBER_ZA = 'phone-number-za'
}

export enum IndexType {
  INTERNAL = 'internal',
  ADHOC = 'adhoc',
  SCHEMA = 'schema'
}

export enum IndexStatus {
  PENDING = 'pending',
  READY = 'ready'
}

export enum OplogOperation {
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete'
}

export const V4SchemaChoice = t.object({ key: t.string.or(t.number).or(t.boolean), display: t.string });
export type V4SchemaChoice = t.Decoded<typeof V4SchemaChoice>;

export const V4SchemaModelField = t.object({
  name: t.string,
  label: nullish(t.string),
  type: t.Enum(V4FieldType),
  subtype: nullish(t.Enum(V4FieldSubType)),
  options: t.array(V4SchemaChoice).optional()
});
export type V4SchemaModelField = t.Decoded<typeof V4SchemaModelField>;

export const V4SchemaRelationship = t.object({ model: t.string, name: t.string, inverse_of: nullish(t.string) });
export type V4SchemaRelationship = t.Decoded<typeof V4SchemaRelationship>;

export const V4SchemaModel = t.object({
  name: t.string,
  label: nullish(t.string),
  display: nullish(t.string),
  fields: t.record(V4SchemaModelField),
  belongs_to: t.record(V4SchemaRelationship),
  has_many: t.record(V4SchemaRelationship)
});
export type V4SchemaModel = t.Decoded<typeof V4SchemaModel>;

export const V4Schema = t.object({
  models: t.record(V4SchemaModel),
  app_user: nullish(t.string),
  datamodel_hash: t.string
});
export type V4Schema = t.Decoded<typeof V4Schema>;

export const V4Info = t.object({
  label: nullish(t.string),
  app_label: nullish(t.string),
  app_id: nullish(codecs.ObjectId),
  org_id: nullish(codecs.ObjectId),
  region: nullish(t.string),
  environment: nullish(t.string),
  last_deployed_at: nullish(codecs.date),
  deployed_by_name: nullish(t.string),
  deployed_by_email: nullish(t.string)
});
export type V4Info = t.Decoded<typeof V4Info>;

export const V4IndexUsageStats = t.object({ queries: t.number, since: codecs.date });
export type V4IndexUsageStats = t.Decoded<typeof V4IndexUsageStats>;

export const V4Index = t.object({
  key: t.record(t.number.or(t.string)),
  name: t.string,
  status: t.Enum(IndexStatus),
  type: t.Enum(IndexType),
  usage_stats: nullish(V4IndexUsageStats)
});
export type V4Index = t.Decoded<typeof V4Index>;

export const V4Indexes = t.object({ models: t.record(t.object({ indexes: t.array(V4Index) })) });
export type V4Indexes = t.Decoded<typeof V4Indexes>;

export const V4LocationValue = t.object({
  latitude: t.number,
  longitude: t.number,
  altitude: nullish(t.number),
  horizontal_accuracy: nullish(t.number),
  vertical_accuracy: nullish(t.number),
  timestamp: nullish(codecs.date)
});
export type V4LocationValue = t.Decoded<typeof V4LocationValue>;

// App fields are defined by each application's schema and may include nested attachments or relationships.
export const V4Object = t.record(t.any).and(
  t.object({
    id: t.string,
    type: t.string,
    updated_at: codecs.date
  })
);
export type V4Object = t.Decoded<typeof V4Object>;

export const V4OPLogEntry = t.object({
  sequence_id: t.string,
  app_id: nullish(codecs.ObjectId),
  operation: t.Enum(OplogOperation),
  events: t.array(t.any),
  object: V4Object
});
export type V4OPLogEntry = t.Decoded<typeof V4OPLogEntry>;

export const V4OPLogResponse = OplogPaginationResponse.and(
  t.object({
    entries: t.array(V4OPLogEntry),
    datamodel_hash: t.string
  })
);
export type V4OPLogResponse = t.Decoded<typeof V4OPLogResponse>;
