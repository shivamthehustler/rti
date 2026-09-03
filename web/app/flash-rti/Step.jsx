import { CircleCheckBig, Loader, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";

export default function Step({
    text,
    status,
    estimated = 13,
}) {
    const [prevStatus, setPrevStatus] = useState(status);
    const [prevEstimated, setPrevEstimated] = useState(estimated);
    const [time, setTime] = useState(estimated);

    if (status !== prevStatus || estimated !== prevEstimated) {
        setPrevStatus(status);
        setPrevEstimated(estimated);
        setTime(estimated);
    }

    useEffect(() => {
        if (status !== "working") return;

        const timer = setInterval(() => {
            setTime((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [status]);

    return (
        <div
            className="
        flex gap-2
        bg-[#E9E8E1]
        text-[#686861]
        rounded-lg
        p-2
        shadow-[inset_0_0_0_0.3px_#aaa]
        min-w-0
      "
        >
            <div className="pt-px shrink-0">
                {status === "done" ? (
                    <CircleCheckBig size={17} />
                ) : status === "error" ? (
                    <OctagonAlert size={17} />
                ) : (
                    <Loader
                        size={17}
                        className={
                            status === "working"
                                ? "animate-spin"
                                : ""
                        }
                    />
                )}
            </div>

            <div className="min-w-0">
                <p className="wrap-break-word">
                    {text}
                </p>

                <p className="text-sm opacity-80">
                    {status === "working"
                        ? time > 0
                            ? `estimated time ${time}s`
                            : "taking longer than usual"
                        : status === "done"
                            ? "completed"
                            : status === "error"
                                ? "information not found"
                                : "yet to start"}
                </p>
            </div>
        </div>
    );
};