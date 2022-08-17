'use strict'


const app = function(canvas,file){
    on('change',(e)=>{
        setImage(e.target.files[0],newCanvas(canvas)) 
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget) return
        const canvasObj = newCanvas(I('editedImage'))
        setFilter(e.target.textContent,canvasObj.imageData,canvasObj)
    },I('filterChoose'))


}

app(I('editedImage'),I('fileGetter'))

