'use strict'

const app = function(canvas,file){


    resetDragDropDefaults()
    on('change',(e)=>{
        setImage(e.target.files[0],newCanvas(canvas),hideLoader)
    },file)

    on('click',(e)=>{
        show(I('loader'))
        setTimeout(()=>setFilter(e.target.textContent,newCanvas(canvas).imageData,newCanvas(canvas),hideLoader),0)
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
        
        setTimeout(()=>updateCssFilters(newCanvas(canvas),newCanvas(canvas).imageData,hideLoader),1)
    },I('cssFilters'))
}

app(I('editedImage'),I('fileGetter'))

