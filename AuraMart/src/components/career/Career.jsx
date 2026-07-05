import { Briefcase, Clock, ChevronRight } from 'lucide-react';

const jobList = [
  {
    title: 'Social Media Executive',
    experience: '2+ Years Experience',
    type: 'Full Time',
    responsibilities: [
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    ],
  },
  {
    title: 'Sales & Marketing Executive',
    experience: '2+ Years Experience',
    type: 'Full Time',
    responsibilities: [
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      'Eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    ],
  },
];

const Career = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* header */}
      <div className="bg-[#E63946] py-10 text-center">
        <h1 className="text-2xl font-bold text-white">Careers</h1>
        <p className="text-blue-200 text-sm mt-1">Join our team and grow with us</p>
      </div>

      <div className="max-w-[860px] mx-auto px-4 py-10 space-y-5">
        {jobList.map((job, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#EAEAEA] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-800">{job.title}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <Briefcase size={12} /> {job.experience}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <Clock size={12} /> {job.type}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-5 py-2 bg-[#E63946] hover:bg-[#C5303A] text-white text-sm font-bold rounded-lg transition-colors self-start sm:self-auto">
                Apply Now <ChevronRight size={14} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Roles & Responsibilities</p>
              <ul className="space-y-2">
                {job.responsibilities.map((r, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] flex-shrink-0 mt-2" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Career;
