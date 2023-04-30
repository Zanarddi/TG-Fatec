import './style.css'
import { useState, useEffect } from "react";

function SchedulePrompt(props) {

	const [date, setDate] = useState('');
	const [time, setTime] = useState('');

	const parentCallback = props.parentCallback;

	useEffect(() => {
		parentCallback(date, time); // is meant to be executed when inputs changes
	}, [date, time]);

	const handleChange = (event) => {
		const id = event.target.id;
		const value = event.target.value;
		if(id == 'time-schedule'){
			changeTime(value);
		}
		else if(id=='date-schedule'){
			changeDate(value);
		}
	}

	const changeDate = (date) => {
		setDate(date)
	}

	const changeTime = (time) => {
		setTime(time)
	}

	const getDate = () => {
		var date = new Date();
		var day = ("0" + date.getDate()).slice(-2);
		var month = ("0" + (date.getMonth() + 1)).slice(-2);
		var today = date.getFullYear() + "-" + (month) + "-" + (day);
		return today
	}


	if (props.isOpened) {
		let currentDate = getDate();
		return (
			<div className='schedule-prompt'>
				<p>Select the date for the post</p>
				<input type="date" id="date-schedule" min={currentDate} onChange={handleChange} />
				<p>Select the time for the post</p>
				<input type="time" id="time-schedule" onChange={handleChange} />
				<p id='schedule-warning'>If you don`t want to schedule the post, simply hide this panel</p>
			</div>
		)
	}
	else {
		return (
			<div className='schedule-prompt'>
			</div>
		)

	}
}

export default SchedulePrompt;