import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { validateUser } = require('./../../validation');

function LoginForm() {

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

        if(!validateUser(inputs.user_login)){
            setMsgErro('Usuário invalido')
        }
        else{
            axios.post(process.env.REACT_APP_API_URL + '/api/login', {
                withCredentials: true,
                ...inputs //send all properties from the 'inputs'
            })
                .then(data => {
                    if (data.data.auth) {
                        // stores the token on cache
                        localStorage.setItem('appToken', data.data.token);
                        // reload page to be redirected to dashboard
                        window.location.reload();
                    } else if (!data.data.auth) {
                        localStorage.removeItem('appToken');
                    }
                    console.log(data.data);
                })
                .catch((error) => {
                    if(error.response.status == '401'){
                        setMsgErro('Usuário ou senha inválidos');
                    }
                    else if(error.response.status == '404'){
                        // Erro ao tentar logar
                    }
                    else if(error.response.status == '400'){
                        // implementar retorno visual para usuário
                    }
                    else{
                        console.log(error.response.status);
                        console.log(error.response.data);
                    }
                });
        }
    }

    return (
        <form className='login_form' onSubmit={handleSubmit}>
            <fieldset>
                <input placeholder="Username" tabIndex="1" maxLength="255" type="text" name="user_login" id="user_login" onChange={handleChange}></input>
                <input placeholder="Password" tabIndex="2" maxLength="128" type="password" name="password_login" id="password_login" onChange={handleChange}></input>
                <p className="errorMsg">{msgErro}</p>
                <br></br>
                <button type="submit" className="button" id='loginButton' tabIndex="3"> Sign In </button>
            </fieldset>
        </form>
    )
}

export default LoginForm;