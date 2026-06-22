export default function Features() {
  const items = [
    {
      title: 'AI-powered Task Automation',
      desc: 'Automate repetitive tasks with intelligent AI that learns your workflow patterns and suggests optimizations.'
    },
    {
      title: 'Real-time Collaboration',
      desc: 'Work seamlessly with your team in real-time, with instant updates and shared workspaces.'
    },
    {
      title: 'Cross-platform Synchronization',
      desc: 'Access your tasks and projects from any device with seamless synchronization across web, mobile, and desktop.'
    },
    {
      title: 'Mobile-First Experience',
      desc: 'Optimized mobile interface with touch-friendly controls and offline capabilities for productivity on the go.'
    },
    {
      title: 'Push Notifications',
      desc: 'Stay on track with intelligent push notifications for deadlines, reminders, and team updates directly on your mobile device.'
    },
    {
      title: 'Voice Commands',
      desc: 'Control FlowMind hands-free with voice commands for adding tasks, setting reminders, and managing your workflow.'
    },
  ]

  return (
    <section className="max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {items.map((it, index) => (
          <div key={index} className="p-4 sm:p-6 bg-background/5 backdrop-blur-sm rounded-lg border border-border hover:bg-background/10 transition-all duration-300 hover:border-border/50">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 text-foreground">{it.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
