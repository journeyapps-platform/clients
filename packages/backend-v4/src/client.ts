import * as defs from './definitions';
import * as sdk from '@journeyapps-labs/common-sdk';

export type BackendClientOptions<C> = {
  account_id: string;
  endpoint: string;
  client: C;
};

type OplogPaginationParams = {
  /**
   * Starting sequence number
   */
  start?: string;
  /**
   * Ending sequence number
   */
  end?: string;
  /**
   * How many to fetch at a time
   */
  limit?: number;
  /**
   * Fetch <limit> form the end of the oplog?
   */
  tail?: boolean;
};

type OplogPaginationResponse = {
  entries: defs.V4OPLogEntry[];
  has_more: boolean;
  next_request_start: string;
};

export const paginateOplog = <I extends OplogPaginationParams, O extends OplogPaginationResponse>(
  endpoint: (params: I) => Promise<O>
) => {
  return Object.assign(endpoint, {
    paginate: async function* (params: I) {
      let more = true;
      let start = params.start || 0;
      let request = {
        ...params,
        sequence_ids: true, // Required for the paging cursor to be returned
        start: start,
        limit: params.limit || 50
      };
      while (more) {
        const result = await endpoint(request);
        yield result;

        more = result.has_more;
        request.start = result.next_request_start;
      }
    }
  });
};

/**
 * API Client for working with the backend V4 API
 */
export class V4BackendClient<C extends sdk.NetworkClient = sdk.NetworkClient> extends sdk.SDKClient<C> {
  constructor(protected options: BackendClientOptions<C>) {
    super({
      client: options.client.augment({
        decoder: async (res) => {
          const data = await res.text();
          return JSON.parse(data);
        }
      }) as C,
      endpoint: options.endpoint
    });
  }

  /**
   * Fetch the schema from the backend
   */
  getSchema = this.createEndpoint<void, defs.V4Schema>({
    path: sdk.join('/api/v4/', this.options.account_id, '/datamodel.json'),
    method: sdk.METHOD.GET
  });

  /**
   * Fetch the schema from the backend
   */
  getInfo = this.createEndpoint<void, defs.V4Info>({
    path: sdk.join('/api/v4/', this.options.account_id, '/info.json'),
    method: sdk.METHOD.GET
  });

  /**
   * Fetch the schema from the backend
   */
  getIndexes = this.createEndpoint<void, defs.V4Indexes>({
    path: sdk.join('/api/v4/', this.options.account_id, '/indexes.json'),
    method: sdk.METHOD.GET
  });

  /**
   * Fetch the OpLog from the backend. Note that the paging mechanism does not work when reading the oplog in
   * reverse order when the tail=true parameter is set
   */
  getOpLog = paginateOplog(
    this.createEndpoint<OplogPaginationParams, OplogPaginationResponse>((params) => {
      const queryString = Object.entries(params)
        .map((entry) => entry[0] + '=' + entry[1])
        .join('&');

      return {
        path: `${sdk.join('/api/v4/', this.options.account_id, '/oplog.json')}?${queryString}`,
        method: sdk.METHOD.GET
      };
    })
  );
}
