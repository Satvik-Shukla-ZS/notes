import { Custom_API_RES } from './common'

export interface REQ_ADD_COLLECTION {
  name: string
  parent: number | null
}
export interface RES_ADD_COLLECTION {
  name: string
  parent: number
}

export interface REQ_COLLECTION_BY_ID {
  id: number | null
}
export type RES_COLLECTION_BY_ID = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}>

export interface REQ_COLLECTION_BY_PARENT_ID {
  parent: number | null
}
export type RES_COLLECTION_BY_PARENT_ID = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}>

export interface REQ_ALL_COLLECTION_BY_PARENT_ID {
  parent: number | null
}
export type RES_ALL_COLLECTION_BY_PARENT_ID = Custom_API_RES<{
  id: number
  name: string
  isDeleted: 0 | 1
  userRef: number
  parent: null | number
}>
