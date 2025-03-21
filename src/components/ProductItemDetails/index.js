// Write your code here
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'

const apiSts = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productObj: {},
    similarProductsArray: [],

    count: 1,
    apiStatusState: apiSts.initial,
  }

  componentDidMount() {
    this.getSpecificProducts()
  }

  getSpecificProducts = async () => {
    this.setState({apiStatusState: apiSts.inprogress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const formatteddata = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const formattedArray = data.similar_products.map(eachIem => ({
        id: eachIem.id,
        imageUrl: eachIem.image_url,
        title: eachIem.title,
        style: eachIem.style,
        price: eachIem.price,
        description: eachIem.description,
        brand: eachIem.brand,
        totalReviews: eachIem.total_reviews,
        rating: eachIem.rating,
        availability: eachIem.availability,
      }))
      this.setState({
        productObj: formatteddata,
        similarProductsArray: formattedArray,
        apiStatusState: apiSts.success,
      })
    } else if (response.status === 404) {
      this.setState({
        apiStatusState: apiSts.failure,
      })
    }
  }

  onInc = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDec = () => {
    this.setState(prevState => ({
      count: prevState.count > 1 ? prevState.count - 1 : 1,
    }))
  }

  onInprogress = () => (
    <div className="load" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onSuccess = () => {
    const {similarProductsArray, productObj, count} = this.state
    return (
      <div>
        <Header />
        <div className="similarPage">
          <div className="top">
            <img className="eachimg" src={productObj.imageUrl} alt="product" />
            <div className="right">
              <h1 className="bold">{productObj.title}</h1>
              <p className="bold">RS {productObj.price}/-</p>
              <div>
                <div className="row">
                  {' '}
                  <div className="rate">
                    <p>{productObj.rating}</p>
                    <img
                      className="star"
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                    />
                  </div>
                  <p>{productObj.totalReviews} Reviews</p>
                </div>

                <p>{productObj.description}</p>
                <div className="row">
                  <span>Available: </span>
                  <p>{productObj.availability}</p>
                </div>
                <div className="row">
                  <span>Brand: </span>
                  <p>{productObj.brand}</p>
                </div>
                <hr />
                <div className="icons">
                  <BsDashSquare data-testid="plus" onClick={this.onDec} />
                  <p>{count}</p>
                  <BsPlusSquare data-testid="minus" onClick={this.onInc} />
                </div>
                <button className="cart" type="button">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
          <div className="bottom">
            <h1>Similar Products</h1>
            <ul className="ul1">
              {similarProductsArray.map(eachItem => (
                <SimilarProductItem data={eachItem} key={eachItem.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatusState} = this.state
    switch (apiStatusState) {
      case apiSts.inprogress:
        return this.onInprogress()
      case apiSts.success:
        return this.onSuccess()
      case apiSts.failure:
        return this.onFailure()
      default:
        return null
    }
  }
}
export default ProductItemDetails
