import {useSelector,useDispatch} from 'react-redux'
import React ,{ useEffect } from "react"
import { Link } from 'react-router-dom'
import {  PostAuthor} from './PostAuthor'
import {TimeAgo} from './TimeAgo'
import {ReactionButtons} from "./ReactionButtons"
import { selectAllPosts,fetchPosts } from './postsSlice'


export const PostsList =()=>{
	let content
	  const dispatch = useDispatch()
	const posts = useSelector( state=>selectAllPosts(state))

	  const postStatus = useSelector(state => state.posts.status)
	   const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())

    }
  }, [postStatus, dispatch])



   
  

  if (postStatus === 'pending') {
    content = <div className="loader">Loading...</div>
  }
   else if (postStatus === 'success') {
     const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    content = orderedPosts.map(post => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content.substring(0, 100)}</p>
       <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
      <PostAuthor  userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <ReactionButtons  post={post}/>
    </article>
  ))

  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }










	return(<section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>)
}



