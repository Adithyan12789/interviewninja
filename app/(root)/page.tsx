import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import {
  getCurrentUser,
} from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviewsRaw, latestInterviewsRaw] = await Promise.all([
    await getInterviewsByUserId(user?.id || ""),
    await getLatestInterviews({ userId: user?.id || "" }),
  ]);

  const userInterviews = userInterviewsRaw ?? [];
  const latestInterviews = latestInterviewsRaw ?? [];

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-white">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h2>
          <p className="text-lg text-white">
            Practice on real interview questions & get instant feedback
          </p>

          <Button
            asChild
            className="btn-primary bg-slate-300 text-black font-bold max-sm:w-full"
          >
            <Link href="/interview">Start An Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="Robot"
          width={400}
          height={400}
          className="hidden sm:block"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-white">Your Inteviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>You Haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-white">Take an Interview</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>There are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
