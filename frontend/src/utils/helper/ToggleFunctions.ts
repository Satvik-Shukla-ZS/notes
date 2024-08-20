export const toggleChildrenVisibility = (collectionId: number, setLoading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>, isSelect : boolean, setSelected: React.Dispatch<React.SetStateAction<Array<number>>>, setVisibleChildren:React.Dispatch<React.SetStateAction<Set<number>>> ) => {
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
        }, 300)
    }
}

export const toggleSelect = (setIsSelect: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsSelect(prev => !prev)
};

export const toggleMenuVisibility = 
    (collectionId: number, setMenuVisibility: React.Dispatch<React.SetStateAction<Record<number, boolean>>>) => {
        setMenuVisibility((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
    }

export const toggleInputVisibility = 
    (collectionId: number, type: string, setMenuVisibility: React.Dispatch<React.SetStateAction<Record<number, boolean>>>, setInputVisible: React.Dispatch<React.SetStateAction<Record<number, boolean>>>, setType : React.Dispatch<React.SetStateAction<string>>) => {
        setInputVisible((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
        setMenuVisibility((prev) => ({
            ...prev,
            [collectionId]: !prev[collectionId]
        }))
        setType(type)
    }

export const toggleRenameVisibility = (collectionId: number, setRename: React.Dispatch<React.SetStateAction<Record<number, boolean>>>) => {
    setRename((prev) => ({
        ...prev,
        [collectionId]: !prev[collectionId]
    }))
}