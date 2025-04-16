import { news } from "../../data/Data"
import Blog from "../Blog"
import "./News.scss"

function News() {
  return (
    <div className="news">
      <h1 className="news__title">Latest News</h1>
      <div className="news__content">
        {news && news.map((blog, i) => <Blog name={blog.name} description={blog.description} key={i} img={blog.img} />)}
      </div>
    </div>
  )
}

export default News
