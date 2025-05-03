import React, { useState } from 'react';
import { Heart, Bookmark, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Community = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Sample data for posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'Prakash',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.',
      tags: ['Productivity', 'Work', 'Fitness'],
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      username: 'Boxi',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.',
      tags: ['Fitness', 'Social'],
      likes: 15,
      comments: 2
    },
    {
      id: 3,
      username: 'User 3',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.',
      tags: ['School', 'Meditation'],
      likes: 32,
      comments: 8
    },
    {
      id: 4,
      username: 'Aditi',
      title: 'This is my hack to completing my tasks efficiently!',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s.',
      tags: ['Sports', 'Productivity'],
      likes: 41,
      comments: 12
    }
  ]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleExpandPost = (id) => {
    if (expandedPost === id) {
      setExpandedPost(null);
    } else {
      setExpandedPost(id);
    }
  };

  const toggleLike = (id) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  const toggleSave = (id) => {
    if (savedPosts.includes(id)) {
      setSavedPosts(savedPosts.filter(postId => postId !== id));
    } else {
      setSavedPosts([...savedPosts, id]);
    }
  };

  const handleCreatePost = () => {
    // Create a new post
    const newPost = {
      id: posts.length + 1,
      username: 'You',
      title: newPostTitle || 'Test Post Title', // Default value for test
      content: newPostContent || 'Test Post Content', // Default value for test
      tags: ['Productivity'],
      likes: 0,
      comments: 0
    };
    
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowModal(false);
  };

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filteredPosts = activeFilters.length > 0
    ? posts.filter(post => post.tags.some(tag => activeFilters.includes(tag)))
    : posts;

  const categories = ['Fitness', 'School', 'Sports', 'Work', 'Meditation', 'Social', 'Productivity'];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for filters */}
      <div className={`bg-white p-4 transition-all duration-300 ${sidebarVisible ? 'w-64' : 'w-0 overflow-hidden'} border-r`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold block">Sort By</h3>
          <button 
            data-testid="sidebar-toggle"
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="space-y-2 mb-6">
          <label className="flex items-center">
            <input type="radio" name="sort" className="mr-2" defaultChecked />
            <span>Trending</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="sort" className="mr-2" />
            <span>Likes (High to low)</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="sort" className="mr-2" />
            <span>Likes (Low to high)</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="sort" className="mr-2" />
            <span>Comments (High to low)</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="sort" className="mr-2" />
            <span>Comments (Low to high)</span>
          </label>
        </div>
        
        <h3 className="font-semibold mb-3">Filter By</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                activeFilters.includes(category) 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => toggleFilter(category)}
            >
              {category}
            </button>
          ))}
          <button className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
            Show More
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6">
        {!sidebarVisible && (
          <button 
            className="fixed left-4 top-4 p-2 bg-white rounded-full shadow-md"
            onClick={toggleSidebar}
          >
            <ChevronRight size={20} />
          </button>
        )}
        
        <div className="max-w-4xl mx-auto">
          {/* Create post button */}
          <div className="flex justify-end mb-6">
            <button 
              className="bg-black text-white rounded-full p-2 shadow-md hover:bg-gray-800"
              onClick={() => setShowModal(true)}
              data-testid="create-post-button"
            >
              <Plus size={24} />
            </button>
          </div>
          
          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div 
                key={post.id} 
                data-testid="post-card"
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpandPost(post.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{post.username}</h3>
                    <div className="flex space-x-1">
                      <button
                        className={`p-2 rounded-full ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(post.id);
                        }}
                        data-testid="like-button"
                      >
                        <Heart size={20} />
                      </button>
                      <button
                        className={`p-2 rounded-full ${savedPosts.includes(post.id) ? 'text-yellow-500' : 'text-gray-400'} hover:bg-gray-800`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(post.id);
                        }}
                        data-testid="bookmark-button"
                      >
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-lg font-medium mb-2">{post.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
                
                {expandedPost === post.id && (
                  <div className="p-4 pt-0 border-t">
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Create post modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                data-testid="close-modal-button"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Add a title</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Lorem Ipsum is simply dummy text of the printing"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Share your thoughts</label>
                <textarea
                  className="w-full p-2 border rounded h-32"
                  placeholder="It is a long established fact that a reader will be distracted"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Add tags</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  onClick={handleCreatePost}
                >
                  Post!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;