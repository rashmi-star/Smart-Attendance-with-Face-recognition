(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
const imageUpload = document.getElementById('imageUpload')
let canvas


Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const LabeledFaceDescriptors= await loadLabeledImages()
  const faceMatcher=new faceapi.FaceMatcher(LabeledFaceDescriptors,0.6)
  let image
  let canvas
  let results
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if(image) image.remove()
    if(canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    results=resizedDetections.map(d=>faceMatcher.findBestMatch(d.descriptor))

    var today = new Date();//date
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    var d = new Date();//time
    var n = d.toLocaleTimeString();

    const fs = require('fs')

    const mystr = today+"("+n+")"+","+" "+","+results.toString();//converting to string
    var arr=mystr.split(",")
    var CsvString = "";
    arr.forEach(function(RowItem) {
      CsvString += RowItem + ',';
      CsvString += "\r\n";
    });
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
    var x = document.createElement("A");
    x.setAttribute("href", CsvString );
    x.setAttribute("download",today+"("+n+")"+".csv");
    document.body.appendChild(x);
    x.click();

    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box,{label:result.toString()})
      drawBox.draw(canvas)
    })
  })
}

function loadLabeledImages(){
  const labels=["Hema","Lavanya","Manas","Maria","Meenakshi","Monisha","Mythra","Narmatha","Nikki","Nithya","Paarkavi","Pavals","Pavithra","Preetha","Priya","Rashmi","Rithanya" ,"Roshini","Sai","Sanjushree"]
  return Promise.all(
    labels.map(async label =>{
      const descriptions=[]
      for(let i=1;i<=10;i++){
        const img = await faceapi.fetchImage(`labeled_images/${label}/1 (${i}).jpg`)

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)

    })
  )
}


},{"fs":1}]},{},[2]);
