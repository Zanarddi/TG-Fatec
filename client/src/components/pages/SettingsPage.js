import { redirect, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import GlobalHeader from "../GlobalHeader/GlobalHeader";
import SettingTabs from "../SettingsTabs";

function SettingsPage(...props) {

  const [content, setContent] = useState('accounts');

  const clickHandler = (text) => {
    setContent(text);
  }

  return (
    <div className="Settings">
      <GlobalHeader isLogged={true} />
      <div className="content">
        <p>Settings</p>
        <div className="settingsForm">
          <div id="settingsTabs" >
            <a id="tab-accounts" onClick={() => clickHandler('accounts')}>Accounts</a>
            <a id="tab-passwordReset" onClick={() => clickHandler('resetPassword')}>Reset password</a>
          </div>
          <div id="settingsContents">
            <SettingTabs tab={content}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;