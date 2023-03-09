import React, { useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Table
} from 'react-bootstrap'
import Web3 from 'web3'
import CarDeedContract from '../../build/contracts/CarDeed.json' 

declare global {
  interface Window {
    ethereum?: {
      enable: () => Promise<void>;
      provider: any;
    };
  }
}

type IBuyer = {
  brand: string,
  price: number,
  buyer: string
  seller: string
}

function App() {
  const [metaMaskFound, setMetaMaskFound] = useState<boolean>(false)
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [carContract, setCarDeedContract] = useState<any>()
  const [carDetails, setCarDetails] = useState<IBuyer>({brand: '', price: 0, buyer: '', seller: ''})
  const [carDeeds, setCarDeeds] = useState<any>()
  const [firstItem, setFirstItem] = useState<any[]>([])
  const [hash, setHash] = useState<string>("")
  const [id, setId] = useState<number>(0)
  const [searched, setSearched] =useState<any>()


  useEffect(() => { 
     (async () => {
      const _web3 =  await initMetamask()    
       _web3 && setWeb3(_web3)
     })()
  }, [])

  useEffect(() => {
     (async () => {
      if (web3) {
        await initContract()
      }
     })()
  }, [web3])


  const initMetamask = async (): Promise<Web3 | undefined> => {
    if (window.ethereum) {
      try {
      await window.ethereum.enable()
      const web3 = new Web3(window.ethereum as any)  
      setMetaMaskFound(true)
      return web3
      }catch(e) {
        console.error(e)
        throw e
      } 
    }else {
      alert("you need to have metamask installed")
      setMetaMaskFound(false)
    }
  }

  const initContract =  async () => {
    const contractAddress =  '0x3c01152480789a10FAA7F93Ed86896ca01e27921'
    if (web3) {
      return setCarDeedContract(new web3.eth.Contract((CarDeedContract.abi as any), contractAddress))
      
    }
  }

  useEffect(() => {
    (async () => {
      if (carContract) {
        const allDeeds = await callCarDetails()
        if (allDeeds) {
          allDeeds && setCarDeeds(allDeeds)
          const first = allDeeds[0]
          first && setFirstItem(first)
        }
      }
    })()
  }, [carContract])

  const callCarDetails = async () => {
        return await carContract.methods.getAllDeeds().call()
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => 
      setCarDetails(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }))


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // save to blockchain
    const accounts = await web3?.eth.getAccounts()
    if (accounts) {
      const _account  = accounts[0]
      try {
        const {brand, price, buyer, seller } = carDetails
        await carContract.methods.addCarDetails(brand, price, buyer, seller).send({from: _account})
              .on('transactionHash', function(hash: string) {
                setHash(hash)
              })
        alert("Successfully saved on the blockchain")
        await callCarDetails()
      }catch(e: any) {
        console.log(e.message)
      }
    }
  }

  const { brand, price, buyer, seller } = carDetails
  const handleDelete = (id: number)  => {
     alert(id)    
  }

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const result = await carContract.methods.getCarDetails(id).call()
      result && setSearched(result)
  }

  const certificateResults = () => {
    if (searched) {
      return (
        <>
          <p className="text-muted">This is to certifiy that buyer <strong>{searched["2"]}</strong> purchased 
            <br /> 
          <strong>{searched["0"]}</strong> from <strong>{searched["3"]}</strong> </p>
         
        <p>Brand:  {searched["0"]}</p>
        <p>Price:  {searched["1"]}</p>
        <p>Buyer:  {searched["2"]}</p>
        <p>Seller:  {searched["3"]}</p>
        </>
      )
    }else {
      return (
       <>
        <p className="text-muted">This is to certifiy that buyer <strong>{firstItem[0]}</strong> purchased 
            <br /> 
          <strong>{firstItem[1]}</strong> from <strong>{firstItem[4]}</strong> </p>
         
          <p>CarId:  {firstItem[0]}</p>
          <p>Brand:  {firstItem[1]}</p>
          <p>Price:  {firstItem[2]}</p>
          <p>Buyer:  {firstItem[3]}</p>
          <p>Seller:  {firstItem[4]}</p> 
       </>        
      )
    }
  }

  return (
    <Container>
      
      <div className='py-3 text-center'><h4>Car Deed Dapp</h4></div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
          <Form style={{display: 'flex'}} onSubmit = {handleSearch}>
            <Form.Control value={id} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>  {
                const parsed = parseInt(e.target.value)
                setId(parsed)
            }} style={{marginRight: 5}} type="number" placeholder="Search car details" className="mb-2" />
            <Button style={{height: 35}} type="submit">Search</Button>
          </Form>
      </div>
      <Row>
        <Col md={8}>
          <Card style={{height: '400px'}}>
          <Card.Body style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <Card.Title className="text-center">Card Title</Card.Title>
          {certificateResults()}   
        </Card.Body>
        </Card>
        </Col>
        <Col md={4}>
           <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Car Brand</Form.Label>
        <Form.Control type="text" name="brand" value={brand} onChange={onChange} placeholder="Brand" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" name="price"  value={price} onChange={onChange} placeholder="Price" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Buyer</Form.Label>
        <Form.Control type="text" name="buyer" value={buyer} onChange={onChange} placeholder="Buyer" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Seller</Form.Label>
        <Form.Control name="seller" type="text" value={seller} onChange={onChange} placeholder="Seller" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
        </Col>
      </Row>
      <div className='py-3 text-center'><h4>Saved Cars</h4></div>
       <Table striped bordered hover className='mt-3'>
      <thead>
        <tr>
          <th>CarID</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Buyer</th>
          <th>Seller</th>
        </tr>
      </thead>
      <tbody> 
        {carDeeds && carDeeds.map((deeds: any, i: any) => (
              <tr>
                  {deeds.map((value: any, idx: any) => (
                    <>
                    <td style={{cursor: 'pointer'}} onDoubleClick={() => handleDelete(idx)}>{value}</td>
                    </>
                  ))}
              </tr> 
        ))}
      </tbody>
    </Table>
    </Container>
  )
}

export default App
