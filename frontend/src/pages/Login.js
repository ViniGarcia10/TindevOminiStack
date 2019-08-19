import React, { useState } from 'react';
import './Login.css';

import api from '../services/api'

import LogoTindev from '../assets/logo.svg';

export default function Login({ history }) {

  const [ username, setUsername ] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

     if (username !== '') {
       const response = await api.post('/devs', {
         username,
       });
  
       const { _id } = response.data;
  
       history.push(`/dev/${_id}`);
     } else {
       alert('Preencha o campo indicado!');
     }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={LogoTindev} alt="Tindev" />
        <input 
        placeholder="Digite seu usuário no Github" 
        value={username}
        onChange={e => setUsername(e.target.value)}
        />
        <button>Enviar</button>
      </form>
    </div>
  );
}

