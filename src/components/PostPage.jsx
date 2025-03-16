import { useParams, useNavigate } from 'react-router-dom'
import { ref, get, update, push, onValue, remove } from 'firebase/database'
import { database, auth } from '../firebase'
import { useState, useEffect } from 'react'

const PostPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [updatedPost, setUpdatedPost] = useState({ title: '', content: '' })

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = ref(database, `posts/${postId}`)
      const snapshot = await get(postRef)
      if (snapshot.exists()) {
        const postData = snapshot.val()
        setPost(postData)
        setUpdatedPost({ title: postData.title, content: postData.content })
      } else {
        setPost(null)
      }
    }
    fetchPost()
  }, [postId])

  useEffect(() => {
    const commentsRef = ref(database, `posts/${postId}/comments`)
    onValue(commentsRef, (snapshot) => {
      if (snapshot.exists()) {
        setComments(Object.values(snapshot.val()))
      } else {
        setComments([])
      }
    })
  }, [postId])

  const handleAddComment = () => {
    if (newComment.trim() === '') return
    const user = auth.currentUser
    push(ref(database, `posts/${postId}/comments`), {
      text: newComment,
      author: user ? user.email : 'Anonymous',
      timestamp: Date.now(),
    })
    setNewComment('')
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdatePost = () => {
    if (!auth.currentUser || auth.currentUser.uid !== post.authorId) return

    update(ref(database, `posts/${postId}`), {
      title: updatedPost.title,
      content: updatedPost.content,
    })
    setPost({ ...post, title: updatedPost.title, content: updatedPost.content })
    setIsEditing(false)
  }

  const handleDeletePost = () => {
    if (!auth.currentUser || auth.currentUser.uid !== post.authorId) return

    remove(ref(database, `posts/${postId}`))
    navigate('/')
  }

  return (
    <div className="post-container">
      {post ? (
        <>
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={updatedPost.title}
                onChange={(e) =>
                  setUpdatedPost({ ...updatedPost, title: e.target.value })
                }
              />
              <textarea
                value={updatedPost.content}
                onChange={(e) =>
                  setUpdatedPost({ ...updatedPost, content: e.target.value })
                }
              />
              <button onClick={handleUpdatePost}>Save</button>
              <button className="cancel-btn" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h1 className="post-title">{post.title}</h1>
              <p className="post-content">{post.content}</p>
              <p>
                Likes: {post.likedBy ? Object.keys(post.likedBy).length : 0}
              </p>

              {/* Edit/Delete buttons (only for post author) */}
              {auth.currentUser && auth.currentUser.uid === post.authorId && (
                <div className="post-actions">
                  <button className="edit-btn" onClick={handleEditToggle}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={handleDeletePost}>
                    Delete
                  </button>
                </div>
              )}
            </>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h2>Comments</h2>
            <ul className="comments-list">
              {comments.map((comment, index) => (
                <li key={index} className="comment">
                  <strong>{comment.author}:</strong> {comment.text}
                </li>
              ))}
            </ul>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button onClick={handleAddComment}>Comment</button>
          </div>
        </>
      ) : (
        <p className="no-post">Post not found.</p>
      )}
      <button className="back-button" onClick={() => navigate('/')}>
        Back to News Feed
      </button>
    </div>
  )
}

export default PostPage
