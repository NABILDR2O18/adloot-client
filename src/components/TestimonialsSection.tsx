import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "MobileApps Inc.",
    role: "Marketing Director",
    quote:
      "AdLoot has transformed our monetization strategy. We've seen a 40% increase in revenue since integration.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Michael Chang",
    company: "GameWorld Studios",
    role: "CEO",
    quote:
      "The integration was seamless and the support team was incredibly helpful. Our users love the offerwall experience.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    company: "SocialConnect",
    role: "Product Manager",
    quote:
      "AdLoot's smart targeting helped us achieve a 28% increase in conversion rates for our campaigns.",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "David Wilson",
    company: "AppNexus",
    role: "CTO",
    quote:
      "The API integration was straightforward and the documentation is excellent. Definitely the best ad network we've worked with.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop",
  },
];

const partnerLogos = [
  { name: "Partner 1", url: "#" },
  { name: "Partner 2", url: "#" },
  { name: "Partner 3", url: "#" },
  { name: "Partner 4", url: "#" },
  { name: "Partner 5", url: "#" },
  { name: "Partner 6", url: "#" },
];

const TestimonialCard = ({ testimonial }) => (
  <Card className="p-6 min-h-[250px] shadow-lg">
    <div className="flex items-center mb-4">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full mr-4 object-cover"
      />
      <div>
        <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">
          {testimonial.role}, {testimonial.company}
        </p>
      </div>
    </div>
    <blockquote className="text-gray-700 italic">
      "{testimonial.quote}"
    </blockquote>
  </Card>
);

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-purple-600">Industry Leaders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our partners have to say about working with AdLoot.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative inset-0 translate-y-0" />
              <CarouselNext className="relative inset-0 translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Partner Logos */}
        {/* <div className="mt-20">
          <h3 className="text-center text-xl font-medium text-gray-700 mb-10">
            Our Trusted Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partnerLogos.map((partner, index) => (
              <div 
                key={index} 
                className="h-20 bg-white rounded-lg shadow-md flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Logo {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};
