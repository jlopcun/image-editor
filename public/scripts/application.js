const newCanvas = (canvas)=>{
    return {
        ctx:()=>canvas.getContext('2d'),
        ref:canvas,
        getWidth:()=>canvas.width,
        getHeight:()=>canvas.height,
        getImageData:()=>canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height),
        X:(pageX)=>parseInt(Math.abs(pageX - canvas.getBoundingClientRect().left)),
        Y:(pageY)=>parseInt(Math.abs(pageY - canvas.getBoundingClientRect().top)),
        XincreaseIndex:()=>canvas.width / canvas.clientWidth,
        YincreaseIndex:()=>canvas.height / canvas.clientHeight
    }
}


const application = {
    mainLayer:newCanvas(document.getElementById('mainLayer')),
    filterLayer:newCanvas(document.getElementById('filterLayer')),
    subElementsLayer:document.getElementById('subElementsLayer'),
    drawLayer:newCanvas(document.getElementById('drawLayer'))
}