import Head from 'next/head';
import { useQuery } from '@apollo/client';
import type { GetStaticProps } from 'next';

import { GET_ADS } from './queryAds';
import { addApolloState, initializeApollo } from "@/apolloClient";
import {Ad} from "@/models/Ad";
import {AdResponse} from "@/types/Ad";

export default function Home() {
    const { data, loading, error } = useQuery<AdResponse>(GET_ADS);

    if (error) {
        return <p className="text-red-500">:( an error happened</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Head>
                <title>Ads List</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <h1 className="text-3xl font-bold mb-4">Advertisements</h1>

            {loading && <p className="text-blue-600">loading...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full px-4">
                {data?.getAds?.map((ad:Ad) => (
                    <div key={ad.id} className="transition duration-300 ease-in-out hover:scale-105 flex flex-col md:flex-row p-4 bg-white rounded-lg shadow-lg m-2 cursor-pointer">
                        <img src={ad.promoteImage} alt={ad.title} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full mr-4 mb-4 md:mb-0" />
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
                            <p className="text-gray-600 mb-2 truncate w-52 pr-4">{ad.description}</p>
                            <p className="text-gray-500 mb-2">{ad.location}</p>
                            <a href={`tel:${ad.phoneNumber}`} className="text-rose-500 hover:underline">{ad.phoneNumber}</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const client = initializeApollo();
    await client.query({
        query: GET_ADS,
    });
    return addApolloState(client, {
        props: {},
    });
};
