import { Button, Col, Container, Image, Row } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import NotFoundImage from '~assets/404.svg'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export function NotFound() {
  return (
    <main>
      <section className='vh-100 d-flex align-items-center justify-content-center'>
        <Container>
          <Row>
            <Col className='text-center d-flex align-items-center justify-content-center' xs={12}>
              <div>
                <Link to={'/'}>
                  <Image className='img-fluid w-75' src={NotFoundImage} />
                </Link>
                <h1 className='text-primary mt-5'>
                  Page not <span className='fw-bolder'>found</span>
                </h1>
                <p className='lead my-4'>
                  Oops! Looks like you followed a bad link. If you think this is a problem with us,
                  please tell us.
                </p>
                <Link to={'/'}>
                  <Button className='btn btn-dark'>
                    <FontAwesomeIcon className='me-3' icon={faChevronLeft} />
                    Go back home
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}
