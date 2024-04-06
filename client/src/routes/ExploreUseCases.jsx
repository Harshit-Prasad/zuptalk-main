import React from 'react'
import { Link } from 'react-router-dom'

const pageContent = [
  {
    heading: 'Supercharge Audience Interaction:',
    points: [
      {
        highlight: 'Live Q&A:',
        content: 'Host engaging "Ask Me Anything" sessions for any content creator, from gamers to celebrities'
      },
      {
        highlight: 'Live Game Streaming:',
        content: 'Level up your streams with live voice interaction between players and viewers'
      },
    ]
  },
  {
    heading: 'Unlock New Content Formats:',
    points: [
      {
        highlight: 'Stock Market Insights:',
        content: 'Offer live audio consultations for informed investment decisions'
      },
      {
        highlight: 'Product Launches:',
        content: 'Generate excitement with live Q&A sessions during product launches'
      },
      {
        highlight: 'Event Promotions:',
        content: 'Connect stars with fans and create buzz through interactive audio sessions'
      },
    ]
  },
  {
    heading: 'Empower Professionals and Learners:',
    points: [
      {
        highlight: 'Group Therapy Sessions:',
        content: 'Facilitate open discussions and support in a safe audio environment'
      },
      {
        highlight: 'Ed-Tech Made Interactive:',
        content: 'Solve student doubts in real-time with live audio explanations'
      },
      {
        highlight: 'Astrology Consultations:',
        content: 'Deliver personalized readings with a more natural, voice-based approach'
      },
    ]
  },
  {
    heading: 'Zuptalk caters to a wide range of content creators, including:',
    points: [
      {
        highlight: 'Just Chatting Streamers:',
        content: 'Discuss the latest trends, answer burning questions, or simply hang out with your fans'
      },
      {
        highlight: 'Coding Classes:',
        content: 'Facilitate collaborative learning with live audio discussions'
      },
      {
        highlight: 'Cooking Demonstrations:',
        content: 'Make learning fun and interactive with real-time Q&A during live streams'
      },
      {
        highlight: 'Teachers of All Subjects:',
        content: 'Bring your lessons to life with engaging audio discussions'
      },
      {
        highlight: 'Small Businesses:',
        content: 'Boost sales through interactive product demonstrations and live customer support'
      }
    ]
  },
]

export default function ExploreUseCases() {
  return (
    <div className='relative flex flex-col landing-page__bg'>
      <nav className='bg-black sticky top-0 flex justify-between items-center px-2 md:px-6 py-2 md:py-4 font-bold'>
        <Link to='/' className='text-xl md:text-3xl text-white font-hughs'>
          Zuptalk
        </Link>

        <Link to='/join-waitlist' className='font-hughs inline-block px-4 py-1 md:px-8 md:py-2 text-black bg-[#00E5BC] rounded-full'>
          Join the Waitlist
        </Link>
      </nav>

      <main className='text-white px-2 md:px-6 flex-1 py-4 md:py-8'>
        <h1 className='text-2xl md:text-4xl font-bold mb-4 md:mb-4'>
          Engage with Your Audience Like Never Before with Zuptalk
        </h1>

        <h2 className='text-xl md:text-2xl mb-4 md:mb-8'>
          Zuptalk is the all-in-one solution for interactive YouTube Livestreams. Here's how it could be used:
        </h2>

        {
          pageContent.map((section, i) => {
            return <section key={i} className='my-4'>
              <h3 className='text-lg md:text-xl font-bold my-2'>{section.heading}</h3>
              <ul>
                {section.points.map((point, i) => {
                return <li key={i} className='my-2 text-sm md:text-lg'>
                  <span className='font-bold'>{point.highlight}</span>&nbsp;
                  {point.content}
                </li>
              })}
              </ul>
            </section>
          })
        }

        <Link to='/join-waitlist' className='font-hughs font-bold inline-block px-8 py-2 text-black bg-[#00E5BC] rounded-full'>
          Join the Waitlist
        </Link>
      </main>
    </div>
  )
}
