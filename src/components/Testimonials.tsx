
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    content:
      "CollegeBites has been a game-changer for our family. My son gets to enjoy my homemade lasagna even while he's away at college, and I have peace of mind knowing he's eating well.",
    author: "Sarah Johnson",
    role: "Parent",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 5,
  },
  {
    content:
      "As a college student, getting home-cooked meals from my parents through CollegeBites has made such a difference. It's like having a piece of home in my dorm room.",
    author: "Michael Chen",
    role: "Student",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
  {
    content:
      "I drive between Boston and New York regularly for work. CollegeBites lets me make some extra money by delivering food packages along my route. It's been a win-win!",
    author: "David Rodriguez",
    role: "Driver",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Community Says
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied parents, students, and drivers using CollegeBites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-collegeBites-lightBlue rounded-lg p-6 shadow-sm"
            >
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={18}
                    className={`${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full mr-3"
                  src={testimonial.avatar}
                  alt={testimonial.author}
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
