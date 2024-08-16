import React, { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { MdEdit } from 'react-icons/md'
import { useContent } from '../utils/context/Content'
import { usePageId } from '../utils/context/PageId'
import PAGE_API from '../utils/api/page'
import { IoIosCloseCircleOutline } from "react-icons/io";
import notes from '../assets/img/notes.png'
import use from 'react';
import { RES_GET_PAGE_BY_ID } from '../utils/types/api/page_Types'

const MarkdownEditor: React.FC = () => {
    const { content, setContent } = useContent()
    const { pageId, setPageId } = usePageId()
    const [ details, setDetails ] = useState<RES_GET_PAGE_BY_ID>()
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

    const handleEditClick = () => {
        setIsReadOnly(false)
    }

    useEffect(() => {
        if(pageId !== 0){
            PAGE_API.GET_BY_PAGE_ID({ id: pageId }).then((response) => {
                setDetails(response.data)
            })
        }
    },[pageId]);

    const handleSaveClick = () => {
        PAGE_API.SAVE_PAGE({ id: pageId, content: content as string })
        setContent(content)
        setIsReadOnly(true)
    }

    if(content !== null){
        return (
            <div className='w-[95%] mx-auto'>
                <h1 className='text-2xl ml-2 mb-4 text-slate-500' >/ <b>{details?.name}</b></h1>
                <div className='flex flex-row justify-between mb-2'>
                    <div className="flex flex-row gap-2">
                    <button
                        className={`p-1 w-24 text-sm text-slate-950 hover:text-slate-100 border-2 rounded-xl ${isReadOnly ? 'bg-slate-300  hover:bg-slate-500 cursor-pointer' : 'bg-gray-300 border-gray-300 cursor-not-allowed opacity-50'}`}
                        onClick={handleEditClick}
                        disabled={!isReadOnly}
                    >
                        <span className='flex flex-row justify-center items-center'>
                            Edit
                            <MdEdit className='mx-1' />
                        </span>
                    </button>
                    <button
                        className={`p-1 w-24 flex justify-center text-slate-950 hover:text-slate-100 border-red-100 items-center text-sm border-2 rounded-xl ${isReadOnly ? 'bg-red-300  hover:bg-red-500 cursor-pointer' : 'bg-gray-300 border-gray-300 cursor-not-allowed opacity-50'}`}
                        onClick={() => {
                            setContent(null)
                            setPageId(0)
                        }}
                    >
                        <span className='flex flex-row justify-center  items-center'>
                            Close
                            <IoIosCloseCircleOutline className='mx-1 mt-[3px]' />
                        </span>
                    </button>
                    </div>
                    <button
                        className={`p-1 w-24 text-sm border-2 rounded-xl ${!isReadOnly ? 'bg-green-300 border-green-300 hover:opacity-50 cursor-pointer' : 'hidden'}`}
                        onClick={handleSaveClick}
                        disabled={isReadOnly}
                    >
                        Save
                    </button>
                </div>
    
                <MDEditor
                    value={content}
                    onChange={(value: string | undefined) => {
                        if (!isReadOnly && value) {
                            setContent(value)
                        }
                    }}
                    preview={isReadOnly ? 'preview' : 'edit'}
                    hideToolbar={isReadOnly}
                    height={isReadOnly ? 650 : 650}
                />
            </div>
        )
    } else {
        return (
            <div className="flex flex-col justify-center items-center my-auto">
                <h1 className='font-mono font-bold text-2xl' >Create and Manage Notes in Ease</h1>
                <img src={notes} alt='notes' className='w-2/4' />
            </div>
        )
    }
}

export default MarkdownEditor
