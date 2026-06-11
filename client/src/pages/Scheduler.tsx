import { useEffect, useState } from 'react'
import { dummyPostsData, PLATFORMS } from '../assets/assets';

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    setPosts(dummyPostsData);
  }
  useEffect(() => {
    (async () => await fetchPost())();
    const interval = setInterval(async () => await fetchPost(), 1000);
    return () => clearInterval(interval);
  }, [])

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setPosts((prev) => [...prev, dummyPostsData[0]])
    }, 1000)
  }

  const scheduled = posts.filter((p) => p.status === "scheduled")
  const published = posts.filter((p) => p.status === "published")

  const togglePlatform = (id: string) => setSelectedPlatforms((prev) => (prev.includes(id)? prev.filter((p) => p != id): [...prev, id]));

  return (
    <div className='flex flex-col lg:flex-row gap-6 h-full'>
      {/* Compose Panel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg text-slate-700">Compose Post</h2>
        </div>
        <form className="space-y-5" onSubmit={handleSchedule}>
          {/* Platforms */}
          <div>
            <label className='block text-xs text-slate-500 uppercase mb-2'>
              Platforms
            </label>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p) =>{
                const active = selectedPlatforms.includes(p.id);
                return( 
                <button key={p.id} onClick={() => togglePlatform(p.id)} type="button" className={`flex items-center gap-1.5 p-3 rounded-md border transition-all duration-150 
                  ${active ? "bg-red-50 border-red-300 text-red-500 scale-103" : "border-slate-200 text-slate-500 hover:border-slate-300"}` }>
                  <p.icon className="size-4.5" />
                </button>
                )
              })}
            </div>
          </div>
          {/* Content */}

          {/* Media Upload */}

          {/* Date & Time */}

          {/* Submit */}
        </form>
      </div> 
    </div>
  )
}

export default Scheduler