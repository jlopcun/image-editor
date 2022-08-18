'use strict'


const app = function(canvas,file){
    on('change',(e)=>{
        hide(I('file'))
        show(I('loader'))
        setImage(e.target.files[0],newCanvas(canvas),hide)
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget) return
        show(I('loader'))
        const canvasObj = newCanvas(I('editedImage'))
        setTimeout(()=>setFilter(e.target.textContent,canvasObj.imageData,canvasObj,hide),0)
        
    },I('filterChoose'))
    
}

app(I('editedImage'),I('fileGetter'))

