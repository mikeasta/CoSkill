import api from "../utils/api";
import { setAlert } from "./alert";

import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    UPDATE_COMMENT_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from './types';

// Get posts
export const getPosts = () => async dispatch => {
    try {
      const res = await api.get('/posts');
  
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Add like
  export const addLike = id => async dispatch => {
    try {
      const res = await api.put(`/posts/post/like/${id}`);
  
      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Remove like
  export const removeLike = id => async dispatch => {
    try {
      const res = await api.delete(`/posts/post/like/${id}`);
  
      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Delete post
  export const deletePost = id => async dispatch => {
    try {
      await api.delete(`/posts/post/${id}`);
  
      dispatch({
        type: DELETE_POST,
        payload: id
      });
  
      dispatch(setAlert('Post Removed', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Add post
  export const addPost = formData => async dispatch => {
    try {
      const res = await api.post('/posts', formData);
  
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
  
      dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Get post
  export const getPost = id => async dispatch => {
    try {
      const res = await api.get(`/posts/post/${id}`);
  
      dispatch({
        type: GET_POST,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Add comment
  export const addComment = (postId, formData) => async dispatch => {
    try {
      const res = await api.post(`/posts/post/comment/${postId}`, formData);
  
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      });
  
      dispatch(setAlert('Comment Added', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // Delete comment
  export const deleteComment = (postId, commentId) => async dispatch => {
    try {
      await api.delete(`/posts/post/comment/${postId}/${commentId}`);
  
      dispatch({
        type: REMOVE_COMMENT,
        payload: commentId
      });
  
      dispatch(setAlert('Comment Removed', 'success'));
    } catch (err) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

  // Like comment
export const likeComment = (postId, commentId) => async dispatch => {
    try {
        const res = await api.put(`/posts/post/comment/like/${postId}/${commentId}`);
    
        dispatch({
            type: UPDATE_COMMENT_LIKES,
            payload: {
                postId,
                commentId,
                post: res.data
            }
        });
    
        dispatch(setAlert('Like Added', 'success'));
    } catch (err) {
        dispatch({
          type: POST_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}

// Unlike comment
export const unlikeComment = (postId, commentId) => async dispatch => {
    try {
        const res = await api.delete(`/posts/post/comment/like/${postId}/${commentId}`);
    
        dispatch({
            type: UPDATE_COMMENT_LIKES,
            payload: {
                postId,
                commentId,
                post: res.data
            }
        });
    
        dispatch(setAlert('Like Removed', 'success'));
    } catch (err) {
        dispatch({
          type: POST_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}