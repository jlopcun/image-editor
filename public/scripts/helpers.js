'use strict'
// GENERAL HELPERS
const I = id => document.getElementById(id)
const elem = tag => document.createElement(tag)
const randomNum = (min,max)=> Math.floor(Math.random() * max ) + min
const attr = R.curry((attribute,value,element)=>{
    element.setAttribute(attribute,value)
    return element
})
const image =(src,id)=>{
    return R.compose(
        attr('src',src)
    )(id?I(id):elem('img'))
}
const on = function(eventType,cb,element){
    element.addEventListener(eventType,cb)
}

const setRoot = (varName,varValue) =>{
    document.documentElement.style.setProperty(varName,varValue)
}

// CANVAS RELATED METHODS AND OBJECTS
const clearCanvas = canvas => canvas.ctx.clearRect(0,0,canvas.width,canvas.height)
const drawImage = (canvas,HTMLimage) => canvas.ctx.drawImage(HTMLimage,0,0,canvas.width,canvas.height)
const newCanvas = (canvas)=>{
    return {
        ctx:canvas.getContext('2d'),
        ref:canvas,
        width:canvas.width,
        height:canvas.height,
        imageData:canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height),
        X:(pageX)=>parseInt(Math.abs(pageX - canvas.getBoundingClientRect().left)),
        Y:(pageY)=>parseInt(Math.abs(pageY - canvas.getBoundingClientRect().top))
    }
}
const updateImageData = (imageData,canvas) => canvas.ctx.putImageData(imageData,0,0)
const setDownloadLink = (canvas,linkId)=> I(linkId).href = canvas.ref.toDataURL()
// IMAGE HELPER METHODS

const resize = (width,height,limit) =>{
    return width > limit?resize(width * .65,height *.65,limit):[width,height]
}

const setImage = function(file,canvas,filter){
    const reader = new FileReader()

    reader.readAsDataURL(file)

    on('load',()=>{
        const img = image(reader.result,'imageToEdit')
        on('load',()=>{
            clearCanvas(canvas)
            drawImage(canvas,img)
            setRoot('--canvasWidth',`${resize(img.width,img.height,400)[0]}px`)
            setRoot('--canvasHeight',`${resize(img.width,img.height,400)[1]}px`)
            filter?setFilter(filter,canvas.ctx.getImageData(0,0,canvas.width,canvas.height),canvas):""
            setDownloadLink(canvas,'imageDownloadLink')
        },img)
    },reader)
}



// FILTER METHODS AND OBJECTS
const setFilter = (filter,imageData,canvas)=>{
    filters[filter](imageData,canvas)
}

const setDifferentColors = (pixels,colorChanges,conditional) =>{
    for(let i=0;i< pixels.length;i+=4){
        if(conditional()){
            pixels[i] += colorChanges[0]
            pixels[i+1] += colorChanges[1]
            pixels[i+2] += colorChanges[2]
        }
    }
    
}

const setSameColor = (pixels,colorChanges,conditional)=>{
    for(let i=0;i< pixels.length;i+=4){
        if(conditional()){
            pixels[i] += colorChanges
            pixels[i+1] += colorChanges
            pixels[i+2] += colorChanges
        }
        
    }
}

const newFilter = (imageData,canvasObject,colorChanges,conditional=false)=> {
    Array.isArray(colorChanges)
    ?setDifferentColors(imageData.data,colorChanges,conditional)
    :setSameColor(imageData.data,colorChanges,conditional)
    updateImageData(imageData,canvasObject)
    setDownloadLink(canvasObject,'imageDownloadLink')
}

// const pixelGetX = (redIndex,width) =>redIndex > width?pixelGetX(redIndex - width,width):redIndex
// const pixelGetY = (redIndex,width,row=1) => redIndex > width ?pixelGetY(redIndex - width,width,row+1):row
// const getPixelPosition = (redIndex,row) => [pixelGetX(redIndex,row),pixelGetY(redIndex,row)]

// const getPixelFromPosition = (x,y,width) => (x + (y) * width/2) * 4

const getPixelColors = (x,y,canvasObj) =>{
    const pixel = canvasObj.ctx.getImageData(x, y, 1, 1);
    const pixelData = pixel.data;
    setRoot('--actualPixelColor',`rgba(${pixelData[0]},${pixelData[1]},${pixelData[2]},${pixelData[3]})`)
}
const filters = {
    'glitch':(imageData,canvas)=> newFilter(imageData,canvas,[0,255,0],()=>randomNum(1,10) > 6),
    'grayscale':(imageData,canvas)=>{
            for(let i=0;i<imageData.data.length; i+=4){
                const colors = [
                    imageData.data[i],
                    imageData.data[i + 1],
                    imageData.data[i + 2]
                ]
                if(!colors.every(color=>color<100)){
                    imageData.data[i] = imageData.data[i] - 70
                    imageData.data[i + 1] = imageData.data[i + 1] - 70
                    imageData.data[i + 2] = imageData.data[i + 2] - 70
                }
            }
            updateImageData(imageData,canvas)
            setDownloadLink(canvas,'imageDownloadLink')
    },
    'blue':(imageData,canvas)=>{
        // TESTING
        newFilter(imageData,canvas,[-50,-50,+50],()=>true)
        console.log(imageData)
    }
    ,
    'blur':(imageData,canvas)=>{
        for(let i=0;i<imageData.data.length;i+=4){
            const newIndex = randomNum(1,10) > 5?i + 4 * randomNum(-1,4) :i
            imageData.data[i] = imageData.data[newIndex]
            imageData.data[i + 1] = imageData.data[newIndex + 1]
            imageData.data[i + 2] = imageData.data[newIndex + 2] 
        }
        updateImageData(imageData,canvas)
        setDownloadLink(canvas,'imageDownloadLink')
    },
    'restore':(imageData,canvas)=>{
        clearCanvas(canvas)
        drawImage(canvas,I('imageToEdit'))
        setDownloadLink(canvas,'imageDownloadLink')
    },
    "border":(imageData,canvas)=>{
        for(let i=0;i<imageData.data.length;i+=4){
            
        }
    },
    'pale':(imageData,canvas)=> newFilter(imageData,canvas,[50,50,0],()=>true)
    ,
    'clear':(imageData,canvas)=>{
        clearCanvas(canvas)
        I('imageDownloadLink').removeAttribute('href')
    },
    "crash":(imageData,canvas)=>{
        for(let i=0;i<imageData.data.length;i+=4){
            const newColor = randomNum(1,10) > 5 ?i + randomNum(-1,4):i
            imageData.data[i] = imageData.data[newColor]
            imageData.data[i +1] = imageData.data[newColor+1]
            imageData.data[i+2] = imageData.data[newColor+2]
        }
        updateImageData(imageData,canvas)
        setDownloadLink(canvas,'imageDownloadLink')
    }
}


