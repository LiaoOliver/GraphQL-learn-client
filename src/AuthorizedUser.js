import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ROOT_QUERY } from './App';

const GITHUB_AUTH_MUTATION = gql`
    mutation githubAuth($code:String!){
        githubAuth(code:$code){
            token
        }
    }
`

class AuthorizedUser extends Component{
    state = { siginingIn:false }

    authorizationComplete = (cache, { data }) => {
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

    render(){
        return (
            <Mutation mutation={GITHUB_AUTH_MUTATION}
                update={this.authorizationComplete}
                refetchQueries={[{ query: ROOT_QUERY }]}>
                    {
                        mutation => {
                            console.log("mutation",mutation)
                            console.log("this.githubAuthMutation", this.githubAuthMutation)
                            this.githubAuthMutation = mutation
                            return (
                                <button 
                                onClick={this.requestCode} 
                                disabled={this.state.siginingIn}>
                                    Sign In with Github
                                </button>
                            )
                        }
                    }
            </Mutation>
        )
    }

} 

export default withRouter(AuthorizedUser);