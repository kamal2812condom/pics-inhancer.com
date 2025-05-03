(() => {
  const fileInput = document.getElementById('fileInput');
  const previewImage = document.getElementById('previewImage');
  const previewVideo = document.getElementById('previewVideo');
  const upgradedCanvas = document.getElementById('upgradedCanvas');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resultText = document.getElementById('resultText');

  let currentFile = null;
  let currentType = null; // 'image' or 'video'

  function resetPreview() {
    previewImage.style.display = 'none';
    previewImage.src = '';
    previewVideo.style.display = 'none';
    previewVideo.src = '';
    upgradedCanvas.style.display = 'none';
    const ctx = upgradedCanvas.getContext('2d');
    ctx.clearRect(0, 0, upgradedCanvas.width, upgradedCanvas.height);
    resultText.textContent = '';
    upgradeBtn.disabled = true;
    downloadBtn.style.display = 'none'; // Hide download button
  }

  function displayImage(file) {
    const url = URL.createObjectURL(file);
    previewImage.src = url;
    previewImage.style.display = 'block';
    previewVideo.style.display = 'none';
    upgradedCanvas.style.display = 'none';
    upgradeBtn.disabled = false;
    resultText.textContent = '';
  }

  function displayVideo(file) {
    const url = URL.createObjectURL(file);
    previewVideo.src = url;
    previewVideo.style.display = 'block';
    previewVideo.load();
    previewImage.style.display = 'none';
    upgradedCanvas.style.display = 'none';
    upgradeBtn.disabled = false;
    resultText.textContent = '';
  }

  function upscaleImage(img, scaleFactor = 2) {
    const canvas = upgradedCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth * scaleFactor;
    canvas.height = img.naturalHeight * scaleFactor;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';
    
    // Show download button
    downloadBtn.style.display = 'block';
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = upgradedCanvas.toDataURL('image/png');
      link.download = 'upgraded-image.png'; // Set the default file name
      link.click();
    };
  }

  function simulateVideoUpgrade() {
    upgradedCanvas.style.display = 'none';
    resultText.textContent = 'Video resolution upscaling is a complex task and requires backend processing. This tool simulates the upgrade visually by playing the video full size.';
    downloadBtn.style.display = 'none'; // Hide download button for video
  }

  fileInput.addEventListener('change', (e) => {
    resetPreview();
    const file = e.target.files[0];
    if (!file) {
      currentFile = null;
      currentType = null;
      return;
    }
    currentFile = file;
    if (file.type.startsWith('image/')) {
      currentType = 'image';
      displayImage(file);
    } else if (file.type.startsWith('video/')) {
      currentType = 'video';
      displayVideo(file);
    } else {
      currentType = null;
      resultText.textContent = 'Unsupported file type. Please upload an image or video.';
      upgradeBtn.disabled = true;
    }
  });

  upgradeBtn.addEventListener('click', () => {
    if (!currentFile) return;
    if (currentType === 'image') {
      const img = new Image();
      img.onload = () => {
        upscaleImage(img);
        resultText.textContent = 'Resolution upgraded by 2x (simulated using canvas).';
      };
      img.onerror = () => {
        resultText.textContent = 'Failed to load the image for processing.';
      };
      img.src = URL.create