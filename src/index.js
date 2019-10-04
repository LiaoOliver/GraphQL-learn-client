import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost';
import { persistCache } from 'apollo-cache-persist';
import { ApolloProvider } from 'react-apollo';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache();

persistCache({
    cache,
    storage: localStorage
})

if (localStorage['apollo-cache-persist']){
    let cacheDate = JSON.parse(localStorage['apollo-cache-persist'])
    cache.restore(cacheDate)
}

console.log("localStorage", localStorage['apollo-cache-persist'])

// 用來處理與 GraphQL 服務之間的通訊服務
const client = new ApolloClient({ 
    cache,
    uri:'http://localhost:4000/graphql' ,
    request: operation => {
        console.log('operation', operation)
        operation.setContext(context => ({
            headers: {
                ...context.headers,
                authorization: localStorage.getItem('token')
            }
        }))
    }
});



// 建立 graphql query 語法
const query = gql`
    query overview{
        totalUsers
        totalPhotos
    }
`

// 向 GraphQL API 請求資料
client.query({query}).then(({data}) => {
    console.log('query', data)
    console.log('cache', client.extract())
}).catch(err => console.log(err))

ReactDOM.render(
    // 藉由 ApolloProvider 元件 將 client 放到 react 的全域範圍
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
