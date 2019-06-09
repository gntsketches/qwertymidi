import React from 'react'
import {connect} from 'react-redux'

import { setQuantization } from '../../../actions'


	const style = {
		cursor: 'pointer'
	}

const ChangeQuantType = (props) => {

	const handleChange = (e) => {
		props.setQuantization(e.target.value)

	}


	return (
		<div>
			<label>Quantization</label>
			<select value={props.quantization} onChange={handleChange} style={style} >
				<option value="4n">4n</option>
				<option value="8n">8n</option>
				<option value="16n">16n</option>
                <option value="32n">32n</option>
                <option value="64n">64n</option>
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