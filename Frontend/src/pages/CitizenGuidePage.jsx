import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpen,
  Bot,
  CalendarDays,
  Car,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  CreditCard,
  ExternalLink,
  FileQuestion,
  FileText,
  Gauge,
  Headphones,
  IdCard,
  Leaf,
  LockKeyhole,
  Play,
  Route,
  Scale,
  Search,
  Shield,
  Siren,
  TrafficCone,
  XCircle,
} from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { getCitizenGuide, getCitizenGuideDetail } from "../utils/api";

const iconMap = {
  alert: AlertCircle,
  bot: Bot,
  calendar: CalendarDays,
  car: Car,
  challan: CreditCard,
  dashboard: Gauge,
  dots: CircleDot,
  file: FileText,
  health: Activity,
  helmet: Headphones,
  leaf: Leaf,
  license: IdCard,
  lock: LockKeyhole,
  map: Route,
  rc: ClipboardList,
  reject: FileQuestion,
  seatbelt: BadgeCheck,
  shield: Shield,
  signal: TrafficCone,
};

const accentClasses = {
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  red: "bg-red-50 text-red-600 border-red-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
};

const IconBubble = ({ name, className = "", accent = "blue", size = "w-11 h-11" }) => {
  const Icon = iconMap[name] || BookOpen;
  return (
    <span className={`${size} rounded-2xl border flex items-center justify-center ${accentClasses[accent] || accentClasses.blue} ${className}`}>
      <Icon className="w-5 h-5" />
    </span>
  );
};

const Section = ({ icon: Icon, title, action, children, className = "" }) => (
  <section className={`bg-white border border-slate-200 rounded-2xl shadow-sm ${className}`}>
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-blue-950">
        {Icon && <Icon className="w-5 h-5 text-blue-700" />}
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const VideoCard = ({ video, onPlay }) => {
  const Icon = iconMap[video.icon] || Play;
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  return (
    <button onClick={() => onPlay(video)} className="text-left group min-w-0 h-full flex flex-col">
      <div className={`relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gradient-to-br ${video.thumbnailTone} shadow-sm`}>
        {video.thumbnailImage && !thumbnailFailed ? (
          <img
            src={video.thumbnailImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setThumbnailFailed(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_35%),radial-gradient(circle_at_70%_70%,white,transparent_30%)]" />
            <Icon className="absolute left-5 top-5 w-12 h-12 text-white/40" />
          </>
        )}
        <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/0 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Play className="w-6 h-6 text-blue-700 fill-blue-700 ml-1" />
          </span>
        </span>
        <span className="absolute right-3 bottom-3 text-xs font-bold text-white bg-slate-950/70 px-2 py-1 rounded-lg">
          {video.duration}
        </span>
      </div>
      <h3 className="mt-3 min-h-10 text-sm font-extrabold text-blue-950 leading-snug">{video.title}</h3>
      <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed">{video.description}</p>
    </button>
  );
};

const LoadingPanel = () => (
  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="h-44 rounded-2xl bg-slate-100" />
    ))}
  </div>
);

const ErrorPanel = ({ message }) => (
  <div className="m-6 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700 text-sm font-semibold">
    {message || "Unable to load citizen guide right now."}
  </div>
);

const GuideDetail = ({ detail }) => {
  const guide = detail?.guide;
  if (!guide) return <LoadingPanel />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-5">
      <Section icon={BookOpen} title={guide.title}>
        <div className="p-5">
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950">
            {detail.video?.embedUrl ? (
              <iframe
                title={detail.video.title}
                src={detail.video.embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">Video guide</div>
            )}
          </div>
          <p className="mt-5 text-slate-600 font-medium leading-relaxed">{guide.summary}</p>
          <div className="mt-5 space-y-3">
            {guide.steps.map((step, index) => (
              <div key={step} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section icon={Route} title="Discover Next">
        <div className="p-5 space-y-4">
          {detail.nextGuide && (
            <Link to={`/citizen-guide/${detail.nextGuide.id}`} className="block rounded-2xl border border-blue-100 bg-blue-50 p-5 hover:bg-blue-100 transition-colors">
              <IconBubble name={detail.nextGuide.icon} accent={detail.nextGuide.accent} />
              <h3 className="mt-4 text-base font-extrabold text-blue-950">{detail.nextGuide.title}</h3>
              <p className="mt-2 text-sm text-slate-600 font-medium">{detail.nextGuide.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-blue-700">
                Next guide <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          )}
          <Link to="/citizen-guide" className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-700">
            Back to all guides
          </Link>
        </div>
      </Section>
    </div>
  );
};

const CitizenGuidePage = () => {
  const { guideId } = useParams();
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError("");
      getCitizenGuide({ search })
        .then((response) => {
          if (mounted) setData(response);
        })
        .catch((err) => {
          if (mounted) setError(err.message);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }, 180);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    let mounted = true;
    if (!guideId) {
      setDetail(null);
      return undefined;
    }
    setDetail(null);
    getCitizenGuideDetail(guideId)
      .then((response) => {
        if (mounted) setDetail(response);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      });
    return () => {
      mounted = false;
    };
  }, [guideId]);

  const visibleVideos = useMemo(() => data?.videos?.slice(0, 6) || [], [data]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border-b border-blue-100">
            <div className="max-w-[1500px] mx-auto px-4 lg:px-8 pt-9 pb-8 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-blue-950 tracking-normal">Citizen Guide</h1>
                <p className="mt-2 text-xl font-extrabold text-blue-700">Learn. Understand. Stay informed.</p>
                <p className="mt-3 max-w-xl text-base font-medium text-slate-700 leading-relaxed">
                  Simple guides to help you use vehicle services, apply for licences and register vehicles with confidence.
                </p>
                <div className="mt-7 relative max-w-xl">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search guides, rules, videos..."
                    className="w-full h-14 rounded-full bg-white border border-slate-200 shadow-sm pl-14 pr-5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>
              <div className="min-h-60 relative hidden md:flex items-center justify-center">
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(14,165,233,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0))]" />
                <div className="absolute inset-x-8 bottom-4 h-20 rounded-full bg-blue-300/20 blur-2xl" />
                <img
                  src="/CitizenGideHeroSection.png"
                  alt="Citizen guide illustration"
                  className="relative w-full max-w-[560px] max-h-72 object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>

          <div className="max-w-[1500px] mx-auto px-4 lg:px-8 py-5 space-y-5">
            {loading ? <LoadingPanel /> : error ? <ErrorPanel message={error} /> : guideId ? (
              <GuideDetail detail={detail} />
            ) : (
              <>
                <Section
                  icon={Play}
                  title="Quick Video Guides"
                  action={<button onClick={() => setSearch("")} className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-700">View all videos <ArrowRight className="w-4 h-4" /></button>}
                >
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-stretch">
                    {visibleVideos.map((video) => <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />)}
                  </div>
                </Section>

                <Section icon={BookOpen} title="Quick Service Guides">
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 items-stretch">
                    {data.serviceGuides.map((guide) => (
                      <Link key={guide.id} to={`/citizen-guide/${guide.id}`} className="rounded-xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-md transition-all min-h-64 flex flex-col">
                        <IconBubble name={guide.icon} accent={guide.accent} size="w-14 h-14" />
                        <h3 className="mt-5 min-h-14 text-lg font-extrabold text-blue-950 leading-tight">{guide.title}</h3>
                        <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">{guide.summary}</p>
                        <span className="mt-auto pt-5 inline-flex items-center justify-between gap-2 text-sm font-extrabold text-blue-700">
                          Learn more <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </Section>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <Section icon={Scale} title="Important Rules">
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.rules.map((rule) => (
                        <div key={rule.title} className="flex gap-3 rounded-xl border border-slate-100 p-4">
                          <IconBubble name={rule.icon} size="w-10 h-10" />
                          <div>
                            <h3 className="text-sm font-extrabold text-blue-950">{rule.title}</h3>
                            <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">{rule.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section icon={CheckCircle2} title="Do's & Don'ts">
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <h3 className="font-extrabold text-emerald-700 mb-4">DO'S</h3>
                        {data.dos.map((item) => (
                          <p key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700 mb-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {item}
                          </p>
                        ))}
                      </div>
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                        <h3 className="font-extrabold text-red-700 mb-4">DON'Ts</h3>
                        {data.donts.map((item) => (
                          <p key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700 mb-3">
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" /> {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Section>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
                  <Section icon={Siren} title="What Should I Do If...">
                    <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {data.emergencyGuides.map((item) => (
                        <Link key={item.id} to="/citizen-guide/vehicle-dashboard" className="rounded-xl border border-slate-200 p-4 text-center hover:border-blue-200 hover:shadow-sm transition-all">
                          <IconBubble name={item.icon} className="mx-auto" />
                          <h3 className="mt-3 text-xs font-extrabold text-blue-950">{item.title}</h3>
                          <span className="mt-2 inline-flex text-[11px] font-extrabold text-blue-700">Know more</span>
                        </Link>
                      ))}
                    </div>
                  </Section>

                  <Section icon={Car} title="Your Vehicle At A Glance">
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                        <div>
                          <h3 className="text-lg font-black text-blue-950">WB12AB1234</h3>
                          <p className="text-sm font-medium text-slate-500">Hyundai Creta</p>
                        </div>
                        <Car className="w-24 h-16 text-slate-700" />
                      </div>
                      {[
                        ["PUC", "Expires in 17 days", "text-amber-600"],
                        ["Challan", "1 pending challan", "text-red-600"],
                        ["Insurance", "Valid till 12 Dec 2025", "text-emerald-600"],
                        ["Vehicle Health", "Health Score: 85 / 100", "text-emerald-600"],
                      ].map(([label, value, color]) => (
                        <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                          <span className="text-sm font-extrabold text-blue-950">{label}</span>
                          <span className={`text-xs font-extrabold ${color}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-5">
                  <Section icon={BellRing} title="Government Terms, Simplified">
                    <div className="p-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                      {data.terms.map((item) => (
                        <div key={item.term} className="rounded-xl border border-slate-200 p-4">
                          <h3 className="font-black text-blue-950">{item.term}</h3>
                          <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed">{item.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section icon={AlertCircle} title="Information Disclaimer">
                    <div className="p-5">
                      <p className="text-sm font-medium text-slate-700 leading-relaxed">
                        Rules and requirements can vary by state, vehicle type, RTO and applicable regulations. Always verify important requirements with the relevant official authority.
                      </p>
                      <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-extrabold text-blue-700">
                        Visit Official Parivahan Website <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </Section>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-[200] bg-slate-950/70 p-4 flex items-center justify-center" onClick={() => setActiveVideo(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-extrabold text-blue-950">{activeVideo.title}</h2>
              <button onClick={() => setActiveVideo(null)} className="text-sm font-extrabold text-slate-500 hover:text-red-600">Close</button>
            </div>
            <div className="aspect-video bg-slate-950">
              <iframe title={activeVideo.title} src={activeVideo.embedUrl} className="w-full h-full" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenGuidePage;
