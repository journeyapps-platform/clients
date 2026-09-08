import * as t from 'ts-codec';

export const OplogPaginationParams = t.object({
  /** Starting sequence number. */
  start: t.string.optional(),
  /** Ending sequence number. */
  end: t.string.optional(),
  limit: t.number.optional(),
  /** Read from the end of the oplog. Automatic pagination is only supported in forward order. */
  tail: t.boolean.optional()
});
export type OplogPaginationParams = t.Decoded<typeof OplogPaginationParams>;

export const OplogPaginationResponse = t.object({
  has_more: t.boolean,
  next_request_start: t.string
});
export type OplogPaginationResponse = t.Decoded<typeof OplogPaginationResponse>;

export const paginateOplog = <I extends OplogPaginationParams, O extends OplogPaginationResponse>(
  endpoint: (params: I) => Promise<O>
) =>
  Object.assign(endpoint, {
    paginate: async function* (params: I) {
      if (params.tail) {
        throw new Error('Oplog pagination does not support tail=true. Use a single getOpLog request instead.');
      }
      let request = { ...params, start: params.start ?? '0', limit: params.limit ?? 50 };
      while (true) {
        const result = await endpoint(request);
        yield result;
        if (!result.has_more) return;
        request.start = result.next_request_start;
      }
    }
  });
