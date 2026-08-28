import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Play, Plus, Video, X, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimateOnScroll from '../components/AnimateOnScroll';

export default function VideoLibrary() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Form states for adding new video
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bible Study');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const list = await dbService.getVideos();
      setVideos(list);
      if (list.length > 0) {
        setActiveVideo(list[0]);
      }
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    setFormError('');
    setUploading(true);

    if (!title || !description || !videoUrl) {
      setFormError('Please fill in all required fields.');
      setUploading(false);
      return;
    }

    // Convert standard YouTube URLs to Embed URLs
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const vidId = videoUrl.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const vidId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    }

    try {
      await dbService.uploadVideo({
        title,
        description,
        category,
        videoUrl: embedUrl,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?w=600&auto=format&fit=crop&q=60'
      });

      // Reset
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
      setShowAddModal(false);
      
      // Reload
      fetchVideos();
    } catch (err) {
      setFormError(err.message || 'Failed to add video.');
    } finally {
      setUploading(false);
    }
  };

  const categories = ['All', 'Bible Study', 'Inspirational', 'Prayer'];
  const filteredVideos = categoryFilter === 'All' 
    ? videos 
    : videos.filter(v => v.category === categoryFilter);

  return (
    <div className="page-wrapper">
      
      {/* Page Header */}
      <AnimateOnScroll animation="fadeUp">
        <section className="flex-between flex-wrap gap-md">
          <div>
            <span className="text-label">DISCIPLESHIP ARCHIVE</span>
            <h1 style={{ fontSize: '38px', margin: '4px 0 0' }}>Daily Video Library</h1>
            <p style={{ margin: '4px 0 0' }}>Stream daily inspirational teachings, Bible study sessions, and sermons.</p>
          </div>
          
          {user && (
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Daily Video
            </button>
          )}
        </section>
      </AnimateOnScroll>

      {loading ? (
        <div className="flex-center" style={{ height: '40vh', gap: '8px' }}>
          <Loader2 className="animate-spin" /> Loading Video Library...
        </div>
      ) : (
        <>
          {/* Active Streaming Player Block */}
          {activeVideo && (
            <AnimateOnScroll animation="fadeUp">
              <section className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="video-player-wrapper">
                  <iframe
                    title={activeVideo.title}
                    src={activeVideo.video_url}
                    allowFullScreen
                  />
                </div>
                <div>
                  <span className="streak-badge" style={{ marginBottom: '8px' }}>{activeVideo.category}</span>
                  <h2 style={{ fontSize: '24px', margin: '4px 0 8px' }}>{activeVideo.title}</h2>
                  <p style={{ margin: 0, fontSize: '15px' }}>{activeVideo.description}</p>
                </div>
              </section>
            </AnimateOnScroll>
          )}

          {/* Category Filter Pills */}
          <div className="category-pills">
            {categories.map(c => (
              <button
                key={c}
                className={`category-pill ${categoryFilter === c ? 'active' : ''}`}
                onClick={() => setCategoryFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Video Playlists Grid */}
          <section>
            <h3>Available Videos ({filteredVideos.length})</h3>
            {filteredVideos.length === 0 ? (
              <p style={{ padding: '40px 0', textAlign: 'center' }}>No videos found in this category.</p>
            ) : (
              <div className="grid-auto" style={{ marginTop: '16px' }}>
                {filteredVideos.map((v, i) => (
                  <AnimateOnScroll key={v.id} animation="fadeUp" delay={i * 80}>
                    <div
                      className="glass-card"
                      style={{
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        cursor: 'pointer',
                        border: activeVideo?.id === v.id ? '2px solid var(--accent-rose)' : '1px solid var(--border-color)'
                      }}
                      onClick={() => {
                        setActiveVideo(v);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div
                        className="video-thumbnail"
                        style={{ backgroundImage: `url(${v.thumbnail_url})` }}
                      >
                        <div className="video-play-icon">
                          <Play size={20} fill="white" />
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-rose)', textTransform: 'uppercase' }}>
                          {v.category}
                        </span>
                        <h4 style={{ margin: '4px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{v.title}</h4>
                        <p style={{ margin: 0, fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {v.description}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Upload Video Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={20} /> Publish Video URL
              </h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Developing Daily Prayer Habits"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>Video Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Summarize the core message or outline..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Inspirational">Inspirational</option>
                    <option value="Prayer">Prayer</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Thumbnail URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://image-link.jpg"
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label>YouTube Video / Share Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={uploading} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : null} Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
