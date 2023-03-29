import MeetupDetails from "../../components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const SingleMeetUp = (props) => {
  const { image, title, address, description } = props.meetupData;

  return (
    <>
      <Head>
        <title>{`React ${title}`}</title>
        <meta name='description' content={description} />
      </Head>
      <MeetupDetails
        img={image}
        title={title}
        address={address}
        description={description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://alextes:syslik901@cluster0.aagrsvh.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollections = db.collection("meetups");

  const meetups = await meetupsCollections.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const { meetupId } = context.params;

  const client = await MongoClient.connect(
    "mongodb+srv://alextes:syslik901@cluster0.aagrsvh.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollections = db.collection("meetups");

  const idHelper = new ObjectId(meetupId);

  const selectedMeetup = await meetupsCollections.findOne({
    _id: idHelper,
  });

  client.close();

  return {
    props: {
      meetupData: {
        image: selectedMeetup.data.image,
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        address: selectedMeetup.data.address,
        description: selectedMeetup.data.description,
      },
    },
  };
}

export default SingleMeetUp;
