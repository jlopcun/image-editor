const newCanvas = (canvas)=>{
    return {
        ctx:()=>canvas.getContext('2d'),
        ref:canvas,
        getWidth:()=>canvas.width,
        getHeight:()=>canvas.height,
        getImageData:()=>canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height),
        X:(pageX)=>parseInt(Math.abs(pageX - canvas.getBoundingClientRect().left)),
        Y:(pageY)=>parseInt(Math.abs(pageY - canvas.getBoundingClientRect().top))
    }
}


const application = {
    mainLayer:newCanvas(document.getElementById('mainLayer')),
    filterLayer:newCanvas(document.getElementById('filterLayer'))
}