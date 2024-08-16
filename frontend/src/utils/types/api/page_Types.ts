import { Custom_API_RES } from './common';

export interface REQ_ADD_PAGE {
    name: string
    collectionId : number
}

export type RES_ADD_PAGE =  Custom_API_RES<{
    id: number
    name: string
    content : string | null
    isDeleted: 0 | 1
    collectionRef: number
}>

export interface REQ_GET_PAGE_BY_ID {
    name : string
    collectionId : number
}

export type RES_GET_PAGE_BY_ID = Custom_API_RES<{
    id: number
    name: string
    content : string | null
    isDeleted: 0 | 1
    collectionRef: number
}>

export interface REQ_SAVE_PAGE{
    id : number
    content : string
}

export type RES_SAVE_PAGE = Custom_API_RES<{
    status : string
}>

export interface REQ_RENAME_PAGE {
    name : string
    parent : number | null
}

export type RES_RENAME_PAGE = Custom_API_RES<{
    id: number
    name: string
    content : string | null
    isDeleted: 0 | 1
    collectionRef: number
}>