import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { toggleRecording, resetTune } from "../actions"

import PressQwerty from './PressQwerty'
import { quantizations } from '../config/constants'

import Header from './Header/Header'

import './App.css';

const scribble = window.scribble;
const Tone = window.Tone;
const metronome = new Tone.MembraneSynth({
	'octaves': 4,
}).toMaster()

// const player = new Tone.Player({
// 	'url': './public/resources/sounds/woodblock.mp3'
// }).toMaster()
// const player = new Tone.Player('../../public/resources/sounds/woodblock.mp3').toMaster()
// const player = new Tone.Player('./woodblock.mp3').toMaster()
// console.log(player)


	Tone.Transport.scheduleRepeat(function(time) {
		// player.start(time)
		metronome.triggerAttackRelease('C2', '8n')
	}, "4n")



/***********************************************************************************************
 * App
 ***********************************************************************************************/

class App extends React.Component {

	componentDidMount() {
		Tone.Transport.bpm.value = this.props.bpm
	}

	acceptOverwrite() {
		return window.confirm('Restarting will overwrite previous recording. Proceed?')
	}

	toggleRecording = () => {
		if (this.props.isRecording) {
			this.props.toggleRecording(false)
			Tone.Transport.stop()
		} else {
			if (this.props.tune.length > 0) {
				if (this.acceptOverwrite() === false) { return }
			}
			this.props.resetTune()
			this.props.toggleRecording(true)
			Tone.Transport.start()
		}
	}

	downloadMidi = () => {

		console.log("raw tune", this.props.tune)

		// make sure the tune is sorted by note start times

		let tune = [...this.props.tune]
		tune.sort((a,b)=>{
			return a.startTime - b.startTime
		})
		tune.forEach((noteObj, index) => {
			if (tune[index+1] && noteObj.endTime > tune[index+1].startTime) {
				noteObj.endTime = tune[index+1].startTime
			}
		})
		console.log("start times sorted", tune)

		// Create a new array with notes quantized to the specified values

		const quantizationConversion = quantizations[this.props.quantization]
		console.log('quantizationConversion', quantizationConversion)
		const bpmConversion = this.props.bpm/60
		let quantizedTune = []
		tune.forEach((noteObj, index) => {
			const quantizedNote = { note: noteObj.note}
			quantizedNote.startBeat = Math.round(noteObj.startTime * bpmConversion * quantizationConversion)
			quantizedNote.endBeat = Math.round(noteObj.endTime * bpmConversion * quantizationConversion)
			if (quantizedNote.endBeat === quantizedNote.startBeat) {
				quantizedNote.endBeat++
			}
			quantizedTune.push(quantizedNote)
		})
		console.log("quantizedTune", quantizedTune)


		const buildScribblePattern = (played, count) => {
			let pattern = ''
			if (played) {
				pattern = 'x'
				for (let i = 1; i < count; i++) {
					pattern += '_'
				}
			} else {
				for (let i = 0; i < count; i++) {
					pattern += '-'
				}
			}
			return pattern
		}


		// check if any notes have a duplicated start beat and push ahead/trim them if so.
		let quantizedTuneTrimmed = []
		quantizedTune.forEach((noteObj, i, arr) => {
			if (i < 0 && noteObj.startBeat === arr[i-1].startBeat) {
				// const noteOnNextBeat = arr.find( el => el.startBeat >= noteObj.endBeat
				// if (noteOnNextBeat.startBeat ... hmmm... > arr[i-1].endBeat) {
			//		quantizedTune.push({pitch: noteObj.pitch, startBeat: noteObj.startBeat+1, endBeat: noteObj.startBeat+2 })
				// endBeat just +1 ? might be confusing if it was the (attempted) last note of a phrase
				// you could check if it's the last note with that startBeat, and if so allow the duration to be as long as specified without overrunning the next note.
			} else {
				quantizedTuneTrimmed.push(noteObj) // the same object...(?)
			}
		})


		let midiTune = []
		quantizedTune.forEach((noteObj, index) => {
			let pattern = buildScribblePattern(true, noteObj.endBeat - noteObj.startBeat)
			if (quantizedTune[index+1] && quantizedTune[index+1].startBeat - noteObj.endBeat > 0) {
				pattern += buildScribblePattern(false, quantizedTune[index+1].startBeat - noteObj.endBeat)
			}

			const clip = scribble.clip({
				notes: noteObj.note,
				pattern: pattern,
				subdiv: this.props.quantization
			})

			midiTune = [...midiTune, ...clip]

		})
		console.log("midiTune", midiTune)

		const bytes = scribble.midi(midiTune, null); // Pass `null` as the second param to get bytes
		const b64 = btoa(bytes); // Encode byte string from Scribbletune as base64
		const uri = 'data:audio/midi;base64,' + b64;
		const link = document.createElement('a');

		link.href = uri;
		link.download = 'music.mid';

		link.click(); // this will start a download of the MIDI byte string as a file called "music.mid"
	}

	render() {
		return (
			<div className="container">
				<Header
					toggleRecording={this.toggleRecording}
					downloadMidi={this.downloadMidi}
				/>
				<PressQwerty />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isRecording: state.isRecording,
		tune: state.tune,
		quantization: state.quantization,
		bpm: state.bpm
	}
}

export default connect(
	mapStateToProps,
	{ toggleRecording, resetTune }
)(App);


