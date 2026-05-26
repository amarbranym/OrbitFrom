import React from "react";

import { Container } from "../common/container";
import { SectionHeading } from "../common/section-heading";
import { SectionWrapper } from "../common/section-wrapper";
import { VideoTestimonialCarousel } from "../common/video-testimonial-carousel";

interface VideoTestimonialItem {
  thumbnail: string;
  videoUrl: string;
  title: string;
  clientName: string;
  clientRole: string;
  quote: string;
}

function ytThumbnail(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function ytWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/** YouTube Shorts from @chaiaurcode and @piyushgargdev */
export const videoTestimonials: VideoTestimonialItem[] = [
  {
    thumbnail: ytThumbnail("oO99bM4YzXw"),
    videoUrl: ytWatchUrl("oO99bM4YzXw"),
    title: "Crazy AI use case",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "A quick take on practical AI workflows for developers.",
  },
  {
    thumbnail: ytThumbnail("Ja_LqbOdPyM"),
    videoUrl: ytWatchUrl("Ja_LqbOdPyM"),
    title: "Job vs independence",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "Career perspective on building skills beyond a single job title.",
  },
  {
    thumbnail: ytThumbnail("uTMS1T0a30o"),
    videoUrl: ytWatchUrl("uTMS1T0a30o"),
    title: "Disregard breaks Google search",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "Why small UX details matter in how users find information.",
  },
  {
    thumbnail: ytThumbnail("qdwZbqfA6fU"),
    videoUrl: ytWatchUrl("qdwZbqfA6fU"),
    title: "Google names are confusing",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "Naming in tech products — and why clarity wins.",
  },
  {
    thumbnail: ytThumbnail("NGxXgIlA5x8"),
    videoUrl: ytWatchUrl("NGxXgIlA5x8"),
    title: "DSA krna h kya ab?",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "Do you still need DSA in 2026? A grounded short answer.",
  },
  {
    thumbnail: ytThumbnail("B1QIxwZvIOE"),
    videoUrl: ytWatchUrl("B1QIxwZvIOE"),
    title: "Day 1 se production ki expectations",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "What teams actually expect when you ship from day one.",
  },
  {
    thumbnail: ytThumbnail("CiGjjr38sN0"),
    videoUrl: ytWatchUrl("CiGjjr38sN0"),
    title: "Agentic Gemini in Android",
    clientName: "Chai aur Code",
    clientRole: "@chaiaurcode",
    quote: "Agentic AI on mobile — what builders should watch for.",
  },
  {
    thumbnail: ytThumbnail("WUrBMWU79Q0"),
    videoUrl: ytWatchUrl("WUrBMWU79Q0"),
    title: "GitHub hacked — remote code execution",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "Breaking down a serious GitHub security incident in minutes.",
  },
  {
    thumbnail: ytThumbnail("OUtOEcyiSOU"),
    videoUrl: ytWatchUrl("OUtOEcyiSOU"),
    title: "Vercel security incident",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "What happened in the Vercel April 2026 incident — explained simply.",
  },
  {
    thumbnail: ytThumbnail("ITR9C2Ti8dM"),
    videoUrl: ytWatchUrl("ITR9C2Ti8dM"),
    title: "Hashing vs encryption",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "The difference every backend developer should know cold.",
  },
  {
    thumbnail: ytThumbnail("bUUM-JQ3qBU"),
    videoUrl: ytWatchUrl("bUUM-JQ3qBU"),
    title: "What is SSO?",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "Single sign-on in plain language for full-stack builders.",
  },
  {
    thumbnail: ytThumbnail("sJ78_uAM0Zs"),
    videoUrl: ytWatchUrl("sJ78_uAM0Zs"),
    title: "What are webhooks?",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "How webhooks connect your app to the rest of the internet.",
  },
  {
    thumbnail: ytThumbnail("O6E3rqwkYF4"),
    videoUrl: ytWatchUrl("O6E3rqwkYF4"),
    title: "Postman alternatives",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "API tooling worth checking if you are rethinking your workflow.",
  },
  {
    thumbnail: ytThumbnail("kao-ToqDsio"),
    videoUrl: ytWatchUrl("kao-ToqDsio"),
    title: "Contract-driven development",
    clientName: "Piyush Garg",
    clientRole: "@piyushgargdev",
    quote: "Why contracts between services save teams from integration pain.",
  },
];

export const VideoTestimonialSection = () => {
  return (
    <SectionWrapper
      id="video-testimonials"
      aria-labelledby="video-testimonials-heading"
    >
      <Container>
        <SectionHeading
          id="video-testimonials-heading"
          title={"Learn with <span class='text-primary'>India's dev creators</span>"}
          description="Shorts from Chai aur Code and Piyush Garg — tap any card to watch in the carousel."
          align="center"
        />
        <VideoTestimonialCarousel testimonials={videoTestimonials} />
      </Container>
    </SectionWrapper>
  );
};
