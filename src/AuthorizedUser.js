import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ROOT_QUERY } from './App';

const GITHUB_AUTH_MUTATION = gql`
    mutation githubAuth($code:String!){
        githubAuth(code:$code){
            token
        }
    }
`

const CurrentUser = ({ name, avatar, logout }) => <div>
    <img scr={avatar} width={48} height={48}/>
    <h1>{ name }</h1>
    <button onClick={logout}>logout</button>
</div>

const Me = ({ logout, requestCode, signingIn }) =>
    <Query query={ROOT_QUERY}>
        {({ loading, data }) => data ?
            <CurrentUser {...data.me} logout={logout} /> :
            loading ?
                <p>loading... </p> :
                <button onClick={requestCode}
                    disabled={signingIn}>
                    Sign In with Github
                </button>
        }
    </Query>

class AuthorizedUser extends Component{
    state = { siginingIn:false }

    authorizationComplete = (cache, { data }) => {
        console.log("Complete",data)
        localStorage.setItem('token', data.githubAuth.token);
        this.props.history.replace('/');
        this.setState({ siginingIn: false });
    }

    componentDidMount(){    
        if(window.location.search.match(/code=/)){
            this.setState({ siginingIn: true });
            const code = window.location.search.replace("?code=","");
            this.githubAuthMutation({ variables: { code }});
        }
    }

    requestCode(){
        var clientID = '937457b9c2fd8a148aaa';
        window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
    }

    logout = () => {
        console.log(this.props)
        // localStorage.removeItem('token');
        // let data = this.props.client.readQuery({ query: ROOT_QUERY });
        // data.me = null;
        // this.props.client.writeQuery({ query:ROOT_QUERY, data });
    }

    render(){
        return (
            <Mutation mutation={GITHUB_AUTH_MUTATION}
                update={this.authorizationComplete}
                refetchQueries={[{ query: ROOT_QUERY }]}>
                {mutation => {
                    this.githubAuthMutation = mutation
                    return (
                        <Me signingIn={this.state.signingIn}
                            requestCode={this.requestCode}
                            logout={this.logout} />
                    )
                }}
            </Mutation>
        )
    }

} 

export default withRouter(AuthorizedUser);