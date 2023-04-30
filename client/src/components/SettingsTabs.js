import axios from "axios";

function SettingTabs({ tab }) {

  const twitterClick = () => {
    axios.get(process.env.REACT_APP_API_URL + '/api/twitter/auth', { withCredentials: true })
      .then(data => {
        console.log(data);
        window.location.href = data.data
      })
  }

  if (tab == 'profile') {
    return (
      <p>profile</p>
    );
  }


  else if (tab == 'accounts') {
    return (
      <>
        <p1>Conect your accounts to share new posts</p1>
        <button onClick={twitterClick} className="twitter-button">Twitter</button>
      </>
    );
  }


  else if (tab == 'resetPassword') {
    return (
      <>
        <p>resetPassword</p>
      </>
    );
  }

  else {
    return (
      <p>{tab}</p>
    );
  }
}

export default SettingTabs;