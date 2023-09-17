const imageUpload = document.getElementById('imageUpload')
const DownloadBtn = document.getElementById('Downloadbutton')
const MailBtn = document.getElementById('Mailbutton')

var myVar, output;
var count=0;

function myFunctions() {
  myVar = setTimeout(showPage, 500);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

let canvas
var mails


Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  let ar=[]
  let ans=[]
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const LabeledFaceDescriptors= await loadLabeledImages()
  const faceMatcher=new faceapi.FaceMatcher(LabeledFaceDescriptors,0.60)
  let image
  let canvas
  let results
  myFunctions()
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

    results.forEach((result, i) => {
      ab=result.toString();
      var b=ab.split("-")
      var arrs=ab.split("(")
      if(arrs[0]=="unknown "){
        count=count+1
      }
      else{
        ar.push(arrs[0])
      }
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box,{label:b[0]})
      drawBox.draw(canvas)  
    })
 
    ans=arraywithoutpercent(ar)
    //document.body.append(ans)

   

    //const fs = require('fs')


    const mystr1 = "Student Absent"+","+" "+","+ans.toString();//converting to string
    const mystr2="Students Present"+","+" "+","+"No of unknowns:"+count+","+""+","+ar.toString();

    mails=ans.toString();

    var arrA=mystr1.split(",")
    var arr2s=mystr2.split(",")

    let arrP = arr2s.filter((c, index) => {
      return arr2s.indexOf(c) === index;
  });

   //var arr1=new Set(arr1)
    var a1size=arrA.length
    var a2size=arrP.length

    if(a1size>a2size){
      for(let i=0; i<a1size-a2size;i++){
        arrP.push("")
      }
    }
    else{
      for(let i=0; i<a2size-a1size;i++){
        arrA.push("")
      }

    }
    

   // console.log(ar); 
  output=[arrP,arrA]
   
  })
    
}

function loadLabeledImages(){
  const labels=["Hema-310619104306","Ajay-310619104301","Patrick-310619104084","James-310619104307","Manoj-310619104308","Pradeep T-310619104089","Lavanya-310619104060","Meha-310619104068","Manas-310619104064","Maria-310619104066","Meenakshi-310619104067","Monisha-310619104075","Mythra-310619104077","Narmatha-310619104078","Nikki-310619104095","Nithya-310619104082","Paarkavi-310619104083","Pavals-310619104085","Pavithra-310619104086","Preetha-310619104094","Priya-310619104097","Rashmi-310619104102","Rithanya-310619104105" ,"Roshini-310619104110","Sai-310619104111","Sanjushree-310619104116"]
  return Promise.all(
    labels.map(async label =>{
      const descriptions=[]
      for(let i=1;i<=10;i++){
        const img = await faceapi.fetchImage(`labeled_images/IV CSE B/${label}/1 (${i}).jpg`)

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)

    })
  )
}
function arraywithoutpercent(resArr){
 // var namesToDeleteArr=[]
  const namesArr=['Hema-310619104306 ',"Ajay-310619104301 ","Patrick-310619104084 ","James-310619104307 ","Manoj-310619104308 ","Pradeep T-310619104089 ",'Lavanya-310619104060 ',"Meha-310619104068 ",'Manas-310619104064 ',"Maria-310619104066 ","Meenakshi-310619104067 ","Monisha-310619104075 ","Mythra-310619104077 ","Narmatha-310619104078 ","Nikki-310619104095 ","Nithya-310619104082 ","Paarkavi-310619104083 ","Pavals-310619104085 ","Pavithra-310619104086 ","Preetha-310619104094 ","Priya-310619104097 ","Rashmi-310619104102 ","Rithanya-310619104105 " ,"Roshini-310619104110 ","Sai-310619104111 ","Sanjushree-310619104116 "]

const toRemove = new Set(resArr);//alternatively include in array can be used
  
difference = namesArr.filter( x => !toRemove.has(x) );

//console.log(difference); 
return difference
}
MailBtn.addEventListener("click",mailFunc);
function mailFunc(){
  var today = new Date();//date
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;

  var d = new Date();//time
  var n = d.toLocaleTimeString();
  var hi=mails.replaceAll(" ,","%0d%0a")
 // console.log(hi); 
window.open('mailto:abc@randomemail.com?subject=Absentees CSE-B '+today+"("+n+")"+'&body='+hi);


}
DownloadBtn.addEventListener("click", myFunc)
  function myFunc(){ 
    var today = new Date();//date
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    var d = new Date();//time
    var n = d.toLocaleTimeString();
   
  var resulti=new Array(output[0].length);
  for(var i=0; i<resulti.length;i++){
    resulti[i]=new Array(output.length);
    for(var j=0;j<resulti[i].length;j++){
      resulti[i][j]=output[j][i];
    }
  }


  var CsvString = "";

  resulti.forEach(function(RowItem, RowIndex) {
  RowItem.forEach(function(ColItem, ColIndex) {
    CsvString += ColItem + ',';
  });
  CsvString += "\r\n";
});

  CsvString = "data:application/csv," + encodeURIComponent(CsvString);
  var x = document.createElement("A");
  x.setAttribute("href", CsvString );
  x.setAttribute("download","IV CSE B"+"-"+today+"("+n+")"+".csv");
  document.body.appendChild(x);
  x.click();

  //location.reload()
  }
