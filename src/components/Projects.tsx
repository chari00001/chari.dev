import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  topics?: string[]
  language?: string
  stargazers_count: number
  forks_count: number
}

interface Project {
  title: string
  description: string
  tech: string[]
  link: string
  github?: string
  stars?: number
  forks?: number
  baseProjectName?: string
  type?: 'Frontend' | 'Backend'
}

const projectUrls = [
  'chari00001/customizable-nextjs-template',
  'chari00001/redit-frontend',
  'chari00001/AlisWeb-Vue',
  'chari00001/Monilas-IMS-Backend',
  'chari00001/Monilas-IMS-Frontend',
  'chari00001/BookStore-Java-Backend',
  'chari00001/BookStore-Next-Frontend',
  'chari00001/HepsiSurda-Backend',
  'chari00001/HepsiSurda-Frontend',
  'chari00001/KTUFacto'
]

const showcaseProjects = [
  {
    title: "ID Language Academy",
    description: "Online dil eğitimi platformu. 1500+ aktif kullanıcı, canlı dersler, interaktif içerikler, sözlük ve oyunlar. Next.js, TypeScript ve PostgreSQL ile geliştirildi.",
    image: "/idlac.png",
    siteUrl: "https://idlac.com",
    githubUrl: "https://github.com/private-repo",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "TailwindCSS"]
  },
  {
    title: "HepsiSurda E-Ticaret",
    description: "Modern e-ticaret platformu. Kullanıcı dostu arayüz, gelişmiş arama, filtreleme ve sepet yönetimi. React, Node.js ve MongoDB ile geliştirildi.",
    image: "/project-2.png",
    siteUrl: "https://hepsisurda.com",
    githubUrl: "https://github.com/chari00001/HepsiSurda-Frontend",
    tech: ["React", "Node.js", "MongoDB", "Express"]
  }
]

const Projects = () => {
  const [githubProjects, setGithubProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  useEffect(() => {
    const fetchGithubProjects = async () => {
      try {
        const projectPromises = projectUrls.map(async url => {
          try {
            const response = await fetch(`https://api.github.com/repos/${url}`, {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            return await response.json()
          } catch (error) {
            console.error(`Error fetching ${url}:`, error)
            // Hata durumunda manuel proje bilgisi döndür
            const [owner, repo] = url.split('/')
            return {
              id: Math.random(),
              name: repo,
              description: 'Proje detayları yüklenirken bir hata oluştu.',
              html_url: `https://github.com/${url}`,
              topics: [],
              language: null,
              stargazers_count: 0,
              forks_count: 0
            }
          }
        })
        
        const data: (GitHubRepo | null)[] = await Promise.all(projectPromises)
        
        const projects = data
          .filter((repo): repo is GitHubRepo => repo !== null)
          .map(repo => {
            const projectName = repo.name
            const lastDashIndex = projectName.lastIndexOf('-')
            const baseProjectName = lastDashIndex !== -1 ? projectName.substring(0, lastDashIndex) : projectName
            const type = projectName.endsWith('Frontend') ? 'Frontend' as const : 
                        projectName.endsWith('Backend') ? 'Backend' as const : 
                        undefined

            let technologies: string[] = []
            if (repo.topics && repo.topics.length > 0) {
              technologies = repo.topics
            } else if (repo.language) {
              technologies = [repo.language]
            }

            return {
              title: repo.name,
              description: repo.description || 'Açıklama bulunmuyor.',
              tech: technologies,
              link: repo.html_url,
              github: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              baseProjectName,
              type
            }
          })

        // Projeleri gruplandır
        const groupedProjects = projects.reduce((acc: Project[][], project) => {
          if (project.type) {
            // Eşleşen projeyi bul
            const existingGroupIndex = acc.findIndex(group => 
              group.some(p => p.baseProjectName === project.baseProjectName)
            )

            if (existingGroupIndex !== -1) {
              acc[existingGroupIndex].push(project)
            } else {
              // Yeni grup oluştur
              const pair = projects.find(p => 
                p.baseProjectName === project.baseProjectName && p.type !== project.type
              )
              if (pair) {
                acc.push([project, pair])
              }
            }
          } else {
            // Tek projeleri ayrı gruplar olarak ekle
            acc.push([project])
          }
          return acc
        }, [])

        setGithubProjects(groupedProjects.flat())
        setError(null)
      } catch (error) {
        console.error('GitHub projeleri yüklenirken hata:', error)
        setError('Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      } finally {
        setLoading(false)
      }
    }

    fetchGithubProjects()
  }, [])

  const renderProject = (project: Project) => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gradient">
        {project.title}
        {project.type && (
          <span className="ml-2 text-sm font-normal text-light/60">
            ({project.type})
          </span>
        )}
      </h3>
      <p className="text-light/70">{project.description}</p>
      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-accent/10 rounded-full text-accent text-sm border border-accent/20"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 text-light/60">
        {project.stars !== undefined && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {project.stars}
          </span>
        )}
        {project.forks !== undefined && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 01.708 0l2 2a.5.5 0 01-.708.708L8.5 6.707V10.5a.5.5 0 01-1 0V6.707L6.354 7.854a.5.5 0 11-.708-.708l2-2zM6 15a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4zm8-4a1 1 0 100-2 1 1 0 000 2zm0 1a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {project.forks}
          </span>
        )}
      </div>
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary inline-block mt-4"
      >
        GitHub'da Gör
      </a>
    </div>
  )

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-darkGray/5 to-dark" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <motion.div
        style={{ scale, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl"
      >
        <motion.h2 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title mb-16"
        >
          Projeler
        </motion.h2>

        {/* Showcase Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          {showcaseProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-morphism p-6 group"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 mb-6 overflow-hidden rounded-xl bg-darkGray/30">
                <div className="absolute inset-0 flex items-center justify-center text-light/30">
                  Proje Görseli
                </div>
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gradient mb-3">{project.title}</h3>
              <p className="text-light/70 mb-4">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-accent/10 rounded-full text-accent text-sm border border-accent/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4">
                <a
                  href={project.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-light/70 hover:text-accent transition-colors duration-300"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Siteyi Ziyaret Et</span>
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-light/70 hover:text-accent transition-colors duration-300"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Existing Projects List */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-accent rounded-full border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-light/70 py-8">
            <p>{error}</p>
          </div>
        ) : githubProjects.length === 0 ? (
          <div className="text-center text-light/70 py-8">
            <p>Henüz proje bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {githubProjects.reduce((acc: JSX.Element[], project, index) => {
              // Eğer proje zaten işlendiyse atla
              if (acc.some(el => el.key === project.title)) {
                return acc
              }

              // Frontend-Backend çifti bul
              const pair = project.type && githubProjects.find(p => 
                p.baseProjectName === project.baseProjectName && p.type !== project.type
              )

              const projectCard = (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-morphism p-8"
                >
                  <div className={`grid grid-cols-1 ${pair ? 'lg:grid-cols-2' : ''} gap-8`}>
                    {renderProject(project)}
                    {pair && renderProject(pair)}
                  </div>
                </motion.div>
              )

              acc.push(projectCard)
              return acc
            }, [])}
          </div>
        )}
      </motion.div>
    </section>
  )
}

export default Projects 