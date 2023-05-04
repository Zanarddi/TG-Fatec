import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { validateEmail } = require('./../../validation');

function EmailForm() {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [msgErro, setMsgErro] = useState('');

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
        event.preventDefault();

        if (!validateEmail(inputs.email_reset)) {
            setMsgErro('Invalid e-mail');
        }
        else {
            axios.post(process.env.REACT_APP_API_URL + '/api/reset/email', {
                email: inputs.email_reset
            }).then((data) => {
                console.log(data.data);
                alert("E-mail sent, verify your inbox or spam folder");
            }).catch((error) => {
                console.log(error.response.data.message);
                setMsgErro(error.response.data.message);
            });
        }
    }

    return (
        <form className='email_form' onSubmit={handleSubmit}>
            <fieldset>
                <input placeholder="Email" tabIndex="1" maxLength="255" type="text" name="email_reset" id="email_reset" onChange={handleChange}></input>
                <p className="errorMsg">{msgErro}</p>
                <br></br>
                <button type="submit" className="button" id='emailButton' tabIndex="3"> Send e-mail </button>
            </fieldset>
        </form>
    )
}

export default EmailForm;