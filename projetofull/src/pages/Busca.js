import React, { useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import { SearchContext } from "../search/search";
import './css/Busca.css'

const Busca = () => {
    const search = useContext(SearchContext)
    const [dataExiste, setDataExiste] = useState(true)
    const data = search.animesinfo;

    useEffect(() => {
        if (search.animesinfo === undefined || search.animesinfo.length === 0) {
            try {
                // Tentando buscar os dados do localStorage e atualizar o estado animesinfo
                search.setInfo(JSON.parse(localStorage.getItem('myInfo')))
                setDataExiste(true)
            } catch (error) {
                // Se ocorrer um erro (por exemplo, se os dados não existirem no localStorage), atualiza o estado dataExiste para false
                console.log(error)
                setDataExiste(false)
            }
        }
    }, [search]);

    return (
        <div className='Container'>
            {dataExiste && data &&
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{data.title}</Card.Title>
                        <Card.Text>
                            Score: {data.score}
                        </Card.Text>
                        <Card.Text>
                            N° Episódios: {data.episodes}
                        </Card.Text>
                    </Card.Body>
                </Card>
            }
            {!dataExiste && <p>Nenhum dado encontrado.</p>}
        </div>
    );
};

export default Busca;