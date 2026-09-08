# @journeyapps-labs/client-backend-v4

## 2.0.0

### Major Changes

- a86aa28: Publish the public backend V4 client under @ja-platform on npm and use CodecSDKClient with ts-codec request and response schemas.

  Account, app, and organization IDs use BSON ObjectId values, and timestamp fields decode to Date values. App-data IDs remain strings. Field types, field subtypes, index states, and oplog operations use enums matching the backend.

  Oplog requests consistently use sequence_id strings and return typed pagination metadata. Automatic pagination rejects tail=true. Correct schema subtypes, location fields, index key maps, and nullable index usage statistics to match the API.

## 1.0.0

### Major Changes

- 2947f9a: First release
