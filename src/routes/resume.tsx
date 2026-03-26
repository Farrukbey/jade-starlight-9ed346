import { marked } from 'marked'

import { createFileRoute } from '@tanstack/react-router'
import { allJobs, allEducations } from 'content-collections'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export const Route = createFileRoute('/resume')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen p-8 lg:p-12 pt-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[#f0f0ff]">
            My Resume
          </h1>
          <p className="text-lg text-[rgba(156,163,175,0.85)]">
            Professional Experience & Education
          </p>
          <Separator className="mt-8" />
        </div>

        {/* Career Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#f0f0ff]">
              Career Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <p className="flex-1 leading-relaxed text-[rgba(156,163,175,0.85)]">
                I am a passionate and driven professional seeking
                opportunities that will leverage my extensive experience
                in frontend development while providing continuous growth
                and learning opportunities. My goal is to contribute to
                innovative projects that challenge me to expand my skill
                set and make meaningful impacts through technology.
              </p>
              <img
                src="/headshot-on-white.jpg"
                alt="Professional headshot"
                className="w-44 h-52 rounded-2xl object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-[#f0f0ff]">
            Work Experience
          </h2>
          <div className="space-y-6">
            {allJobs.map((job) => (
              <Card key={job.jobTitle}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl text-[#f0f0ff]">
                        {job.jobTitle}
                      </CardTitle>
                      <p className="font-medium text-[rgba(156,163,175,0.85)]">
                        {job.company} - {job.location}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {job.startDate} - {job.endDate || 'Present'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 leading-relaxed text-[rgba(156,163,175,0.85)]">
                    {job.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <HoverCard key={tag}>
                        <HoverCardTrigger>
                          <Badge variant="outline" className="cursor-pointer">
                            {tag}
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <p className="text-sm">
                            Experience with {tag} in professional development
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                  {job.content && (
                    <div
                      className="mt-6 prose prose-sm max-w-none prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: marked(job.content),
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold text-[#f0f0ff]">
            Education
          </h2>
          <div className="space-y-6">
            {allEducations.map((education) => (
              <Card key={education.school}>
                <CardHeader>
                  <CardTitle className="text-xl text-[#f0f0ff]">
                    {education.school}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-[rgba(156,163,175,0.85)]">
                    {education.summary}
                  </p>
                  {education.content && (
                    <div
                      className="mt-6 prose prose-sm max-w-none prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: marked(education.content),
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
