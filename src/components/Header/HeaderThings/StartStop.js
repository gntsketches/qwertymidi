import React from 'react'
import {connect} from 'react-redux'

const StartStop = (props) => {
	const renderStartStop = () => {
		if (props.isRecording) {
			return <p>Stop Recording</p>
		} else {
			return <p>Start Recording</p>
		}
	}

	const style = {
		cursor: 'pointer'
	}

	return (
		<div className="header-click" style={style} onClick={props.toggleRecording} >{renderStartStop()}</div>
	)
}

const mapStateToProps = (state) => {
	return {
		isRecording: state.isRecording
	}
}

export default connect(
	mapStateToProps,
	null
)(StartStop);