import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import './Main.css';

import LogoTindev from '../assets/logo.svg';
import IconLike from '../assets/like.svg';
import IconDislike from '../assets/dislike.svg';
import IconEndList from '../assets/end.svg';
import ItsAMatch from '../assets/itsamatch.png';
import api from '../services/api';

export default function Main({ match }) {
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev ] = useState(null);

  // useEffect de Chamada para nossa api backend
  useEffect(() => {
    async function loadUsers() {
      const response = await api.get('/devs', {
        headers: {
          user: match.params.id,
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [match.params.id]);

  // useEffect de conexão com o nosso websocket
  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: { user: match.params.id }
    });

    // ouvir o evento de match
    socket.on('match', dev => {
      setMatchDev(dev);
    });

  }, [match.params.id]);

  // função do like nos elementos
  async function handleLike(id) {
    await api.post(`/devs/${id}/likes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  // função do dislike nos elementos
  async function handleDislike(id) {
    await api.post(`/devs/${id}/dislikes`, null, {
      headers: { user: match.params.id }
    });

    setUsers(users.filter(user => user._id !== id));
  }

  return (
    <div className="main-container">
      <Link to='/'>
        <img src={LogoTindev} alt="Tindev" />
      </Link>
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <img src={user.avatar} alt={user.name} />
              <footer>
                <strong>{user.name}</strong>
                <p>{user.bio}</p>
              </footer>

              <div className="botoes">
                <button type='button' onClick={() => { handleDislike(user._id) }}>
                  <img src={IconDislike} alt="Dislike" />
                </button>
                <button type='button' onClick={() => { handleLike(user._id) }}>
                  <img src={IconLike} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
          <div className="endList">
            <img src={IconEndList} alt="Fim da Lista!" className="endList" />
            <p>Fim da Lista :(</p>
          </div>
        )}

        { 
          matchDev && (
            <div className="match-container">
              <img src={ItsAMatch} alt="It's a match"/>

              <img className='avatar' src={matchDev.avatar} alt={matchDev.name}/>
              <strong>{matchDev.name}</strong>
              <p>{matchDev.bio}</p>
            
              <button type='button' onClick={() => setMatchDev(null)}>Fechar</button>
            </div>
          )
        }
    </div>
  );
}