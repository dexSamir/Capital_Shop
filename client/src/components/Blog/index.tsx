import "./Blog.scss"

interface BlogProps {
  name: string
  description: string
  img: string
}

function Blog({ name, description, img }: BlogProps) {
  return (
    <div className="blog">
      <div className="blog__image-container">
        <img src={img || "/placeholder.svg"} alt={name} className="blog__image" />
      </div>
      <div className="blog__content">
        <p className="blog__category">Fashion Tips</p>
        <h1 className="blog__title">{name}</h1>
        <p className="blog__description">{description}</p>
        <a href="" className="blog__link">
          Read More
        </a>
      </div>
    </div>
  )
}

export default Blog
