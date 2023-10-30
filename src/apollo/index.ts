import {ApolloClient, InMemoryCache, NormalizedCacheObject} from '@apollo/client';
import merge from 'deepmerge';
import isEqual from 'lodash-es/isEqual';

let apolloClient: ApolloClient<NormalizedCacheObject> | null;

const BIR_API = 'http://localhost:4400/graphql';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'
/*
    ssrMode in Apollo Client:

    - Query Handling:
      • Without ssrMode: Apollo may batch multiple queries together before sending to the server.
      • With ssrMode: Apollo sends each query immediately, optimizing for server-side rendering speed.

    - Benefits of ssrMode:
      • Reduces Redundant Data Requests: Prevents Apollo from fetching data both server-side and client-side.
      • Enhances Performance: Prioritizes immediate query dispatch, resulting in quicker server responses and faster page loads for users.
*/

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Determines if rendering on the server (true) or client (false)
    uri: BIR_API,
    cache: new InMemoryCache(),
  });
}


export function initializeApollo(initialState?: any) {
  // returns a singleton
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.cache.extract();
    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
            sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });
    _apolloClient.cache.restore(data);
  }

  if (typeof window === 'undefined') {
    return _apolloClient;
  }

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

// Used in a Next.js page's getStaticProps/getServerSideProps
// inject Apollo Client cache state
export function addApolloState(
    client: ApolloClient<NormalizedCacheObject>,
    pageProps:any
) {
  if(pageProps?.props){
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
  return pageProps
}

