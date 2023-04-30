import './style.css'
import { useState, useEffect } from "react";
import axios from "axios";
import ResultImages from './ResultImages';
axios.defaults.withCredentials = true;

const { validatePrompt } = require('./../../../validation')

function ImagePrompt(props) {

	const [inputs, setInputs] = useState({});
	const [hasImage, setHasImage] = useState();
	const [image, setImage] = useState('-1');
	const [imageFolder, setImageFolder] = useState('');
	const [msgErro, setMsgErro] = useState('');
	const [disableInput, setDisableInput] = useState('');

	const parentCallback = props.parentCallback;


	useEffect(() => {
		parentCallback(image, imageFolder); // This is be executed when `image` state changes
	}, [image]);

	const handleChange = (event) => {
		const id = event.target.id;
		const value = event.target.value;
		setInputs(values => ({ ...values, [id]: value }));
	}

	const changeImage = (value) => {
		if (image == value) {
			setImage('-1');
		} else {
			setImage(value);
		}

	}

	const disableFields = () => {

	}

	const generateImg = async () => {
		if (validatePrompt(inputs['prompt-ia'])) {
			setMsgErro('');
			setHasImage('loading');
			setDisableInput('disabled')
			await axios.get(process.env.REACT_APP_API_URL + '/api/dalle/create', {
				withCredentials: true,
				params: {
					prompt: inputs['prompt-ia']
				}
			})
				.then(data => {
					setImageFolder(data.data);
					setHasImage('created');
					console.log(data.data);
				})
				.catch((err) => {
					// console.log(err.response);
					setMsgErro('Error when generating image');
					setHasImage('');
					setDisableInput('')
				})
		} else {
			setMsgErro('Invalid value for prompt')
			setDisableInput('')
			console.log('nao tem texto');
		}
	}

	if (props.isOpened) {
		return (
			<div className='image-prompt'>
				<p>Type your text to generate image</p>
				<p className="message-error">{msgErro}</p>
				<textarea cols="40" rows="5" id="prompt-ia" onChange={handleChange} disabled={disableInput}></textarea>
				<button id="generate-image" onClick={generateImg} disabled={disableInput}>Generate Image</button>
				<ResultImages parentCallback={changeImage} state={hasImage} aiImage={image} img0={imageFolder + '/0.png'} img1={imageFolder + '/1.png'} />
			</div>
		)
	}
	else {
		return (
			<div className='image-prompt'>
			</div>
		)

	}
}

export default ImagePrompt;