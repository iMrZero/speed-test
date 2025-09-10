const testButton = document.querySelector(".run-test");
const downloadSection = document.querySelector(".download-section");
const downloadSpeed = document.querySelector(".download-speed");
const uploadSpeed = document.querySelector(".upload-speed");
const yourIp = document.querySelector(".your-ip");
const yourLocation = document.querySelector(".your-location");
const progressDownload = document.querySelector("#progress");
const progressUpload = document.querySelector("#progress-up");
const FILE_URL = "https://imrzero.github.io/speedtest/20mb.pdf";

async function speedTest() {
  const start = performance.now();
  downloadSpeed.textContent = "-- Mbps";
  progressDownload.style.width = 0;
  try {
    const respone = await fetch(FILE_URL);
    const blob = await respone.blob();
    const end = performance.now();
    const dutation = (end - start) / 1000;
    const filseSizeBits = blob.size * 8;
    const speedMbps = filseSizeBits / dutation / 1000000;
    animateValue(downloadSpeed, 0, speedMbps, 1000, progressDownload);
    getInfo();
  } catch (error) {
    console.log("speed test failed :" + error);
  }
}
async function getInfo() {
  await fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((d) => {
      yourIp.textContent = d.ip;
      yourLocation.textContent = d.country_name;
    });
}
function uploadTest() {
  uploadSpeed.textContent = "-- Mbps";
  progressUpload.style.width = 0;
  // here we create any size we need for the file
  const fileSize = 2 * 1024 * 1024;
  // create file based on the the size that we setup
  // use blob constructor and ArrayBuffyer to initail the binary empty file for upload test
  const dummyData = new Blob([new ArrayBuffer(fileSize)], {
    type: "application/octet-stream",
  });
  // init and a request using xmlhtpp
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://speedtest.free.beeceptor.com/upload", true);
  let startTime;
  let lastLoaded = 0;
  let lastTime = 0;
  xhr.upload.addEventListener("progress", handleProgress);
  xhr.upload.addEventListener("load", handleLoad);
  xhr.upload.addEventListener("error", handleError);
  function handleProgress(e) {
    if (e.lengthComputable) {
      const now = performance.now();

      if (!startTime) {
        startTime = now;
        lastTime = now;
      }
      const elapsed = (now - lastTime) / 1000;
      const uploadedBytes = e.loaded - lastLoaded;
      console.log(elapsed, uploadedBytes);

      if (elapsed > 0) {
        const speedBps = uploadedBytes / elapsed; // bytes per second
        const speedMbps = (speedBps * 8) / (1024 * 1024); // Mbps
        animateValue(uploadSpeed, 0, speedMbps, 1000, progressUpload);
        console.log(speedBps, speedMbps);
        console.log(`Current upload speed: ${speedMbps.toFixed(2)} Mbps`);
      }
      lastLoaded = e.loaded;
      lastTime = now;
    }
  }
  function handleLoad(e) {
    if (xhr.status === 200) {
      console.log("upload completed");
      const totalElapsedTime = (performance.now() - startTime) / 1000;
      const averageSpeedBps = fileSize / totalElapsedTime;
      const averageSpeedMbps = (averageSpeedBps * 8) / (1024 * 1024);
      console.log(`Average upload speed: ${averageSpeedMbps.toFixed(2)} Mbps`);
    } else {
      console.error(`Faild To upload ${xhr.statusText}`);
    }
  }
  function handleError() {
    console.error("Network error during upload.");
  }
  // send data for test
  xhr.send(dummyData);
}

function animateValue(element, start, end, durtion, animateBar) {
  const width = downloadSection.getBoundingClientRect().width;
  let startTime = null;
  function step(timetamp) {
    if (!startTime) startTime = timetamp;
    const progress = Math.min((timetamp - startTime) / durtion, 1);
    const value = start + (end - start) * progress;
    element.textContent = value.toFixed(2) + " Mbps";
    animateBar.style.width = width - value.toFixed(0) + "px";
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
testButton.addEventListener("click", speedTest);
testButton.addEventListener("click", () => setTimeout(uploadTest, 1000));
