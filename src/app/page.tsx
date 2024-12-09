"use client";
import Image from 'next/image';
import { Banknote, ChevronLeft, ChevronRight, Clock, Timer } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function HomePage() {
  const discountDay = useMemo(() => new Date().getDay() === 2, []);
  const discountAmount = useMemo(() => discountDay ? 0.5 : 1, [discountDay]);

  const movies = useMemo(() => [
    {
      id: 1,
      MovieName: 'Moana 2',
      MovieImage: '/moana 2.webp',
      MovieDescription: 'Playing 6/12 @ 6:15pm',
      MovieDuration: 100,
      MovieStartTime: 1733533200,
      MovieStarring: ['Dwayne Johnson', 'Nicole Scherzinger', 'Alan Tudyk', 'Rose Matafeo'],
      MovieVideo: '/Moana 2.mp4',
      MoviePricePerCar: 20,
      MoviePricePerPerson: null
    },
    {
      id: 2223,
      MovieName: 'Gladiator 2',
      MovieImage: '/gladiator 2.jpeg',
      MovieDescription: 'Playing 6/12 @ 6:15pm',
      MovieDuration: 148,
      MovieStartTime: 1733541000,
      MovieStarring: ['Dwayne Johnson', 'Nicole Scherzinger', 'Alan Tudyk', 'Rose Matafeo'],
      MovieVideo: '/Gladiator 2.mp4',
      MoviePricePerCar: 20,
      MoviePricePerPerson: null
    }
  ], []);

  interface Star {
    id: number;
    top: string;
    left: string;
    scale: number;
    duration: string;
    delay: string;
  }

  const [selectedMovie, setSelectedMovie] = useState(movies[0]);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const starArray = Array.from({ length: 200 }).map((_, index) => ({
      id: index,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      scale: Math.random() * 1.05,
      duration: `${Math.random() + 4}s`,
      delay: `${Math.random()}s`,
    }));

    setStars(starArray);
  }, []);

  useEffect(() => {
    setSelectedMovie(movies[selectedMovieIndex]);
  }, [selectedMovieIndex, movies]);

  function minutesToHoursMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes}`;
  }

  function epochToTimeAMPM(epoch: number) {
    const date = new Date(epoch * 1000);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  return (
    <main className='max-w-screen overflow-hidden flex flex-col bg-black'>

      <section className="w-screen h-screen max-w-screen max-h-screen flex flex-col md:flex-row overflow-hidden relative z-20">
        <div key={selectedMovie!.MovieVideo} className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-black origin-top animate-video-reveal-top z-10" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black origin-top animate-video-reveal-bottom z-10" />
          <video
            key={selectedMovie!.MovieVideo}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
          >
            <source src={selectedMovie!.MovieVideo} type="video/mp4" />
          </video>
        </div>

        <div className="flex-1 z-10 relative flex flex-col bg-gradient-to-t from-black via-black/50 to-black/50">
          <Navbar />

          <div className="flex-1 flex flex-col md:flex-row justify-between">
            <div className='flex flex-col justify-between pb-10 md:pb-20 pt-4 px-4 md:pl-20 text-center md:text-left'>
              <div>
                <h1 className='text-4xl md:text-8xl text-white uppercase font-lexend underline max-w-full md:max-w-[50vw]'>
                  {selectedMovie?.MovieName}
                </h1>
                <p className='text-white text-base md:text-xl font-extralight font-lexend p-2'>
                  {selectedMovie?.MovieDescription}
                </p>
              </div>
            </div>

            <div className='flex flex-col justify-end pb-10 md:pb-20 pt-4 px-4 md:pr-20 gap-6 md:gap-12 text-center md:text-left'>
              <div className='hidden md:block'>
                <h2 className='text-white font-lexend text-xl py-2 font-semibold'>Starring</h2>
                {
                  selectedMovie?.MovieStarring.map((actor, index) => (
                    <p key={actor}
                      style={{
                        opacity: 1 - index * 0.2
                      }}
                      className={`text-white text-lg font-light font-lexend`}>{actor}</p>
                  ))
                }
              </div>

              <div className='flex flex-col gap-2'>
                <div className='flex flex-row justify-center md:justify-between items-center'>
                  <div className='flex flex-row'>
                    <button onClick={() =>
                      setSelectedMovieIndex((selectedMovieIndex - 1 + movies.length) % movies.length)
                    }>
                      <ChevronLeft color="#ffffff" />
                    </button>
                    <button onClick={() =>
                      setSelectedMovieIndex((selectedMovieIndex + 1) % movies.length)
                    }>
                      <ChevronRight color="#ffffff" />
                    </button>
                  </div>

                  <div className='hidden md:flex flex-row gap-2'>
                    {
                      movies.map((movie) => (
                        <div key={movie.id} data-selected={movie.id == selectedMovie!.id} className='data-[selected=true]:bg-white bg-white/50 w-1 h-1 rounded-full' />
                      ))
                    }
                  </div>
                </div>

                <div className='flex flex-row gap-4 justify-center'>
                  {
                    movies.map((movie) => (
                      <button key={movie.id} onClick={() => {
                        setSelectedMovieIndex(movies.findIndex(m => m.id === movie.id));
                      }}>
                        <Image className='rounded-sm w-[125px] md:w-[175px]' src={movie.MovieImage} alt={movie.MovieName} width={175} height={175} />
                      </button>
                    ))
                  }
                </div>
              </div>

              <Link
                href={'/#tickets'}
                className='md:hidden bg-white/25 backdrop-blur-xl hover:bg-white/50 text-white font-bold text-lg py-4 font-owsald w-full hover:bg-opacity-85 text-center hover:cursor-pointer rounded-sm block mt-4'
              >
                Get Your Tickets
              </Link>
            </div>

            <Link
              href={'/#tickets'}
              className='hidden md:block absolute bottom-20 left-20 bg-white/25 backdrop-blur-xl hover:bg-white/50 text-white font-bold text-xl py-6 font-owsald w-96 hover:bg-opacity-85 text-center hover:cursor-pointer rounded-sm'
            >
              Get Your Tickets
            </Link>
          </div>
        </div>
      </section>

      <div className='relative'>
        <div className='absolute w-full h-full z-10'>
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white/50 rounded-full animate-sparkle"
              style={{
                top: star.top,
                left: star.left,
                scale: star.scale,
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <section id='tickets' className='bg-black py-16 relative overflow-hidden'>
          <div className='max-w-6xl mx-auto relative z-10 px-4'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl md:text-5xl font-lexend text-white font-bold mb-4'>Buy Your Tickets</h2>
              <p className='text-xl font-light font-lexend text-white/70 max-w-3xl mx-auto'>
                Experience the magic of cinema under the stars. Select your favorite movie and get ready for an unforgettable night.
              </p>
            </div>
            <div className='flex flex-col md:flex-row gap-8'>
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className='bg-white/5 border border-white/10 flex-1 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-xl'
                >
                  <div className='relative w-full aspect-[3/4] overflow-hidden'>
                    <Image
                      src={movie.MovieImage}
                      alt={movie.MovieName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  </div>
                  <div className='p-6'>
                    <h3 className='text-2xl font-lexend text-white font-semibold mb-3'>{movie.MovieName}</h3>
                    <div className='mb-4 space-y-2'>
                      <p className='text-white/70 flex items-center gap-2'>
                        <Clock />
                        Playing @ {epochToTimeAMPM(movie.MovieStartTime)}
                      </p>
                      <p className='text-white/70 flex items-center gap-2'>
                        <Timer />
                        Duration {minutesToHoursMinutes(movie.MovieDuration)} minutes
                      </p>
                      <p className='text-white/70 flex items-center gap-2'>
                        <Banknote />
                        {discountDay ? `Discount Tuesday $${movie.MoviePricePerCar * discountAmount} per vehicle` : `$${movie.MoviePricePerCar} per vehicle`}
                      </p>
                    </div>
                    <button className='w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg'>
                      Get Your Tickets
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id='faq' className='bg-black py-12 relative overflow-hidden'>
          <div className='max-w-4xl mx-auto relative z-10'>
            <h2 className='text-white md:text-5xl font-lexend mb-8 md:p-0 px-6 text-4xl'>Frequently Asked Questions</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-black/25 backdrop-blur-xl rounded-lg p-6'>
                <h3 className='text-white text-2xl font-lexend mb-4'>Where are you located?</h3>
                <p className='text-white/50 text-lg font-lexend'>We are at 3116 Ash Avenue McAllen Texas 78501. It&apos;s by business 83 between Ware and 29th.</p>
              </div>
              <div className='bg-black/25 backdrop-blur-xl rounded-lg p-6'>
                <h3 className='text-white text-2xl font-lexend mb-4'>What is the price per vehicle?</h3>
                <p className='text-white/50 text-lg font-lexend'>The price is $20 per vehicle, we have discount Tuesday for $10 per vehicle.</p>
              </div>
              <div className='bg-black/25 backdrop-blur-xl rounded-lg p-6'>
                <h3 className='text-white text-2xl font-lexend mb-4'>Can we bring our own snacks?</h3>
                <p className='text-white/50 text-lg font-lexend'>We have concessions but you are welcome to bring your favorites.</p>
              </div>
              <div className='bg-black/25 backdrop-blur-xl rounded-lg p-6'>
                <h3 className='text-white text-2xl font-lexend mb-4'>What time and days do you open?</h3>
                <p className='text-white/50 text-lg font-lexend'>We are open everyday at 6:15pm, show starts at 7:00pm.</p>
              </div>
              <div className='bg-black/25 backdrop-blur-xl rounded-lg p-6'>
                <h3 className='text-white text-2xl font-lexend mb-4'>Can we bring our pets?</h3>
                <p className='text-white/50 text-lg font-lexend'>Unfortunately pets are not allowed.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}