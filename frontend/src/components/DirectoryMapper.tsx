import React, { useState, useCallback, useEffect, useRef } from 'react'
import Directory from '../utils/helper/DirFormatter'
import { dataType, ResultArr, CollectionType, PageType } from '../utils/helper/DirFormatter'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'
import { FaNoteSticky } from 'react-icons/fa6'
import { ImMenu, ImCross } from 'react-icons/im'
import COLLECTION_API from '../utils/api/collection'
import PAGE_API from '../utils/api/page'

const DirectoryMap: React.FC = () => {
    const [data, setData] = useState<ResultArr>([])
    const [structuredData, setStructuredData] = useState<ResultArr>([])
    const [menuVisibility, setMenuVisibility] = useState<Record<number, boolean>>({})
    const [rename, setRename] = useState<Record<number, boolean>>({})
    const [type , setType] = useState<string>("")
    const [visibleChildren, setVisibleChildren] = useState<Set<number>>(new Set())
    const [inputVisible, setInputVisible] = useState<Record<number, boolean>>({})
    const input = useRef<Record<number, HTMLInputElement | null>>({})
    const renameRef = useRef<HTMLInputElement>(null);

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
        setVisibleChildren((prev) => {
            const newVisibleChildren = new Set(prev)
            if (newVisibleChildren.has(collectionId)) {
                newVisibleChildren.delete(collectionId)
            } else {
                newVisibleChildren.add(collectionId)
            }
            return newVisibleChildren
        })
    }, [])

    const toggleMenuVisibility = useCallback((collectionId: number) => {
        setMenuVisibility((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
    }, [menuVisibility])

    const toggleInputVisibility = useCallback((collectionId: number, type: string) => {
        setInputVisible((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
        setMenuVisibility((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
        setType(type)
    }, [menuVisibility])

    const toggleRenameVisibility = useCallback((collectionId: number) => {
        setRename((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
    }, []);

    const callApi = async (collectionId: number) => {
        try {
            const res = await COLLECTION_API.Get_All_By_Parent_ID({ parent: collectionId });
            const newItems = res.data;
            console.log(newItems)
            setData(prevData => {
                const dataSet = new Set(prevData.map(item => item.id));
                const itemsToAdd: ResultArr = [];
                const itemsToRemove: ResultArr = [];

                newItems.forEach(item => {
                    if (dataSet.has(item.id)) {
                        itemsToRemove.push(item);
                    } else {
                        itemsToAdd.push(item);
                    }
                });
                const updatedData = prevData
                    .filter(item => !itemsToRemove.includes(item))
                    .concat(itemsToAdd);

                return updatedData;
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleKeyDown = useCallback(
        (parentId: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && input.current[parentId]) {
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
                } else if (inputValue && type === 'PAGE') {
                    PAGE_API.ADD_PAGE({name: inputValue, collectionId: parentId})
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
                }
            }
        },
        [input, type]
    )


    const handleDelte = (collectionId: number, type:string) => {
        if(type === 'COLLECTION'){
            COLLECTION_API.DELETE_COLLECTION_BY_ID({ id: collectionId }).then((res) => {
                console.log(res)
                setData((prev) => prev.filter((single) => single.id !== collectionId))
            }).catch((error) => {
                console.error('Failed to delete item:', error)
            })
        } else if(type === 'PAGE'){
            PAGE_API.DELETE_BY_PAGE_ID({ id: collectionId }).then(() => {
                setData((prev) => prev.filter((single) => single.id !== collectionId))
            }).catch((error) => {
                console.error('Failed to delete item:', error)
            });
        }
    }

    const handleRename = (e: React.KeyboardEvent<HTMLInputElement>, collectionId: number, type: string) => {
        if (e.key === 'Enter' && renameRef.current) {
            const inputValue = renameRef.current.value.trim()
            if (inputValue && type === 'COLLECTION') {
                COLLECTION_API.RENAME_COLLECTION({ name: inputValue, id: collectionId })
                    .then((res) => {
                        if (res.code === 200) {
                            setData((prev) => prev.map((single) => {
                                if (single.id === collectionId && single.type === 'COLLECTION') {
                                    return { ...single, name: inputValue }
                                }
                                return single
                            }))

                            toggleRenameVisibility(collectionId);
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to rename item:', error)
                    })
            } else if (inputValue && type === 'PAGE') {
                PAGE_API.RENAME_PAGE({ name: inputValue, id: collectionId })
                    .then((res) => {
                        if (res.code === 200) {
                            setData((prev) => prev.map((single) => {
                                if (single.id === collectionId && single.type === 'PAGE') {
                                    return { ...single, name: inputValue }
                                }
                                return single
                            }))
                            toggleRenameVisibility(collectionId);
                            toggleMenuVisibility(collectionId);
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to rename item:', error)
                    })
            }
        }
    }
    useEffect(() => {
        console.log(rename)
    }, [rename])

    const renderItem = useCallback(
        (item: CollectionType | PageType) => {
            if (item.type === 'COLLECTION') {
                const isChildrenVisible = visibleChildren.has(item.id)
                const isMenuVisible = menuVisibility[item.id] || false
                const isInputVisible = inputVisible[item.id] || false
                const isRenameVisible = rename[item.id] || false

                return (
                    <div
                        key={item.id}
                        className='relative mt-2 bg-yellow-300 p-2 border-2 border-black mb-1 hover:bg-yellow-200 shadow-sm shadow-black'
                        onClick={() => {
                            callApi(item.id)
                        }}
                    >
                        {isRenameVisible ? <input type='text' ref={renameRef} className='mb-2 mt-2' onKeyDown={(e) => { handleRename(e, item.id, item.type) }} /> :
                            <div
                                className='flex flex-row justify-between items-center'
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
                                <div className='flex gap-2 items-center'>
                                    {isChildrenVisible ? <FaFolderOpen /> : <FaFolder />}
                                    {item.name}
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
                                    <div className='menu-content ml-40 mt-40 absolute bg-white text-center text-[12px] p-2 z-10 rounded-2xl'>
                                        <div
                                            className='menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500'
                                            onClick={() => {
                                                toggleInputVisibility(item.id, "COLLECTION")
                                            }}
                                        >
                                            Add Collection
                                        </div>
                                        <div className='menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500'
                                            onClick={() => {
                                                toggleInputVisibility(item.id, "PAGE")
                                            }}
                                        >
                                            Add Page
                                        </div>
                                        <div className='menu-item w-28 hover:bg-sky-200 p-2 rounded-xl hover:text-sky-500' onClick={() => toggleRenameVisibility(item.id)} >Rename</div>
                                        <div className='menu-item w-28 hover:bg-red-200 p-2 rounded-xl hover:text-red-500' onClick={() => handleDelte(item.id, item.type)} >Delete</div>
                                    </div>
                                )}
                            </div>}
                        {isChildrenVisible && item.children && item.children.map(renderItem)}
                        {isInputVisible && (
                            <input
                                type='text'
                                ref={(el) => {
                                    if (el) input.current[item.id] = el
                                }}
                                onKeyDown={handleKeyDown(item.id)}
                                className='border-2 border-black p-2 rounded-lg w-full mt-2'
                                placeholder='Enter name'
                            />
                        )}
                    </div>
                )
            } else if (item.type === 'PAGE') {
                const isMenuVisible = menuVisibility[item.id] || false
                const isRenameVisible = rename[item.id] || false
                return (
                    <>
                    {isRenameVisible ? <input type='text' ref={renameRef} className='mb-2 mt-2' onKeyDown={(e) => { handleRename(e, item.id, item.type) }} /> :
                    <div className="flex flex-row justify-between p-2 items-center bg-slate-400 hover:bg-slate-300 mt-2 shadow-sm shadow-black border-2 border-black">
                    <div
                        key={item.id}
                        className='mb-1 cursor-pointer flex flex-row gap-2 items-center'

                    >
                        <FaNoteSticky />
                        <h3>{item.name}</h3>
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
                                    <div className='menu-content ml-36 mt-20 absolute bg-white text-center text-[12px] p-2 z-10 rounded-2xl'>
                                        <div className='menu-item w-28 hover:bg-sky-200 p-2 cursor-pointer rounded-xl hover:text-sky-500' onClick={() => toggleRenameVisibility(item.id)} >Rename</div>
                                        <div className='menu-item w-28 hover:bg-red-200 p-2 cursor-pointer rounded-xl hover:text-red-500' onClick={() => handleDelte(item.id, item.type)} >Delete</div>
                                    </div>
                                )}
                    </div>}
                    </>
                    
                )
            }
            return null
        },
        [visibleChildren, menuVisibility, rename, type, toggleChildrenVisibility, toggleMenuVisibility, inputVisible, toggleInputVisibility]
    )

    return <div>{structuredData.map(renderItem)}</div>
}

export default DirectoryMap
