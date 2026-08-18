import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { Play, Plus, Video, X, Loader2, Sparkles, Folder } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '38px', margin: 0 }}>Daily Video Library</h1>
          <p style={{ margin: '4px 0 0' }}>Stream daily inspirational teachings, Bible study sessions, and sermons.</p>
        </div>
        
        {/* Only authenticated users can upload for security/role simulation */}
        {user && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add Daily Video
          </button>
        )}
      </section>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh', gap: '8px' }}>
          <Loader2 className="animate-spin" /> Loading Video Library...
        </div>
      ) : (
        <>
          {/* Active Streaming Player Block */}
          {activeVideo && (
            <section className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'black',
                border: '1px solid var(--border-color)'
              }}>
                <iframe
                  title={activeVideo.title}
                  src={activeVideo.video_url}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allowFullScreen
                />
              </div>
              <div>
                <span className="streak-badge" style={{ marginBottom: '8px' }}>{activeVideo.category}</span>
                <h2 style={{ fontSize: '24px', margin: '4px 0 8px' }}>{activeVideo.title}</h2>
                <p style={{ margin: 0, fontSize: '15px' }}>{activeVideo.description}</p>
              </div>
            </section>
          )}

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(c => (
              <button
                key={c}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: categoryFilter === c ? 'var(--accent-rose)' : 'var(--bg-tertiary)',
                  color: categoryFilter === c ? 'white' : 'var(--text-primary)',
                  borderColor: categoryFilter === c ? 'var(--accent-rose)' : 'var(--border-color)',
                  fontSize: '13px'
                }}
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                marginTop: '16px'
              }}>
                {filteredVideos.map(v => (
                  <div
                    key={v.id}
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
                    <div style={{
                      width: '100%',
                      aspectRatio: '16/10',
                      borderRadius: '8px',
                      backgroundImage: `url(${v.thumbnail_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(15,23,42,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        backdropFilter: 'blur(4px)'
                      }}>
                        <Play size={20} fill="white" />
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-rose)', textTransform: 'uppercase' }}>{v.category}</span>
                      <h4 style={{ margin: '4px 0', fontSize: '15px', color: 'var(--text-primary)' }}>{v.title}</h4>
                      <p style={{ margin: 0, fontSize: '13px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Upload Video Drawer Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Video size={20} /> Publish Video URL</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '10px', borderRadius: '8px', color: 'var(--accent-rose)', fontSize: '13px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Inspirational">Inspirational</option>
                    <option value="Prayer">Prayer</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Thumbnail Image URL (Optional)</label>
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
