import { useEffect, useState } from 'react'
import { PLATFORMS } from '../assets/assets';
import { ArrowRightIcon, CalendarDaysIcon, ClockIcon, XIcon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const {data} = await api.get("/api/posts");
      setPosts(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }
  useEffect(() => {
    (async () => await fetchPosts())();
    const interval = setInterval(async () => await fetchPosts(), 10000);
    return () => clearInterval(interval);
  }, [])

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Select date and time");
      return;
    }
    if (selectedPlatforms.includes('instagram') && !mediaFile) {
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();

    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("scheduledFor", scheduledFor);
      formData.append("status", "scheduled");
      formData.append("platforms", JSON.stringify(selectedPlatforms));
      if (mediaFile) formData.append("media", mediaFile);

      await api.post("/api/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Post scheduled!");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      fetchPosts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
    finally{
      setLoading(false);
    }
  }

  const scheduled = posts.filter((p) => p.status === "scheduled")
  const published = posts.filter((p) => p.status === "published")

  const togglePlatform = (id: string) => setSelectedPlatforms((prev) => (prev.includes(id)? prev.filter((p) => p != id): [...prev, id]));

  return (
    <div className='flex flex-col lg:flex-row gap-6 h-full'>
      {/* Compose Panel */}
      <div className="w-full lg:w-[460px] shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-y-auto">
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
                  ${active ? "bg-red-50 border-red-300 text-red-500 scale-105" : "border-slate-200 text-slate-500 hover:border-slate-300"}` }>
                  <p.icon className="size-4.5" />
                </button>
                )
              })}
            </div>
          </div>
          {/* Content */}

          <div>
            <label className='block text-xs text-slate-500 uppercase mb-2'>Content</label>
            <textarea required rows={5} placeholder='What do you want to share today?' className='w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 outline-none resize-none' value={content} onChange={(e) => setContent(e.target.value)} />
            <div className={`text-right text-xs mt-1 font-medium ${content.length > 270 ? "text-red-500" : "text-slate-400"}`}>
              {content.length}/280
            </div>
          </div>
          

          {/* Media Upload */}
          <div>
            <label className="block text-xs text-slate-500 uppercase mb-2">
              Media(optional)
            </label>
            {mediaFile ? (<div className='relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50'>
              {mediaFile.type.startsWith("image/") 
                ? 
                <img src={URL.createObjectURL(mediaFile)} alt='preview' className='w-full h-40 object-cover' /> 
                : 
                <video src={URL.createObjectURL(mediaFile)} className='w-full h-40 object-cover' controls />}
                <button type='button' className='absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full flex items-center justify-center transition-colors' onClick={() => setMediaFile(null)}>
                  <XIcon className='size-3.5' />
                </button>
            </div>) : 
            (<label className='flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition-all group'>
              <span className='text-sm text-slate-500 group-hover:text-red-600 transition-colors'>Click to upload image or video</span>
              <input type="file" accept='image/*, video/*' className='hidden' onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])}/>
            </label>)}
          </div>

          {/* Date & Time */}
          <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='block text-xs text-slate-500 uppercase mb-2'>
                  Date
                </label>
                <div>
                  <input type="date" required className='w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none' value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
              </div>
              <div>
                <label className='block text-xs text-slate-500 uppercase mb-2'>
                  Time
                </label>
                <div>
                  <input type="time" required className='w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm outline-none' value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                </div>
              </div>
          </div>

          {/* Submit */}
          <button type='submit' disabled={loading} className='w-full flex items-center justify-center gap-2 py-3.5 bg-red-500 hover:bg-red-600 transition-all text-white rounded-lg'>
          {loading ? (
            <>
            <div className='size-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              Scheduling...
            </>
          ) : 
          (<>
            Schedule Post
            <ArrowRightIcon className='size-4' />
          </>)}
          </button>
        </form>
      </div> 

      {/* Queue Panels */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto">
            {/* Upcoming */}
            <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden'>
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <CalendarDaysIcon className='size-4 text-zinc-500'/>
                <h3 className="text-slate-900 text-sm">Upcoming</h3>
                <span className="ml-auto text-xs font-bold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
                  {scheduled.length}
                </span>
              </div>
              {scheduled.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">No upcoming posts</p>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {scheduled.map((post) => (
                    <li key={post._id} className="px-5 py-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                            <ClockIcon className="size-3" />
                            {new Date(post.scheduledFor).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {post.platforms.map((pid: string) => {
                            const platform = PLATFORMS.find((p) => p.id === pid);
                            return platform ? (
                              <span key={pid} className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                <platform.icon className="size-3.5" />
                                {platform.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Published */}
            <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden'>
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <CalendarDaysIcon className='size-4 text-green-500'/>
                <h3 className="text-slate-900 text-sm">Published</h3>
                <span className="ml-auto text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  {published.length}
                </span>
              </div>
              {published.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">No published posts</p>
              ) : (
                <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {published.map((post) => (
                    <li key={post._id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-slate-700 line-clamp-2 flex-1">{post.content}</p>
                        <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">
                          {new Date(post.scheduledFor).toLocaleString()}
                        </span>
                      </div>
                        <div className="flex gap-2 mt-2">
                          {post.platforms.map((pid: string) => {
                            const platform = PLATFORMS.find((p) => p.id === pid);
                            return platform ? (
                              <span key={pid} className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                <platform.icon className="size-3.5" />
                                {platform.name}
                              </span>
                            ) : null;
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
      </div>
    </div>

  )
}

export default Scheduler