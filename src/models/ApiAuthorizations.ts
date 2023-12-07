import { Schema, model } from 'mongoose';

interface IApiAuthorization {
  username: string;
  password: string;
}

const ApiAuthorizationsSchema = new Schema<IApiAuthorization>(
  { username: String, password: String },
  { versionKey: false, collection: 'ApiAuthorizations' },
);

const ApiAuthorizations = model<IApiAuthorization>(
  'ApiAuthorizations',
  ApiAuthorizationsSchema,
  'ApiAuthorizations',
);
export default ApiAuthorizations;
