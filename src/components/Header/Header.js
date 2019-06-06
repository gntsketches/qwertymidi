import React from 'react'

import { Wrapper } from './Header.styles'
import StartStop from './HeaderThings/StartStop'
import ChangeBpm from './HeaderThings/ChangeBpm'
import ChangeQuantType from './HeaderThings/ChangeQuantization'
import Download from './HeaderThings/Download'

class Header extends React.Component {

	render() {
		return (
			<Wrapper>
				<StartStop toggleRecording={this.props.toggleRecording} />
				<ChangeBpm />
				<ChangeQuantType />
				<Download onClick={this.props.downloadMidi} />
			</Wrapper>
		)
	}
}

export default Header
