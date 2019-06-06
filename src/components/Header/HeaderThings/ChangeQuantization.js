import React from 'react'
import {connect} from 'react-redux'

import { setQuantization } from '../../../actions'

const ChangeQuantType = (props) => {

	const handleChange = (e) => {
		props.setQuantization(e.target.value)

	}

	return (
		<div>
			<label>Quantization</label>
			<select value={props.quantization} onChange={handleChange}>
				<option value="4n">4n</option>
				<option value="8n">8n</option>
				<option value="16n">16n</option>
			</select>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		quantization: state.quantization
	}
}

export default connect(
	mapStateToProps,
	{ setQuantization }
)(ChangeQuantType);