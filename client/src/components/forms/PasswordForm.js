import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { validateEmail } = require('./../../validation');

function PasswordForm(props) {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [msgErro, setMsgErro] = useState('');
    const [disableInput, setDisableInput] = useState('');


    useEffect(() => {
        console.log("localstorage: " + localStorage.getItem('appToken'));
        if (localStorage.getItem('appToken') != null) {
            navigate('/dashboard');
        }
    }, []);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }


    const handleSubmit = (event) => {
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
            axios.post(process.env.REACT_APP_API_URL + '/api/reset/password', {
                password: inputs.password_reset,
                token: props.token,
                email: props.email
            }).then((data) => {
                console.log(data.data);
                alert("Password changed, you can now login");
                navigate('/login');
            }).catch((error) => {
                console.log(error.response.data.message);
                setMsgErro(error.response.data.message);
                setDisableInput('');
            });
        }
    }

    return (
        <form className='password_form' onSubmit={handleSubmit}>
            <fieldset>
                <input placeholder="New Password" tabIndex="1" maxLength="128" type="password" name="password_reset" id="password_login" onChange={handleChange}></input>
                <input placeholder="Repeat your password" tabIndex="2" maxLength="128" type="password" name="password_reset_repeat" id="password_login" onChange={handleChange}></input>
                <p className="errorMsg">{msgErro}</p>
                <br></br>
                <button type="submit" className="button" id='passwordButton' disabled={disableInput} tabIndex="3"> Change Password </button>
            </fieldset>
        </form>
    )
}

export default PasswordForm;