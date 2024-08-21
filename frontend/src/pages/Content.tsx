import React, { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { MdEdit } from 'react-icons/md'
import PAGE_API from '../utils/api/page'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RES_GET_PAGE_BY_ID } from '../utils/types/api/page_Types'
import { useNavigate, useParams } from 'react-router-dom'

const MarkdownEditor: React.FC = () => {
    const [content, setContent] = useState("")
    const [ details, setDetails ] = useState<RES_GET_PAGE_BY_ID>()
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

    const pageId = Number(useParams().id)
    const navigate = useNavigate();

    const handleEditClick = () => {
        setIsReadOnly(false)
    }

    useEffect(() => {
        if(pageId !== 0){
            PAGE_API.GET_BY_PAGE_ID({ id: pageId }).then((response) => {
                setContent(response.data.content ?? "")
                setDetails(response.data)
            })
        }
        setIsReadOnly(true)
    },[pageId]);

    const handleSaveClick = () => {
        PAGE_API.SAVE_PAGE({ id: pageId, content: content as string })
        setIsReadOnly(true)
    }

    return (
        <div className='w-[95%] mx-auto'>
            <div className='flex flex-row justify-between mb-2'>
            <h1 className='text-2xl ml-2 mb-2 text-slate-300' ><b>{details?.name}</b></h1>
                <div className="flex flex-row gap-2">
                <button
                    className={`p-1 w-24 text-sm border-2 rounded-xl ${!isReadOnly ? 'bg-green-300 border-green-300 hover:opacity-50 cursor-pointer' : 'hidden'}`}
                    onClick={handleSaveClick}
                    disabled={isReadOnly}
                >
                    Save
                </button>
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
                    onClick={()=>{
                        localStorage.removeItem("visibleChildren")
                        navigate('/app')
                    }}
                    >
                    <span className='flex flex-row justify-center  items-center'>
                        Close
                        <IoIosCloseCircleOutline className='mx-1 mt-[3px]' />
                    </span>
                </button>
                </div>
            </div>
            <hr className='border-1 border-slate-200 mb-4' />

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
}

export default MarkdownEditor
