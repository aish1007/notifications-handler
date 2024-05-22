import React from 'react';
import Header from '../component/Header/Header';
import { useParams } from 'react-router';

function Metric() {
  const params = useParams();
  const { id } = params;
  return (
    <div id='app' className='bg-body'>
      <div className='mt-10'> Details for metric: {id} </div>
    </div>
  );
}

export default Metric;
