import * as React from "react";
import { APITypes, PlyrProps, usePlyr } from "plyr-react";
import "plyr-react/plyr.css";
import Hls from "hls.js";
import Plyr from "plyr-react";



const useHls = (src, options, id) => {
    const hls = React.useRef(new Hls())
    const hasQuality = React.useRef(false)
    const [plyrOptions, setPlyrOptions] = React.useState(options)

    React.useEffect(() => {
        hasQuality.current = false
    }, [options])

    React.useEffect(() => {
        hls.current.loadSource(src)
        hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
            if (hasQuality.current) return // early quit if already set

            const levels = hls.current.levels
            const quality = {
                default: levels[levels.length - 1].height,
                options: levels.map(level => level.height),
                forced: true,
                onChange: newQuality => {
                    console.log("changes", newQuality)
                    levels.forEach((level, levelIndex) => {
                        if (level.height === newQuality) {
                            hls.current.currentLevel = levelIndex
                        }
                    })
                }
            }
            setPlyrOptions({ ...plyrOptions, quality })
            hasQuality.current = true
        })
    }, [id])

    return { options: plyrOptions }
}

const CustomPlyrInstance = React.forwardRef((props, ref,) => {
    const { source, options = null, hlsSource } = props
    const raptorRef = usePlyr(ref, {
        ...useHls(hlsSource, options, props.id),
        source
    })
    return <video ref={raptorRef} className="plyr-react plyr" />
})

const PlyrComponent = (props) => {
    const options = {
        title: 'Example Title',
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            // 'volume',
            'captions',
            'settings',
            // 'pip',
            'airplay',
            'fullscreen',
            // 'restart',
            'rewind',
            'fast-forward',
            'duration',
        ],
        settings: [
            'captions',
            'speed',
            'loop',
        ],
        keyboard: { focused: true, global: true },
        // quality:{ default: 720, options: [1080, 720, 360] },
    }
    const videoSource = props.source;
    const hlsSource = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

    const ref = React.useRef(null)
    const supported = Hls.isSupported()

    return (
        <div className="wrapper" style={{ 'minHeight': '300px !important', 'width': '100%', 'backgroundColor': 'red' }}>
            {supported ? (
                <CustomPlyrInstance
                    ref={ref}
                    source={videoSource}
                    options={options}
                    hlsSource={hlsSource}
                    id={props.id}
                />
            ) : (
                "HLS is not supported in your browser"
            )}
        </div>
    )
}

export const Plyr0 = (props) => {
    const options = {
        title: 'Example Title',
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            // 'volume',
            'captions',
            'settings',
            // 'pip',
            'airplay',
            'fullscreen',
            // 'restart',
            'rewind',
            'fast-forward',
            'duration',
        ],
        settings: [
            'captions',
            'speed',
            'loop',
        ],
        autoplay: false,
        blankVideo: 'لقد حدث خطأ',
        captions: {
            active: false,
            language: 'auto',
        },
        keyboard: { focused: true, global: true },
        // quality:{ default: 720, options: [1080, 720, 360] },
    }
    const videoSource = props.source;
    // const hlsSource = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

    const ref = React.useRef(null)
    const supported = Hls.isSupported()

    return (
        <div className="wrapper" style={{ 'minHeight': '300px !important', 'width': '100%', 'backgroundColor': 'red' }}>
            <Plyr
                options={options}
                source={props.source}
            />
        </div>
    )
}

export default PlyrComponent