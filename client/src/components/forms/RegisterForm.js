import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const { validateUser, validateEmail } = require('./../../validation');

function RegisterForm() {

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({});
    const [msgErro, setMsgErro] = useState('');

    useEffect(() => {
        console.log("localstorage: " + localStorage.getItem('appToken'));
        if (localStorage.getItem('appToken')!=null) {
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
        if (!validateEmail(inputs.email_register)) {
            setMsgErro('Email inválido');
        }
        else if (!validateUser(inputs.user_register)) {
            setMsgErro('Usuário invalido');
        }
        else {
            axios.post(process.env.REACT_APP_API_URL + '/api/register', {
                withCredentials: true,
                ...inputs //send all properties from the 'inputs'
            })
                .then(async data => {
                    if (data.data.auth) {
                        // stores the token on cache
                        localStorage.setItem('appToken', data.data.token);
                        // reload page to be redirected to dashboard
                        window.location.reload();
                    } else if (!data.data.auth) {
                        localStorage.removeItem('appToken');
                    }
                })
                .catch((error) => {
                    if (error.response.status == '404') {
                        // Erro ao tentar criar usuário
                    }
                    else if (error.response.status == '409') {
                        // erro de usuario ou email em uso
                        setMsgErro('Usuário ou email em uso');
                    }
                    else if (error.response.status == '400') {
                        // erro de valores de entrada inválidos
                        console.log('Valores de entrada inválidos');
                    }
                    else {
                        console.log(error.response.status);
                        console.log(error.response.data);
                    }
                });
        }

    }

    return (
        <form className="register_form" onSubmit={handleSubmit}>
            <fieldset>
                <input placeholder="Email" tabIndex="1" maxLength="255" type="text" name="email_register" id='email_register' onChange={handleChange}></input>
                <input placeholder="Username" tabIndex="2" maxLength="255" type="text" name="user_register" id='user_register' onChange={handleChange}></input>
                <input placeholder="Password" tabIndex="3" maxLength="128" type="password" name="password_register" id='password_register' onChange={handleChange}></input>
                <p className="errorMsg">{msgErro}</p>
                <br></br>
                <button type="submit" className="button" id='registerButton' tabIndex="4">Sign up</button>
            </fieldset>
        </form>
    )
}

export default RegisterForm;