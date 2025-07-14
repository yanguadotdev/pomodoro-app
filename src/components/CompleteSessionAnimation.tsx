import { useEffect, useState } from "react"
import Lottie from "lottie-react"


export default function CompletedSessionAnimation() {
    const [animationData, setAnimationData] = useState<any | null>(null)

    useEffect(() => {
        import("@/assets/lotties/complete-session.json").then((mod) => {
            setAnimationData(mod.default)
        })
    }, [])

    if (!animationData) return null

    return (
        <div className="text-center -mt-12 size-48">
            <Lottie
                className="size-48"
                animationData={animationData}
                loop={false}
            />
            <p className="text-white text-lg font-semibold -mt-12">¡Completado!</p>
        </div>
    )
}
