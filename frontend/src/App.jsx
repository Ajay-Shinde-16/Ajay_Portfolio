import { useTheme } from "./hooks/useTheme";
import { useReveal } from "./hooks/useReveal";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import { Stats, Marquee } from "./components/Stats";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ResumeFab from "./components/ResumeFab";

export default function App() {
  const { theme, toggle } = useTheme();
  useReveal([]); // wire up scroll-reveal after mount

  return (
    <div className={`pf${theme === "light" ? " light" : ""}`} id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav theme={theme} onToggle={toggle} />
      <main id="main" tabIndex={-1}>
        <Hero theme={theme} />
        <Stats />
        <Marquee />
        <About />
        <Skills />
        <Projects theme={theme} />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <ResumeFab />
    </div>
  );
}