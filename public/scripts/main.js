'use strict'

const app = function(canvas,file){
    resetDragDropDefaults()
    on('change',(e)=>{
        setImage(e.target.files[0],newCanvas(canvas),hideLoader)
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget) return
        show(I('loader'))
        const canvasObj = newCanvas(I('editedImage'))
        setTimeout(()=>setFilter(e.target.textContent,canvasObj.imageData,canvasObj,hideLoader),0)
        
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
    
}

app(I('editedImage'),I('fileGetter'))

