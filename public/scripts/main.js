'use strict'


const app = function(canvas,file,filter){

    on('change',(e)=>{
        setImage(e.target.files[0],newCanvas(canvas)) 
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget) return
        const canvasObj = newCanvas(I('editedImage'))
        setFilter(e.target.textContent,canvasObj.imageData,canvasObj)
    },I('filterChoose'))

    on('mousemove',(e)=>{
        const canvasObj = newCanvas(I('editedImage'))
        getPixelColors(canvasObj.X(e.pageX),canvasObj.Y(e.pageY),canvasObj)
    },canvas)
}

app(I('editedImage'),I('fileGetter'))

