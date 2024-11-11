import Wave from "react-wavify";


export default function Waves(props) {
    return (
        <>
            <Wave
                id="wave1"
                fill={props.color[0]}
                paused={false}
                options={{
                    height: 25,
                    amplitude: 40,
                    speed: 0.8,
                    points: 3,
                }}
            />
            <Wave
                id="wave2"
                fill={props.color[1]}
                paused={false}
                options={{
                    height: 20,
                    amplitude: 30,
                    speed: 0.6,
                    points: 3,
                }}
            />
            <Wave
                id="wave3"
                fill={props.color[2]}
                paused={false}
                options={{
                    height: 20,
                    amplitude: 30,
                    speed: 0.4,
                    points: 3,
                }}
            />
            <Wave
                id="wave4"
                fill={props.color[3]}
                paused={false}
                options={{
                    height: 20,
                    amplitude: 30,
                    speed: 0.2,
                    points: 3,
                }}
            />
        </>
    )
}