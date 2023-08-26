import IconApps from './components/icons/IconApps'
import IconSearch from './components/icons/IconSearch'
import IconMicrophone from './components/icons/IconMicrophone'
import axios from 'axios'
import Typewriter from 'typewriter-effect';
import ClipLoader from "react-spinners/ClipLoader";
import React from 'react'


const AnchorFooter = ({ children }) => (
  <a className='text-sm p-4 hover:underline cursor-pointer'>{children}</a>
)

const ButtonGrayLoading = () => (<button className='bg-[#f8f9fa] text-[#3c4043] border-transparent border hover:border-gray-200 rounded-[4px] h-9 px-4 flex items-center'><ClipLoader size={30} color={'#1a73e8'} loading={true} className='mr-2' /> Loading..</button>)

function App () {

  const [isSearchBarLoading, setIsSearchBarLoading] = React.useState(false);
  const [isLuckyLoading, setIsLuckyLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [reply, setReply] = React.useState('');
  const [showErrorMessage, setErrorMessage] = React.useState('');
  const [noValidQuery, setNoValidQuery] = React.useState(true);

  const handleTyping = async (e) => {
    if (e.keyCode === 13) { 
      try {
        search();
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsSearchBarLoading(false); 
      }
    }
  };

  const sendRequest = async (action, buttonClicked) => {
    try {
      const link = action == 'search' ? `/api/search?q=${query}` : `/api/button/${buttonClicked}`;
      const response = await axios.get(link);
      console.log(response);
      
      if (response.data.status) {
        setNoValidQuery(false);
        if (response.data.beingThrottled){
          setErrorMessage('You are experiencing a slower rate of replies due to exceeding limit of requests.');
        } else {
          if (response.data.nonvalid) {
            setNoValidQuery(true);
            setErrorMessage(query.length < 5 ? 'Search query is too short.' : 'Search query is too long.');
          }else
            setErrorMessage('');
        }
        setReply(response.data.reply);
       } else {
        setReply('');
        setErrorMessage('You have exceeded your daily limit of requests.');
      }
      if (action == 'button') {
        switch (buttonClicked) {
          case 'lucky':
            setIsLuckyLoading(false);
            break;
          default:
            break;
        }
      }else {
        setIsSearchBarLoading(false);
      }

    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleClick = () => {
    setIsSearchBarLoading(true);
    sendRequest('search', null);
  }


  const clickButton = (btnName) => {
    if (btnName == 'lucky')
      setIsLuckyLoading(true);
    sendRequest('button', btnName);
  }

  const ButtonGraySearch = ({ title }) => (<button className='bg-[#f8f9fa] text-[#3c4043] border-transparent border hover:border-gray-200 rounded-[4px] h-9 px-4' onClick={handleClick}>{title}</button>)
  const ButtonGray = ({ title }) => (<button className='bg-[#f8f9fa] text-[#3c4043] border-transparent border hover:border-gray-200 rounded-[4px] h-9 px-4' onClick={() => clickButton('lucky')}>{title}</button>)
  const AnchorHeader = ({ title, buttonName }) => (<a className='text-[#5f6368] hover:underline cursor-pointer' onClick={() => clickButton(buttonName)}>{title}</a>)
  const ButtonBlue = ({ title, buttonName }) => (<button className='bg-[#1a73e8] rounded-[4px] text-white border-transparent border pl-6 pr-6 pt-2 pb-2 hover:bg-[#2b7de9] hover:shadow-md' onClick={() => buttonName == 'signin' ? clickButton(buttonName) : null}>{title}</button>)

  return (
    <div className='flex flex-col min-w-[490px] min-h-screen'>
      <div className='flex justify-end items-center space-x-4 p-4'>
        <AnchorHeader title='Gmail' buttonName="gmail" />
        <AnchorHeader title='Images' buttonName="images" />
        <a className='flex flex-col justify-center items-center w-10 h-10 text-[#5f6368] hover:bg-gray-200 hover:rounded-full cursor-pointer'>
          <IconApps />
        </a>
        <ButtonBlue title='Sign in' buttonName="signin" />
      </div>

      <div className='flex flex-col items-center min-h-[92px] max-h-72'>
        <div className='relative max-h-24 h-full mt-auto'>
          <img className='max-h-full max-w-full object-contain object-center' src='https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' alt='logo' />
        </div>
      </div>

      <div className='flex-shrink p-5 max-h-40'>
        <div className='relative pt-2 mx-auto my-0 w-auto max-w-[584px]'>
          <div className='flex justify-between items-center hover:border-gray-200 hover:border-2 border border-gray-[#5f6368] h-[44px] rounded-t-full rounded-b-full'>
            <span className='text-[#9aa0a6] p-4'>
              <IconSearch />
            </span>
            <input onKeyDown={handleTyping} className='outline-none flex-1 w-48' type='text' id='query' value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className='p-4 cursor-pointer p-4' onClick={() => clickButton('mic')}>
              <IconMicrophone />
            </button>
          </div>
          <div className='flex flex-grow flex-shrink-0 justify-center pt-10 space-x-4'>
            { isSearchBarLoading ? <ButtonGrayLoading /> : <ButtonGraySearch title='NotGoogle Search' />}
            { isLuckyLoading ? <ButtonGrayLoading /> : <ButtonGray title={'I\'m Feeling Lucky'} />}
            
          </div>
        </div>
      </div>

      <div className='block flex-shrink-0 flex-grow'>
      { reply.trim().length > 0 &&
  <div className="text-center py-4 lg:px-4" id='reply'>
    <div className="p-4 items-center text-white leading-none lg:rounded-full flex lg:inline-flex" role="alert" id={noValidQuery ? 'replyBgRed' : 'replyBg'}>
      <span className="flex rounded-full uppercase px-2 py-1 text-xs font-bold mr-3" id={noValidQuery ? 'replyTagRed' : 'replyTag'}>NotGoogle</span>
      <span className="font-semibold mr-2 text-left flex-auto w-1/2 whitespace-normal">{reply}</span>
      <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
    </div>
  </div>
  }
  {showErrorMessage.length > 0 && 
  <div className='text-red-700 text-center'>
    {showErrorMessage}
  </div>
}
</div>


      <div className='flex flex-col xl:justify-between justify-evenly bg-[#f2f2f2] text-[#70757a]'>
        <div className='px-8 py-4 border-b border-gray-300'>Your Mom</div>
        <div className='px-5 flex flex-wrap justify-evenly text-red-500'>
        <div key={0} className='flex flex-wrap text-center'>
        <AnchorFooter key={1}> <strong>Note</strong>: This is not the real Google. This entire project is just for fun. Please do not take any of the AI replies seriously. </AnchorFooter>
        </div>
        </div>
      </div>
    </div>
  )
}

export default App
