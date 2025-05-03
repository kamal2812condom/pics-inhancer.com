 upscaleBtn.addEventListener('click', async () => {
      if (!currentFile) return;
      upscaleBtn.disabled = true;
      loadingText.style.display = 'block';
      enhancedImage.src = '';
      downloadBtn.style.display = 'none';

      try {
        const img = new Image();
        const originalUrl = URL.createObjectURL(currentFile);
        img.src = originalUrl;

        await new Promise((resolve, reject) => {
          img.onload = () => {
            URL.revokeObjectURL(originalUrl); // Clean up
            resolve();
          };
          img.onerror = reject;
        });

        // Use window.Upscaler to refer to the class correctly
        const upscaler = new window.Upscaler({
          scale: 4,
          model: 'esrgan',
        });

        const output = await upscaler.upscale(img);
        const blob = await new Promise(resolve => output.canvas.toBlob(resolve, 'image/png'));

        if (upscaledBlobUrl) {
          URL.revokeObjectURL(upscaledBlobUrl);
        }
        upscaledBlobUrl = URL.createObjectURL(blob);
        enhancedImage.src = upscaledBlobUrl;

        downloadBtn.style.display = 'block';
        loadingText.style.display = 'none';
      } catch (error) {
        loadingText.style.display = 'none';
        upscaleBtn.disabled = false;
        alert('Error during upscaling: ' + error.message);
      }
    });