import imgIcon from './img/icon-img.png'
import twIcon from './img/twitter-icon.png'
import fbIcon from './img/facebook-icon.png'

function PostItem(props) {

  let image = <></>
  let twImage = <></>
  let fbImage = <></>

  let description = props.description;
  let shortDescription = description.substring(0, 60); 

  let schedule = '';
  if(props.schedule != 'false'){
    schedule = props.schedule;
  }

  if (props.image != 'false') {
    image = <img src={imgIcon} width='40px' />
  }
  if (props.twitter) {
    twImage = <img src={twIcon} width='35px' />
  }
  if (props.facebook) {
    fbImage = <img src={fbIcon} width='35px' />
  }

  return (
    <>
      <div className="post-item">
        <div className="post-info">
          <div id="description">
            {shortDescription}
          </div>
          <div id="image">
            {image}
          </div>
          <div id="schedule">
            <p>{schedule}</p>
          </div>
          <div id="social-media">
            {twImage}
            {fbImage}
          </div>
        </div>
        {/* <button id="rmv-item-bt">-</button> */}
      </div>
    </>
  )
}

export default PostItem;