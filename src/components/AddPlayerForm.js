import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AddPlayerForm extends Component {

    // state = {
    //     value: ''
    // };

    playerInput = React.createRef();

    // handleValueChange = (e) => {
    //     this.setState({
    //         value: e.target.value
    //     })
    // }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addPlayer(this.playerInput.current.value);
        // this.setState({
        //     value: ''
        // })
        e.currentTarget.reset();
    }

    render() {
        console.log(this.props.currentPlayer)
        // console.log(this.props, this.props.currentPlayer.displayName == {})
        if(this.props.currentPlayer.displayName && this.props.currentPlayer.displayName === "false"){
            return (
                <div className="footerForm">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            ref={this.playerInput}
                            // value={this.state.value}
                            // onChange={this.handleValueChange}
                            placeholder="enter a player's name"
                        />

                        <input
                            type="submit"
                            value="Add player"
                        />
                    </form>
                </div>
            );
        } else {
            return (
                <div className="footerForm">
                </div>
            );
        }

    }
}

AddPlayerForm.propTypes = {
    playerInput: PropTypes.string
}

export default AddPlayerForm