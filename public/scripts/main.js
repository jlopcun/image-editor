'use strict'

const app = function(canvas,file){
    resetCssInputs()
    resetDragDropDefaults()
    on('change',(e)=>{
        setImage(e.target.files[0],canvas,hideLoader)
        resetCssInputs()
    },file)

    on('click',(e)=>{
        if(e.target===e.currentTarget || isCanvasEmpty(canvas)) return
        show(I('loader'))
        setTimeout(()=>setFilter(e.target.dataset.filter || e.target.closest('[data-filter]').dataset.filter,application.filterLayer.getImageData(),application.filterLayer,hideLoader),0)
    },I('filterChoose'))

    

    on('dragover',(e)=>{
        checkFileType(e.dataTransfer.items[0],'image')
        ?expectedDropFileValidation()
        :unexpectedDropFileValidation()
        isCanvasEmpty(canvas)?show(I('dropmessage')):""
        hide(I('file'))
    },I('canvasContainer'))

    on('drop',(e)=>{
        const file = e.dataTransfer.files[0]
        hide(I('dropmessage'))
        resetCssInputs()
        if(!checkFileType(file,'image')) {
            setCanvasDropInterfaceDefault()
            return
        }
        setImage(e.dataTransfer.files[0],canvas,hideLoader)
        setRoot('--canvasContainerBg','#333')
        resetCssInputs()
        
    },I('canvasContainer'))

    on('dragleave',(e)=>{
        setCanvasDropInterfaceDefault()
        hide(I('dropmessage'))
    },I('canvasContainer'))
    on('dragend',()=>{
        setCanvasDropInterfaceDefault()
        hide(I('dropmessage'))
    },I('canvasContainer'))

    on('change',(e)=>{
        show(I('loader'))
        cssFilterSettings[getId(e.target)] = getInputValue(e.target)
        
        setTimeout(()=>updateCssFilters(canvas,canvas.getImageData(),hideLoader),1)
    },I('cssFilters'))


    on('click',(e)=>{
        if(isCanvasEmpty(canvas)) return
        show(I('loader'))
        setTimeout(()=>download(hideLoader),0)
    },I('imageDownloadButton'))


    on('click',()=>{
        clearCanvas(canvas)
        drawImage(canvas,I('imageToEdit'),{})
        resetCssInputs()
    },I('resetCss'))

    on('click',()=>{
        I('imageToEdit').src = ""
        clearCanvas(application.filterLayer)
        clearCanvas(application.mainLayer)
        resetCssInputs()
        I('addImage').setAttribute('disabled',"")
        I('addImage__label').setAttribute('data-disabled',"")
        removeAllChildren(application.subElementsLayer)
        show(I('file'))
    },I('clearCanvas'))

    on('change',(e)=>{
        setRoot('--mainColor',getInputValue(e.target))
    },I('mainColorPicker'))


    on('click',()=>{
        setRoot('--mainColor','#5fb')
    },I('resetSettings'))

    on('resize',()=>{
        setRoot('--layerWidth',getComputedStyle(application.mainLayer.ref).width)
        setRoot('--layerHeight',getComputedStyle(application.mainLayer.ref).height)
    },window)

    on('change',(e)=>{
        show(I('loader'))
        const fileLink = URL.createObjectURL(e.target.files[0])
        setSubElement('img',fileLink,hideLoader)
    },I('addImage'))

    on('click',(e)=>{
        const actions = {
            'subElementsLayer__subElement__del':()=>{
                application.subElementsLayer.removeChild(e.target.closest('.subElementsLayer__subElement'))
            }
        }
        if(actions[e.target.classList[0]]) actions[e.target.classList[0]]()
    },I('subElementsLayer'))
}


app(application.mainLayer,I('fileGetter'))


