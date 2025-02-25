import Image from 'next/image';

interface Skill {
  name: string;
  level: number;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

const AboutMe: React.FC = () => {

  // Skills data
  const skills: Skill[] = [
    { name: 'Social Media Marketing', level: 90 },
    { name: 'Content Strategy', level: 85 },
    { name: 'SEO', level: 80 },
    { name: 'Google Analytics', level: 85 },
    { name: 'Email Marketing', level: 75 },
    { name: 'Paid Advertising', level: 80 },
  ];

  // Experience data
  const experiences: Experience[] = [
    {
      title: 'Senior Digital Marketing Specialist',
      company: 'TechGrowth Agency',
      period: '2023 - Present',
      description: 'Leading digital marketing campaigns for tech startups, focusing on growth strategies and conversion optimization.'
    },
    {
      title: 'Digital Marketing Associate',
      company: 'InnovateMKT',
      period: '2022 - 2023',
      description: 'Managed social media accounts, email campaigns, and content marketing for B2B clients across various industries.'
    },
  ];

  return (
    <div 
      className="h-full-screen bg-background text-white font-inter overflow-hidden relative"
    >
      <div className="container mx-auto px-4 py-16 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Profile Section - Modified for rectangular photo without border */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative w-64 h-full mb-6 overflow-hidden">
              <Image 
                src="/profile-placeholder.png" 
                alt="Digital Marketing Specialist" 
                fill
                className="object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold font-space text-white mt-4">Adhara Eka</h1>
            <h2 className="text-xl text-primary-blue mb-4">Digital Marketing Specialist</h2>
            
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-primary-blue hover:text-primary-purple transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-blue hover:text-primary-purple transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-blue hover:text-primary-purple transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="md:col-span-2">
            <section className="mb-10">
              <h3 className="text-2xl font-space font-bold mb-4 border-b border-primary-blue pb-2">About Me</h3>
              <p className="text-gray-300 mb-4">
                I am a passionate Digital Marketing Specialist with over 2 years of experience driving growth for businesses through innovative digital strategies. My expertise lies in creating compelling narratives and leveraging data-driven insights to maximize ROI across various digital platforms.
              </p>
              <p className="text-gray-300">
                My approach combines creative content development with analytical precision, ensuring campaigns not only reach the right audience but also resonate with them on a deeper level. I thrive in dynamic environments where I can experiment with emerging trends and technologies to stay ahead of the competition.
              </p>
            </section>
            
            <section className="mb-10">
              <h3 className="text-2xl font-space font-bold mb-4 border-b border-primary-blue pb-2">Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-white">{skill.name}</span>
                      <span className="text-sm font-medium text-primary-blue">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-blue to-primary-purple h-2 rounded-full" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-2xl font-space font-bold mb-4 border-b border-primary-blue pb-2">Experience</h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary-blue pl-4">
                    <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                    <div className="flex justify-between">
                      <p className="text-primary-blue">{exp.company}</p>
                      <p className="text-secondary">{exp.period}</p>
                    </div>
                    <p className="text-gray-300 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;