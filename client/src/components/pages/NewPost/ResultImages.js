import './style.css'
import { useState, useEffect } from "react";
import loadingGIF from "./../../../loading.gif"

function ResultImages(props) {

  const changeImage = props.parentCallback;

  if (props.state == 'loading') {
    return (
      <div className='img-ai-container'>
        <img className='image-AI' src={loadingGIF}></img>
        <img className='image-AI' src={loadingGIF}></img>
      </div>
    )
  }
  else if (props.state == 'created') {
    return (
      <div className='img-ai-container'>
        <img onClick={()=>{changeImage('0')}} className={(props.aiImage=='0') ? 'image-AI-selected' : 'image-AI'} src={process.env.REACT_APP_API_URL + props.img0} ></img>
        <img onClick={()=>{changeImage('1')}} className={(props.aiImage=='1') ? 'image-AI-selected' : 'image-AI'} src={process.env.REACT_APP_API_URL + props.img1} ></img>
      </div>
    )
  }
  else {
    return (
      <></>
    )
  }
}

export default ResultImages;