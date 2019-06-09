import React from 'react'
import {connect} from "react-redux"

import { minBPM, maxBPM } from '../../../config/constants'
import {setBpm, enableQwertySound } from "../../../actions/index"

const Tone = window.Tone


const style = {
	cursor: 'pointer'
}

class ChangeBpm extends React.Component {
	constructor(props) {
		super(props)
		this.inputEl = React.createRef()
	}

	componentDidMount() {

		this.inputEl.current.onfocus = () => {
			this.props.enableQwertySound(false)
		}
		this.inputEl.current.onblur = () => {
			this.props.enableQwertySound(true)
			if (this.props.bpm > maxBPM ) {
				this.props.setBpm(200)
			} else if (this.props.bpm < minBPM ) {
				this.props.setBpm(1)
			}
		}
	}


	setBpm = (e) => {
		console.log('in set')
		if (e.target.value === 0 ) { return }
		Tone.Transport.bpm.value = e.target.value
		this.props.setBpm(e.target.value)
	}

	render() {
		return (
			<div>
				<label htmlFor="bpm">BPM</label>
				<input
					ref={this.inputEl}
					style={style}
					name="bpm"
					id="bpm"
					type="number"
					min={minBPM}
					max={maxBPM}
					value={this.props.bpm}
					onChange={this.setBpm}
				/>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		bpm: state.bpm
	}
}

export default connect(
	mapStateToProps,
	{ enableQwertySound, setBpm }
)(ChangeBpm);