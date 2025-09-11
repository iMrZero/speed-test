/**
 * This File For Test Purpose You Can Play around with it
 */
const FILE_URL = "https://imrzero.github.io/speedtest/20mb.pdf";
const FILE_UPLAOD = "https://speedtest.free.beeceptor.com/upload";
async function downloadSpeed(file) {
  const start = performance.now();
  try {
    const respone = await fetch(file);
    const blob = await respone.blob();
    const end = performance.now();
    const duration = (end - start) / 1000;
    const fileBits = blob.size * 8;
    const mbps = fileBits / duration / 1000000;
    console.log(start, end, duration, fileBits, mbps.toFixed(2));
  } catch (error) {
    console.log("Failed To Fetch :", error);
  }
}
async function uploadSpeed(file) {
  const start = performance.now();
  try {
    const file_size = 1 * 1024 * 1024;
    const dummy_data = new Blob([new ArrayBuffer(file_size)], {
      type: "application/octet-stream",
    });
    const send = await fetch(file, { method: "POST", body: dummy_data });
    const blob = await send.blob();
    const end = performance.now();
    const duration = (end - start) / 1000;
    const bps = blob.size / duration;
    const mbps = (bps * 8) / (1024 * 1024);
    console.log({ start, end, duration, blob: blob.size, mbps });
  } catch (error) {
    console.log("Error on :", error);
  }
}

downloadSpeed(FILE_URL);
uploadSpeed(FILE_UPLAOD);
