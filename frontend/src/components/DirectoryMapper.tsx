import React, { useState, useCallback, useEffect, useRef, useContext } from 'react'
import Directory from '../utils/helper/DirFormatter'
import { dataType, ResultArr, CollectionType, PageType } from '../utils/helper/DirFormatter'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { FaNoteSticky } from 'react-icons/fa6'
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { ImMenu, ImCross } from 'react-icons/im'
import COLLECTION_API from '../utils/api/collection'
import PAGE_API from '../utils/api/page'
import { Toast } from '../utils/alert/sweetAlert2'
import { Link, useParams } from 'react-router-dom'

const DirectoryMap: React.FC = () => {
    const [data, setData] = useState<ResultArr>([])
    const [structuredData, setStructuredData] = useState<ResultArr>([])
    const [menuVisibility, setMenuVisibility] = useState<Record<number, boolean>>({})
    const [rename, setRename] = useState<Record<number, boolean>>({})
    const [type, setType] = useState<string>('')
    const [visibleChildren, setVisibleChildren] = useState<Set<number>>(new Set())
    const [inputVisible, setInputVisible] = useState<Record<number, boolean>>({})
    const input = useRef<Record<number, HTMLInputElement | null>>({})
    const renameRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState<Record<number, boolean>>({})
    const [isSelect, setIsSelect] = useState<boolean>(false)
    const [selected, setSelected] = useState<Array<number>>(new Array())

    const pageId = Number(useParams().id ?? -1);

    console.log({pageId: pageId});
    

    useEffect(() => {
        COLLECTION_API.Get_All_By_Parent_ID({ parent: null }).then((res) => {
            setData(res.data)
        })
    }, [])

    useEffect(() => {
        if (data.length > 0) {
            const directory = new Directory(data as dataType)
            const result = directory.createObject()
            setStructuredData(result)
        }
    }, [data])

    const toggleChildrenVisibility = useCallback((collectionId: number) => {
        if (isSelect) {
            setSelected(prev => {
                if (prev.includes(collectionId)) {
                    return prev.filter(item => item !== collectionId)
                } else {
                    return [...prev, collectionId]
                }
            })
        } else {
            setLoading(prev => ({ ...prev, [collectionId]: true }))
            setTimeout(() => {
                setVisibleChildren((prev) => {
                    const newVisibleChildren = new Set(prev)
                    if (newVisibleChildren.has(collectionId)) {
                        newVisibleChildren.delete(collectionId)
                    } else {
                        newVisibleChildren.add(collectionId)
                    }
                    return newVisibleChildren
                })
                setLoading(prev => ({ ...prev, [collectionId]: false }))
            }, 1000)
        }
    }, [isSelect])

    const toggleSelect = useCallback(() => {
        setIsSelect(prev => !prev)
    }, []);

    const toggleMenuVisibility = useCallback(
        (collectionId: number) => {
            setMenuVisibility((prev) => ({
                ...prev,
                [collectionId]: !prev[collectionId]
            }))
        },
        [menuVisibility]
    )

    const toggleInputVisibility = useCallback(
        (collectionId: number, type: string) => {
            setInputVisible((prev) => ({
                ...prev,
                [collectionId]: !prev[collectionId]
            }))
            setMenuVisibility((prev) => ({
                ...prev,
                [collectionId]: !prev[collectionId]
            }))
            setType(type)
        },
        [menuVisibility]
    )

    const toggleRenameVisibility = useCallback((collectionId: number) => {
        setRename((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
    }, [])

    const callApi = async (collectionId: number) => {
        try {
            const res = await COLLECTION_API.Get_All_By_Parent_ID({ parent: collectionId })
            const newItems = res.data
            console.log(newItems)
            setData((prevData) => {
                const dataSet = new Set(prevData.map((item) => item.id))
                const itemsToAdd: ResultArr = []
                const itemsToRemove: ResultArr = []

                newItems.forEach((item) => {
                    if (dataSet.has(item.id)) {
                        itemsToRemove.push(item)
                    } else {
                        itemsToAdd.push(item)
                    }
                })
                const updatedData = prevData.filter((item) => !itemsToRemove.includes(item)).concat(itemsToAdd)

                return updatedData
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleKeyDown = useCallback(
        (parentId: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && input.current[parentId] && input.current[parentId]?.value === '') {
                toggleInputVisibility(parentId, type)
            } else if (e.key === 'Enter' && input.current[parentId]) {
                const inputValue = input.current[parentId]?.value.trim()
                if (inputValue && type === 'COLLECTION') {
                    COLLECTION_API.ADD({ name: inputValue, parent: parentId })
                        .then((res) => {
                            const newItem: CollectionType = {
                                ...res.data,
                                type: 'COLLECTION'
                            }
                            setData((prevData) => [...prevData, newItem])
                        })
                        .catch((error) => {
                            console.error('Failed to add item:', error)
                        })
                    setInputVisible((prev) => ({
                        ...prev,
                        [parentId]: false
                    }))
                    Toast.fire({
                        icon: 'success',
                        title: 'Collection added successfully'
                    })
                } else if (inputValue && type === 'PAGE') {
                    PAGE_API.ADD_PAGE({ name: inputValue, collectionId: parentId })
                        .then((res) => {
                            const newItem: PageType = {
                                ...res.data,
                                type: 'PAGE'
                            }
                            setData((prevData) => [...prevData, newItem])
                        })
                        .catch((error) => {
                            console.error('Failed to add item:', error)
                        })
                    setInputVisible((prev) => ({
                        ...prev,
                        [parentId]: false
                    }))
                    Toast.fire({
                        icon: 'success',
                        title: 'Page added successfully'
                    })
                }
            }
        },
        [input, type]
    )

    const handleGroupDelete = async () => {
        for (const ele of selected) {
            try {
                await COLLECTION_API.DELETE_COLLECTION_BY_ID({ id: ele });
            } catch (error) {
                console.error(`Failed to delete collection ${ele}:`, error);
            }

            try {
                await PAGE_API.DELETE_BY_PAGE_ID({ id: ele });
            } catch (error) {
                console.error(`Failed to delete page ${ele}:`, error);
            }
            setData((prev) => prev.filter((single) => single.id !== ele));
        }
        setSelected([]);
        Toast.fire({
            icon: 'success',
            title: 'Selected items deleted successfully'
        });
    };

    const handleDelte = (collectionId: number, type: string) => {
        if (type === 'COLLECTION') {
            COLLECTION_API.DELETE_COLLECTION_BY_ID({ id: collectionId })
                .then((res) => {
                    console.log(res)
                    setData((prev) => prev.filter((single) => single.id !== collectionId))
                    Toast.fire({
                        icon: 'success',
                        iconColor: 'red',
                        title: 'Collection deleted'
                    });
                })
                .catch((error) => {
                    console.error('Failed to delete item:', error)
                })
        } else if (type === 'PAGE') {
            PAGE_API.DELETE_BY_PAGE_ID({ id: collectionId })
                .then(() => {
                    setTimeout(() => {
                        setData((prev) => prev.filter((single) => single.id !== collectionId))
                    }, 200)
                    Toast.fire({
                        icon: 'success',
                        iconColor: 'red',
                        title: 'Page deleted'
                    });
                })
                .catch((error) => {
                    console.error('Failed to delete item:', error)
                })
        }
    }

    const handleRename = (e: React.KeyboardEvent<HTMLInputElement>, collectionId: number, type: string) => {
        if (e.key === 'Enter' && renameRef.current && renameRef.current.value === '') {
            toggleRenameVisibility(collectionId)
        }
        if (e.key === 'Enter' && renameRef.current) {
            const inputValue = renameRef.current.value.trim()
            if (inputValue && type === 'COLLECTION') {
                COLLECTION_API.RENAME_COLLECTION({ name: inputValue, id: collectionId })
                    .then((res) => {
                        if (res.code === 200) {
                            setData((prev) =>
                                prev.map((single) => {
                                    if (single.id === collectionId && single.type === 'COLLECTION') {
                                        return { ...single, name: inputValue }
                                    }
                                    return single
                                })
                            )

                            toggleRenameVisibility(collectionId)
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to rename item:', error)
                    })
            } else if (inputValue && type === 'PAGE') {
                PAGE_API.RENAME_PAGE({ name: inputValue, id: collectionId })
                    .then((res) => {
                        if (res.code === 200) {
                            setData((prev) =>
                                prev.map((single) => {
                                    if (single.id === collectionId && single.type === 'PAGE') {
                                        return { ...single, name: inputValue }
                                    }
                                    return single
                                })
                            )
                            toggleRenameVisibility(collectionId)
                            toggleMenuVisibility(collectionId)
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to rename item:', error)
                    })
            }
            toggleMenuVisibility(collectionId)
        }
    }

    const renderItem = useCallback(
        (item: CollectionType | PageType) => {
            if (item.type === 'COLLECTION') {
                const isChildrenVisible = visibleChildren.has(item.id)
                const isMenuVisible = menuVisibility[item.id] || false
                const isInputVisible = inputVisible[item.id] || false
                const isRenameVisible = rename[item.id] || false
                const isLoading = loading[item.id] || false

                return (
                    <div
                        key={item.id}
                        className='relative p-2 my-2 bg-slate-100 rounded-md  hover:bg-slate-300 shadow-sm shadow-black'
                        style={{
                            backgroundColor: selected.includes(item.id) ? 'rgb(203 213 225)' : ""
                        }}
                    >
                        {isRenameVisible ? (
                            <input
                                type='text'
                                ref={renameRef}
                                className='w-full rounded-md border-none'
                                placeholder='Enter text to rename'
                                onKeyDown={(e) => {
                                    handleRename(e, item.id, item.type)
                                }}
                            />
                        ) : (
                            <div
                                className='flex flex-row justify-between items-center truncate'
                                style={{ fontWeight: 'bold', cursor: 'pointer' }}
                                onClick={() => {
                                    toggleChildrenVisibility(item.id)
                                    {
                                        isMenuVisible && toggleMenuVisibility(item.id)
                                    }
                                    {
                                        isInputVisible && toggleInputVisibility(item.id, item.type)
                                    }
                                }}
                            >
                                <div className='flex gap-2 items-center' onClick={() => {
                                    callApi(item.id)
                                }}>
                                    {isChildrenVisible ? <FaFolderOpen /> : <FaFolder />}
                                    {item.name}
                                </div>
                                <div
                                    className='menu flex flex-row items-center justify-center gap-4'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleMenuVisibility(item.id)
                                    }}
                                >
                                    {isLoading && <span className='border-2 animate-spin border-x-slate-500 border-y-slate-400 rounded-full w-4 h-4' ></span>}
                                    {!isMenuVisible ? <ImMenu /> : <ImCross />}
                                </div>
                                {isMenuVisible && (
                                    <div className='menu-content ml-20 mt-40 absolute bg-white text-center text-[12px] p-2 z-50 rounded-2xl' onClick={(e)=>{
                                        e.stopPropagation()
                                        toggleMenuVisibility(item.id)}}>
                                        <div
                                            className='menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleInputVisibility(item.id, 'COLLECTION')
                                            }}
                                        >
                                            Add Collection
                                        </div>
                                        <div
                                            className='menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleInputVisibility(item.id, 'PAGE')
                                            }}
                                        >
                                            Add Page
                                        </div>
                                        <div
                                            className='menu-item w-28 hover:bg-sky-200 p-2 rounded-xl hover:text-sky-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleRenameVisibility(item.id)}}
                                        >
                                            Rename
                                        </div>
                                        <div
                                            className='menu-item w-28 hover:bg-sky-200 p-2 rounded-xl hover:text-sky-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleSelect()
                                            toggleMenuVisibility(item.id)}}
                                        >
                                            Select
                                        </div>
                                        <div
                                            className='menu-item w-28 hover:bg-red-200 p-2 rounded-xl hover:text-red-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelte(item.id, item.type)}}
                                        >
                                            Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {isChildrenVisible && item.children && item.children.map(renderItem)}
                        {isInputVisible && (
                            <input
                                type='text'
                                ref={(el) => {
                                    if (el) input.current[item.id] = el
                                }}
                                onKeyDown={handleKeyDown(item.id)}
                                className='border-2 border-black p-2 rounded-lg w-full mt-2'
                                placeholder='Enter the name'
                            />
                        )}
                    </div>
                )
            } else if (item.type === 'PAGE') {
                const isMenuVisible = menuVisibility[item.id] || false
                const isRenameVisible = rename[item.id] || false
                return (
                    <>
                        {isRenameVisible ? (
                            <input
                                type='text'
                                ref={renameRef}
                                className='border-2 border-black p-2 rounded-lg w-full mt-2'
                                placeholder='Rename Page'
                                onKeyDown={(e) => {
                                    handleRename(e, item.id, item.type)
                                }}
                            />
                        ) : (
                            <div className='flex flex-row justify-between p-2 cursor-pointer rounded-md items-center bg-slate-400 hover:bg-slate-300 mt-2 shadow-sm shadow-black border-2 border-black'
                                style={{
                                    backgroundColor: item.id === pageId ? 'rgb(203 213 225)' : "rgb(148 163 184)"
                                }}>
                                <div key={item.id} className=' flex flex-row gap-2 items-center' >
                                    {item.id === pageId ? <FaRegNoteSticky /> : <FaNoteSticky />}
                                    <Link to={"/page/" + item.id}>
                                        <h3>{item.name}</h3>
                                    </Link>
                                </div>
                                <div
                                    className='menu'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toggleMenuVisibility(item.id)
                                    }}
                                >
                                    {!isMenuVisible ? <ImMenu /> : <ImCross />}
                                </div>
                                {isMenuVisible && (
                                    <div className='menu-content ml-20 mt-24 absolute bg-white text-center text-[12px] p-2 z-10 rounded-2xl'>
                                        <div
                                            className='menu-item w-20 hover:bg-sky-200 p-2 cursor-pointer rounded-xl hover:text-sky-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleRenameVisibility(item.id)}}
                                        >
                                            Rename
                                        </div>
                                        <div
                                            className='menu-item w-20 hover:bg-red-200 p-2 cursor-pointer rounded-xl hover:text-red-500'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDelte(item.id, item.type)}}
                                        >
                                            Delete
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )
            }
            return null
        },
        [visibleChildren, menuVisibility, rename, type, toggleChildrenVisibility, toggleMenuVisibility, inputVisible, toggleInputVisibility, loading, selected]
    )

    return <div className='relative overflow-y-auto p-1 h-[625px] hide-scroll'>
        {isSelect && <div className="select text-2xl ml-44 mb-4 flex flex-row items-end justify-center bg-green-500 w-8 shadow-sm shadow-green-300 rounded-lg"
            onClick={() => toggleSelect()}>
            <TiTick />
        </div>}
        {selected.length !== 0 && !isSelect &&
            <div className="flex flex-row ml-36 gap-2 mb-4 items-end justify-center ">
                <FaTrash className='bg-red-500 p-1 text-xl w-8 shadow-sm shadow-red-300 rounded-lg' onClick={() => handleGroupDelete()} />
                <FaXmark className='bg-red-500 w-8 text-xl shadow-sm shadow-red-300 rounded-lg' onClick={() => { setSelected([]) }} />
            </div>
        }
        {structuredData.map(renderItem)}
    </div>
}

export default DirectoryMap
