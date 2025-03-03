import { Link } from 'react-router-dom'
import { ref, onValue } from 'firebase/database'
import { database } from '../firebase'
import { useState, useEffect } from 'react'

const NewsFeed = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const postsRef = ref(database, 'posts')
    onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const postArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
        setPosts(postArray)
      } else {
        setPosts([])
      }
    })
  }, [])

  return (
    <div className="news-feed-container">
      <h1>News Feed</h1>
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/post/${post.id}`} className="post-link">
                {post.title}
              </Link>
            </li>
          ))
        ) : (
          <p className="no-posts">No posts available</p>
        )}
      </ul>
    </div>
  )
}

export default NewsFeed
