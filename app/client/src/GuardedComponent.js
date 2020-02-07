import React from 'react';


export class GuardedComponent extends React.Component {

	render() {
		return(
			<div>
				<h1> Woo! Welcome authenticated user! </h1>
			</div>
		);
	}
}

// export default GuardedComponent;
