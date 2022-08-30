import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from '../../styles/Header.module.scss'
import Link from 'next/link'
import axios from 'axios'

const cx = classNames.bind(styles)

const navbar = [
    {
        id: 1,
        name: 'Home',
        path: '/'
    },
    {
        id: 2,
        name: 'List anime',
        path: '/movies'
    }
]

function Header () {

    const [ search, setSearch ]: [ string , Dispatch<SetStateAction< string  >>] = useState('')
    const [ moviesSearch, setMoviesSearch ] = useState([])
    const [ movies ,setMovies ]: [ [] , Dispatch<SetStateAction< [] >>] = useState([])
    const [ dropdown, setDropdown ]: [ boolean , Dispatch<SetStateAction<boolean>>] = useState(false)

    useEffect(() => {
        axios.get('https://ghibliapi.herokuapp.com/films')
        .then(res => res.data)
        .then(data => setMovies(data))
    }, [])

    useEffect(() => {
        if (search.length > 0) {
            const filterMovies = movies.filter((movie: {title: string}) => movie.title.toLowerCase().includes(search.toLowerCase()))
            if (filterMovies.length > 0) {
                setMoviesSearch(filterMovies)
            }
        } else {
            setMoviesSearch([])
        }
    }, [search])

    const handleBlur = () => {
        setTimeout(() => setDropdown(false), 150)
    }

  return (
    <>
        <nav className={cx('header')}>
            <div className={cx('header--navbar')}>
                <Link href='/'>
                    <a>
                        <div className={cx('header--navbar__brand', 'fs-1 fw-bold')}>
                            Anonime
                        </div>
                    </a>
                </Link>
                <ul className={cx('header--navbar__nav')}>
                    {navbar.map(item => (
                        <li key={item.id}>
                            <Link href={item.path}>
                                <a className={cx('header--navbar__item', 'fs-5')}>
                                    {item.name}
                                </a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <label className={cx('header--label')} htmlFor='search'>
                <input
                    name='search'
                    className={cx('header--searchbar', 'fs-5')}
                    type="text"
                    placeholder='Search anime or movie'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setDropdown(true)}
                    onBlur={handleBlur}
                />
            </label>
            <ul hidden={!dropdown} className={cx('dropdown')}>
                {moviesSearch.map((item: {id: string, image: string, title: string, director: string}) => (
                    <li key={item.id}>
                        <Link href={`/movies/${item.id}`}>
                            <a>
                                <div className={cx('dropdown--item', 'row')}>
                                    <div className={cx('dropdown--item__thumbnail', 'col c-4')}>
                                        <img className={cx('dropdown--item__image')} src={item.image} alt="" />
                                    </div>
                                    <div className='col c-8'>
                                        <div className={cx('dropdown--item__title', 'fs-4 fw-semibold')}>
                                            {item.title}
                                        </div>
                                        <div className={cx('dropdown--item__director')}>
                                            {item.director}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    </>
  )
}

export default Header