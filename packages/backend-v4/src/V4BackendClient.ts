import type * as bson from 'bson';
import * as defs from './definitions';
import * as sdk from '@journeyapps/common-sdk';
import { OplogPaginationParams, paginateOplog } from './pagination';

export type BackendClientOptions<C> = {
  account_id: bson.ObjectId;
  endpoint: string;
  client: C;
};

/** Public backend APIs for schema, deployment information, indexes, and oplog. */
export class V4BackendClient<C extends sdk.NetworkClient = sdk.NetworkClient> extends sdk.CodecSDKClient<C> {
  constructor(protected options: BackendClientOptions<C>) {
    super({ client: options.client, endpoint: options.endpoint });
  }

  getSchema = this.createEndpoint({
    path: sdk.join('/api/v4/', this.options.account_id.toHexString(), '/datamodel.json'),
    method: sdk.METHOD.GET,
    decoder: sdk.decodeResponse,
    codecs: { response: defs.V4Schema }
  });

  getInfo = this.createEndpoint({
    path: sdk.join('/api/v4/', this.options.account_id.toHexString(), '/info.json'),
    method: sdk.METHOD.GET,
    decoder: sdk.decodeResponse,
    codecs: { response: defs.V4Info }
  });

  getIndexes = this.createEndpoint({
    path: sdk.join('/api/v4/', this.options.account_id.toHexString(), '/indexes.json'),
    method: sdk.METHOD.GET,
    decoder: sdk.decodeResponse,
    codecs: { response: defs.V4Indexes }
  });

  getOpLog = paginateOplog(
    this.createEndpoint((params: OplogPaginationParams) => {
      const query = new URLSearchParams({ sequence_ids: 'true', start: '0' });
      for (const [key, value] of Object.entries(OplogPaginationParams.encode(params))) {
        if (value !== undefined) query.set(key, String(value));
      }
      return {
        path: `${sdk.join('/api/v4/', this.options.account_id.toHexString(), '/oplog.json')}?${query}`,
        method: sdk.METHOD.GET,
        decoder: sdk.decodeResponse,
        codecs: { request: OplogPaginationParams, response: defs.V4OPLogResponse }
      };
    })
  );
}
