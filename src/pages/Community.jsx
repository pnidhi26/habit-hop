import React, { useState } from 'react';
import '../styles/Community.css';
import { Plus, X, ChevronLeft, ChevronRight, Bookmark, Heart } from 'lucide-react';

export default function Community() {
  const [filterVisible, setFilterVisible] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Prakash Nidhi Verma', avatar: 'P', color: 'bg-purple-500' },
      title: 'The 5AM gym routine that transformed my productivity',
      content: 'Switching to early morning workouts completely changed my relationship with fitness and productivity. I prep everything the night before - gym clothes laid out, pre-workout bottle ready, gym bag packed. My alarm is set for 4:50AM and placed across the room so I have to physically get up. The first week was brutal, but by week two my body started adjusting. I follow a simple full-body routine 3 days per week that takes exactly 45 minutes. What I discovered is that the morning workout creates a powerful "keystone effect" - because I have already accomplished something difficult before most people wake up, I carry that momentum throughout the day. My work performance has improved dramatically, and I no longer have the evening debate of "should I go to the gym?" since its already done.',
      isSaved: false,
      isLiked: false,
      tags: ['Fitness', 'Productivity', 'Sport']
    },
    {
      id: 2,
      user: { name: 'Boxi Chen', avatar: 'B', color: 'bg-blue-500' },
      title: 'How I built a daily yoga routine that actually sticks!',
      content: 'After struggling for years to maintain a consistent yoga practice, I finally found a system that works for me. I start with just 10 minutes every morning right after waking up - before checking my phone or brewing coffee. This small commitment makes it feel achievable even on busy days. I keep my yoga mat rolled out beside my bed as a visual reminder. After 2 weeks, I gradually increased to 20 minutes, focusing on flows I genuinely enjoy rather than whats supposed to be good for me. The key insight was linking it to an existing habit (waking up) and making the barrier to start extremely low. Now 6 months in, I have not missed a day and its transformed my focus throughout the day.',
      isSaved: true,
      isLiked: false,
      tags: ['Social', 'Fitness']
    },
    {
      id: 3,
      user: { name: 'Dengtai Wang', avatar: 'D', color: 'bg-pink-500' },
      title: 'How I built a reading habit by "bookending" my day',
      content: 'After years of buying books I never read, I finally developed a sustainable reading habit using a technique I call "bookending" my day. I read for 20 minutes immediately after waking up and 20 minutes before bed - these two "bookends" provide structure and consistency. The morning session is for non-fiction/learning, while evening is reserved for fiction and pleasure reading. The key was removing all friction - I keep my current books on my nightstand, use a reading timer app, and never worry about how many pages I complete. By detaching from "progress" metrics and focusing just on time spent, reading transformed from a chore into a calming ritual. I have read 27 books this year already after completing only 3 books last year!',
      isSaved: false,
      isLiked: true,
      tags: ['Reading', 'Mindfulness']
    },
    {
      id: 4, 
      user: { name: 'Aditi More', avatar: 'A', color: 'bg-green-500' },
      title: 'Dance practice accountability system that changed everything',
      content: 'I struggled with consistent dance practice until I developed my "3-2-1" system. Heres how it works: 3 scheduled practice sessions per week (non-negotiable, in calendar like important meetings), 2 dance styles I am focusing on (currently breaking and house), and 1 weekly recording session where I film my progress. The recording part was game-changing - watching myself improved my technique faster than anything else. I also joined a Discord group where we share weekly progress videos, which keeps me accountable. Since implementing this system, I have improved more in 3 months than I did in the previous year of inconsistent practice. The combination of scheduled sessions, focused practice, and visual documentation creates powerful momentum.',
      isSaved: true,
      isLiked: true,
      tags: ['Fitness', 'Dance']
    },
    {
      id: 5, 
      user: { name: 'Austin Norquist', avatar: 'A', color: 'bg-yellow-500' },
      title: 'How I maintain a daily meditation practice with the "2-Minute Rule"',
      content: 'I failed at establishing a meditation practice multiple times until I discovered the "2-Minute Rule." The principle is simple: when forming a new habit, make it so easy you cant say no. I committed to just 2 minutes of meditation daily - thats it. This tiny commitment eliminated all resistance to starting. Once I sit down for those 2 minutes, I often continue for longer (now averaging 15 minutes), but knowing I only HAVE to do 2 minutes makes it sustainable. I use the same spot, same cushion, and same simple timer app every day. I also created a habit tracker in my journal where I mark each day I meditate, creating a visual chain I do not want to break. After 6 months, meditation has become as automatic as brushing my teeth, and my anxiety levels have dropped significantly.',
      isSaved: false,
      isLiked: true,
      tags: ['Meditation', 'Mindfulness']
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const [sortOption, setSortOption] = useState('trending');
  const [activeFilters, setActiveFilters] = useState([]);
  
  const availableFilters = [
    'Fitness', 'School', 'Sports', 'Work', 'Meditation', 'Social', 'Productivity'
  ];

  const toggleSave = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? {...post, isSaved: !post.isSaved} : post
    ));
  };

  const toggleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? {...post, isLiked: !post.isLiked} : post
    ));
  };

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you'd send this to your API
    const newPost = {
      id: posts.length + 1,
      user: { name: 'You', avatar: 'Y', color: 'bg-indigo-500' },
      title: formData.title,
      content: formData.content,
      isSaved: false,
      isLiked: false,
      tags: ['Work']
    };
    
    setPosts([newPost, ...posts]);
    setFormData({ title: '', content: '' });
    setShowCreatePost(false);
  };

  const filteredPosts = activeFilters.length > 0 
    ? posts.filter(post => post.tags.some(tag => activeFilters.includes(tag)))
    : posts;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left sidebar with filters */}
      <div className={`bg-white p-4 transition-all duration-300 ${filterVisible ? 'w-64' : 'w-16'} border-r`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`font-semibold ${filterVisible ? 'block' : 'hidden'}`}>Sort By</h3>
          <button 
            onClick={() => setFilterVisible(!filterVisible)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            {filterVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {filterVisible && (
          <>
            <div className="space-y-2 mb-6">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={sortOption === 'trending'} 
                  onChange={() => setSortOption('trending')} 
                  className="mr-2"
                />
                <span>Trending</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={sortOption === 'likesHighToLow'} 
                  onChange={() => setSortOption('likesHighToLow')} 
                  className="mr-2"
                />
                <span>Likes (High to low)</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={sortOption === 'likesLowToHigh'} 
                  onChange={() => setSortOption('likesLowToHigh')} 
                  className="mr-2"
                />
                <span>Likes (Low to high)</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={sortOption === 'commentsHighToLow'} 
                  onChange={() => setSortOption('commentsHighToLow')} 
                  className="mr-2"
                />
                <span>Comments (High to low)</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={sortOption === 'commentsLowToHigh'} 
                  onChange={() => setSortOption('commentsLowToHigh')} 
                  className="mr-2"
                />
                <span>Comments (Low to high)</span>
              </label>
            </div>

            <h3 className="font-semibold mb-3">Filter By</h3>
            <div className="flex flex-wrap gap-2">
              {availableFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeFilters.includes(filter)
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
              <button className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                Show More
              </button>
            </div>
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-black text-white rounded-full p-2 shadow-md hover:bg-gray-800"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {filteredPosts.map(post => (
              <div 
                key={post.id} 
                className="bg-black text-white rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  className="p-4 cursor-pointer" 
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-10 h-10 rounded-full ${post.user.color} flex items-center justify-center mr-3 text-white font-bold`}>
                      {post.user.avatar}
                    </div>
                    <div>{post.user.name}</div>
                  </div>
                  
                  <div className="mb-4">
                    {post.title}
                  </div>
                  
                  {expandedPost === post.id && (
                    <div className="mt-4">
                      <ul className="list-disc pl-6 space-y-2">
                        {post.content.split('.').filter(sentence => sentence.trim().length > 0).map((sentence, idx) => (
                          <li key={idx}>{sentence.trim()}.</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(post.id);
                      }}
                      className={`p-2 rounded-full ${post.isSaved ? 'text-yellow-500' : 'text-gray-400'} hover:bg-gray-800`}
                    >
                      <Bookmark size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(post.id);
                      }}
                      className={`p-2 rounded-full ${post.isLiked ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-800`}
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black text-white rounded-lg w-full max-w-2xl p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add a title</h2>
              <button 
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Lorem Ipsum is simply dummy text of the printing"
                className="w-full p-4 mb-4 bg-white text-black rounded-full"
                required
              />
              
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Add a body</h3>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout..."
                  className="w-full p-4 bg-white text-black rounded-lg min-h-32"
                  required
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                >
                  Add Tags
                </button>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                >
                  Post!
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}