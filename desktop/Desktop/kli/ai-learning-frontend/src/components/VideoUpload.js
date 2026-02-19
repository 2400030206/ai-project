import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import './VideoUpload.css';

function VideoUpload() {
  const { user } = useContext(AppContext);
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [supportedLanguages, setSupportedLanguages] = useState({});

  useEffect(() => {
    fetchLanguages();
    fetchVideos();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/localization/languages');
      const data = await response.json();
      setSupportedLanguages(data);
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (selectedFile.size > maxSize) {
        setError('File size exceeds 500MB limit');
        return;
      }
      
      const allowedFormats = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', 'video/webm', 'video/x-flv', 'video/x-ms-wmv'];
      if (!allowedFormats.includes(selectedFile.type)) {
        setError('Only video files are allowed (MP4, AVI, MOV, MKV, WebM, FLV, WMV)');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a video file');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a video title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('language', language);

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      setSuccess(`✓ Video "${data.title}" uploaded successfully! (${data.fileSizeFormatted})`);
      setFile(null);
      setTitle('');
      setDescription('');
      setLanguage('en');
      document.querySelector('input[type="file"]').value = '';
      
      // Refresh videos list
      fetchVideos();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Delete failed');
      setSuccess('Video deleted successfully');
      fetchVideos();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete video');
    }
  };

  return (
    <div className="video-upload-container">
      <div className="upload-section">
        <h2>📹 Upload Learning Video</h2>
        <p className="subtitle">Share videos like YouTube for your learning community</p>
        
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="video-file">Select Video File</label>
            <input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={loading}
              className="file-input"
            />
            <small>Supported: MP4, AVI, MOV, MKV, WebM (Max 500MB)</small>
          </div>

          <div className="form-group">
            <label htmlFor="video-title">Video Title *</label>
            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title (e.g., Introduction to Python)"
              disabled={loading}
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-description">Description</label>
            <textarea
              id="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              disabled={loading}
              maxLength="500"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video-language">Language</label>
            <select
              id="video-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
            >
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">⚠️ {error}</div>}
          {success && <div className="success-message">✓ {success}</div>}

          <button
            type="submit"
            disabled={loading || !file}
            className="upload-btn"
          >
            {loading ? '⏳ Uploading...' : '📤 Upload Video'}
          </button>
        </form>
      </div>

      <div className="videos-section">
        <h3>📺 Available Videos</h3>
        {videos.length === 0 ? (
          <p className="no-videos">No videos uploaded yet</p>
        ) : (
          <div className="videos-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-card">
                <div className="video-header">
                  <h4>{video.title}</h4>
                  <span className="language-badge">{video.language.toUpperCase()}</span>
                </div>
                {video.description && <p className="video-desc">{video.description}</p>}
                <div className="video-meta">
                  <small>📁 {(video.fileSize / 1024 / 1024).toFixed(2)} MB</small>
                  <small>📊 {video.viewCount || 0} views</small>
                  <small>Status: {video.status}</small>
                </div>
                <button 
                  onClick={() => handleDeleteVideo(video.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUpload;
