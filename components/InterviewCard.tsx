import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {

  const feedback = userId && id ? await getFeedbackByInterviewId({
    interviewId: id,
    userId,
  }) : null;
  
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");
  

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
        <div className="card-interview bg-red-900">
            <div>
                <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-blue-950">
                    <p className="badge-text text-white">{ normalizedType }</p>
                </div>

                <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className="rounded-full object-fit size=[90px]"/>

                <h3 className="mt-5 capitalize text-white">
                  {role} Interview
                </h3>

                <div className="flex flex-row gap-5 mt-3 ">
                  <div className="flex flex-row gap-2">
                    <Image src="/calendar.svg" alt="calendar icon" width={22} height={22}/>
                    <p className="text-white">{formattedDate}</p>
                  </div>

                  <div className="flex flex-row gap-2">
                    <Image src="/star.svg" alt="star icon" width={22} height={22}/>
                    <p className='text-white'>{feedback?.totalScore || "---"}/100</p>
                  </div>
                </div>

                <p className="line-clamp-2 mt-5 text-white">
                  {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills!"}
                </p>
            </div>

            <div className="flex flex-row justify-between">
              <DisplayTechIcons techStack={techstack} />

              <Button className="text-sm font-semibold w-fit hover:bg-gray-600 hover:text-white rounded-full px-5 py-3 cursor-pointer min-h-10 bg-white">
                <Link className="font-bold" href={feedback ? `/interview/${id}/feedback` : `/interview/${id}`}>
                  {feedback ? 'Check Feedback' : "View Interview"}
                </Link>
              </Button>
            </div>
        </div>
    </div>
  )
};

export default InterviewCard;
