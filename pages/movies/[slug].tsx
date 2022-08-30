import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import axios from 'axios'
import classNames from 'classnames/bind'
import styles from '../../styles/Movie.module.scss'
import { capitalizeFirstLetter } from '../../apps/capitalizeFirstLetter'
import Link from 'next/link'
import Head from 'next/head'
import Video from '../../features/Video'

const cx = classNames.bind(styles)

function Movie ({ movie, movies }: { movie: any, movies: any }) {
    
    const [ popularMovies, setPopularMovies ]: [ {id: string, image: string}[] | undefined, Dispatch<SetStateAction<{id: string, image: string}[] | undefined>>] = useState()

    const movieInfo = {
        director: movie.director,
        producer: movie.producer,
        release_date: movie.release_date,
        running_time: `${movie.running_time} min`,
        rotten_tomatoes_score: movie.rt_score
    }

    useEffect(() => {
        const sortMovies = movies.sort((a: {rt_score: string}, b: {rt_score: string}) => Number(b.rt_score) - Number(a.rt_score))
        setPopularMovies(sortMovies.slice(0,6))
    }, [movies])

  return (
    <>
        <Head>
            <title>{`${movie.title} | Anonime`}</title>
            <meta name='keywords' content={`anonime, ${movie.title}`} />
        </Head>
        <div className={cx('container', 'row')}>
            <div className='col c-12 m-12 l-8'>
                <div className={cx('movie')}>
                    <div className={cx('movie--title', 'fs-2 fw-semibold')}>
                        {movie.title}
                    </div>
                    <Video />
                </div>
                <div className={cx('movie--information', 'row')}>
                    <div className='col c-12 m-6 l-4'>
                        <img
                            style={{width: '100%', height: '100%', borderRadius: '1.2rem'}}
                            src={movie.image}
                            alt=""
                            
                        />  
                    </div>
                    <ul className='col c-12 m-6 l-4'>
                        {Object.entries(movieInfo).map(item => (
                            <li className={cx('information')} key={item[0]}>
                                <div className={cx('information--title', 'fs-4 fw-semibold')}>
                                    {capitalizeFirstLetter(item[0].replaceAll('_', ' '))}
                                </div>
                                <div className={cx('information--content')}>
                                    {item[1]}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={cx('movie--description', 'c-12')}>
                    <div className={cx('movie--description__title', 'fs-4 fw-semibold')}>
                        Sypnosis :
                    </div>
                    <div className={cx('movie--description__content')}>
                        {movie.description}
                    </div>
                </div>
            </div>
            <div className='col c-12 m-12 l-4'>
                <div className={cx('popular--title', 'fs-2 fw-semibold')}>
                    Popular Anime
                </div>
                {
                popularMovies
                ?
                <ul className={cx('popular--content', 'row')}>
                    {popularMovies.map((movie) => (
                        <li key={movie.id } className={cx('popular--content__image', 'col c-6 m-6 l-6')}>
                            <Link href={`/movies/${movie.id}`}>
                                <a>
                                    <img
                                        style={{width: '100%', height: '100%', borderRadius: '1.2rem'}}
                                        src={movie.image}
                                        alt=""
                                        
                                    />
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
                :
                'Loading'
                }
            </div>
        </div>
    </>
  )
}

export async function getStaticPaths() {
    const res = await axios.get('https://ghibliapi.herokuapp.com/films')
    const movies = res.data

    const paths = movies.map((movie: any) => ({
        params: {
            slug: movie.id,
        }
    }))

    return { paths, fallback: false}
}

export async function getStaticProps({ params }: {params: {slug: string}}) {
    const resMovie = await axios.get(`https://ghibliapi.herokuapp.com/films/${params.slug}`)
    const movie = await resMovie.data

    const resMovies = await axios.get('https://ghibliapi.herokuapp.com/films')
    const movies = await resMovies.data

    return {
        props: {
            movie,
            movies,
        }
    }
}

export default Movie