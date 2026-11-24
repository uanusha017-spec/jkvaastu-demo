import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, Play, Search, X } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { STARTER_BLOGS, STARTER_VIDEOS } from '../data/vastuContent';
import { SafeImage } from '../components/SafeImage';
import {
  BLOG_CATEGORIES,
  extractYouTubeId,
  formatTimestamp,
  type BlogCategory,
  type BlogPost,
  type VideoResource,
} from '../types/models';

interface BlogsVideosPageProps {
  initialBlogSlug?: string | null;
  onClearInitialSlug: () => void;
  onOpenBooking: () => void;
}

export const BlogsVideosPage: React.FC<BlogsVideosPageProps> = ({
  initialBlogSlug,
  onClearInitialSlug,
  onOpenBooking,
}) => {
  const { publicBlogs, publicVideos, publicLoading } = useFirebase();
  const [activeTab, setActiveTab] = useState<'blogs' | 'videos'>('blogs');
  const [categoryFilter, setCategoryFilter] = useState<'All' | BlogCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Omit<BlogPost, 'id'> | null>(null);
  const [activeVideo, setActiveVideo] = useState<Omit<VideoResource, 'id'> | null>(null);

  const blogsList = useMemo(
    () => (publicBlogs.length > 0 ? publicBlogs : STARTER_BLOGS),
    [publicBlogs]
  );
  const videosList = useMemo(
    () => (publicVideos.length > 0 ? publicVideos : STARTER_VIDEOS),
    [publicVideos]
  );

  useEffect(() => {
    if (initialBlogSlug) {
      const match = blogsList.find((b) => b.slug === initialBlogSlug);
      if (match) {
        setActiveTab('blogs');
        setSelectedBlog(match);
      }
      onClearInitialSlug();
    }
  }, [initialBlogSlug, blogsList, onClearInitialSlug]);

  const filteredBlogs = useMemo(() => {
    return blogsList.filter((b) => {
      const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
      const q = searchTerm.trim().toLowerCase();
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [blogsList, categoryFilter, searchTerm]);

  const filteredVideos = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return videosList.filter(
      (v) =>
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
    );
  }, [videosList, searchTerm]);

  // Article Reader View
  if (selectedBlog) {
    return (
      <article className="bg-white py-14 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSelectedBlog(null)}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Library
          </button>

          <p className="text-xs text-slate-500">
            {selectedBlog.category} · {selectedBlog.readTime} · By {selectedBlog.author}
            {selectedBlog.createdAt ? ` · ${formatTimestamp(selectedBlog.createdAt)}` : ''}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-slate-900 mt-3 leading-[1.12]">
            {selectedBlog.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {selectedBlog.excerpt}
          </p>

          <div className="mt-8 aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <SafeImage
              src={selectedBlog.coverImage}
              alt={selectedBlog.title}
              fallbackLabel={selectedBlog.category}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-10 space-y-5 text-base text-slate-700 leading-[1.8] whitespace-pre-line">
            {selectedBlog.content}
          </div>

          <div className="mt-12 p-7 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                Need Personalized Remedies for Your Property?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Book a one-on-one non-demolition Vastu audit tailored to your floor plan and date of
                birth.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </article>
    );
  }

  const activeYoutubeId = activeVideo ? extractYouTubeId(activeVideo.videoUrl) : null;
  const isDirectVideoFile = activeVideo
    ? /\.(mp4|webm|ogg)(\?.*)?$/i.test(activeVideo.videoUrl)
    : false;

  return (
    <div className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-orange-700 mb-3">
              Editorial Articles &amp; Webinars
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
              Vastu Knowledge Library &amp; Video Sessions
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Practical articles, directional guides, and recorded webinar sessions synced directly
              from our consultation desk across all devices.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'blogs'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Articles ({blogsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Videos &amp; Webinars ({videosList.length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics..."
                className="w-full sm:w-56 pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-orange-600"
              />
            </div>
          </div>
        </div>

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-1.5 mb-8">
              <button
                type="button"
                onClick={() => setCategoryFilter('All')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === 'All'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                All Categories
              </button>
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {publicLoading && publicBlogs.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="h-80 rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="py-16 text-center border border-slate-200 rounded-xl bg-slate-50">
                <p className="text-sm font-medium text-slate-800">No articles match your filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('All');
                    setSearchTerm('');
                  }}
                  className="mt-3 text-xs font-medium text-orange-700 hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.slug}
                    onClick={() => setSelectedBlog(blog)}
                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                      <SafeImage
                        src={blog.coverImage}
                        alt={blog.title}
                        fallbackLabel={blog.category}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-xs text-slate-500">
                        {blog.category} · {blog.readTime}
                      </p>
                      <h2 className="font-display text-2xl font-semibold text-slate-900 mt-2 group-hover:text-orange-700 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed flex-1">
                        {blog.excerpt}
                      </p>
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>By {blog.author}</span>
                        <span className="font-semibold text-slate-900">Read Article</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Videos & Webinars Tab */}
        {activeTab === 'videos' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVideos.map((video, idx) => (
              <article
                key={'id' in video && typeof video.id === 'string' ? video.id : `${video.title}-${idx}`}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <SafeImage
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fallbackLabel={video.category}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveVideo(video)}
                    aria-label={`Play ${video.title}`}
                    className="absolute inset-0 bg-slate-950/35 hover:bg-slate-950/50 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span className="w-12 h-12 rounded-full bg-orange-600 text-white inline-flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </span>
                  </button>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-slate-500">
                    {video.category} · {video.duration}
                  </p>
                  <h2 className="font-display text-2xl font-semibold text-slate-900 mt-1.5">
                    {video.title}
                  </h2>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed flex-1">
                    {video.description}
                  </p>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveVideo(video)}
                      className="text-xs font-semibold text-orange-700 hover:text-orange-800 cursor-pointer"
                    >
                      Watch Session
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="pr-4">
                <p className="text-xs text-slate-500">
                  {activeVideo.category} · {activeVideo.duration}
                </p>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-slate-950 flex items-center justify-center">
              {activeYoutubeId ? (
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube.com/embed/${activeYoutubeId}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isDirectVideoFile ? (
                <video src={activeVideo.videoUrl} controls className="w-full h-full" />
              ) : (
                <div className="p-8 text-center space-y-4 max-w-md">
                  <SafeImage
                    src={activeVideo.thumbnailUrl}
                    alt={activeVideo.title}
                    className="w-44 h-28 object-cover rounded-lg mx-auto border border-slate-700"
                  />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeVideo.description}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={activeVideo.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                    >
                      Open Session Page
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVideo(null);
                        onOpenBooking();
                      }}
                      className="px-4 py-2 text-xs font-medium text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Book Live Consultation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
