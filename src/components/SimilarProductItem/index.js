// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {data} = props
  const {
    id,
    imageUrl,
    title,
    brand,
    price,

    rating,
  } = data
  return (
    <li key={id} className="card">
      <img className="similar" src={imageUrl} alt="similar product" />
      <p className="bold">{title}</p>
      <p>{brand}</p>
      <div className="row">
        <p className="price">Rs {price}/-</p>
        <div className="rate ">
          <p>{rating}</p>
          <img
            className="star"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
