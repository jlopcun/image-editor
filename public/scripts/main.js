'use strict'

const app = function(canvas,file){

    const appliedFilters = new Set()

    resetDragDropDefaults()
    on('change',(e)=>{
        setImage(e.target.files[0],newCanvas(canvas),hideLoader)
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget || isCanvasEmpty(newCanvas(canvas))) return
        const filterName = e.target.textContent
        const canvasObj = newCanvas(I('editedImage'))

        show(I('loader'))

        if(!appliedFilters.has(e.target.textContent)){
            setTimeout(()=>setFilter(e.target.textContent,canvasObj.imageData,canvasObj,hideLoader),0)
            appliedFilters.add(e.target.textContent)
            if (filterName==="clear" || filterName==="restore") appliedFilters.clear()
            return
        }
        hide(I('loader'))
        appliedFilters.add(e.target.textContent);
        if (filterName==="clear" || filterName==="restore") appliedFilters.clear()
        console.log(appliedFilters)
    },I('filterChoose'))

    

    on('dragover',(e)=>{
        checkFileType(e.dataTransfer.items[0],'image')
        ?expectedDropFileValidation()
        :unexpectedDropFileValidation()
        isCanvasEmpty(newCanvas(canvas))?show(I('dropmessage')):""
        hide(I('file'))
    },I('canvasContainer'))

    on('drop',(e)=>{
        const file = e.dataTransfer.files[0]
        hide(I('dropmessage'))
        if(!checkFileType(file,'image')) {
            setCanvasDropInterfaceDefault()
            return
        }
        setImage(e.dataTransfer.files[0],newCanvas(canvas),hideLoader)
        setRoot('--canvasContainerBg','#333')
        
    },I('canvasContainer'))

    on('dragleave',(e)=>{
        setCanvasDropInterfaceDefault()
        hide(I('dropmessage'))
    },I('canvasContainer'))
    

    on('change',(e)=>{
        show(I('loader'))
        
        cssFilterSettings[getId(e.target)] = getInputValue(e.target)
        
        updateCssFilters(newCanvas(canvas),appliedFilters,hideLoader)

    },I('cssFilters'))
}

app(I('editedImage'),I('fileGetter'))

