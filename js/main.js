const video = document.getElementById("video");
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models")
]).then(startVideo);
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => {
      return console.error(err);
    }
  );
}
video.addEventListener('play', () => {
    const canvas=faceapi.createCanvasFromMedia(video);
document.body.append(canvas);
const displaySize={width:video.width,height:video.height}
faceapi.matchDimensions(canvas, displaySize);
setInterval(async () => { 
const detections=await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions())
.withFaceLandmarks()
.withFaceDescriptors()
.withAgeAndGender()
const landmarks=await faceapi.detectFaceLandmarks(video,new faceapi.TinyFaceDetectorOptions())
const resizedDetections=faceapi.resizeResults(detections,displaySize);
console.log("resizeddetections"+resizedDetections.toString())
canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
if(!resizedDetections.length){
  console.log("mask")
  document.getElementById("GFG").innerHTML="WITH MASK";
  return;
}
document.getElementById("GFG").innerHTML="";
faceapi.draw.drawDetections(canvas,resizedDetections);
faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
resizedDetections.forEach(result => {
  const { age, gender, genderProbability } = result
  new faceapi.draw.DrawTextField(
    [
      `${faceapi.utils.round(age, 0)} years`,
      `${gender} (${faceapi.utils.round(genderProbability)})`
    ],
    result.detection.box.bottomLeft
  ).draw(canvas)
})
},100)
})