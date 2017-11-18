import React, { PureComponent } from 'react'
import { Col } from 'react-flexbox-grid'

import { history } from '../store/location'

const styles = {
	avatar: {
		width: '100px',
		height: '100px',
		borderRadius: '50%'
	},
	text: {
		margin: '4px',
		padding: '4px'
	},
	number: {
		border: '1px solid',
		borderRadius: '50%',
		margin: '4px',
		padding: '4px',
		width: '27px',
		height: '27px'
	},
	card: {
		border: 'double',
		margin: '15px',
		padding: '25px',
		width: '28vw',
		height: 'auto'
	}
}

class ReviewCard extends PureComponent {

	render() {
		const { author, createdAt, text, rating, link } = this.props
		const { firstName, avatar } = author

		return (
			<Col onClick={ () => link ? history.push(link) : null } style={styles.card} xs={12}>
				<img alt={`${firstName} img unavailable`} style={styles.avatar} src={avatar}/>
				<h1 style={styles.text}>{firstName}</h1>

				<p style={styles.text}> USER JOINED AT: </p>
				<p style={styles.text}>{author.createdAt}</p>

				<p style={styles.text}>{text}</p>
				<p style={styles.text}>{createdAt}</p>

				<p style={styles.text}> RATING: </p>
				<span style={styles.number}>{rating}</span>
			</Col>
		)
	}
}

export default ReviewCard
