import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalHeader from "../../GlobalHeader/GlobalHeader";
import ImagePrompt from "./ImagePrompt";
import SchedulePrompt from "./SchedulePrompt";

import './style.css'

const { validateDescription } = require('./../../../validation')

function NewPost() {

  const navigate = useNavigate();

  const [showImage, setShowImage] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [inputs, setInputs] = useState({});
  const [image, setImage] = useState({});
  const [imageFolder, setImageFolder] = useState('');
  const [msgErro, setMsgErro] = useState('');
  const [dateTime, setDateTime] = useState('false');
  const [btDisabled, setBtDisabled] = useState('');

  const handleChange = (event) => {
    const id = event.target.id;
    const value = event.target.value;
    setInputs(values => ({ ...values, [id]: value }));
  }

  const showDivImage = () => {
    setShowImage(!showImage);
  }

  const showDivSchedule = () => {
    setShowSchedule(!showSchedule);
  }

  const changeSchedule = (date, time) => {
    if (date != '' && time != '')
      setDateTime(`${date}T${time}`);
  }

  const changeImg = (img, folder) => {
    console.log(image);
    setImage(img)
    console.log(image);
    setImageFolder(folder + '/' + img + '.png');
    console.log(imageFolder);
  }

  const createPost = () => {
    let tmpImg;
    if (image == '-1') {
      tmpImg = false;
    }
    else {
      tmpImg = imageFolder;
    }
    if (validateDescription(inputs['new-post-description'])) {
      // disables the button after click
      setBtDisabled('true');

      axios.post(process.env.REACT_APP_API_URL + '/api/post/create', {
        withCredentials: true,
        description: inputs['new-post-description'],
        twitter: true,
        imgUrl: tmpImg,
        schedule: dateTime
      })
        .then(data => {
          console.log(data);
          navigate('/dashboard')
        }).catch((err) => {
          console.log(err.response);
          setMsgErro(err.response.data)
          setBtDisabled('');
        })
    } else {
      setMsgErro('Invalid text');
      setBtDisabled('');
      console.log('nao tem texto');
    }
  }



  return (
    <div className="new-post">
      <GlobalHeader isLogged={true} />
      <div className="content">
        <div className="new-post-panel">
          <div className="new-posts-header">
            <p>New Post</p>
          </div>
          <div className="new-post-fields">
            <p className="message-error-new-post">{msgErro}</p>
            <div className="description">
              <p>Description</p>
              <textarea cols="40" rows="5" id="new-post-description" onChange={handleChange}></textarea>
            </div>
            <div className="image">
              <div className="image-header">
                <p>Image</p>
                <button id="show-image" onClick={showDivImage}>{showImage ? 'Hide' : 'Show'}</button>
              </div>
              <ImagePrompt parentCallback={changeImg} isOpened={showImage} />
            </div>
            <div className="schedule">
              <div className="schedule-header">
                <p>Schedule</p>
                <button id="show-schedule" onClick={showDivSchedule}>{showSchedule ? 'Hide' : 'Show'}</button>
              </div>
              <SchedulePrompt parentCallback={changeSchedule} isOpened={showSchedule} />
            </div>
            <div className="new-post-btn">
              <button id="create-new-post" onClick={createPost} disabled={btDisabled}>Create Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPost;