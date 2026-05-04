import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Education } from '../components/Education';
import { Experience } from '../components/Experience';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Courses } from '../components/Courses';
import { Certificates } from '../components/Certificates';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { EditableSection } from '../components/EditableSection';
import { useSiteData } from '../context/SiteDataContext';

export function PortfolioPage() {
  const { ready } = useSiteData();

  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#051622',
        }}
        aria-busy
        aria-label="Loading"
      />
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <EditableSection section="hero">
          <Hero />
        </EditableSection>
        <EditableSection section="about">
          <About />
        </EditableSection>
        <EditableSection section="education">
          <Education />
        </EditableSection>
        <EditableSection section="experience">
          <Experience />
        </EditableSection>
        <EditableSection section="skills">
          <Skills />
        </EditableSection>
        <EditableSection section="projects">
          <Projects />
        </EditableSection>
        <EditableSection section="courses">
          <Courses />
        </EditableSection>
        <EditableSection section="certificates">
          <Certificates />
        </EditableSection>
        <EditableSection section="contact">
          <Contact />
        </EditableSection>
      </main>
      <Footer />
    </>
  );
}
