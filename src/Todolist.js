import React, { Component, Fragment } from 'react';
import './style.css'
import Todoitem from './Todoitem'

class Todolist extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			inputValue : '',
			list : ['123','456']
		}
		this.hanleButtonClick = this.hanleButtonClick.bind(this);
	}

	render() {
		return (
			<Fragment>		
				<div>
					<a>输入内容</a>
					<input id='insertArea' className='input' type="text" value={this.state.inputValue} onChange={this.handleInputeChange.bind(this)}/>
					<button onClick={this.hanleButtonClick}>提交</button>	
				</div>		
				<ul>
					{
						this.state.list.map((item, index) => {
							return (
								<div key={index}>
									<Todoitem content={item} index={index} deleteItem={this.handleItemDelete.bind(this)}/>
								</div>
								)
						})
					}
				</ul>			
			</Fragment>
			)
	}

	handleInputeChange(e){
		const value = e.target.value;
		this.setState(() => (
		{
			inputValue : value
		}));
	}

	hanleButtonClick(){
		const value = this.state.inputValue;
		this.setState((prevState) => (
		{
			list :[...prevState.list, value],
			inputValue : ""
		}));
	}

	handleItemDelete(index){
		const list = [...this.state.list];
		list.splice(index, 1);
		this.setState({
			list : list
		});
	}

}

export default Todolist;
