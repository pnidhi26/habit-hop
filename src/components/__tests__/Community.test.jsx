import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, X, Heart, BookmarkPlus } from 'lucide-react';

const Community = () => {
  // State for controlling the sidebar visibility
  const [showSidebar, setShowSidebar] = useState(true);
  
  // State for tracking which post is expanded
  const [expandedPostId, setExpandedPostId] = useState(null);
  
  // State for post creation modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  
  // State for saved/liked posts
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  
  // State for category filters
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Mock data for initial posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'ANorquist',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      categories: ['Fitness', 'Productivity']
    },
    {
      id: 2,
      username: 'Username123',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      categories: ['Fitness']
    },
    {
      id: 3,
      username: 'Morgan',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      categories: ['School']
    },
    {
      id: 4,
      username: 'BernieTheDog',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      categories: ['Productivity']
    }
  ]);

  // Categories for filtering
  const categories = [
    'Fitness', 
    'Productivity', 
    'School', 
    'Work', 
    'Self-care'
  ];

  // Toggle post expansion
  const toggleExpandPost = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  // Toggle save/bookmark functionality
  const toggleSavePost = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  // Toggle like functionality
  const toggleLikePost = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  // Handle creating a new post
  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostBody.trim()) {
      const newPost = {
        id: posts.length + 1,
        username: 'CurrentUser', // Placeholder for a real user system
        title: newPostTitle,
        content: newPostBody,
        categories: ['Productivity'] // Default category
      };
      
      setPosts([newPost, ...posts]);
      
      // Reset form and close modal
      setNewPostTitle('');
      setNewPostBody('');
      setShowCreateModal(false);
    }
  };

  // Toggle category filter
  const toggleCategoryFilter = (category) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(c => c !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };

  // Filter posts based on active filters
  const filteredPosts = activeFilters.length > 0 
    ? posts.filter(post => 
        post.categories.some(category => activeFilters.includes(category))
      )
    : posts;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-white p-6 shadow-lg transition-all ${
          showSidebar ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        {showSidebar && (
          <>
            <h2 className="text-xl font-bold mb-4">Sort By</h2>
            
            <div className="space-y-2 mb-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md w-full text-left">
                Recent
              </button>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left">
                Popular
              </button>
              <button className="px-4 py-2 hover:bg-gray-100 rounded-md w-full text-left">
                Saved
              </button>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategoryFilter(category)}
                  className={`px-4 py-2 rounded-md w-full text-left ${
                    activeFilters.includes(category) ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            {showSidebar ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
          
          <h1 className="text-2xl font-bold">Community</h1>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <Plus size={24} />
          </button>
        </div>
        
        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div 
              key={post.id} 
              className="bg-white p-6 rounded-lg shadow"
            >
              <div 
                onClick={() => toggleExpandPost(post.id)}
                className="cursor-pointer mb-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{post.username}</h3>
                  <div className="space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSavePost(post.id);
                      }}
                      className={`p-1 rounded-full hover:bg-gray-100 ${
                        savedPosts.includes(post.id) ? 'text-yellow-500' : 'text-gray-500'
                      }`}
                    >
                      <BookmarkPlus size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikePost(post.id);
                      }}
                      className={`p-1 rounded-full hover:bg-gray-100 ${
                        likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-bold mt-2">{post.title}</h2>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.categories.map(category => (
                    <span 
                      key={category} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              {expandedPostId === post.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p>{post.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add a title
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Lorem Ipsum is simply dummy text of the printing"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add a body
                </label>
                <textarea
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout..."
                  rows="5"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <button 
                onClick={handleCreatePost}
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Post!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;