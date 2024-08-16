import React, { useState, useCallback, useEffect, useRef } from 'react';
import Directory from '../utils/helper/DirFormatter';
import { dataType, ResultArr, CollectionType, PageType } from '../utils/helper/DirFormatter';
import { FaFolder, FaFolderOpen } from 'react-icons/fa';
import { FaNoteSticky } from 'react-icons/fa6';
import { ImMenu, ImCross } from 'react-icons/im';
import COLLECTION_API from '../utils/api/collection';

const DirectoryMap: React.FC = () => {
    const [data, setData] = useState<ResultArr>([]);
    const [structuredData, setStructuredData] = useState<ResultArr>([]);
    const [menuVisibility, setMenuVisibility] = useState<Record<number, boolean>>({});
    const [visibleChildren, setVisibleChildren] = useState<Set<number>>(new Set());
    const [inputVisible, setInputVisible] = useState<Record<number, boolean>>({});
    const input = useRef<Record<number, HTMLInputElement | null>>({});
    

    useEffect(() => {
        COLLECTION_API.Get_All_By_Parent_ID({ parent: null }).then((res) => {
            setData(res.data);
        });
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const directory = new Directory(data as dataType);
            const result = directory.createObject();
            setStructuredData(result);
        }
    }, [data]);

    const toggleChildrenVisibility = useCallback((collectionId: number) => {
        setVisibleChildren(prev => {
            const newVisibleChildren = new Set(prev);
            if (newVisibleChildren.has(collectionId)) {
                newVisibleChildren.delete(collectionId);
            } else {
                newVisibleChildren.add(collectionId);
            }
            return newVisibleChildren;
        });
    }, []);

    const toggleMenuVisibility = useCallback((collectionId: number) => {
        setMenuVisibility(prev => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }));
    }, []);

    const toggleInputVisibility = useCallback((collectionId : number) => {
        setInputVisible(prev => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }));
        setMenuVisibility(prev => ({
            ...prev,
            [collectionId]: false
        }));
    },[]);

    const handleKeyDown = useCallback((parentId: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.current[parentId]) {
            const inputValue = input.current[parentId]?.value.trim();
            if (inputValue) {
                COLLECTION_API.ADD({ name: inputValue, parent: parentId }).then((res) => {
                    const newItem: CollectionType = {
                        ...res.data,
                        type: 'COLLECTION'
                    };
                    setData(prevData => [...prevData, newItem]);
                }).catch(error => {
                    console.error('Failed to add item:', error);
                });
                setInputVisible(prev => ({
                    ...prev,
                    [parentId]: false
                }));
            }
        }
    }, []);

    const renderItem = useCallback((item: CollectionType | PageType) => {
        if (item.type === 'COLLECTION') {
            const isChildrenVisible = visibleChildren.has(item.id);
            const isMenuVisible = menuVisibility[item.id] || false;
            const isInputVisible = inputVisible[item.id] || false;

            return (
                <div key={item.id} className='relative mt-2 bg-yellow-300 p-2 border-2 border-black mb-1 hover:bg-yellow-200 shadow-sm shadow-black'>
                    <div
                        className='flex flex-row justify-between items-center'
                        style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => {
                            toggleChildrenVisibility(item.id);
                            {isMenuVisible && toggleMenuVisibility(item.id)}
                            {isInputVisible && toggleInputVisibility(item.id)}
                        }}
                    >
                        <div className="flex gap-2 items-center">
                            {isChildrenVisible ? <FaFolderOpen /> : <FaFolder />}
                            {item.name}
                        </div>
                        <div className="menu" onClick={(e) => {
                            e.stopPropagation();
                            toggleMenuVisibility(item.id);
                        }}>
                            {!isMenuVisible ? <ImMenu /> : <ImCross />}
                        </div>
                        {isMenuVisible && (
                            <div className="menu-content ml-40 mt-40 absolute bg-white text-center text-[12px] p-2 z-10 rounded-2xl" >
                                <div className="menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500"
                                onClick={()=>{
                                    toggleInputVisibility(item.id);
                                }}>
                                    Add Collection</div>
                                    <div className="menu-item w-28 group hover:bg-green-200 p-2 rounded-xl hover:text-green-500">
                                    Add Page</div>
                                <div className="menu-item w-28 hover:bg-sky-200 p-2 rounded-xl hover:text-sky-500">Rename</div>
                                <div className="menu-item w-28 hover:bg-red-200 p-2 rounded-xl hover:text-red-500">Delete</div>
                            </div>
                        )}
                    </div>
                    {isChildrenVisible && item.children && item.children.map(renderItem)}
                    {isInputVisible && (
                        <input
                        type="text"
                        ref={(el) => { if (el) input.current[item.id] = el; }}
                        onKeyDown={handleKeyDown(item.id)}
                        className="border-2 border-black p-2 rounded-lg w-full mt-2"
                        placeholder="Enter name"
                    />
                    )}
                </div>
            );
        } else if (item.type === 'PAGE') {
            return (
                <div key={item.id} className='bg-slate-400 hover:bg-slate-300 shadow-sm shadow-black ml-4 border-2 border-black mb-1 p-2 cursor-pointer flex flex-row gap-2 items-center'>
                    <FaNoteSticky />
                    <h3>{item.name}</h3>
                </div>
            );
        }
        return null;
    }, [visibleChildren, menuVisibility, toggleChildrenVisibility, toggleMenuVisibility, inputVisible, toggleInputVisibility]);

    return (
        <div>
            {structuredData.map(renderItem)}
        </div>
    );
};

export default DirectoryMap;
