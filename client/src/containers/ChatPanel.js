import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Observable } from 'rxjs/Observable';
import take from 'lodash/take';
import shuffle from 'lodash/shuffle';
import format from 'date-fns/format'

import AppBar from '../components/AppBar';
import UsersList from '../components/UsersList';

class ChatPanel extends Component {
   sendMessage(e) {
       e.preventDefault();
       const messageInput = document.querySelector('#message-input');
       axios.post('http://localhost:4000/message', {
          message: messageInput.value,
          who: this.props.nickname,
          timestamp: Date.now() 
       }).then(messageInput.value = '');
   }
    render() {
        return (
            <div>
                <h4>Your nickname is {this.props.nickname}</h4>
                <ul className='collection'>
                    {this.props.messages.map(message => (
                        <li className='collection-item' key={`${message.who}${message.message}`}>
                            <span className='title'>
                                {message.who}
                                <i>
                                    {format(parseInt(message.timestamp,10), 'YYYY-MM-DD HH:mm:ss')}
                                </i>
                            </span>
                            <p>
                                <strong>{message.message}</strong>
                            </p>
                        </li>
                    ))}
                </ul>
                <form className='row' onSubmit={this.sendMessage.bind(this)}>
                    <div className='input-field col s10'>
                        <input type='text' id='message-input'/>
                        <label className='active' htmlFor='message-input'>
                            Enter message here
                        </label>
                    </div>
                    <div className='input-field col s2'>
                        <button id='sendBtn' type='submit' className='btn-floating btn-large waves-effect waves-light red'>
                            <i className='material-icons'>send</i>
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}
export default ChatPanel;