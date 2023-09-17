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
  const faceMatcher=new faceapi.FaceMatcher(LabeledFaceDescriptors,0.55)
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
 

    const mystr1 = "Student Absent"+","+" "+","+ans.toString();//converting to string
    const mystr2="Students Present"+","+" "+","+"No of unknowns:"+count+","+""+","+ar.toString();

    mails=ans.toString();


    var arrA=mystr1.split(",")
    var arr2s=mystr2.split(",")

    let arrP = arr2s.filter((c, index) => {
      return arr2s.indexOf(c) === index;
  });

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

    output=[arrP,arrA]
    //const fs = require('fs')
  
  })
}
function loadLabeledImages(){
  const labels=["Adhitya-3106204001","Jagadeeswar-3106204002","Arvind-3106204003","Nikhilesh-3106204004","Harish-3106204005","Razeen-3106204006","Pratheep-3106204007","Sam-3106204008","Varnesh-3106204009","Vignesh S-3106204010","Vinay-3106204011","Naveen-3106204012","Santhosh-3106204013","Dinesh-3106204014","Pothi-3106204015","Prabhakaran-3106204016","Mithun-3106204017","Vignesh-3106204018","Nikhilan-3106204019","Tharun-3106204020","Avinash-3106204021"]

  //const labels=["Yuvan",'Vishnu','Srinivas','Sri','Vasu','Yogaraj','Siva','SriHari','uma','sweatha','SweathaSri','Srinithi','Suruthi','Vasunthra','Swathi Rajan']
  return Promise.all(
    labels.map(async label =>{
      const descriptions=[]
      for(let i=1;i<=10;i++){
        const img = await faceapi.fetchImage(`labeled_images/III AUTOMOBILE/${label}/1 (${i}).jpg`)

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)

    })
  )
}
function arraywithoutpercent(resArr){
  //var namesToDeleteArr=[]

  
  const namesArr=["Adhitya-3106204001 ","Jagadeeswar-3106204002 ","Arvind-3106204003 ","Nikhilesh-3106204004 ","Harish-3106204005 ","Razeen-3106204006 ","Pratheep-3106204007 ","Sam-3106204008 ","Varnesh-3106204009 ","Vignesh S-3106204010 ","Vinay-3106204011 ","Naveen-3106204012 ","Santhosh-3106204013 ","Dinesh-3106204014 ","Pothi-3106204015 ","Prabhakaran-3106204016 ","Mithun-3106204017 ","Vignesh-3106204018 ","Nikhilan-3106204019 ","Tharun-3106204020 ","Avinash-3106204021 ","Tharun Pranath-3106204022 ","Lourdu-3106204023 "]
 // const namesArr=["Yuvan ",'Vishnu ','Srinivas ','Sri ','Vasu ','Yogaraj ','Siva ','SriHari ','Uma ','sweatha ','SweathaSri ','Srinithi ','Suruthi ','Swathi Rajan ','Vasunthra ']

const toRemove = new Set(resArr);
  
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
  x.setAttribute("download","III AUTOMOBILE"+"-"+today+"("+n+")"+".csv");
  document.body.appendChild(x);
  x.click();

  //location.reload()
  }

