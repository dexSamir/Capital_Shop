import { news } from "../../data/Data"
import Blog from "../Blog"

function News() {
  return (
    <div className="bg-[#f6f6f6] pb-44">
      <h1 className="pt-20 mt-32 text-center text-[30px] leading-relaxed">Latest News</h1>
      <div className="mx-auto my-8 flex w-full items-center justify-center gap-5 px-20">
        {news && news.map((blog, i) => <Blog name={blog.name} description={blog.description} key={i} img={blog.img} />)}
      </div>
    </div>
  )
}

export default News
