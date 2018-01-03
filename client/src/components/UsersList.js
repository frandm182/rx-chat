import React from 'react';
import format from 'date-fns/format';

const UsersList = props => (
    <div>
        <h4>User list</h4>
        <table className='stripped'>
            <thead>
                <tr>
                    <th>Nickname</th>
                    <th>Time joinde</th>
                </tr>
            </thead>
            <tbody>
                {props.userlist.map(user => (
                    <tr key={user.socketId}>
                        <td>{user.nickname}</td>
                        <td>{format(parseInt(user.connectTime,10),'YYYY-MM-DD HH:mm:ss')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
           
    </div>
)

export default UsersList;