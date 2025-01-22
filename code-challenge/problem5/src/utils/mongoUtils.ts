import { Types, connect, connection } from 'mongoose'

import { UpdateOptions } from 'mongodb'
import { __ } from '~localization'

type QueryOneModel = {
  collectionName: string
  query: any
}

type QueryManyModel = {
  collectionName: string
  query: any[]
}

type UpdateOneModel = QueryOneModel & {
  values: any
}

type QueryModel = QueryOneModel & {
  limit?: number
  select?: any
  skip?: number
  sort?: any
}

type QueryResponse = {
  error: boolean
  message: string
  result?: any
}

export async function connectDb() {
  try {
    await connect(process.env.MONGO_DB_URL || '', {
      autoCreate: true,
      autoIndex: true,
      bufferCommands: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw new Error('Could not connect to MongoDB')
  }
}

export async function closeDb() {
  console.log('Closed MongoDB')
  await connection.close()
}

export async function findOne({
  collectionName,
  query = {},
}: QueryOneModel): Promise<QueryResponse> {
  try {
    const result = await connection.collection(collectionName).findOne(query)
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function find({
  collectionName,
  limit,
  query = {},
  skip,
  sort,
}: QueryModel): Promise<QueryResponse> {
  try {
    let cursor = connection.collection(collectionName).find(query || {})
    if (sort) cursor = cursor.sort(sort)
    if (limit) cursor = cursor.limit(limit)
    if (skip) cursor = cursor.skip(skip)
    const result = await cursor.toArray()
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function insertOne({
  collectionName,
  query = {},
}: QueryOneModel): Promise<QueryResponse> {
  try {
    const result = await connection
      .collection(collectionName)
      .insertOne({ ...query, createdAt: Date.now(), updatedAt: Date.now() })
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function insertMany({
  collectionName,
  query = [],
}: QueryManyModel): Promise<QueryResponse> {
  try {
    const result = await connection
      .collection(collectionName)
      .insertMany(query.map((e) => ({ ...e, createdAt: Date.now(), updatedAt: Date.now() })))
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function updateOne({
  collectionName,
  query = {},
  values,
}: UpdateOneModel): Promise<QueryResponse> {
  try {
    if (values.$set) values.$set.updatedAt = Date.now()
    else values.$set = { updatedAt: Date.now() }
    const result = await connection.collection(collectionName).findOneAndUpdate(query, values)
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function updateMany({
  collectionName,
  options,
  query = {},
  values,
}: UpdateOneModel & { options?: UpdateOptions }): Promise<QueryResponse> {
  try {
    if (values.$set) values.$set.updatedAt = Date.now()
    else values.$set = { updatedAt: Date.now() }
    const result = await connection
      .collection(collectionName)
      .updateMany(query, values, options as any)
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function deleteOne({
  collectionName,
  query = {},
}: QueryOneModel): Promise<QueryResponse> {
  try {
    const result = await connection.collection(collectionName).findOneAndDelete(query)
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function deleteMany({
  collectionName,
  query = {},
}: QueryOneModel): Promise<QueryResponse> {
  try {
    const result = await connection.collection(collectionName).deleteMany(query)
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export function createObjectID(id?: string) {
  try {
    const objectID = new Types.ObjectId(id)
    return objectID
  } catch (error) {
    throw null
  }
}

export async function countDocuments({
  collectionName,
  query = {},
}: QueryOneModel): Promise<QueryResponse> {
  try {
    const result = await connection.collection(collectionName).countDocuments(query)
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}

export async function aggregate({
  collectionName,
  query = {},
}: QueryOneModel): Promise<QueryResponse> {
  try {
    const result = await connection.collection(collectionName).aggregate(query).toArray()
    return { error: false, message: '', result }
  } catch (error) {
    throw { error: true, message: __('common.errorDb') } as QueryResponse
  }
}
