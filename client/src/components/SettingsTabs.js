import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SettingTabs({ tab }) {

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [msgErro, setMsgErro] = useState('');
  const [disableInput, setDisableInput] = useState('');

  const twitterClick = () => {
    axios.get(process.env.REACT_APP_API_URL + '/api/twitter/auth', { withCredentials: true })
      .then(data => {
        console.log(data);
        window.location.href = data.data
      })
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  const changePassword = (event) => {
    setDisableInput('disabled');
    event.preventDefault();
    if (inputs.password_reset == null || inputs.password_reset_repeat == null) {
      setMsgErro('Both fields are required');
      setDisableInput('');
      return;
    }
    if (!(inputs.password_reset == inputs.password_reset_repeat)) {
      setMsgErro('Both passwords must be the same');
      setDisableInput('');
      return;
    }
    else {
      axios.post(process.env.REACT_APP_API_URL + '/api/reset/password/logged', {
        password: inputs.password_reset
      }).then((data) => {
        console.log(data.data);
        alert("Password changed");
        navigate('/dashboard');
      }).catch((error) => {
        console.log(error.response.data.message);
        setMsgErro(error.response.data.message);
        setDisableInput('');
      });
    }
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
        <p id="title-settings">Typer your new password</p>
        <input placeholder="New Password" maxLength="128" type="password" name="password_reset" id="password_login" onChange={handleChange}></input>
        <input placeholder="Repeat your password" maxLength="128" type="password" name="password_reset_repeat" id="password_login" onChange={handleChange}></input>
        <p className="errorMsg">{msgErro}</p>
        <button type="submit" onClick={changePassword} className="button" id='passwordButton' disabled={disableInput} tabIndex="3"> Change Password </button>
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