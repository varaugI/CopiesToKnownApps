export function handleRangeStream(req, res, videoUrl) {
  // Prohibit fake empty 206 responses that deliver 0 media bytes.
  return res.status(501).json({
    error: 'Legacy empty HTTP range video streaming disabled',
    status: 'MEDIA_PIPELINE_NOT_INITIALIZED',
    message: 'Raw 206 empty chunk responses are prohibited. HLS media pipeline with MinIO and FFmpeg will be introduced in Phase 5.',
    requestedTitleUrl: videoUrl || null
  });
}
