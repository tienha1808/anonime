import { faPlay, faPause, faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { faVolumeHigh, faVolumeLow, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { faExpand, faMinimize } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from '../../styles/Video.module.scss'


const cx = classNames.bind(styles)

function Video () {

    const [ pause, setPause ] = useState(true)
    const [ volume, setVolume ] = useState(0.8)
    const [ currentTime, setCurrentTime ]: [ number, Dispatch<SetStateAction<number>>]  = useState(0)
    const [ duration, setDuration ]: [ number, Dispatch<SetStateAction<number>>] = useState(0)
    const [ wide, setWide ] = useState(faExpand)
    const [ bgVideo, setBgVideo ] = useState(true)

    const videoRef: any = useRef()
    const containerRef: any = useRef()

    useEffect(() => {
        const stop = setTimeout(() => setBgVideo(false), 1800)
        return () => clearTimeout(stop)
    }, [bgVideo === true])

    useEffect(() => {
        if (videoRef) {
            setDuration(Math.floor(videoRef.current.duration))
            if (duration) {
                if (videoRef.current.currentTime === duration) {
                    setPause(true)
                } else {
                    const intervalVideo = setInterval(() => {
                        const current = Math.floor(videoRef.current.currentTime * 100 / duration)
                        setCurrentTime(current)
                    }, 1000)
                    return () => clearInterval(intervalVideo)
                }
            }
        }
        
    })
    
    const handlePlayPause = () => {
        if (pause) {
            videoRef.current.play()
            setPause(false)
        } else {
            videoRef.current.pause()
            setPause(true)
        }
    }

    const handleVolume = () => {
        if (videoRef.current.volume === 0) {
            setVolume(100)
            videoRef.current.volume = 1
        } else {
            setVolume(0)
            videoRef.current.volume = 0
        }
    }

    const handleChangeVolme = (e: any) => {
        const value = e.target.value
        videoRef.current.volume = value
        setVolume(value)
    }

    const handleTimeVideo = (e: any) => {
        const value = e.target.value
        if (duration) {
            const time = Math.floor((value * duration) / 100)
            setCurrentTime(value)
            videoRef.current.currentTime = time
        }
    }

    const handleWide = () => {
        if (document.fullscreenElement == null) {
            containerRef.current.requestFullscreen()
            setWide(faMinimize)
        } else {
            document.exitFullscreen()
            setWide(faExpand)
        }
    }
    
    const handleMouseMove = () => {
        if (!bgVideo) {
            setBgVideo(true)
        }
    }

    return (
        <>
            <div
                ref={containerRef}
                className={cx(
                    'video--container',
                    {'video--background': bgVideo},
                    {'video--hiddenmouse': !bgVideo}
                )}
                onMouseMove={handleMouseMove}
            >
                <div className={cx('media')}>
                    <div className={cx('media--video')}>
                        <input
                            className={cx('media--track__video')}
                            style={{
                                backgroundImage:
                                `   
                                    linear-gradient(
                                    90deg,
                                    #ff0000 0%,
                                    #ff0000 ${currentTime}%,
                                    var(--text-muted) ${currentTime}%,
                                    var(--text-muted) 100%)
                                `
                            }}
                            type='range'
                            value={currentTime}
                            step='1'
                            min='0'
                            max='100'
                            onChange={handleTimeVideo}
                        />
                    </div>
                    <div className={cx('media--player')}>
                        <div className={cx('media--playaudio')}>
                            <button
                                className={cx('media--button')}
                                onClick={handlePlayPause}
                            >
                                <FontAwesomeIcon className={cx('media--button__icon')} icon={pause ? faPlay : faPause} />
                            </button>
                            <button
                                className={cx('media--button')}
                                onClick={handleVolume}
                        
                            >
                                <FontAwesomeIcon className={cx('media--button__icon')} icon={volume > 0 ? (volume >= 0.8 ? faVolumeHigh : faVolumeLow) : faVolumeXmark} />
                            </button>
                            <div className={cx('media--audio')}>
                                <input
                                    className={cx('media--track__audio')}
                                    type="range"
                                    style={{
                                        backgroundImage:
                                        `   
                                            linear-gradient(
                                            90deg,
                                            #fff 0%,
                                            #fff ${volume * 100}%,
                                            var(--text-muted) ${volume * 100}%,
                                            var(--text-muted) 100%)
                                        `
                                    }}
                                    value={volume}
                                    min='0'
                                    max='1'
                                    step='0.02'
                                    onChange={handleChangeVolme}
                                />
                            </div>
                        </div>
                        <div className={cx('media--screen')}>
                            <button
                                className={cx('media--button')}
                                onClick={handleWide}
                            >
                                <FontAwesomeIcon className={cx('media--button__icon')} icon={wide} />
                            </button>
                        </div>
                    </div>
                </div>
                <video
                    ref={videoRef}
                    src='/videos/dotoc2.mp4'
                    className={cx('video')}
                    onClick={handlePlayPause}
                    onDoubleClick={handleWide}
                >
                </video>
                <button className={cx('media--icon', {'media--icon__hidden': pause})}>
                    <FontAwesomeIcon className={cx('media--icon__svg')} icon={faCirclePause} />
                </button>
                <button className={cx('media--icon', {'media--icon__hidden': !pause})}>
                    <FontAwesomeIcon className={cx('media--icon__svg')} icon={faCirclePlay} />
                </button>
            </div>
        </>
    );
}

export default Video;