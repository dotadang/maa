import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Todoitem extends Component {
	constructor(props){
		super(props);
		this.onItemClick = this.onItemClick.bind(this)
	}

	render(){
		const {test, content} = this.props;
		return(
				<div onClick={this.onItemClick}>
					{test} - {content}
				</div>
			)
	}

	onItemClick(){
		const {deleteItem, index} = this.props;
		deleteItem(index);
	}
}

Todoitem.propTypes = {
	content: PropTypes.string,
	deleteItem: PropTypes.func,
	index: PropTypes.number
};

Todoitem.defaultProps = {
	test: 'hello'
}

export default Todoitem;