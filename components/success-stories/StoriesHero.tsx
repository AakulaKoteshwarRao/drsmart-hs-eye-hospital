export default function StoriesHero({ videoCount, conditionCount, rating }: { videoCount: string; conditionCount: string; rating: string }) {
  return (
    <section className="stories-hero">
      <div className="sec-label"><span>Success Stories</span></div>
      <h1>Real patients. <em>Real recoveries.</em></h1>
      <p className="stories-hero-text">Every story here is a real patient who trusted us with their care. These videos document their journey -- from diagnosis to recovery -- in their own words.</p>
      <div className="stories-hero-stats">
        <div className="shs"><span className="shs-num">{videoCount}</span><span className="shs-label">Video Stories</span></div>
        <div className="shs"><span className="shs-num">{conditionCount}</span><span className="shs-label">Conditions Covered</span></div>
        <div className="shs"><span className="shs-num">{rating}*</span><span className="shs-label">Patient Rating</span></div>
      </div>
    </section>
  )
}
