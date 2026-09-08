# Backend V4 Client

`@ja-platform/sdk-backend-v4` provides a typed HTTP client for JourneyApps' public backend API. Use it to inspect an app's data model, read deployment information, inspect database indexes, or consume the oplog.

## Operations

| Method | Purpose |
| --- | --- |
| `getSchema` | Read models, fields, choices, and relationships. |
| `getInfo` | Read deployment labels, ownership, and deployment metadata. |
| `getIndexes` | Inspect each model's indexes, build status, and usage statistics. |
| `getOpLog` | Read data changes; use `.paginate(...)` to iterate forward through pages. |

## Usage

```ts
import { createNodeNetworkClient } from '@journeyapps/common-sdk';
import { V4BackendClient } from '@ja-platform/sdk-backend-v4';
import { ObjectId } from 'bson';

const backend = new V4BackendClient({
  endpoint: 'https://backend.example.com',
  account_id: new ObjectId('507f1f77bcf86cd799439011'),
  client: createNodeNetworkClient({
    headers: { Authorization: `Bearer ${token}` }
  })
});

const schema = await backend.getSchema();

for await (const page of backend.getOpLog.paginate({ start: '0', limit: 100 })) {
  for (const entry of page.entries) {
    await handleChange(entry);
  }
}
```

Use your backend endpoint, account ID, and an authorized credential. Oplog sequence IDs remain strings to preserve precision. Automatic pagination supports forward reads; use a single `getOpLog({ tail: true })` call for a tail read.
