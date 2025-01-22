import { Button, Col, Container, Image, Row } from 'react-bootstrap'

import ErrorImage from '~assets/500.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export function ServerError() {
  return (
    <main>
      <section className='vh-100 d-flex align-items-center justify-content-center'>
        <Container>
          <Row className='align-items-center'>
            <Col className='order-2 order-lg-1 text-center text-lg-left' lg={5} xs={12}>
              <h1 className='text-primary mt-5'>
                Something has gone <span className='fw-bolder'>seriously</span> wrong
              </h1>
              <p className='lead my-4'>
                It&apos;s always time for a coffee break. We should be back by the time you finish
                your coffee.
              </p>
              <Link to={'/'}>
                <Button className='btn btn-dark'>
                  <FontAwesomeIcon className='me-3' icon={faChevronLeft} />
                  Go back home
                </Button>
              </Link>
            </Col>
            <Col
              className='order-1 order-lg-2 text-center d-flex align-items-center justify-content-center'
              lg={7}
              xs={12}
            >
              <Image className='img-fluid w-75' src={ErrorImage} />
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}
