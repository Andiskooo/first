import { ImageResponse } from 'next/og';
import { blogPosts } from './data';
 
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { id: string } }) {
  // Find the blog post with the matching ID
  const post = blogPosts.find((p) => p.id === params.id || p.link.includes(params.id));
  
  // If post is not found, return default image
  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 'bold' }}>Blog Post Not Found</div>
        </div>
      ),
      { ...size }
    );
  }

  // Extract the accent color
  const accentColor = post.accentColor?.split('-')[0] || 'blue';
  const accentColorMap: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    orange: '#f97316',
    purple: '#8b5cf6',
  };
  const color = accentColorMap[accentColor] || '#3b82f6';
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 48,
          position: 'relative',
        }}
      >
        {/* Background with gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${post.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)',
            zIndex: 1,
          }}
        />
        
        {/* Content */}
        <div style={{ zIndex: 2 }}>
          {post.subtitle && (
            <div
              style={{
                fontSize: 18,
                backgroundColor: color,
                color: 'white',
                padding: '6px 12px',
                borderRadius: 4,
                marginBottom: 16,
                display: 'inline-block',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {post.subtitle}
            </div>
          )}
          <div style={{ color: 'white', marginBottom: 24, maxWidth: '80%' }}>
            {post.title}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, display: 'flex', alignItems: 'center' }}>
            {post.date && (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  style={{ marginRight: 8 }}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{post.date}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Company logo/branding */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 32,
            display: 'flex',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            ECOTEK
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
