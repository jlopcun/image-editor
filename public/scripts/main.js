'use strict'


const app = function(canvas,file){
    on('change',(e)=>{
        hide(I('file'))
        show(I('loader'))
        setImage(e.target.files[0],newCanvas(canvas),hide)
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget) return
        const canvasObj = newCanvas(I('editedImage'))
        show(I('loader'))
        setFilter(e.target.textContent,canvasObj.imageData,canvasObj,hide)

    },I('filterChoose'))

}

app(I('editedImage'),I('fileGetter'))

