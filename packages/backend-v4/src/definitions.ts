export interface V4Schema {
  models: { [name: string]: V4SchemaModel };
  app_user: string;
  datamodel_hash: string;
}

export interface V4Info {
  label: string;
  app_label: string;
  app_id: string;
  org_id: string;
  last_deployed_at: string;
  deployed_by_name: string;
  deployed_by_email: string;
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

export interface V4Index {
  key: {
    _id: string;
  };
  name: string;
  status: IndexStatus;
  type: IndexType;
  usage_stats: {
    queries: number;
    since: string;
  };
}

export interface V4Indexes {
  models: {
    [name: string]: {
      indexes: V4Index[];
    };
  };
}

export interface V4SchemaModel {
  name: string;
  label: string;
  display: string;
  fields: { [name: string]: V4SchemaModelField };
  belongs_to: {
    [name: string]: {
      model: string;
      name: string;
    };
  };
  has_many: {
    [name: string]: {
      model: string;
      name: string;
    };
  };
}

export type V4FieldType =
  | 'text'
  | 'integer'
  | 'number'
  | 'date'
  | 'datetime'
  | 'single-choice'
  | 'single-choice-integer'
  | 'boolean'
  | 'multiple-choice'
  | 'multiple-choice-integer'
  | 'photo'
  | 'signature'
  | 'track'
  | 'attachment';

export type V4FieldSubType =
  | 'text:email'
  | 'text:address'
  | 'text:name'
  | 'text:url'
  | 'text:paragraph'
  | 'text:number'
  | 'text:signed-number'
  | 'text:south-african-id'
  | 'text:phone-number'
  | 'text:decimal-number'
  | 'text:password';

export interface V4SchemaModelField {
  name: string;
  label: string;
  type: V4FieldType;
  subtype: V4FieldSubType;
}

export interface V4Object {
  id: string;
  type: string;
  updated_at: string;
  [key: string]: boolean | string | number | V4LocationValue;
}

export interface V4LocationValue {
  latitude: number;
  longitude: number;
  altitude: number;
  horizontal_accuracy: number;
  vertical_accuracy: number;
  timestamp: string;
}

export interface V4OPLogEntry {
  sequence: string;
  operation: 'update' | 'create' | 'delete';
  events: any[];
  object: V4Object;
}
