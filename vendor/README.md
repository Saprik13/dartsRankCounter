# Vendored OCR assets

- `tesseract/`: Tesseract.js 7.0.0 browser bundle and worker, Apache-2.0.
- `tesseract-core/`: tesseract.js-core 7.0.0 WebAssembly builds, Apache-2.0.
- `tessdata/`: Ukrainian and English `4.0.0_fast` traineddata, Apache-2.0.

These files are intentionally committed so GitHub Pages performs OCR without runtime CDN requests. When updating Tesseract.js, update the worker and every core variant together, including relaxed-SIMD builds.
