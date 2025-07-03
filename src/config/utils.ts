import { Model } from 'mongoose';

export async function isPropertyExist(
  model: Model<any>,
  propertyName: string,
  value: string,
): Promise<boolean> {
  const query = { [propertyName]: value };
  const exists = await model.exists(query);
  return exists ? true : false;
}
