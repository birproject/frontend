import {gql} from "@apollo/client";

export const GET_ADS = gql`
    query GetAds {
    getAds {
        description
        imageList
        location
        phoneNumber
        promoteImage
        title
        id
    }
}
`
