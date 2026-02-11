import { useRef, useState, useEffect } from "react";

/* =========================
   COMPONENTS
========================= */
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ShinyText from "./components/ShinyText/ShinyText";
import BlurText from "./components/BlurText/BlurText";
import Lanyard from "./components/Lanyard/Lanyard";
import ChromaGrid from "./components/ChromaGrid/ChromaGrid";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import Aurora from "./components/Aurora/Aurora";
import CertificationSection from "./components/CertificationSection/CertificationSection";
import GallerySection from "./components/GallerySection/GallerySection";

/* =========================
   DATA
========================= */
import { listTools, listProyek } from "./data";

/* =========================
   AOS
========================= */
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

function App() {
  /* =========================
     REFS & STATES
  ========================= */
  const aboutRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  /* =========================
     HANDLERS
  ========================= */
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (isReload) {
      const baseUrl = window.location.origin + "/portofolio/";
      window.location.replace(baseUrl);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => observer.disconnect();
  }, []);

  /* =========================
     RENDER
  ========================= */
  return (
    <>
      {/* =========================
         AURORA BACKGROUND
      ========================= */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Aurora
          colorStops={["#3b0000", "#8b0000", "#ff3b2f"]}
          speed={1.0}
          stormIntensity={0.45}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================
           HERO
        ========================= */}
        <div className="hero relative grid grid-cols-1 lg:grid-cols-[1fr_420px] items-center pt-10 gap-6">
          {/* LEFT */}
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <div className="flex items-center gap-3 mb-6 bg-white-200 w-fit p-4 rounded-2xl">
              <img src="./assets/kevicons.png" className="w-10 rounded-md" />
              <q>Ora et Labora</q>
            </div>

            <h1 className="text-5xl font-bold mb-6">
              <ShinyText
                text="Hi I'm Kevin Denyno Tjoanda"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </h1>

            <BlurText
              text="A passionate Web developer dedicated to crafting modern, high-performance digital experiences through innovative and user-friendly solutions."
              delay={150}
              animateBy="words"
              direction="top"
              className="mb-6"
            />

            <div className="flex items-center sm:gap-4 gap-2">
              <a
                href="./assets/CV Kevin Denyno Tjoanda.pdf"
                download
                className="cv-btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 36 36"
                  width="36"
                  height="36"
                >
                  <rect width="36" height="36" fill="#fdd835" />
                  <path
                    fill="#e53935"
                    d="M38.67,42H11.52C11.27,40.62,11,38.57,11,36c0-5,0-11,0-11s1.44-7.39,3.22-9.59
                    c1.67-2.06,2.76-3.48,6.78-4.41c3-0.7,7.13-0.23,9,1c2.15,1.42,3.37,6.67,3.81,11.29"
                  />
                </svg>

                <span className="now">now!</span>
                <span className="play">CV?</span>
              </a>

              <a
                href="#project"
                className="font-semibold bg-[#1a1a1a] p-2 px-1 rounded-full border border-gray-700 hover:bg-[#222]"
              >
                <ShinyText
                  text="Explore My Projects"
                  disabled={false}
                  speed={3}
                />
              </a>
            </div>
          </div>

          {/* RIGHT – LANYARD */}
          <div className="relative w-full flex justify-center lg:block">
            {/* MOBILE */}
            <div className="block lg:hidden mt-10">
              <div className="w-[260px] h-[360px] mx-auto">
                <Lanyard position={[0, 1.15, 13]} gravity={[0, -22, 0]} fov={26} />
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:block absolute top-[80%] right-8 -translate-y-1/2 z-30">
              <div className="w-[360px] h-[460px]">
                <Lanyard position={[0, 1.3, 15]} gravity={[0, -40, 0]} fov={22} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
           ABOUT
        ========================= */}
        <div
          id="about"
          className="about-fire mt-15 mx-auto w-full max-w-[1600px] rounded-3xl p-6"
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-10 pt-0 px-8"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-once="true"
          >
            {/* LEFT */}
            <div className="basis-full md:basis-7/12 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-red-900/40">
              <h2 className="text-3xl md:text-4xl font-bold mb-5 text-red-500 drop-shadow-[0_0_10px_rgba(139,0,0,0.6)]">
                About Me
              </h2>

              <BlurText
                text="I’m Kevin Denyno Tjoanda, a full-stack developer passionate about building modern, high-performance applications with an intuitive user experience. I enjoy working with the latest technologies like Artificial Intelligence, Machine Learning, and cloud-based development, blending creativity with precision to deliver impactful solutions. With over three years of experience and more than 20 completed projects, I’m committed to helping users and businesses grow in the digital era through functional, aesthetic, and scalable digital products."
                delay={150}
                animateBy="words"
                direction="top"
                className="text-base md:text-lg leading-relaxed mb-10 text-gray-300"
              />

              <div className="flex flex-col sm:flex-row justify-between text-center gap-y-8 mb-4">
                <div>
                  <h1 className="text-4xl">
                    5<span className="text-red-600">+</span>
                  </h1>
                  <p>Project Finished</p>
                </div>
                <div>
                  <h1 className="text-4xl">
                    3<span className="text-red-600">+</span>
                  </h1>
                  <p>Years of Experience</p>
                </div>
                <div>
                  <h1 className="text-4xl">
                    4.00<span className="text-red-600">/4.00</span>
                  </h1>
                  <p>Last GPA</p>
                </div>
              </div>

              <ShinyText
                text="Working with heart, creating with mind."
                disabled={false}
                speed={3}
                className="text-red-600"
              />
            </div>

            {/* RIGHT */}
            <div className="basis-full md:basis-5/12 flex justify-center">
              <ProfileCard
                name="Kevin D Tjoanda"
                title="Web Developer"
                handle="kevintjoanda_"
                status="Online"
                contactText="Contact Me"
                avatarUrl="./assets/kevin.png"
                showUserInfo
                enableTilt
                enableMobileTilt={false}
                onContactClick={() => console.log("Contact clicked")}
              />
            </div>
          </div>
        </div>

        {/* =========================
           PROJECT
        ========================= */}
        <div className="proyek mt-32 py-10" id="project">
          <h1 className="text-center text-4xl font-bold mb-2">Project</h1>
          <p className="text-center opacity-50">
            Showcasing a selection of projects that reflect my skills,
            creativity, and passion.
          </p>

          <div className="mt-14">
            <ChromaGrid
              items={listProyek}
              onItemClick={handleProjectClick}
              radius={500}
              damping={0.45}
              fadeOut={0.6}
              ease="power3.out"
            />
          </div>
        </div>

        {/* =========================
          CERTIFICATION & GALLERY
        ========================= */}
        <CertificationSection />
        <GallerySection />
      </main>

      {/* =========================
        MODAL
      ========================= */}
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
}

export default App;
