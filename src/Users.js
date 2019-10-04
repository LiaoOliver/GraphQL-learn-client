import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ROOT_QUERY } from './App';

const ADD_FAKE_USERS_MUATATION = gql`
    mutation addFakeUsers($count: Int!){
        addFakeUsers(count:$count){
            githubLogin
            name
            avatar
        }
    }
`

const UserListItem = ({name, avatar}) => <li>
    <img src={avatar} width="64" height="64" alt="avatar"></img>
    {name}
</li>

const UserList = ({ count, users, refetchUsers }) => <div>
    <p>{ count } Users</p>
    <button onClick={() => refetchUsers() }>Refetch</button>
    <Mutation mutation={ADD_FAKE_USERS_MUATATION} variables={{count:1}}>
        {
            addFakeUsers => <button onClick={addFakeUsers}>Add Fake Users</button>
        }
    </Mutation>
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
        (result) => {
            console.log('USER', result)
            return result.loading ? 
            <p>Loading users ...</p> : 
            <UserList count={result.data.totalUsers} users={result.data.allUsers} refetchUsers={result.refetch}/>
        }
    }
</Query>

export default Users;