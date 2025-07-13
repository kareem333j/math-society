import { useEffect, useRef, useState, memo, useMemo } from "react";
import axiosInstance from "../../../../Axios";
import LogoImg from '../../../../assets/images/logos/logo_white.png';
import LogoImgDark from '../../../../assets/images/logos/logo_dark.png';
import useLocalStorage from "use-local-storage";
import { LoveBtn } from "../../../inherit/LoveBtn";

function TypeVideo(props) {
    const videoData = props.videoData;
    const [likes, setLikes] = useState(0);
    const [userLike, setUserLike] = useState(false);
    const [storage] = useLocalStorage('isDark');
    const videoEmbed = useRef();

    useEffect(() => {
        setUserLike(false);
        setLikes(0);
        getLikes();
    }, [videoData.id]);

    const getLikes = () => {
        axiosInstance
            .get(`quizzes/get/video/likes/${videoData.id}`)
            .then(
                (response) => {
                    if (response.data.like === true) {
                        setUserLike(true);
                    } else {
                        setUserLike(false);
                    }
                    setLikes(response.data.likes);
                }
            )
            .catch(
                (err) => {
                    setLikes(videoData.likes);
                }
            )
    }

    const handleLikes = () => {
        axiosInstance
            .post('quizzes/update/video/likes', {
                id: videoData.id,
                like: !userLike,
            })
            .then((response) => {
                getLikes();
            })
            .catch((err) => { console.log(err) })
    }
    const extractDriveVideoSrc = (embedCode) => {
        const match = embedCode.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    };

    const VideoPlayer = useMemo(() => {
        const VideoEmbed = ({ embedCode }) => {
            const src = extractDriveVideoSrc(embedCode);

            useEffect(() => {
                const iframe = videoEmbed.current?.querySelector("iframe");
                if (iframe) {
                    iframe.setAttribute("allowfullscreen", "true");
                    iframe.setAttribute("allow", "fullscreen");
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                }
            }, [embedCode]);

            return (
                <div className="video-container" ref={videoEmbed}>
                    {src && (
                        <iframe
                            key={`video-${videoData.id}`}
                            src={src}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                            title="Video Player"
                            frameBorder="0"
                        />
                    )}
                </div>
            );
        };

        return <VideoEmbed embedCode={videoData.video_embed} />;
    }, [videoData.video_embed, videoData.id]);

    return (
        <>
            <div className='player_wrapper d-flex justify-content-center align-items-center flex-column'>
                <div className="player-div-1">
                    <img className="hide-btn p-2" src={storage ? LogoImgDark : LogoImg} alt='logo' />
                    {VideoPlayer}
                    <div className="player-div-2"></div>
                </div>
                <h3 className='title w-100 d-flex justify-content-start align-items-center'>{videoData.title}</h3>
            </div>
            <div className="video-options w-100">
                <div className="d-flex align-items-center likes">
                    <LoveBtn handleLikes={handleLikes} userLike={userLike} />
                    <div className="d-flex gap-2" style={{ 'fontSize': '1.1em', 'color': 'var(--color-default2)' }}> <span>{likes}</span>  <span>إعجاب</span></div>
                </div>
            </div>
            <div className="video-description-div w-100 d-flex flex-column" dir="rtl">
                <span className="desc-title mb-2">الوصف :</span>
                <span style={{ "whiteSpace": "pre-line" }} className="description">{videoData.description}</span>
            </div>

        </>

    )
}

export default TypeVideo;