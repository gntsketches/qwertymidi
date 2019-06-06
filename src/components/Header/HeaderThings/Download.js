import React from 'react'
import { connect } from 'react-redux'



const Download = ({ tune, onClick }) => {

	console.log(tune.length)

	const greyDownloadText = tune.length === 0 ? 'greyed' : ''

	return (
			<div className='header-click' onClick={onClick} >
				<p className={greyDownloadText} >Download</p>
			</div>
	)

}

const mapStateToProps = (state) => {
	return {
		tune: state.tune
	}
}

export default connect(
	mapStateToProps,
	null
)(Download)



