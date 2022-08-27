'use strict'
// GENERAL HELPERS
const I = id => document.getElementById(id)
const elem = tag => document.createElement(tag)
const randomNum = (min,max)=> Math.floor(Math.random() * max ) + min
const attr = R.curry((attribute,value,element)=>{
    element.setAttribute(attribute,value)
    return element
})

const append = (el,node) =>{
    el.appendChild(node)
}

const addClass = (el,...className) =>{
    el.classList.add(...className)
}

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

const getRoot = (varName) =>{
    return window.getComputedStyle(document.body).getPropertyValue(varName)
}

const changeTextContent = (el,text) =>{
    el.textContent = text
}

const hide = el => el.classList.add('hidden')
const show = el => el.classList.remove('hidden')

const getInputValue = input => `${input.value || input.textContent}${input.dataset.unit || ""}`

const getId = el => el.id

const toArray = DOMlist => Array.from(DOMlist)

const objKeys = obj => Object.keys(obj)
const objValues = obj => Object.values(obj)
const objKeyVal = (obj,eqStart,eqEnd = "",separator=",") => objKeys(obj).map((setting,index)=> `${setting}${eqStart}${objValues(obj)[index]}${eqEnd}`).join(separator)

function hideLoader(){
    hide(I('loader'))
}
// CANVAS RELATED METHODS AND OBJECTS



const isCanvasEmpty = canvasObj => canvasObj.getImageData().data.reduce((prev,act)=>prev+act) === 0



const clearCanvas = canvas =>{
    canvas.ctx().clearRect(0,0,canvas.getWidth(),canvas.getHeight())
    canvas.ctx().filter = "none"
}


const drawImage = (canvas,HTMLimage) => canvas.ctx().drawImage(HTMLimage,0,0,HTMLimage.width,HTMLimage.height)

const updateImageData = (imageData,canvas) =>{
    canvas.ctx().putImageData(imageData,0,0)
    // drawImage(canvas,canvas.ref)
}
const download = (callback)=>{
    const a = elem('a')
    const downloadCanvas = createCanvasElement(application.mainLayer.ref,application.filterLayer.ref)
    a.href = downloadCanvas.ref.toDataURL()
    attr('download','jl_edited_image',a)
    a.click()
    if(callback) callback()
}

const createCanvasElement = (...image) =>{
    const canvas = newCanvas(document.createElement('canvas')),
    img = I('imageToEdit')
    console.log(image[0])
    equalSizes(image[0],canvas.ref);
    [...image].forEach(img=>drawImage(canvas,img))
    return canvas
}
// IMAGE HELPER METHODS



const equalSizes = (sizeGetter,sizePut) =>{
    sizePut.width = sizeGetter.width
    sizePut.height = sizeGetter.height
}


const setImage = function(file,canvas,callback){
        hide(I('file'))
        show(I('loader'))
        const img = image(URL.createObjectURL(file),'imageToEdit')
        on('load',()=>{

                equalSizes(img,canvas.ref)
                equalSizes(img,application.filterLayer.ref)
                drawImage(canvas,img)

                callback()
            
        },img)
        
}



// FILTER METHODS AND OBJECTS

const cssFilterSettings = {
    "blur":getInputValue(I('blur')),
    "brightness":getInputValue(I('brightness')),
    "contrast":getInputValue(I('contrast')),
    "grayscale":getInputValue(I('grayscale')),
    "hue-rotate":getInputValue(I('hue-rotate')),
    "invert":getInputValue(I('invert')),
    "saturate":getInputValue(I('saturate')),
    "sepia":getInputValue(I('sepia'))

}

const updateCssFilters = (canvasObj,imageData,callback = null) =>{
        clearCanvas(canvasObj)
        const vals = objValues(cssFilterSettings)
        canvasObj.ctx().filter = `blur(${vals[0]}) brightness(${vals[1]}) contrast(${vals[2]}) grayscale(${vals[3]}) hue-rotate(${vals[4]}) invert(${vals[5]}) saturate(${vals[6]}) sepia(${vals[7]})`
        
        drawImage(canvasObj,I('imageToEdit'))
        canvasObj.ctx().filter = "none"


        if(callback!==null) callback()
        
}

const resetCssInputs = () =>{
    toArray(I('cssFilters').querySelectorAll('.cssFilters__filter__value')).forEach(input=>{
        input.value = input.dataset.default
        cssFilterSettings[getId(input)] = getInputValue(input)
    })
}



const setFilter = (filter,imageData,canvas,callback = null)=>{
    filters[filter](imageData,canvas)

    if(callback!==null) callback()


}

const setDifferentColors = (pixels,colorChanges,conditional,cb) =>{
    const mainLayerData = application.mainLayer.getImageData()
    for(let i=0;i< pixels.length;i+=4){
        if(conditional()){
            pixels[i] += colorChanges[0]
            pixels[i+1] += colorChanges[1]
            pixels[i+2] += colorChanges[2]
            pixels[i+3]  = mainLayerData.data[i + 3]
        }
        
        
    }
    
}

const setSameColor = (pixels,colorChanges,conditional,cb)=>{
    const mainLayerData = application.mainLayer.getImageData()
    for(let i=0;i< pixels.length;i+=4){
        if(conditional()){
            pixels[i] += colorChanges
            pixels[i+1] += colorChanges
            pixels[i+2] += colorChanges
            pixels[i+3] = mainLayerData.data[i+3]
        }
        
    }
}

const newFilter = (imageData,canvasObject,colorChanges,conditional=false)=> {
    Array.isArray(colorChanges)
    ?setDifferentColors(imageData.data,colorChanges,conditional)
    :setSameColor(imageData.data,colorChanges,conditional)
    updateImageData(imageData,canvasObject)

}



const filters = {
    'glitch':(imageData,canvas)=>{
        newFilter(imageData,canvas,[0,255,0],()=>randomNum(1,10) > 6)



    },
    "crash":(imageData,canvas)=>{
        const mainLayer = application.mainLayer.getImageData()
        for(let i=0;i<imageData.data.length;i+=4){
            if(randomNum(1,10)>5){
                const newColor = i + randomNum(-1,4)
                imageData.data[i] = mainLayer.data[newColor]
                imageData.data[i +1] = mainLayer.data[newColor+1]
                imageData.data[i+2] = mainLayer.data[newColor+2]
                imageData.data[i+3] = mainLayer.data[i+3]
            }
        }
        updateImageData(imageData,canvas)

    },
    'reset':(imageData,canvas)=>{
        clearCanvas(application.filterLayer)
    }
    
    
}




// FILE METHODS
const resetDragDropDefaults = () =>{
    on('dragover',(e)=>{
        e.preventDefault()
    },window)
    on('drop',(e)=>{
        e.preventDefault()
    },window)
}

const checkFileType = (file,type) =>{
    return file.type.includes(type)
}


const expectedDropFileValidation = () =>{
    setRoot('--canvasContainerBg',getRoot('--fulfilledBg'))
    changeTextContent(I('dropmessage'),'drop it!!!')

}

const unexpectedDropFileValidation = () =>{
    setRoot('--canvasContainerBg',getRoot('--errBg'))
    changeTextContent(I('dropmessage'),'only can accept image files')
}

const setCanvasDropInterfaceDefault = () =>{
    setRoot('--canvasContainerBg','#333')
    isCanvasEmpty(newCanvas(I('imageToEdit')))?show(I('file')):""
}



