import './components/navbar.js'
import NavBar from './components/navbar.js';
import Map from './components/map.js';
import Post from './components/post.js';

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className='main'>
        <div className='main-timeline'>
          <Post 
            username={'Event 1'}
            description={'This event has happened.'}
            picture={'ex.jpg'}
          />
          <Post 
            username={'Event 2'}
            description={'Another event has happened.'}
            picture={'ex.jpg'}
          />
          <Post 
            username={'Event 3'}
            description={'Yet another event has happened.'}
            picture={'ex.jpg'}
          />
        </div>
        <Map />
      </div>
    </div>
  );
}
