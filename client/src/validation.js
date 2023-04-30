exports.validateEmail = (email) => {
  if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
    return true;
  } else {
    return false;
  }
};

exports.validateUser = (text) => {
  if (/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(text)) {
    return true;
  } else {
    return false;
  }

};

exports.validateDescription = (text) => {
  if (text != '') {
    return true
  } else {
    return false
  }
}

exports.validatePrompt = (text) => {
  if (text != '') {
    return true
  } else {
    return false
  }
}
