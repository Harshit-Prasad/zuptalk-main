import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStreamsStore } from "../../services/store";
import useProtectedRoutes from "../../hooks/useProtectedRoutes";
import ProfileToggle from '../../components/ui/ProfileToggle';

export default function Dashboard() {
  const { streams, removeStream, setStreams } = useStreamsStore(
    (state) => state
  );
  const axiosProtectedRoute = useProtectedRoutes();
  const [getStreamLoading, setGetStreamLoading] = useState(true);
  const [deleteStreamLoading, setDeleteStreamLoading] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const streams = await axiosProtectedRoute.get("/api/stream/");

        setStreams(streams.data);
        setGetStreamLoading(false);
      })();
    } catch (error) {
      console.log(error.message);
    }
  }, []);


  const upcomingStreams = streams.filter((stream) => !stream.ended);
  const endedStreams = streams.filter((stream) => stream.ended);

  console.log(endedStreams);

  return (
    <div className='h-dvh items-center justify-between flex flex-col p-2 landing-page__bg text-white overflow-y-auto'>
      <nav className="navbar">
        <Link className="logo text-4xl" to="/">
          Zuptalk
        </Link>

        <div className='flex gap-5 items-center'>
          <Link className="link text-xl md:text-2xl" to="/create-page">
            Create a new Page
          </Link>

          <ProfileToggle />
        </div>
      </nav>
      <main className="grow flex flex-col items-center gap-3 p-5">
        <h2 className="text-2xl py-5">Upcoming Streams</h2>
        {upcomingStreams.length === 0 && !getStreamLoading && (
          <p className="text-center">No upcoming streams</p>
        )}

        {getStreamLoading && <p>Loading...</p>}

        {upcomingStreams.length > 0 && (
          <div>
            {upcomingStreams.map((upcomingStream) => {
              if (!upcomingStream.ended) {
                return (
                  <div
                    className="flex-col md:flex-row flex justify-evenly items-center gap:4 md:gap-10 mt-6 text-black"
                    key={upcomingStream._id}
                  >
                    <iframe
                      width={240}
                      className="pointer-events-none"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      src={`https://www.youtube.com/embed/${upcomingStream.url.split(':')[1]}`} frameborder="0"></iframe>
                    <div className="flex gap-2">
                      <Link
                        className="button ff-roboto font-semibold"
                        to={`/admin-rah/${upcomingStream.url}`}
                      >
                        Speak with Audience
                      </Link>
                      <button
                        disabled={deleteStreamLoading}
                        className="button ff-roboto font-semibold"
                        onClick={async () => {
                          try {
                            setDeleteStreamLoading(true);
                            const itemRemoved = await axiosProtectedRoute.patch(
                              `/api/stream/${upcomingStream._id}`
                            );

                            removeStream(upcomingStream._id);
                          } catch (error) {
                            console.log(error.message);
                          } finally {
                            setDeleteStreamLoading(false);
                          }
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              }
              return <></>;
            })}
          </div>
        )}

        <h2 className="text-2xl py-5">History</h2>
        {endedStreams.length === 0 && !getStreamLoading && (
          <p className="text-center">Empty History</p>
        )}
        {endedStreams.length > 0 && (
          <div>
            {endedStreams.map((endedStream) => {
              return (
                <div className="flex justify-evenly gap-5" key={endedStream._id}>
                  <iframe
                    width={240}
                    className="pointer-events-none"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    src={`https://www.youtube.com/embed/${endedStream.url.split(':')[1]}`}></iframe>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>

  );
}

// zuptalk to link
// profile button
// RAH font face