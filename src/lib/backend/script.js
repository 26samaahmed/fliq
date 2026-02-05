const video = /** @type {HTMLVideoElement} */ (document.getElementById('video'));
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const photos = /** @type {HTMLElement} */ (document.getElementById('photos'));
const photoButton = /** @type {HTMLButtonElement} */ (document.getElementById('photo-button'));
const clearButton = /** @type {HTMLButtonElement} */ (document.getElementById('clear-button'));
let width = 700,
  height = 0,
  streaming = false;

async function getUserMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

function streamVideo() {
  if (!streaming) {
    // Set video / canvas height
    height = video.videoHeight / (video.videoWidth / width);
    video.setAttribute('width', String(width));
    video.setAttribute('height', String(height));
    canvas.setAttribute('width', String(width));
    canvas.setAttribute('height', String(height));
    streaming = true;
  }
}

function clear() {
  // Clear photos
  photos.innerHTML = '';
}

function takePicture() {
  // Create canvas
  const context = canvas.getContext('2d');
  if (width && height && context) {
    // set canvas props
    canvas.width = width;
    canvas.height = height;
    // Draw an image of the video on the canvas
    context.drawImage(video, 0, 0, width, height);
    // Create image from the canvas
    const imgUrl = canvas.toDataURL('image/png');
    // Create img element
    const img = document.createElement('img');
    // Set img src
    img.setAttribute('src', imgUrl);
    // Add image to photos
    photos.appendChild(img);
  }
}

document.addEventListener('DOMContentLoaded', getUserMedia);
video.addEventListener('canplay', streamVideo);
photoButton.addEventListener('click', takePicture);
clearButton.addEventListener('click', clear);