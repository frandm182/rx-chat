import React, { Component } from 'react';
import io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import take from 'lodash/take';
import shuffle from 'lodash/shuffle';

import AppBar from '../components/AppBar';
import UsersList from '../components/UsersList';
import ChatPanel from './ChatPanel';

class App extends Component {
    constructor() {
        super();
        this.state = {
            userlist: [],
            messages: []
        }
        this.nickname = this.generateNickName();
    }

    generateNickName() {
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return take(shuffle(possible), 6).join('');
    }

    componentDidMount() {
        const socket = io('http://localhost:4000');

        const socketIdStream = Observable.create(observer => {
            socket.on('my socketId', data => {
                observer.next(data);
            });
        });

        socketIdStream.subscribe(data => {
            socket.emit('client connect', {
                nickname: this.nickname,
                socketId: data.socketId,
                connectTime: data.connectTime
            })
        });

        const socketAllUsersStream = Observable.create(observer => {
            socket.on('all users', data => {
                observer.next(data);
            })
        });

        socketAllUsersStream.subscribe(data => {
            this.setState({ userlist: data })
        }); 

        const socketMessageStream = Observable.create(observer => {
            socket.on('message', data => {
                observer.next(data);
            })
        });

        socketMessageStream.subscribe(data => {
            this.setState({ messages: [...this.state.messages, data] })
        })       
    }
    render() {
        return (
            <div>
                <AppBar />
                <div className='row'>
                     <div className='col s6'>
                         <ChatPanel nickname={this.nickname} messages={this.state.messages} />
                    </div>
                     <div className='col s6'>
                         <UsersList userlist={this.state.userlist}/>
                    </div>
                </div>
            </div>
        )
    }
}
export default App;