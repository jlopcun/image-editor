'use strict'


const app = function(canvas,file){
    resetDragDropDefaults()
    on('change',(e)=>{
        setImage(e.target.files[0],newCanvas(canvas),hide)
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget) return
        show(I('loader'))
        const canvasObj = newCanvas(I('editedImage'))
        setTimeout(()=>setFilter(e.target.textContent,canvasObj.imageData,canvasObj,hide),0)
        
    },I('filterChoose'))

    

    on('dragover',(e)=>{
        checkFileType(e.dataTransfer.items[0],'image')
        ?expectedDropFileValidation()
        :unexpectedDropFileValidation()

        show(I('dropmessage'))
        hide(I('file'))
    },I('canvasContainer'))

    on('drop',(e)=>{
        const file = e.dataTransfer.files[0]
        if(!file.type.includes('image')) {
            setRoot('--canvasContainerBg','#333')
            show(I('file'))
            clearCanvas(newCanvas(canvas))
            return
        }
        setImage(e.dataTransfer.files[0],newCanvas(canvas),hide)
        setRoot('--canvasContainerBg','#333')
        hide(I('dropmessage'))
    },I('canvasContainer'))

    on('dragleave',(e)=>{
        setRoot('--canvasContainerBg','#333')
        show(I('file'))
        hide(I('dropmessage'))
    },I('canvasContainer'))
    
}

app(I('editedImage'),I('fileGetter'))

