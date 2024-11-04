import React, { useState } from 'react';
import { FaRegSmile, FaRegImage } from 'react-icons/fa';

function PostingPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'Valorant PH',
      picture: 'https://via.placeholder.com/150',
      caption: 'Lf isa Silver\nXUN149',
      rating: 0,
      likes: 0,
      likedByUser: false,
      comments: [
        { username: 'JaneDoe', text: 'Looks amazing! I have to try it.' },
        { username: 'ChefMike', text: 'Great presentation!' },
      ],
      showComments: false,
      createdAt: new Date(),
    },
    // Additional posts can be added here
  ]);

  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostPicture, setNewPostPicture] = useState(null);
  const [newPostRating, setNewPostRating] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState({ postId: null, visible: false });
  const [showDeleteOption, setShowDeleteOption] = useState({ postId: null, visible: false });
  const [feeling, setFeeling] = useState('');
  const [feelingOpen, setFeelingOpen] = useState(false);

  const handleAddPost = () => {
    if (newPostCaption.trim() === '') return;
    const newPost = {
      id: posts.length + 1,
      username: 'User123', // This can be changed to dynamic user data
      picture: newPostPicture ? URL.createObjectURL(newPostPicture) : '',
      caption: newPostCaption,
      rating: newPostRating, // User-provided rating
      likes: 0,
      likedByUser: false,
      comments: [],
      showComments: false,
      createdAt: new Date(),
      feeling: feeling,
    };
    setPosts([newPost, ...posts]);
    setNewPostCaption('');
    setNewPostPicture(null);
    setNewPostRating(0);
    setFeeling('');
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPostPicture(e.target.files[0]);
    }
  };

  const [newComment, setNewComment] = useState('');

  const handleAddComment = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { username: 'User123', text: newComment }],
            }
          : post
      )
    );
    setNewComment('');
  };

  const handleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
              likedByUser: !post.likedByUser,
            }
          : post
      )
    );
  };

  const handleToggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              showComments: !post.showComments,
            }
          : post
      )
    );
  };

  const handleShowDeleteOption = (postId) => {
    setShowDeleteOption((prev) => ({ postId, visible: prev.postId === postId ? !prev.visible : true }));
  };

  const handleDeleteConfirmation = (postId) => {
    setShowDeleteConfirmation({ postId, visible: true });
    setShowDeleteOption({ postId: null, visible: false });
  };

  const handleDeletePost = () => {
    if (showDeleteConfirmation.postId !== null) {
      setPosts((prevPosts) => prevPosts.filter(post => post.id !== showDeleteConfirmation.postId));
      setShowDeleteConfirmation({ postId: null, visible: false });
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation({ postId: null, visible: false });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Post input area */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 text-white">
        <textarea
          placeholder="What's on your mind?"
          value={newPostCaption}
          onChange={(e) => setNewPostCaption(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-lg focus:outline-none mb-2"
        />
        <div className="flex gap-4 mb-2">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <FaRegImage className="h-6 w-6" />
            Upload Image
          </label>
          <input
            type="file"
            id="imageUpload"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button className="flex items-center gap-1 bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 cursor-pointer" onClick={() => setFeelingOpen(!feelingOpen)}>
            <FaRegSmile className="h-6 w-6" />
            {feeling ? feeling : 'Feeling'}
          </button>
          {feelingOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white text-black p-4 rounded shadow-md">
                <ul className="list-none">
                  <li className="cursor-pointer hover:bg-gray-200 p-1" onClick={() => { setFeeling('Very Satisfied'); setFeelingOpen(false); }}>Very satisfied</li>
                  <li className="cursor-pointer hover:bg-gray-200 p-1" onClick={() => { setFeeling('Satisfied'); setFeelingOpen(false); }}>Satisfied</li>
                  <li className="cursor-pointer hover:bg-gray-200 p-1" onClick={() => { setFeeling('Unsatisfied'); setFeelingOpen(false); }}>Unsatisfied</li>
                  <li className="cursor-pointer hover:bg-gray-200 p-1" onClick={() => { setFeeling('Very Unsatisfied'); setFeelingOpen(false); }}>Very unsatisfied</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        {newPostPicture && (
          <div className="mt-2 relative">
            <img src={URL.createObjectURL(newPostPicture)} alt='Preview' className='w-full h-auto rounded mb-2' />
            <button onClick={() => setNewPostPicture(null)} className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 absolute top-0 right-0'>
              &times;
            </button>
          </div>
        )}
        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, starIndex) => (
              <svg
                key={starIndex}
                onClick={() => setNewPostRating(starIndex + 1)}
                className={`w-6 h-6 cursor-pointer ${newPostRating > starIndex ? 'text-yellow-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .288l2.833 8.718h9.167l-7.5 5.446 2.833 8.718-7.5-5.446-7.5 5.446 2.833-8.718-7.5-5.446h9.167z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-2 justify-end">
          <button
            onClick={handleAddPost}
            className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts display */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg mb-2">{post.username}</div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg
                      key={starIndex}
                      className={`w-5 h-5 ${post.rating > starIndex ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 .288l2.833 8.718h9.167l-7.5 5.446 2.833 8.718-7.5-5.446-7.5 5.446 2.833-8.718-7.5-5.446h9.167z" />
                    </svg>
                  ))}
                </div>
                <div className="text-gray-500 text-sm">{post.createdAt.toLocaleDateString()} {post.createdAt.toLocaleTimeString()}</div>
              </div>
              <div className="relative">
                <button
                  onClick={() => handleShowDeleteOption(post.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  &#8943;
                </button>
                {showDeleteOption.visible && showDeleteOption.postId === post.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md">
                    <button
                      onClick={() => handleDeleteConfirmation(post.id)}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            </div>
            {post.picture && <img src={post.picture} alt="Post" className="w-full h-auto mb-2 rounded" />}
            <div className="text-gray-800 mb-2">{post.caption}</div>
            {post.feeling && <div className="text-gray-500 italic mb-2">Feeling: {post.feeling}</div>}
            <div className="flex items-center mb-4">
              <button
                onClick={() => handleLikePost(post.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                {post.likedByUser ? 'Unlike' : 'Like'}
              </button>
              <span className="ml-2 text-gray-700">{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
              <button
                onClick={() => handleToggleComments(post.id)}
                className="ml-4 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Comments ({post.comments.length})
              </button>
            </div>
            {post.showComments && (
              <div className="border-t pt-2">
                <div className="mb-2 font-semibold">Comments:</div>
                {post.comments.map((comment, index) => (
                  <div key={index} className="mb-1">
                    <span className="font-semibold mr-1">{comment.username}:</span>
                    {comment.text}
                  </div>
                ))}
                <div className="mt-2 flex">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border rounded-l px-3 py-1 flex-1 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-r hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation.visible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeletePost}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostingPage;
