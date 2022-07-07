import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props){

    return (
        <Fragment>
            <Head>
                <title>Meetups - Darío Chiappello</title>
                <meta name="description" content="Meetups page for Darío Chiappello" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

// (SSG) Static Site Generation
export async function getStaticProps(){
   // fetch data from an API
   const client = await MongoClient.connect('mongodb+srv://DarioChiappello:arWMvNyOkMU2Jrzz@cluster0.bjj6g.mongodb.net/meetups?retryWrites=true&w=majority');

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                image: meetup.image,
                address: meetup.address,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    }
}

// (SSR) Server Side Rendering - React will not re-render the page if the props are the same
// export async function getServerSideProps(context){

//     const req = context.req;
//     const res = context.res;

//     // fetch data from an API

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export default HomePage;