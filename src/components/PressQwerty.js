import React from 'react'
import { useState, useEffect, useRef } from 'react'  // what would be the benefit of useState for down vs just having the variable?
import { connect } from 'react-redux'

import { addNoteToTune } from '../actions'
import { synth } from './synth'
import { NOTE_KEYS_ALL } from "../config/constants"
import { KEYS_TO_PITCH } from "../config/constants"
import Qwerty from './Qwerty'

const PressQwerty = ({ isRecording, addNoteToTune }) => {

	const [down, setDown] = useState([])
	const [downKeys, setDownKeys] = useState([])
	const currentNote = useRef('')


	useEffect(() => {

		const addNote = (noteObject) => {
			if (isRecording) {
				addNoteToTune(noteObject)
			}
		}

		const handleKeyDown = (e) => {
			if (NOTE_KEYS_ALL.includes(e.key) && !down.some((obj) => obj.key === e.key) ) {
				setDown(prev => prev.concat({ key: e.key, startTime: window.Tone.Transport.getSecondsAtTime() }))
				// setDownKeys([...downKeys, e.key]) // following refactor, results in multiple keys "stuck" in setDownKeys
				setDownKeys(prev => prev.concat(e.key))
				currentNote.current = KEYS_TO_PITCH[e.key]
				synth.triggerAttack(currentNote.current, window.Tone.context.currentTime)
			}
		}

		// (todo: check does console.log still happens TWICE?) , even though the note is only added once...
		const handleKeyUp = (e) => {
			if (NOTE_KEYS_ALL.includes(e.key)) {  // && down etc...?
				// let keyObject = {...down.find((obj) => obj.key === e.key)}
				let keyObject = down.find((obj) => obj.key === e.key) // robtaussig does not use spread
				let noteObject = { note: KEYS_TO_PITCH[e.key], startTime: keyObject.startTime }
				noteObject.endTime = window.Tone.Transport.getSecondsAtTime()
				// setDown(down.filter(obj => obj.key !== e.key))
				setDown(prev => prev.filter(obj => obj.key !== e.key))
				// setDownKeys(downKeys.filter(key => key !== e.key))
				setDownKeys(prev => prev.filter(key => key !== e.key))
				if (currentNote.current === KEYS_TO_PITCH[e.key]) {
					synth.triggerRelease(null)	//KEYS_TO_PITCH[e.key]) // someday, polyphonic
				}
				addNote(noteObject)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}

	}, [down, isRecording, addNoteToTune])


	return (
		<>
			<Qwerty downKeys={downKeys} />
		</>
	)

}

const mapStateToProps = (state) => {
	return {
		isRecording: state.isRecording
	}
}

export default connect(
	mapStateToProps,
	{ addNoteToTune }
)(PressQwerty);



// ***************************************************************************************************
//  https://www.reddit.com/r/reactjs/comments/bv26tc/render_on_key_press/
// 	https://www.reddit.com/r/reactjs/comments/buxhug/rerendering_arrays_as_props/


// 	use cases:
// 	press q, release q, press w, release w

// press q, press w, release q, release w
// press q, press w, release w, release q

// press q, press w, press e, release q, release w, release e
// press q, press w, press e, release w, release q, release e
// press q, press w, press e, release e, release w, release q
// press q, press w, press e, release e, release q, release w

// commentary from handleKeyUp:
// if (currentNote.current === KEYS_TO_PITCH[e.key]) {
// 	synth.triggerRelease(null)//keyToPitch[e.key])
// 	// you could build a feature where it returns to play the last previously held note...
//
// 	// if (down.length !== 0) {
// 	// 	synth.triggerAttack(keyToPitch[down[down.length-1].key])
// 	// }
// 	// here this triggered note never releases. above, you could test on down[down-1].e.key rather than currentNote...?
// }
// // console.log(noteObject)
// addNote(noteObject)

//