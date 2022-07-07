import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  
  return (
    <Fragment>
      <Head>
            <title>{props.meetupData.title}</title>
            <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail 
          image={props.meetupData.image} 
          title={props.meetupData.title}
          address={props.meetupData.address}
          description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect('mongodb+srv://DarioChiappello:arWMvNyOkMU2Jrzz@cluster0.bjj6g.mongodb.net/meetups?retryWrites=true&w=majority');

  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    paths: meetups.map(meetup => ({
      params: { meetupId: meetup._id.toString()}
    })),
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {

    const meetupId = context.params.meetupId;
    // console.log(meetupId);
    // fetch data for a single meetup
    const client = await MongoClient.connect('mongodb+srv://DarioChiappello:arWMvNyOkMU2Jrzz@cluster0.bjj6g.mongodb.net/meetups?retryWrites=true&w=majority');

    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

    client.close();
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                image: selectedMeetup.image,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }
        },
        revalidate: 1
    }
}

export default MeetupDetails;