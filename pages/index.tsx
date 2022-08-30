import type { InferGetStaticPropsType } from 'next'
import classNames from 'classnames/bind'
import styles from '../styles/Home.module.scss'
import axios from 'axios'
import Link from 'next/link'
import { random } from '../apps/random'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Head from 'next/head'

const cx = classNames.bind(styles)

interface Movie {
  id: string,
  title: string,
  description: string,
  movie_banner: string,
}

const Home = ({ movies }: InferGetStaticPropsType<typeof getStaticProps>) => {

  const [ exploreMovie, setExploreMovie ] : [Movie | undefined, Dispatch<SetStateAction<Movie | undefined>>] = useState()

  useEffect(() => {
      setExploreMovie(movies[random(0, movies.length)])
  }, [movies])

  return (
    <>
      <Head>
        <title>Anonime | Home</title>
        <meta name='keywords' content={`anonime, ${movies.map((movie: {title: string}) => movie.title).toString()}`} />
      </Head>
      <div className={cx('container')}>
        <div className={cx('explore')}>
          <div className={cx('explore--title', 'l-12 fs-2 fw-semibold')}>
            Explore
          </div>
          <div className={cx('explore--content', 'l-12 fs-4')}>
            What are you gonna watch today ?
          </div>
          {
            exploreMovie
            ?
            <Link href={`/movies/${exploreMovie.id}`}>
              <a>
                <div
                  className={cx('explore--thumbnail', 'c-12')}
                  style={{
                    backgroundImage: `url(${exploreMovie.movie_banner})`
                  }}
                >
                  <div className={cx('explore--thumbnail__content')}>
                    <div className={cx('explore--thumbnail__title', 'fs-1 fw-semibold')}>
                      {exploreMovie.title}
                    </div>
                    <div className={cx('explore--thumbnail__description')}>
                      {exploreMovie.description}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
            :
            'Loading'
          }
        </div>
        <div className={cx('release')}>
          <div className={cx('release--title', 'fs-1 fw-semibold')}>
            New Realease
          </div>
          <ul className={cx('release--movies', 'row')}>
            {movies.map((movie: any) => (
              <li key={movie.id} className={cx('Movie', 'col c-6 m-4 l-2')}>
                <Link href={`/movies/${movie.id}`}>
                  <a>
                    <div className={cx('film--thumbnail')}>
                      <img
                        className={cx('film--thumbnail__image')}
                        src={movie.image}
                        alt=''
                      />
                    </div>
                  </a>
                </Link>
                <div className={cx('film--title', 'fw-semibold')}>
                  {movie.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const res = await axios.get('https://ghibliapi.herokuapp.com/films')
  const movies = await res.data

  return {
    props: {
      movies,
    },
  }
}

export default Home