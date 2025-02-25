import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../../../Axios";
// import LogoImg from '../../../../assets/images/logo.svg';
// import LogoImgDark from '../../../../assets/images/logo1.svg';
import useLocalStorage from "use-local-storage";
import { LoveBtn } from "../../../inherit/LoveBtn";
import LogoImg from '../../../../assets/images/logos/logo_white.png';
import LogoImgDark from '../../../../assets/images/logos/logo_dark.png';


function TypeVideo(props) {
    const videoData = props.videoData;
    const [likes, setLikes] = useState(0);
    const [userLike, setUserLike] = useState(false);
    const [storage] = useLocalStorage('isDark');
    const videoEmbed = useRef();
    // const dataUser = props.dataAuth.profile;

    useEffect(() => {
        setUserLike(false);
        setLikes(0);
        getLikes();
        
    }, [props.videoData.id]);

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

    const VideoEmbed = ({ embedCode }) => {
        return (
            <div dangerouslySetInnerHTML={{ __html: embedCode }} ></div>
        );
    };

    return (
        <>
            <div className='player_wrapper d-flex justify-content-center align-items-center flex-column'>
                <div className="player-div-1">
                    <img className="hide-btn p-2" src={storage ? LogoImgDark : LogoImg} alt='logo' />
                    <VideoEmbed embedCode={videoData.video_embed}/>
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
                <span style={{"whiteSpace": "pre-line"}} className="description">{videoData.description}</span>
            </div>

        </>

    )
}

export default TypeVideo;





// to get video with plyr
// import PlyrComponent from "../../../plyr/Plyr";
// import { Plyr0 } from "../../../plyr/Plyr";
// import ReactPlayer from 'react-player';
// import Plyr from "plyr-react";
/* <Plyr0
    source={{
        type: 'video',
        sources: [
            {
                src: 'https://www.youtube-nocookie.com/embed/kQbMYsQLqCg?si=B0-nxV59KJDEzrZJ',
                provider: 'youtube',
                size: 480
            },
            {
                src: 'https://www.youtube-nocookie.com/embed/kQbMYsQLqCg?si=B0-nxV59KJDEzrZJ',
                provider: 'youtube',
                size: 720
            },
            {
                src: 'https://www.youtube-nocookie.com/embed/kQbMYsQLqCg?si=B0-nxV59KJDEzrZJ',
                provider: 'youtube',
                size: 1080
            },
        ],
    }}
    
/> */
/* <PlyrComponent/> */