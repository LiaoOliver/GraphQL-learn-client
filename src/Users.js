import React from 'react';
import { Query } from 'react-apollo';
import { ROOT_QUERY } from './App';

const UserListItem = ({name, avatar}) => <li>
    <img src={avatar} width="64" height="64" alt="avatar"></img>
    {name}
</li>

const UserList = ({ count, users }) => <div>
    <p>{ count } Users</p>
    <ul>
        {
            users.map(user => <UserListItem key={user.githubLogin}
            name={user.name}
            avatar={user.avatar}/>)
        }
    </ul>
</div>

const Users = () => <Query query={ROOT_QUERY}>
    {
        ({ data, loading }) => loading ? 
        <p>Loading users ...</p> : 
        <UserList count={data.totalUsers} users={data.allUsers}/>
    }
</Query>

export default Users;